import express, { type NextFunction, type Request, type Response } from "express";
import { fileURLToPath } from "node:url";
import { dirname, extname, join } from "node:path";
import { readFileSync } from "node:fs";

// <api-imports>
import auth_action_get_0 from "./api/auth/[action]/GET";
import auth_action_post_1 from "./api/auth/[action]/POST";
import auth_action_detail_get_2 from "./api/auth/[action]/[detail]/GET";
import auth_action_detail_post_3 from "./api/auth/[action]/[detail]/POST";
import colleges_get_4 from "./api/colleges/GET";
import colleges_id_get_5 from "./api/colleges/[id]/GET";
import compare_get_6 from "./api/compare/GET";
import health_get_7 from "./api/health/GET";
import locations_get_8 from "./api/locations/GET";
import predict_post_9 from "./api/predict/POST";
import reviews_get_10 from "./api/reviews/GET";
import reviews_post_11 from "./api/reviews/POST";
// </api-imports>
import { seoRoutes } from "../lib/seo-routes";

function normalizeCommerceApiBaseUrlEnv() {
	if (process.env.GODADDY_API_BASE_URL) return;
	const hostOnly = process.env.VITE_GODADDY_API_HOST;
	if (!hostOnly) return;
	const normalizedHost = hostOnly.replace(/^https?:\/\//, "").trim();
	if (!normalizedHost) return;
	process.env.GODADDY_API_BASE_URL = `https://${normalizedHost}`;
}

normalizeCommerceApiBaseUrlEnv();

const app = express();

// Honour x-forwarded-* from the load balancer so req.protocol/req.hostname
// reflect the public-facing values. Express-maintained parsing respects the
// existing trust-proxy config; direct header reads would let a client spoof
// the sitemap origin in robots.txt.
app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// <api-registrations>
app.get("/api/auth/:action", auth_action_get_0);
app.post("/api/auth/:action", auth_action_post_1);
app.get("/api/auth/:action/:detail", auth_action_detail_get_2);
app.post("/api/auth/:action/:detail", auth_action_detail_post_3);
app.get("/api/colleges", colleges_get_4);
app.get("/api/colleges/:id", colleges_id_get_5);
app.get("/api/compare", compare_get_6);
app.get("/api/health", health_get_7);
app.get("/api/locations", locations_get_8);
app.post("/api/predict", predict_post_9);
app.get("/api/reviews", reviews_get_10);
app.post("/api/reviews", reviews_post_11);
// </api-registrations>

// Error middleware must be registered AFTER the routes it protects; Express
// only passes errors to middleware defined later in the stack.
app.use("/api", (err: unknown, req: Request, res: Response, _next: NextFunction) => {
	// Always respond JSON on /api so clients parsing response.json() don't
	// receive Express's default HTML error page for non-Error throws.
	console.error("ssr.api.error", {
		url: req.url,
		error: err instanceof Error ? err.stack : String(err),
	});
	res.status(500).json({ error: "Internal server error" });
});

function baseUrl(req: Request): string {
	const env = process.env.PUBLIC_URL || process.env.SITE_URL;
	if (env) return env.replace(/\/+$/, "");
	return `${req.protocol}://${req.hostname}`;
}

function escapeXml(s: string): string {
	return s.replace(/[&<>"']/g, (c) =>
		({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
	);
}

app.get("/robots.txt", (req, res) => {
	const base = baseUrl(req);
	const body = [
		"User-agent: *",
		"Allow: /",
		"",
		`Sitemap: ${base}/sitemap.xml`,
		"",
	].join("\n");
	res.type("text/plain").set("Cache-Control", "public, max-age=3600").send(body);
});

app.get("/sitemap.xml", (req, res) => {
	const base = baseUrl(req);
	const urls = seoRoutes
		.filter((r) => typeof r.path === "string" && r.path.startsWith("/"))
		.map((r) => {
			const loc = `${base}${r.path}`;
			const parts = [`    <loc>${escapeXml(loc)}</loc>`];
			if (r.lastmod) parts.push(`    <lastmod>${escapeXml(r.lastmod)}</lastmod>`);
			if (r.changefreq) parts.push(`    <changefreq>${r.changefreq}</changefreq>`);
			if (r.priority !== undefined)
				parts.push(`    <priority>${r.priority.toFixed(1)}</priority>`);
			return `  <url>\n${parts.join("\n")}\n  </url>`;
		})
		.join("\n");
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
	res.type("application/xml").set("Cache-Control", "public, max-age=3600").send(body);
});

if (import.meta.env?.PROD) {
	const __dirname = dirname(fileURLToPath(import.meta.url));
	const clientDir = join(__dirname, "client");

	app.use(
		express.static(clientDir, {
			index: false,
			setHeaders(res, filePath) {
				res.set(
					"Cache-Control",
					filePath.includes("/assets/")
						? "public, max-age=31536000, immutable"
						: "no-cache",
				);
			},
		}),
	);

	app.use((_req, res, next) => {
		res.set("Cache-Control", "no-cache");
		next();
	});

	let template: string;
	try {
		template = readFileSync(join(clientDir, "index.html"), "utf-8");
	} catch (err) {
		console.error("ssr.template.load-failed", {
			path: join(clientDir, "index.html"),
			error: err instanceof Error ? err.message : String(err),
		});
		process.exit(1);
	}
	if (!template.includes("<!--app-head-->") || !template.includes("<!--app-html-->")) {
		console.error("ssr.template.markers-missing", {
			hasHead: template.includes("<!--app-head-->"),
			hasHtml: template.includes("<!--app-html-->"),
		});
		process.exit(1);
	}
	const fallbackShell = template
		.replace("<!--app-head-->", "")
		.replace("<!--app-html-->", "");

	type RenderResult = {
		html: string;
		head: string;
		status: number;
		redirect?: string;
	};
	let renderFn: ((url: string) => Promise<RenderResult>) | null = null;
	const SSR_MODULE_LOAD_TIMEOUT_MS = 30_000;
	const loadTimeout = setTimeout(() => {
		if (renderFn !== null) return;
		console.error("ssr.module.load-timeout", {
			timeoutMs: SSR_MODULE_LOAD_TIMEOUT_MS,
		});
		process.exit(1);
	}, SSR_MODULE_LOAD_TIMEOUT_MS);
	loadTimeout.unref();
	import("../entry-server").then(
		(mod) => {
			clearTimeout(loadTimeout);
			renderFn = mod.render;
		},
		(err) => {
			clearTimeout(loadTimeout);
			console.error("ssr.module.load-failed", {
				error: err instanceof Error ? err.stack : String(err),
			});
			process.exit(1);
		},
	);

	app.get(/.*/, async (req, res, next) => {
		if (req.method !== "GET") return next();
		if (req.path.startsWith("/api")) return next();
		if (extname(req.path)) return next();
		const sendFallback = () =>
			res
				.status(503)
				.set("Content-Type", "text/html; charset=utf-8")
				.set("Cache-Control", "no-store")
				.send(fallbackShell);
		if (renderFn === null) {
			return sendFallback();
		}
		try {
			const result = await renderFn(req.url);
			if (result.redirect) {
				res.redirect(result.status, result.redirect);
				return;
			}
			if (!result.html) {
				console.error("ssr.render.error-response", {
					url: req.url,
					status: result.status,
				});
				res
					.status(result.status)
					.set("Content-Type", "text/html; charset=utf-8")
					.set("Cache-Control", "no-store")
					.send(fallbackShell);
				return;
			}
			const out = template
				.replace("<!--app-head-->", () => result.head)
				.replace("<!--app-html-->", () => result.html);
			res
				.status(result.status)
				.set("Content-Type", "text/html; charset=utf-8")
				.set("Cache-Control", "no-cache")
				.send(out);
		} catch (err) {
			console.error("ssr.render.failed", {
				url: req.url,
				error: err instanceof Error ? err.stack : String(err),
			});
			sendFallback();
		}
	});
}

const shutdown = async (signal: string) => {
	console.log(`Got ${signal}, shutting down gracefully...`);
	let mod: { closeConnection?: () => Promise<void> | void } | null = null;
	try {
		const dbClient = "./db/client" + ".js";
		mod = await import(/* @vite-ignore */ dbClient);
	} catch (error: unknown) {
		const code = (error as { code?: string } | null)?.code;
		if (code !== "ERR_MODULE_NOT_FOUND") {
			console.error("ssr.shutdown.db-import-failed", {
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}
	if (mod && typeof mod.closeConnection === "function") {
		try {
			await mod.closeConnection();
			console.log("Database connections closed");
		} catch (error: unknown) {
			console.error("ssr.shutdown.db-close-failed", {
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}
	process.exit(0);
};

(["SIGTERM", "SIGINT"] as const).forEach((signal) => {
	process.once(signal, () => {
		void shutdown(signal);
	});
});

const rawPort = process.env.PORT || "3000";
const port = parseInt(rawPort, 10);
if (!Number.isInteger(port) || port <= 0 || port > 65535) {
	console.error("ssr.server.invalid-port", { rawPort });
	process.exit(1);
}
const host = process.env.HOST || "0.0.0.0";
const server = app.listen(port, host, () => {
	console.log(`Server listening on http://${host}:${port}`);
});
server.on("error", (err: NodeJS.ErrnoException) => {
	console.error("ssr.server.listen-failed", {
		port,
		host,
		code: err.code,
		error: err.message,
	});
	process.exit(1);
});

export default app;

import { lazy, Suspense } from 'react';
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from 'react-router-dom';
import CookieBannerErrorBoundary from '@/components/CookieBannerErrorBoundary';
import RootErrorBoundary from '@/components/RootErrorBoundary';
import RootLayout from './layouts/RootLayout';
import Spinner from './components/Spinner';
import ErrorPage from './pages/error';
import { routes } from './routes';
import { CompareProvider } from './contexts/CompareContext';
import { WishlistProvider } from './contexts/WishlistContext';

const CookieBanner = lazy(() =>
  import('@/components/CookieBanner').catch((error) => {
    console.warn('Failed to load CookieBanner:', error);
    return { default: () => null };
  })
);

const SpinnerFallback = () => (
  <div className="flex justify-center py-8 h-screen items-center">
    <Spinner />
  </div>
);

const routeTree: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<SpinnerFallback />}>
        <RootLayout>
          <Outlet />
        </RootLayout>
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: routes,
  },
];

const router = createBrowserRouter(routeTree, {
  basename: '/',
});

export default function App() {
  return (
    <RootErrorBoundary>
      <WishlistProvider>
        <CompareProvider>
          <RouterProvider router={router} />
          <CookieBannerErrorBoundary>
            <Suspense fallback={null}>
              <CookieBanner />
            </Suspense>
          </CookieBannerErrorBoundary>
        </CompareProvider>
      </WishlistProvider>
    </RootErrorBoundary>
  );
}
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  let statusCode = 500;
  let statusText = 'Internal Server Error';
  let message = 'An unexpected error occurred.';

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    statusText = error.statusText;
    if (error.status === 404) {
      message = 'The page you are looking for could not be found.';
    } else if (error.status === 500) {
      message = error.data?.message || 'An error occurred on the server.';
    }
  } else if (error instanceof Error) {
    message = error.message;
    statusText = 'Error';
  }

  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-5xl font-bold text-primary mb-4">{statusCode}</div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{statusText}</h1>

          <p className="text-gray-600 mb-6">{message}</p>

          {isDev && error instanceof Error && (
            <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200 text-left">
              <p className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-words">
                {error.stack}
              </p>
            </div>
          )}

          <Link
            to="/"
            className="inline-block px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

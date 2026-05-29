import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import HomePage from './pages/index';
import ProdNotFoundPage from './pages/_404';
import ErrorPage from './pages/error';

const NotFoundPage = ProdNotFoundPage;

const CollegesPage = lazy(() => import('./pages/colleges'));
const CollegeDetailPage = lazy(() => import('./pages/college-detail'));
const ComparePage = lazy(() => import('./pages/compare'));
const PredictorPage = lazy(() => import('./pages/predictor'));
const WishlistPage = lazy(() => import('./pages/wishlist'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));

export const routes: RouteObject[] = [
  { path: '/',             element: <HomePage />, errorElement: <ErrorPage /> },
  { path: '/colleges',     element: <CollegesPage />, errorElement: <ErrorPage /> },
  { path: '/colleges/:id', element: <CollegeDetailPage />, errorElement: <ErrorPage /> },
  { path: '/compare',      element: <ComparePage />, errorElement: <ErrorPage /> },
  { path: '/predictor',    element: <PredictorPage />, errorElement: <ErrorPage /> },
  { path: '/wishlist',     element: <WishlistPage />, errorElement: <ErrorPage /> },
  { path: '/login',        element: <LoginPage />, errorElement: <ErrorPage /> },
  { path: '/signup',       element: <SignupPage />, errorElement: <ErrorPage /> },
  { path: '*',             element: <NotFoundPage /> },
];

export type Path = '/' | '/colleges' | '/colleges/:id' | '/compare' | '/predictor' | '/login' | '/signup';
export type Params = Record<string, string | undefined>;
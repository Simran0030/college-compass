import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import HomePage from './pages/index';
import ProdNotFoundPage from './pages/_404';

const NotFoundPage = ProdNotFoundPage;

const CollegesPage = lazy(() => import('./pages/colleges'));
const CollegeDetailPage = lazy(() => import('./pages/college-detail'));
const ComparePage = lazy(() => import('./pages/compare'));
const PredictorPage = lazy(() => import('./pages/predictor'));
const WishlistPage = lazy(() => import('./pages/wishlist'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));

export const routes: RouteObject[] = [
  { path: '/',             element: <HomePage /> },
  { path: '/colleges',     element: <CollegesPage /> },
  { path: '/colleges/:id', element: <CollegeDetailPage /> },
  { path: '/compare',      element: <ComparePage /> },
  { path: '/predictor',    element: <PredictorPage /> },
  { path: '/wishlist',     element: <WishlistPage /> },
  { path: '/login',        element: <LoginPage /> },
  { path: '/signup',       element: <SignupPage /> },
  { path: '*',             element: <NotFoundPage /> },
];

export type Path = '/' | '/colleges' | '/colleges/:id' | '/compare' | '/predictor' | '/login' | '/signup';
export type Params = Record<string, string | undefined>;
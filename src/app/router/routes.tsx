import type { RouteObject } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { paths } from './paths'
import { HomePage } from '@/pages/HomePage'
import { BrandsPage } from '@/pages/BrandsPage'
import { BrandDetailPage } from '@/pages/BrandDetailPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { ComparePage } from '@/pages/ComparePage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { LoginPage } from '@/pages/LoginPage'
import { AdminPage } from '@/pages/AdminPage'
import { RegisterPage } from '@/pages/RegisterPage'

export const routes: RouteObject[] = [
  {
    path: paths.home,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: paths.brands, element: <BrandsPage /> },
      { path: paths.brandDetail, element: <BrandDetailPage /> },
      { path: paths.categories, element: <CategoriesPage /> },
      { path: paths.compare, element: <ComparePage /> },
      { path: paths.favorites, element: <FavoritesPage /> },
      { path: paths.profile, element: <ProfilePage /> },
      { path: paths.settings, element: <SettingsPage /> },
      { path: paths.login, element: <LoginPage /> },
      { path: paths.register, element: <RegisterPage /> },
      { path: paths.admin, element: <AdminPage /> },  
      { path: paths.notFound, element: <NotFoundPage /> },
    ],
  },
]
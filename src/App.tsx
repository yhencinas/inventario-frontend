import { Navigate, Route, Routes } from 'react-router-dom'
import { GlobalLoader } from './components/GlobalLoader'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { ProductsPage } from './pages/products/ProductsPage'
import { ReportsPage } from './pages/reports/ReportsPage'
import { SalesPage } from './pages/sales/SalesPage'
import { AdminPage } from './pages/admin/AdminPage'
import { ScreenRoute } from './components/ScreenRoute'

function App() {
  return (
    <>
      <GlobalLoader />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route element={<ScreenRoute route="/" />}><Route path="/" element={<DashboardPage />} /></Route>
            <Route element={<ScreenRoute route="/products" />}><Route path="/products" element={<ProductsPage />} /></Route>
            <Route element={<ScreenRoute route="/sales" />}><Route path="/sales" element={<SalesPage />} /></Route>
            <Route element={<ScreenRoute route="/reports" />}><Route path="/reports" element={<ReportsPage />} /></Route>
            <Route element={<ScreenRoute route="/admin" />}><Route path="/admin" element={<AdminPage />} /></Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App

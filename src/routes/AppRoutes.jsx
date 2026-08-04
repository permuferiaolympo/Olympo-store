import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import Home from '../pages/Home/Home.jsx'
import Catalog from '../pages/Catalog/Catalog.jsx'
import Product from '../pages/Product/Product.jsx'
import About from '../pages/About/About.jsx'
import Contact from '../pages/Contact/Contact.jsx'
import Cart from '../pages/Cart/Cart.jsx'
import Dashbard from '../pages/Dashbard/Dashbard.jsx'
import CreateProduct from '../pages/CreateProduct/CreateProduct.jsx'
import Admin from '../pages/Admin/Admin.jsx'
import Settings from '../pages/Settings/Settings.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        {/* Rutas Públicas de la Tienda */}
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="product/:slug" element={<Product />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />

        {/* Ruta Oculta de Administración */}
        <Route path="admin" element={<Admin />} />
        <Route path="login" element={<Admin />} />

        {/* Rutas Protegidas (Requieren Login Admin) */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashbard />} />
          <Route path="dashboard/create-product" element={<CreateProduct />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes


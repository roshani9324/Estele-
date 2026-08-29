import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./admin/pages/AdminDashboard"
import AdminLogin from "./admin/pages/AdminLogin";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminCollections from "./admin/pages/AdminCollections";
import AdminOrders from "./admin/pages/AdminOrders";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/collections" element={<AdminCollections />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          {/* Next admin pages */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

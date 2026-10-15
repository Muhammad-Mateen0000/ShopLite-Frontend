import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import NotFound from "../pages/NotFound";
import ProductDetail from "../pages/ProductDetail";
import Products from "../pages/Products";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/products/:id"
          element={<ProductDetail />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <div className="mx-auto max-w-7xl px-4 py-10">
                <h1 className="text-3xl font-bold text-[#51463d]">
                  Dashboard
                </h1>

                <p className="mt-2 text-[#81766b]">
                  User dashboard will be implemented later.
                </p>
              </div>
            }
          />
        </Route>

        <Route path="/404" element={<NotFound />} />

        <Route
          path="*"
          element={<Navigate to="/404" replace />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
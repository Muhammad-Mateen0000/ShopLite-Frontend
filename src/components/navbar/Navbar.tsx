import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { totalItems } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await signOut();
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-sm font-medium transition ${
      isActive ? "text-[#a65332]" : "text-[#655b52] hover:text-[#a65332]"
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-[#f3e4d8] text-[#a65332]"
        : "text-[#655b52] hover:bg-[#f5eee8] hover:text-[#a65332]"
    }`;

  const iconLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg p-2 transition ${
      isActive
        ? "bg-[#f3e4d8] text-[#a65332]"
        : "text-[#655b52] hover:bg-[#f5eee8] hover:text-[#a65332]"
    }`;

  return (
    <header className="border-b border-[#e7ddd2] bg-[#fffdf9]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="flex min-h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b45f3c] text-white shadow-sm">
              <ShoppingBag size={19} strokeWidth={2.2} />
            </span>

            <span className="text-xl font-bold tracking-tight text-[#51463d] sm:text-2xl">
              ShopLite
            </span>
          </Link>

          {/* Desktop Center Navigation */}
          <div className="hidden items-center gap-5 md:flex lg:gap-8">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>

            {user && (
              <>
                <NavLink to="/orders" className={navLinkClass}>
                  Orders
                </NavLink>

                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>

                {profile?.role === "admin" && (
                  <NavLink to="/admin" className={navLinkClass}>
                    Admin
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden items-center gap-2 sm:gap-3 md:flex">
            {user ? (
              <>
                {/* Cart */}
                <NavLink to="/cart" className={iconLinkClass} aria-label="Cart">
                  <span className="relative block">
                    <ShoppingCart size={20} />

                    {totalItems > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b45f3c] px-1 text-[10px] font-bold text-white">
                        {totalItems > 99 ? "99+" : totalItems}
                      </span>
                    )}
                  </span>
                </NavLink>

                {/* Dashboard */}
                <NavLink
                  to="/dashboard"
                  className={iconLinkClass}
                  aria-label="Dashboard"
                >
                  <LayoutDashboard size={20} />
                </NavLink>

                {/* Admin */}
                {profile?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className="rounded-lg border border-[#d9cec2] px-3 py-2 text-sm font-medium text-[#655b52] transition hover:border-[#b45f3c] hover:bg-[#fbf4ee] hover:text-[#a65332]"
                  >
                    Admin
                  </NavLink>
                )}

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-[#d9cec2] px-3 py-2 text-sm font-medium text-[#655b52] transition hover:border-[#b45f3c] hover:bg-[#fbf4ee] hover:text-[#a65332]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  className="rounded-lg bg-[#b45f3c] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#9f5031]"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            {user && (
              <NavLink to="/cart" className={iconLinkClass} aria-label="Cart">
                <span className="relative block">
                  <ShoppingCart size={20} />

                  {totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b45f3c] px-1 text-[10px] font-bold text-white">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </span>
              </NavLink>
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="rounded-lg p-2 text-[#655b52] transition hover:bg-[#f5eee8] hover:text-[#a65332]"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-[#e7ddd2] py-4 md:hidden">
            <div className="flex flex-col gap-1">
              <NavLink
                to="/"
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                Products
              </NavLink>

              {user ? (
                <>
                  <NavLink
                    to="/orders"
                    onClick={closeMenu}
                    className={mobileNavLinkClass}
                  >
                    Orders
                  </NavLink>

                  <NavLink
                    to="/dashboard"
                    onClick={closeMenu}
                    className={mobileNavLinkClass}
                  >
                    Dashboard
                  </NavLink>

                  {profile?.role === "admin" && (
                    <NavLink
                      to="/admin"
                      onClick={closeMenu}
                      className={mobileNavLinkClass}
                    >
                      Admin
                    </NavLink>
                  )}

                  <NavLink
                    to="/cart"
                    onClick={closeMenu}
                    className={mobileNavLinkClass}
                  >
                    <span className="flex items-center justify-between">
                      <span>Cart</span>

                      {totalItems > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b45f3c] px-1.5 text-[10px] font-bold text-white">
                          {totalItems > 99 ? "99+" : totalItems}
                        </span>
                      )}
                    </span>
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-lg border border-[#d9cec2] px-3 py-2.5 text-left text-sm font-medium text-[#655b52] transition hover:border-[#b45f3c] hover:bg-[#fbf4ee] hover:text-[#a65332]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="mt-2 flex flex-col gap-2 border-t border-[#e7ddd2] pt-3">
                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-lg border border-[#d9cec2] px-3 py-2.5 text-center text-sm font-medium text-[#655b52] transition hover:border-[#b45f3c] hover:bg-[#fbf4ee] hover:text-[#a65332]"
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/signup"
                    onClick={closeMenu}
                    className="rounded-lg bg-[#b45f3c] px-3 py-2.5 text-center text-sm font-medium text-white transition hover:bg-[#9f5031]"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;

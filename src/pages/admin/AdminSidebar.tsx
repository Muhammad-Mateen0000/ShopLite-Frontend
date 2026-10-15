import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

type AdminSidebarProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

export function AdminSidebar({
  isCollapsed,
  onToggle,
}: AdminSidebarProps) {
  const links = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: Package,
      end: false,
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: ShoppingCart,
      end: false,
    },
    {
      to: "/admin/customers",
      label: "Customers",
      icon: Users,
      end: false,
    },
  ];

  return (
    <aside
      className={`shrink-0 border-r border-[#e7ddd2] bg-[#fffdf9] transition-all duration-200 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex min-h-[calc(100vh-64px)] flex-col">
        <div
          className={`flex items-center border-b border-[#e7ddd2] px-4 py-5 ${
            isCollapsed
              ? "justify-center"
              : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <BarChart3
                size={20}
                className="text-[#b45f3c]"
              />

              <span className="font-semibold text-[#51463d]">
                Admin Panel
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            aria-label={
              isCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="rounded-lg p-2 text-[#655b52] transition hover:bg-[#f5eee8] hover:text-[#a65332]"
          >
            {isCollapsed ? (
              <ChevronRight size={19} />
            ) : (
              <ChevronLeft size={19} />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                title={
                  isCollapsed ? link.label : undefined
                }
                className={({ isActive }) =>
                  `flex items-center rounded-lg py-2.5 text-sm font-medium transition ${
                    isCollapsed
                      ? "justify-center px-2"
                      : "gap-3 px-3"
                  } ${
                    isActive
                      ? "bg-[#f3e4d8] text-[#a65332]"
                      : "text-[#655b52] hover:bg-[#f8f1eb] hover:text-[#a65332]"
                  }`
                }
              >
                <Icon size={19} />

                {!isCollapsed && (
                  <span>{link.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
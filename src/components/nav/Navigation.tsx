import React from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Home, Target, BarChart3, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation: React.FC = () => {
  const navItems = [
    {
      path: "/",
      label: "Resumen",
      icon: Home,
    },
    {
      path: "/today",
      label: "Hoy",
      icon: CheckSquare,
    },
    {
      path: "/calendar",
      label: "Calendario",
      icon: Calendar,
    },
    {
      path: "/habits",
      label: "Hábitos",
      icon: Target,
    },
    {
      path: "/progress",
      label: "Progreso",
      icon: BarChart3,
    },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

import React from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Home, Target, BarChart3, CheckSquare, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AuthAppContext";

const Navigation: React.FC = () => {
  const { state, signOut } = useApp();

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
          
          {/* User section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{state.user?.name}</span>
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

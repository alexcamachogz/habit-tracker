import React from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Home, Target, BarChart3, CheckSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AuthAppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          
          {/* User dropdown */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-10 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full hover:ring-2 hover:ring-gray-300 transition-all">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(state.user?.name || 'User')}&background=3b82f6&color=fff&size=40`}
                    alt={state.user?.name || 'Usuario'}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      // Fallback si la imagen no carga
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(state.user?.name?.charAt(0) || 'U')}&background=6b7280&color=fff&size=40`;
                    }}
                  />
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-64">
                <div className="flex items-center space-x-3 p-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(state.user?.name || 'User')}&background=3b82f6&color=fff&size=40`}
                    alt={state.user?.name || 'Usuario'}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {state.user?.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {state.user?.email}
                    </p>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  onClick={signOut}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

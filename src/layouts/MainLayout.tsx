import React from "react";
import Navigation from "@/components/nav/Navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

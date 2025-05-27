
import React from 'react';
import { Button } from "@/components/ui/button";
import { Archive, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-3">
      <Button
        onClick={() => navigate('/')}
        variant={isActive('/') ? "default" : "outline"}
        className={`backdrop-blur-lg transition-all duration-200 ${
          isActive('/') 
            ? "bg-blue-500/80 hover:bg-blue-600/80 text-white border-blue-400/30" 
            : "bg-slate-800/40 border-slate-600/30 text-white hover:bg-slate-700/50"
        }`}
      >
        <Home className="w-4 h-4 mr-2" />
        Dashboard
      </Button>
      <Button
        onClick={() => navigate('/archived-events')}
        variant={isActive('/archived-events') ? "default" : "outline"}
        className={`backdrop-blur-lg transition-all duration-200 ${
          isActive('/archived-events') 
            ? "bg-blue-500/80 hover:bg-blue-600/80 text-white border-blue-400/30" 
            : "bg-slate-800/40 border-slate-600/30 text-white hover:bg-slate-700/50"
        }`}
      >
        <Archive className="w-4 h-4 mr-2" />
        Arquivados
      </Button>
    </div>
  );
};

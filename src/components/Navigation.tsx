
import React from 'react';
import { Button } from "@/components/ui/button";
import { Archive, Home, Users, StickyNote, BarChart3, CheckCircle } from "lucide-react";
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
        className={`backdrop-blur-xl transition-all duration-200 ${
          isActive('/') 
            ? "bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/80 hover:to-blue-600/80 text-white border-cyan-400/30" 
            : "bg-slate-800/40 border-cyan-500/30 text-white hover:bg-slate-700/50"
        }`}
      >
        <Home className="w-4 h-4 mr-2" />
        Dashboard
      </Button>
      <Button
        onClick={() => navigate('/overview')}
        variant={isActive('/overview') ? "default" : "outline"}
        className={`backdrop-blur-xl transition-all duration-200 ${
          isActive('/overview') 
            ? "bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/80 hover:to-blue-600/80 text-white border-cyan-400/30" 
            : "bg-slate-800/40 border-cyan-500/30 text-white hover:bg-slate-700/50"
        }`}
      >
        <BarChart3 className="w-4 h-4 mr-2" />
        Visão Geral
      </Button>
      <Button
        onClick={() => navigate('/crm')}
        variant={isActive('/crm') ? "default" : "outline"}
        className={`backdrop-blur-xl transition-all duration-200 ${
          isActive('/crm') 
            ? "bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/80 hover:to-blue-600/80 text-white border-cyan-400/30" 
            : "bg-slate-800/40 border-cyan-500/30 text-white hover:bg-slate-700/50"
        }`}
      >
        <Users className="w-4 h-4 mr-2" />
        CRM
      </Button>
      <Button
        onClick={() => navigate('/notes')}
        variant={isActive('/notes') ? "default" : "outline"}
        className={`backdrop-blur-xl transition-all duration-200 ${
          isActive('/notes') 
            ? "bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/80 hover:to-blue-600/80 text-white border-cyan-400/30" 
            : "bg-slate-800/40 border-cyan-500/30 text-white hover:bg-slate-700/50"
        }`}
      >
        <StickyNote className="w-4 h-4 mr-2" />
        Anotações
      </Button>
      <Button
        onClick={() => navigate('/completed-events')}
        variant={isActive('/completed-events') ? "default" : "outline"}
        className={`backdrop-blur-xl transition-all duration-200 ${
          isActive('/completed-events') 
            ? "bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/80 hover:to-blue-600/80 text-white border-cyan-400/30" 
            : "bg-slate-800/40 border-cyan-500/30 text-white hover:bg-slate-700/50"
        }`}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Concluídos
      </Button>
      <Button
        onClick={() => navigate('/archived-events')}
        variant={isActive('/archived-events') ? "default" : "outline"}
        className={`backdrop-blur-xl transition-all duration-200 ${
          isActive('/archived-events') 
            ? "bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/80 hover:to-blue-600/80 text-white border-cyan-400/30" 
            : "bg-slate-800/40 border-cyan-500/30 text-white hover:bg-slate-700/50"
        }`}
      >
        <Archive className="w-4 h-4 mr-2" />
        Arquivados
      </Button>
    </div>
  );
};

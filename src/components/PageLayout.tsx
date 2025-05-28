
import React, { Suspense } from 'react';
import { Navigation } from '@/components/Navigation';
import { Skeleton } from '@/components/ui/skeleton';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const PageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
    <Navigation />
    <div className="mx-10 p-4 max-w-none">
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 mb-4 shadow-2xl h-[120px] flex items-center">
        <div className="flex-1">
          <Skeleton className="h-10 w-64 mb-2 bg-white/10" />
          <Skeleton className="h-4 w-96 bg-white/5" />
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full bg-slate-800/20" />
        ))}
      </div>
    </div>
  </div>
);

export const PageLayout: React.FC<PageLayoutProps> = ({ children, title, subtitle }) => {
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const currentDateTime = new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 transition-all duration-300 ease-in-out">
      <Navigation />
      
      <div className="mx-10 p-4 max-w-none">
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 mb-4 shadow-2xl h-[120px] flex items-center animate-fade-in">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                {title}
              </h1>
              <p className="text-cyan-300">
                {subtitle || `Desenvolvido por Lon Systems. ${formatDateTime(currentDateTime)}`}
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<PageSkeleton />}>
          <div className="animate-fade-in">
            {children}
          </div>
        </Suspense>
      </div>
    </div>
  );
};


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Index from "./pages/Index";
import ArchivedEvents from "./pages/ArchivedEvents";
import CRM from "./pages/CRM";
import Notes from "./pages/Notes";
import Overview from "./pages/Overview";
import CompletedEvents from "./pages/CompletedEvents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 flex items-center justify-center">
    <div className="text-center space-y-4">
      <Skeleton className="h-8 w-48 mx-auto bg-white/10" />
      <Skeleton className="h-4 w-32 mx-auto bg-white/5" />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen transition-all duration-300 ease-in-out">
          <Suspense fallback={<AppSkeleton />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/crm" element={<CRM />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/completed-events" element={<CompletedEvents />} />
              <Route path="/archived-events" element={<ArchivedEvents />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

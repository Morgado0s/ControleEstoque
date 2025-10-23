import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EstoqueProvider } from "@/contexts/EstoqueContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordRecovery from "./pages/PasswordRecovery";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Dashboard from "./pages/Dashboard";
import Estoque from "./pages/Estoque";
import Movimentacoes from "./pages/Movimentacoes";
import Produtos from "./pages/Produtos";
import Armazens from "./pages/Armazens";
import Categorias from "./pages/Categorias";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/recuperar-senha" element={<PasswordRecovery />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/privacidade" element={<Privacy />} />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <EstoqueProvider>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </EstoqueProvider>
              </ProtectedRoute>
            } />
            <Route path="/estoque" element={
              <ProtectedRoute>
                <EstoqueProvider>
                  <AppLayout>
                    <Estoque />
                  </AppLayout>
                </EstoqueProvider>
              </ProtectedRoute>
            } />
            <Route path="/movimentacoes" element={
              <ProtectedRoute>
                <EstoqueProvider>
                  <AppLayout>
                    <Movimentacoes />
                  </AppLayout>
                </EstoqueProvider>
              </ProtectedRoute>
            } />
            <Route path="/produtos" element={
              <ProtectedRoute>
                <EstoqueProvider>
                  <AppLayout>
                    <Produtos />
                  </AppLayout>
                </EstoqueProvider>
              </ProtectedRoute>
            } />
            <Route path="/armazens" element={
              <ProtectedRoute>
                <EstoqueProvider>
                  <AppLayout>
                    <Armazens />
                  </AppLayout>
                </EstoqueProvider>
              </ProtectedRoute>
            } />
            <Route path="/categorias" element={
              <ProtectedRoute>
                <EstoqueProvider>
                  <AppLayout>
                    <Categorias />
                  </AppLayout>
                </EstoqueProvider>
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <EstoqueProvider>
                  <AppLayout>
                    <Perfil />
                  </AppLayout>
                </EstoqueProvider>
              </ProtectedRoute>
            } />

            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

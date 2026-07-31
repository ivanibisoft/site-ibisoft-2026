import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import Segment from './pages/Segment'
import Functionality from './pages/Functionality'
import QueroConhecer from './pages/QueroConhecer'
import SobreErp from './pages/SobreErp'
import About from './pages/About'
import Cases from './pages/Cases'
import NotFound from './pages/NotFound'
import { ScrollToTop } from './components/ScrollToTop'
import { SiteAssetsProvider } from '@/hooks/use-site-assets'
import { AuthProvider } from '@/hooks/use-auth'
import { ErrorBoundary } from './components/ErrorBoundary'
import { EditorMiddleware } from './components/EditorMiddleware'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'
import AdminLogin from '@/pages/admin/Login'
import AdminDashboard from '@/pages/admin/Dashboard'
import CollectionListPage from '@/pages/admin/CollectionListPage'
import CollectionFormPage from '@/pages/admin/CollectionFormPage'

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <SiteAssetsProvider>
        <EditorMiddleware>
          <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
            <ScrollToTop />
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/segmentos/:slug" element={<Segment />} />
                  <Route path="/funcionalidades/:slug" element={<Functionality />} />
                  <Route path="/quero-conhecer" element={<QueroConhecer />} />
                  <Route path="/sobre-erp" element={<SobreErp />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/cases" element={<Cases />} />
                  <Route path="/contato" element={<QueroConhecer />} />
                </Route>

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path=":collection" element={<CollectionListPage />} />
                    <Route path=":collection/new" element={<CollectionFormPage />} />
                    <Route path=":collection/:id/edit" element={<CollectionFormPage />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BrowserRouter>
        </EditorMiddleware>
      </SiteAssetsProvider>
    </AuthProvider>
  </ErrorBoundary>
)

export default App

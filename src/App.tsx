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
import AdminLayout from './components/AdminLayout'
import AdminLogin from './pages/admin/Login'
import AdminForgotPassword from './pages/admin/ForgotPassword'
import AdminDashboard from './pages/admin/Dashboard'
import AdminLeads from './pages/admin/Leads'
import AdminModules from './pages/admin/Modules'
import AdminModuleDetails from './pages/admin/ModuleDetails'
import AdminSegments from './pages/admin/Segments'
import AdminCases from './pages/admin/Cases'
import AdminTeam from './pages/admin/Team'
import AdminProfile from './pages/admin/Profile'
import AdminHomeConfig from './pages/admin/HomeConfig'
import AdminPartnerLogos from './pages/admin/PartnerLogos'
import { ScrollToTop } from './components/ScrollToTop'
import { AuthProvider } from '@/hooks/use-auth'
import { ErrorBoundary } from './components/ErrorBoundary'
import { EditorMiddleware } from './components/EditorMiddleware'

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
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
              <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="modules" element={<AdminModules />} />
                <Route path="modules/:id" element={<AdminModuleDetails />} />
                <Route path="segments" element={<AdminSegments />} />
                <Route path="cases" element={<AdminCases />} />
                <Route path="team" element={<AdminTeam />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="home-config" element={<AdminHomeConfig />} />
                <Route path="partner-logos" element={<AdminPartnerLogos />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </EditorMiddleware>
    </AuthProvider>
  </ErrorBoundary>
)

export default App

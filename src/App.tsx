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
import { ErrorBoundary } from './components/ErrorBoundary'
import { EditorMiddleware } from './components/EditorMiddleware'

const App = () => (
  <ErrorBoundary>
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

              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </EditorMiddleware>
    </SiteAssetsProvider>
  </ErrorBoundary>
)

export default App

import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ExitIntentModal } from './ExitIntentModal'
import { WhatsAppButton } from './WhatsAppButton'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/20 selection:text-primary">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ExitIntentModal />
      <WhatsAppButton />
    </div>
  )
}

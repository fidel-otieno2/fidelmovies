import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import InstallPrompt from '../components/InstallPrompt'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <InstallPrompt />
    </div>
  )
}

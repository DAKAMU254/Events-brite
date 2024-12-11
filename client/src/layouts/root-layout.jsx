import { Outlet } from 'react-router-dom'
import Navbar from './navbar'
import Footer from './footer'

export default function RootLayout() {
  return (
    <div>
      <Navbar />
        <Outlet />
      <Footer />
    </div>
  )
}
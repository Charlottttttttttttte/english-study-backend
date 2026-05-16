import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import Level1Page from './pages/Level1Page'
import Level2Page from './pages/Level2Page'
import Level3Page from './pages/Level3Page'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map/:date" element={<MapPage />} />
        <Route path="/level1/:date" element={<Level1Page />} />
        <Route path="/level2/:date" element={<Level2Page />} />
        <Route path="/level3/:date" element={<Level3Page />} />
        <Route path="/stats/:date" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Layout>
  )
}

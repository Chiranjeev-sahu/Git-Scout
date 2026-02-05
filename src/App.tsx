import { Route, Routes } from 'react-router'
import { HomePage } from './components/HomePage'
import { MainLayout } from './components/layout/MainLayout'

import { Dashboard } from './components/Dashboard'

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route element={<MainLayout />}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App

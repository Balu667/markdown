import './App.css'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './views/Dashboard'
import { Navigate } from 'react-router-dom';

function App() {

  return (
   <div>
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
   </div>
  )
}

export default App

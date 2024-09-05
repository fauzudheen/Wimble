import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AdminRoutes from './utils/AdminRoutes';
import UserRoutes from './utils/UserRoutes';

function App() {

  return (
    <Router>
      <>
        <AdminRoutes />
        <UserRoutes />
      </>
    </Router>
  )
}

export default App

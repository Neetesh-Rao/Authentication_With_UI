import { Toaster } from "react-hot-toast";
import './App.css'
import AuthPage from './AuthPage'
import DashboardPage from './DashboardPage';
import {BrowserRouter, Routes,Route} from 'react-router-dom';
 


function App() {


  return (
   <BrowserRouter>
   <Toaster position="bottom-right" reverseOrder={false} />
   <Routes>
    <Route path="/" element={<AuthPage/>}/>
    <Route path="/dashboard" element={<DashboardPage/>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App

import {Routes, Route} from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { LookEmail } from "./auth/LookEmail";
import MainPage from "./pages/MainPage";
import Dashboard from "./pages/auth_user/Dashboard";
import AdminDashboard from "./pages/auth_user/AdminDashboard";
import BeLogin from "./layout/BeLogin";
import Logout from "./layout/Logout";
import Profile from "./pages/auth_user/Profile";
import Account from "./pages/auth_user/Account";
import { ResetPassword } from "./auth/Reset/ResetPassword";
import { PasswordChangeRequest } from "./auth/Reset/PasswordChangeRequest";

function App() {
  return (
    <Routes>
        <Route path='' element={<MainPage/>}/>
      {/* login */}
        <Route path='login' element={<Login/>}/>

      {/* register */}
        <Route path='register' element={<Register/>}/>
        <Route path="/click-link" element={<LookEmail />} />

      {/* reset password */}
        <Route path="/reset-password" element={<PasswordChangeRequest />} />
        <Route path="/reset/:id/:token" element={<ResetPassword />} />

      {/* pages */}
        <Route path='dashboard' element={< Dashboard />}/>
        <Route path='admin-dashboard' element={< AdminDashboard />}/>
        <Route path='be-login' element={<BeLogin/>} />
        <Route path='logout' element={<Logout/>}/>
        <Route path='profile' element={<Profile/>}/>
        <Route path='account' element={<Account/>}/>
    </Routes>
  )
}

export default App

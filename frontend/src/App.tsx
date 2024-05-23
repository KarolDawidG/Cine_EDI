import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { LookEmail } from "./auth/LookEmail";
import MainPage from "./pages/main/MainPage";
import Dashboard from "./pages/auth_user/Dashboard";
import AdminDashboard from "./pages/auth_user/adminComponents/AdminDashboard";
import BeLogin from "./layout/BeLogin";
import Logout from "./layout/Logout";
import Profile from "./pages/auth_user/Profile";
import Account from "./pages/auth_user/Account";
import { ResetPassword } from "./auth/Reset/ResetPassword";
import { PasswordChangeRequest } from "./auth/Reset/PasswordChangeRequest";
import VHSCatalog from "./components/Vhs/VHSCatalog";
import Basket from "./components/Basket/Basket";
import { SalesDataProvider } from "./components/DataAnalizing/contex/SalesDataContext";
import { MoviesProvider } from "./components/Vhs/hooks/context/MoviesContext";
import { CartProvider } from "./components/Basket/context/CartContext";

function App() {
  return (
    <MoviesProvider>
      <CartProvider>
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
          <Route path='dashboard' element={<Dashboard />}/>
          <Route path='be-login' element={<BeLogin/>} />
          <Route path='logout' element={<Logout/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='account' element={<Account/>}/>
          <Route path='vhs' element={<VHSCatalog />}/>
          <Route path='basket' element={<Basket />}/>
          <Route path='admin-dashboard' element={
            <SalesDataProvider>
              <AdminDashboard />
            </SalesDataProvider>
          } />
        </Routes>
      </CartProvider>
    </MoviesProvider>
  );
}

export default App;

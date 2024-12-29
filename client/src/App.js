import {BrowserRouter,Routes,Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizerDashboard from './pages/OrganizerDashboard';
import SponsorDashboard from './pages/SponsorDashboard';
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectedRoutes from './components/ProtectedRoutes';
import PublicRoute from './components/PublicRoute';
import IntroPage from './pages/IntroPage';
import Profile from './pages/Profile';

function App() {
  const {loading}=useSelector(state =>state.alerts)
  return (
    <>
      <BrowserRouter>
      {loading ? (<Spinner/>) 
      :(
        <Routes>

        <Route path='/' element={
        <PublicRoute><IntroPage/></PublicRoute>
        }/>

      <Route path='/home' element={
        <ProtectedRoutes><HomePage/></ProtectedRoutes>
      }/>

      <Route path='/login' element={
        <PublicRoute><Login/></PublicRoute>
        }/>

      <Route path='/register' element={
        <PublicRoute><Register/></PublicRoute>
        }/>

        
      <Route path='/OrganizerDashboard' element={<ProtectedRoutes><OrganizerDashboard/></ProtectedRoutes>}/>

      <Route path='/Profile' element={<ProtectedRoutes><Profile/></ProtectedRoutes>}/>

      <Route path='/SponsorDashboard' element={<ProtectedRoutes><SponsorDashboard/></ProtectedRoutes>}/>
    </Routes>
      )
      }
      
      </BrowserRouter>
    </>
  );
}

export default App;

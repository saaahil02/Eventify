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
import NotificationPage from './pages/NotificationPage';
import Organizers from './pages/admin/Organizers';
import Sponsors from './pages/admin/Sponsors';
import Users from './pages/admin/Users';
import OrgProfile from './pages/Organizers/OrgProfile';
import SpoProfile from './pages/Sponsor/SpoProfile';
import OrgRoute from './components/OrgRoute';
import SpoRoute from './components/SpoRoute';
import CreateEvent from './pages/Organizers/CreateEvent';
import EventRegister from './pages/EventRegister';
import YourEvents from './pages/Organizers/YourEvents';
import EventAnalytics from './pages/Organizers/EventAnalytics';
import GoogleForm from './pages/GoogleForm';
import SpoHomePage from './pages/Sponsor/SpoHomepage';
import SpoEventDetails from './pages/Sponsor/SpoEventDetails';


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

    

        
      <Route path='/Organizer-Register' element={<ProtectedRoutes><OrganizerDashboard/></ProtectedRoutes>}/>

      <Route path='/Profile' element={<ProtectedRoutes><Profile/></ProtectedRoutes>}/>

      <Route path='/Sponsor-Register' element={<ProtectedRoutes><SponsorDashboard/></ProtectedRoutes>}/>

      <Route path='/notification' element={<ProtectedRoutes><NotificationPage/></ProtectedRoutes>}/>

      <Route path='/admin/OrganizersList' element={<ProtectedRoutes><Organizers/></ProtectedRoutes>}/>

      <Route path='/admin/SponsorsList' element={<ProtectedRoutes><Sponsors/></ProtectedRoutes>}/>

      <Route path='/admin/UsersList' element={<ProtectedRoutes><Users/></ProtectedRoutes>}/>

      <Route path='/user/event/:id' element={<ProtectedRoutes><EventRegister/></ProtectedRoutes>}/>

      <Route path='/user/googleForm' element={<ProtectedRoutes><OrgRoute><GoogleForm/></OrgRoute></ProtectedRoutes>}/>

      <Route path='/organizer/profile' element={<ProtectedRoutes><OrgRoute><OrgProfile/></OrgRoute></ProtectedRoutes>}/>

      <Route path='/organizer/CreateEvent' element={<OrgRoute><ProtectedRoutes><CreateEvent/></ProtectedRoutes></OrgRoute>}/>

      <Route path='/organizer/YourEvents' element={<ProtectedRoutes><OrgRoute><YourEvents/></OrgRoute></ProtectedRoutes>}/>

      <Route path='/organizer/EventAnalytics' element={<ProtectedRoutes><OrgRoute><EventAnalytics/></OrgRoute></ProtectedRoutes>}/>

      
      <Route path='/sponsor/profile' element={<ProtectedRoutes><SpoRoute><SpoProfile/></SpoRoute></ProtectedRoutes>}/>
      
      <Route path='/sponsor/listevent' element={<ProtectedRoutes><SpoRoute><SpoHomePage/></SpoRoute></ProtectedRoutes>}/>
      <Route path='/sponsor/EventDetails/:id' element={<ProtectedRoutes><SpoRoute><SpoEventDetails/></SpoRoute></ProtectedRoutes>}/>


    </Routes>
      )
      }
      
      </BrowserRouter>
    </>
  );
}

export default App;

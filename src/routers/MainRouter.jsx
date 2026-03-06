import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { AdminLayout } from './Layouts/AdminLayout';
import { StudentLayout } from './Layouts/StudentLayout';
import { ProtectedRoute } from './ProtectedRoute';
import Project from '../pages/Project';
import { Settings } from '../pages/Settings';
import { Reports } from '../pages/Reports';
import { PublicLayout } from './Layouts/PublicLayout';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import VerifyOtp from '../pages/public/VerifyOtp';
import { Home } from '../pages/public/Home';
import { About } from '../pages/public/About';
import { Services } from '../pages/public/Services';
import { CoordinatorLayout } from './Layouts/CoordinatorLayout';
import Profile from '../pages/Porfile';
import UserProfile from '../pages/UserProfile';
import { useAuth } from '../utils/AuthProvider';
import Events from '../pages/Events';
import EventDetailsPage from '../pages/EventDetailsPage';
import { EventLayout } from './Layouts/Eventayout';
import MyEvents from '../pages/MyEvents';
import CreateEvent from '../pages/CreateEvent';
import RegisteredEvents from '../pages/RegisteredEvents';
import Users from '../pages/Users';
import Approvals from '../pages/Approvals';
import Notifications from '../pages/Notifications';
import Tasks from '../pages/Tasks';
import Calendar from '../pages/Calendar';
import { AutoRedirect } from './AutoRedirect';
import NotFound from '../pages/NotFound';

const MainRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<AutoRedirect />} />
      
      <Route path='/' element={<PublicLayout />}>

        <Route index element={<Home title='Home' />} />
        <Route path='about' element={<About title='About' />} />
        <Route path='services' element={<Services title='Services' />} />
        <Route path='login' element={<Login title='Login' />} />
        <Route path='register' element={<Register title='Register' />} />
        <Route path='verify-otp' element={<VerifyOtp title='Verify OTP' />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
               <Route index element={<Dashboard title="Overview" />} />
               <Route path="events" element={<EventLayout />}>
                 <Route index element={<Events title="Events" />} />
                 <Route path="api/:id" element={<EventDetailsPage title="Event Details" />} />
                 <Route path="myevents" element={<MyEvents title="My Events" />} />
                 <Route path="create" element={<CreateEvent title="Create Event" />} />
               </Route>
               <Route path="projects" element={<Project title="Projects" />} />
               <Route path="users">
                 <Route index element={<Users title="All Users" />} />
                 <Route path="students" element={<Users title="Students" />} />
                 <Route path="coordinators" element={<Users title="Coordinators" />} />
               </Route>
               <Route path="approvals">
                 <Route index element={<Approvals title="Pending Approvals" />} />
                 <Route path="approved" element={<Approvals title="Approved" />} />
                 <Route path="rejected" element={<Approvals title="Rejected" />} />
               </Route>
               <Route path='reports' element={<Reports title="Reports"/>}/>
               <Route path="calendar" element={<Calendar title="Calendar" />} />
               <Route path="notifications" element={<Notifications title="Notifications" />} />
               <Route path="profile" element={<Profile title="Profile"/>}/>
               <Route path="user/:id" element={<UserProfile title="User Profile"/>}/>
               <Route path='settings' element={<Settings title="Settings"/>}/>
          </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['Coordinator']} />}>
      <Route path="/coordinator" element={<CoordinatorLayout/>}>
        <Route  index element={<Dashboard  title="Overview" />} />
         <Route path="events" element={<EventLayout />}>
           <Route index element={<Events title="Events" />} />
           <Route path="api/:id" element={<EventDetailsPage title="Event Details" />} />
         </Route>
        <Route path="tasks" element={<Tasks title="Tasks" />} />
        <Route path="calendar" element={<Calendar title="Calendar" />} />
        <Route path='settings' element={<Settings title="Settings"/>}/>
         <Route path="profile" element={<Profile title="Profile"/>}/>
         <Route path="user/:id" element={<UserProfile title="User Profile"/>}/>
       </Route>    
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
      <Route path="/student" element={<StudentLayout />}>
        <Route  index element={<Dashboard title="Overview" />} />
          <Route path="events" element={<EventLayout />}>
             <Route index element={<Events title="Events" />} />
             <Route path="registered" element={<RegisteredEvents title="My Registered Events" />} />
                   <Route path="api/:id" element={<EventDetailsPage title="Event Details" />} />
               </Route>
         <Route path="profile" element={<Profile title="Profile"/>}/>
         <Route path="user/:id" element={<UserProfile title="User Profile"/>}/>
         <Route path="calendar" element={<Calendar title="Calendar" />} />
         <Route path="settings" element={<Settings title="Settings"/>}/>
       </Route>    
      </Route>
                   {/* <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
      <Route path="/student" element={<StudentLayout />}>
        <Route  index element={<StudentDashboard title="Overview" />} />
        <Route path="profile" element={<Profile title="Student Profile" />} />
        <Route path="request" element={<RequestedRegisterList title="My Registration Requests" />} />
        <Route path="settings" element={<Settings title="Settings" />} />
        <Route path="calendar" element={<Calendar title="Calendar" />} />
        <Route path="notifications" element={<Notifications title="Notifications" />} />
      </Route>
    </Route> */}

      <Route path="*" element={<NotFound />} />

    </>
  )
);

export default MainRouter;
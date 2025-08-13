import { Route } from "react-router-dom";
import Sdashboard from "../pages/Administrator/Sdashboard";
import Administratorusermanagement from "../pages/Administrator/administratorusermanagement";
import Administratorcoursemanagement from "../pages/Administrator/administratorcoursemanagement";
import AdministratorNotification from "../pages/Administrator/administratorNotification";
import AdministratorLogging from "../pages/Administrator/administratorlogging";

export const Administrator = () => (
     <>
     <Route path="/administrator" element={<Sdashboard/>} />
     <Route path="/administrator/user/management" element={<Administratorusermanagement/>} />
     <Route path="/administrator/course/management" element={<Administratorcoursemanagement/>} />
     <Route path="/administrator/notification" element={<AdministratorNotification/>} />
     <Route path="/administrator/system/log" element={<AdministratorLogging/>} />
    </>
    
);


import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Services from "./components/Services";
import ServiceDetail from "./components/ServiceDetail";
import Reservations from "./components/Reservations";
import ReservationDetail from "./components/ReservationDetail";
import ReservationEdit from "./components/ReservationEdit";
import Vehicles from "./components/Vehicles";
import VehicleDetail from "./components/VehicleDetail";
import VehicleAdd from "./components/VehicleAdd";
import VehicleEdit from "./components/VehicleEdit";
import ProfileEdit from "./components/ProfileEdit";

export const routes = {
  "/dashboard": {
    component: Dashboard,
    // we are using `meta` as a good practice, but you are free to use something else
    meta: { needsAuth: true },
  },
  "/login": {
    component: Login,
    meta: { needsAuth: false },
  },
  "/register": {
    component: Register,
    meta: { needsAuth: false },
  },
  "/services": {
    component: Services,
    meta: { needsAuth: true },
  },
  "/service": {
    component: ServiceDetail,
    meta: { needsAuth: true },
  },
  "/reservations": {
    component: Reservations,
    meta: { needsAuth: true },
  },
  "/reservation": {
    component: ReservationDetail,
    meta: { needsAuth: true },
  },
  "/reservation-edit": {
    component: ReservationEdit,
    meta: { needsAuth: true },
  },
  "/vehicles": {
    component: Vehicles,
    meta: { needsAuth: true },
  },
  "/vehicle": {
    component: VehicleDetail,
    meta: { needsAuth: true },
  },
  "/vehicle-add": {
    component: VehicleAdd,
    meta: { needsAuth: true },
  },
  "/vehicle-edit": {
    component: VehicleEdit,
    meta: { needsAuth: true },
  },
  "/account": {
    component: ProfileEdit,
    meta: { needsAuth: true },
  },
};

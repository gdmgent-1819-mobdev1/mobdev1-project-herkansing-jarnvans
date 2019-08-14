// Pages
import HomeView from './pages/home';
import FirebaseView from './pages/firebase-example';
import MapboxView from './pages/mapbox-example';
import RegisterView from './pages/register';
import LoginView from './pages/login';
import PasswordResetView from './pages/password-reset';
import ProfileView from './pages/profile';
import RoomsView from './pages/rooms';
import AddRoomView from './pages/add_room';
import DetailRoomView from './pages/detail';
import FavoritesRoomView from './pages/favorites';

export default [
  { path: '/', view: HomeView },
  { path: '/firebase', view: FirebaseView },
  { path: '/mapbox', view: MapboxView },
  { path: '/register', view: RegisterView },
  { path: '/login', view: LoginView },
  { path: '/login/password-reset', view: PasswordResetView },
  { path: '/profile', view: ProfileView },
  { path: '/rooms', view: RoomsView },
  { path: '/rooms/add', view: AddRoomView },
  { path: '/rooms/:id', view: DetailRoomView },
  { path: '/favorites', view: FavoritesRoomView },
];

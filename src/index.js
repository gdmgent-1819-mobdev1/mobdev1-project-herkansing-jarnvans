import Navigo from 'navigo';
import handlebars, { compile } from 'handlebars';
import './styles/main.scss';

import routes from './routes';

// Partials
const headerOwner = require('./partials/headerOwner.handlebars');
const headerStudent = require('./partials/headerStudent.handlebars');
const footer = require('./partials/footer.handlebars');

// Register the partial components
// functions.getCurrentUser()
//   .then((user) => {
//     const { type } = user;
//     let student = false;
//     if (type === 'student') {
//       student = true;
//     }
//     console.log(type);

handlebars.registerPartial('headerOwner', compile(headerOwner)({}));
handlebars.registerPartial('headerStudent', compile(headerStudent)({}));
handlebars.registerPartial('footer', compile(footer)({}));
// Router logic to load the correct template when needed
const router = new Navigo(window.location.origin, true);

routes.forEach((route) => {
  router.on(route.path, () => {
    route.view();
    router.updatePageLinks();
  });
});

// This catches all non-existing routes and redirects back to the home
router.notFound(() => {
  router.navigate('/');
});
router.resolve();
window.onload = () => {
  router.navigate(window.location.hash.split('/')[1]);
};

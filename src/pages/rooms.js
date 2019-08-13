import { compile } from 'handlebars';
import update from '../helpers/update';
import functions from '../helpers/functions';

// Import the template to use
const dormsTemplate = require('../templates/rooms.handlebars');

export default () => {
  const user = localStorage.getItem('currentUserId');
  const student = functions.getUserType();

  functions.getRooms(user, student)
    .then((dorms) => {
      let foundDorms = false;

      if (dorms.length > 0) {
        foundDorms = true;
      }

      update(compile(dormsTemplate)({ foundDorms, dorms, student }));
      document.querySelector('.menu-open').addEventListener('click', functions.openMenu, false);
      document.querySelector('.menu-close').addEventListener('click', functions.closeMenu, false);
      document.querySelector('.log-out').addEventListener('click', functions.signOut, false);
    });
};

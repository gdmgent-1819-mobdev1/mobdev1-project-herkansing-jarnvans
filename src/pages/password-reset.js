import { compile } from 'handlebars';
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const passwordResetTemplate = require('../templates/password-reset.handlebars');

const resetPassword = () => {
  const email = document.querySelector('.email').value;

  firebase.auth().sendPasswordResetEmail(email);
  window.location.replace('#/login');
};

export default () => {
  // Data to be passed to the template
  // Return the compiled template to the router
  update(compile(passwordResetTemplate)({}));
  document.querySelector('.send').addEventListener('click', resetPassword, false);
};

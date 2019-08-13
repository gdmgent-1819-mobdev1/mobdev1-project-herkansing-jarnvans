import { compile } from 'handlebars';
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const loginTemplate = require('../templates/login.handlebars');

const signIn = (e) => {
  e.preventDefault();
  const email = document.querySelector('.email').value;
  const password = document.querySelector('.password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.replace('#/profile');
    })
    .catch((error) => {
      console.log(error);
    });
};

export default () => {
  // Data to be passed to the template
  // Return the compiled template to the router
  update(compile(loginTemplate)({}));
  document.querySelector('.send').addEventListener('click', signIn, false);
};

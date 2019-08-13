// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import functions from '../helpers/functions';


const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
const database = firebase.database();
// Import the template to use
const profileTemplate = require('../templates/profile.handlebars');


const cutEmail = (email) => {
  const placeAt = email.indexOf('@');
  const firstPartEmail = email.substr(0, placeAt);
  const lastPartEmail = email.substr(placeAt);
  return {
    firstPartEmail,
    lastPartEmail,
  };
};

const getSchool = (id) => {
  return new Promise((resolve, reject) => {
    database.ref(`schools/${id}`).once('value')
      .then(snapshot => snapshot.val())
      .then((school) => {
        resolve(school);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default () => {
  functions.getCurrentUser()
    .then((user) => {
      localStorage.setItem('currentUserId', user.id);
      localStorage.setItem('type', user.type);
      let student = false;
      let nameSchool = '';
      const newEmail = cutEmail(user.email);
      const { firstPartEmail } = newEmail;
      const { lastPartEmail } = newEmail;
      if (user.type === 'student') {
        student = true;
        getSchool(user.school)
          .then((school) => {
            nameSchool = school.name;
            update(compile(profileTemplate)({
              user, student, firstPartEmail, lastPartEmail, nameSchool,
            }));
            document.querySelector('.menu-open').addEventListener('click', functions.openMenu, false);
            document.querySelector('.menu-close').addEventListener('click', functions.closeMenu, false);
            document.querySelector('.log-out').addEventListener('click', functions.signOut, false);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        update(compile(profileTemplate)({
          user, firstPartEmail, lastPartEmail, student,
        }));
        document.querySelector('.menu-open').addEventListener('click', functions.openMenu, false);
        document.querySelector('.menu-close').addEventListener('click', functions.closeMenu, false);
        document.querySelector('.log-out').addEventListener('click', functions.signOut, false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  // Data to be passed to the template
  // Return the compiled template to the router
};

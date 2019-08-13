import { compile } from 'handlebars';
import update from '../helpers/update';
import { Student, Owner } from '../helpers/classes';
import functions from '../helpers/functions';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
const database = firebase.database();


// Import the template to use
const registerTemplate = require('../templates/register.handlebars');

const signUp = (e) => {
  e.preventDefault();
  const firstName = document.querySelector('.first-name').value;
  const lastName = document.querySelector('.last-name').value;
  const street = document.querySelector('.street').value;
  const number = document.querySelector('.number').value;
  const city = document.querySelector('.city').value;
  const postalCode = document.querySelector('.postal-code').value;
  const email = document.querySelector('.email').value;
  const phoneNumber = document.querySelector('.phone-number').value;
  const password = document.querySelector('.password').value;
  const repeatPassword = document.querySelector('.password-repeat').value;
  const typePerson = document.querySelector('.ownerStudent').value;
  const college = document.querySelector('.college').value;
  const address = `${street} ${number} ${city}`;
  // let coords = {};
  let profile = {};

  if (password === repeatPassword) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        functions.getCoordinatesFromAddress(address)
          .then((coords) => {
            firebase.auth().useDeviceLanguage();
            firebase.auth().currentUser.sendEmailVerification();
            const userId = firebase.auth().currentUser.uid;

            if (typePerson === 'student') {
              profile = new Student(userId, firstName, lastName,
                street, number, postalCode, city, coords.latitude, coords.longitude,
                email, phoneNumber, typePerson, college);
            } else {
              profile = new Owner(userId, firstName, lastName,
                street, number, postalCode, city, coords.latitude, coords.longitude,
                email, phoneNumber, typePerson);
            }

            database.ref(`users/${userId}`).set(profile)
              .then(() => {
                window.location.replace('#/profile');
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log('Wachtwoorden komen niet overeen');
  }
};

export default () => {
  // Data to be passed to the template
  // Return the compiled template to the router
  database.ref('schools').once('value')
    .then(snapshot => snapshot.val())
    .then((schools) => {
      update(compile(registerTemplate)({ schools }));
      const checkElement = document.querySelector('.ownerStudent');
      const hiddenElement = document.querySelector('.college-input');
      document.querySelector('.ownerStudent').addEventListener('change', () => {
        functions.showElement(hiddenElement, checkElement, 'Student');
      }, false);
      document.querySelector('.send').addEventListener('click', signUp, false);
    })
    .catch((error) => {
      console.log(error);
    });
};

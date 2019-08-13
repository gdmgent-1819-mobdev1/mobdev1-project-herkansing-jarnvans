// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import functions from '../helpers/functions'

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
const database = firebase.database();
// Import the template to use
const detailTemplate = require('../templates/detail.handlebars');

const getIdFromUrl = () => {
  const arrayUrl = window.location.href.split('/');
  const roomId = arrayUrl[arrayUrl.length - 1];
  return roomId;
};

const getCurrentRoom = (id) => {
  return new Promise((resolve, reject) => {
    database.ref(`rooms/${id}`).once('value')
      .then(snapshot => snapshot.val())
      .then((room) => {
        resolve(room);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getOwner = (id) => {
  return new Promise((resolve, reject) => {
    database.ref(`users/${id}`).once('value')
      .then(snapshot => snapshot.val())
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default () => {
  // Data to be passed to the template
  const roomId = getIdFromUrl();
  getCurrentRoom(roomId)
    .then((room) => {
      getOwner(room.ownerId)
        .then((user) => {
          const student = functions.getUserType();
          update(compile(detailTemplate)({ room, user, student }));
          document.querySelector('.menu-open').addEventListener('click', functions.openMenu, false);
          document.querySelector('.menu-close').addEventListener('click', functions.closeMenu, false);
          document.querySelector('.log-out').addEventListener('click', functions.signOut, false);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
  // Return the compiled template to the router
};

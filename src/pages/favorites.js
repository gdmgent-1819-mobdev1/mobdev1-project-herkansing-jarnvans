import { compile } from 'handlebars';
import update from '../helpers/update';
import functions from '../helpers/functions';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
const database = firebase.database();

// Import the template to use
const favoritesTemplate = require('../templates/favorites.handlebars');

const getFavorites = (userId) => {
  return new Promise((resolve, reject) => {
    database.ref(`users/${userId}/favorites`).once('value')
      .then(snapshot => snapshot.val())
      .then((favorites) => {
        const favoritesArray = [];
        if (favorites !== undefined) {
          favorites.forEach((favorit) => {
            favoritesArray.push(favorit);
          });
          resolve(favoritesArray);
        }
        resolve(favoritesArray);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default () => {
  const user = localStorage.getItem('currentUserId');
  const student = functions.getUserType();

  getFavorites(user)
    .then((favorites) => {
      functions.getRooms(user, student)
        .then((rooms) => {
          let foundDorms = false;
          const favoritRooms = [];

          if (favorites.length > 0) {
            foundDorms = true;

            favorites.forEach((favorit, index) => {
              for (let i = 0; i < rooms.length; i++) {
                if (favorit === rooms[i].id) {
                  favoritRooms.push(rooms[index]);
                }
              }       
            });
          }
          update(compile(favoritesTemplate)({ student, foundDorms, favoritRooms }));
          document.querySelector('.menu-open').addEventListener('click', functions.openMenu, false);
          document.querySelector('.menu-close').addEventListener('click', functions.closeMenu, false);
          document.querySelector('.log-out').addEventListener('click', functions.signOut, false);
        });
    });
};

import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';
import update from '../helpers/update';
import functions from '../helpers/functions';
import config from '../config';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
const database = firebase.database();

// Import the template to use
const dormsTemplate = require('../templates/rooms.handlebars');

let dormsPassed = 0;

const showSearchOption = (showElement, firstHideElement, secondHideElement) => {
  document.querySelector(showElement).classList.remove('hidden');
  document.querySelector(firstHideElement).classList.add('hidden');
  document.querySelector(secondHideElement).classList.add('hidden');
};

const checkExists = (favorites, roomId) => {
  let exists = false;
  favorites.forEach((favorit) => {
    if (favorit === roomId) {
      exists = true;
    }
  });
  return exists;
};

const getFavorites = (userId) => {
  return new Promise((resolve, reject) => {
    database.ref(`users/${userId}`).once('value')
      .then(snapshot => snapshot.val())
      .then((user) => {
        const favoritesArray = [];
        if (user.favorites !== undefined) {
          user.favorites.forEach((favorit) => {
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

const getRoomAndLike = (dorms, student, foundDorm, user) => {
  getFavorites(user)
    .then((favorites) => {
      const favoritArray = favorites;
      if (foundDorm) {
        let foundDorms = foundDorm;
        let exist = false;
        if (dormsPassed < dorms.length) {
          exist = checkExists(favorites, dorms[dormsPassed].id);
        } else {
          foundDorms = false;
        }
        if (exist) {
          dormsPassed += 1;
          getRoomAndLike(dorms, student, foundDorms, user);
        } else {
          if (foundDorms) {
            const room = dorms[dormsPassed];
            update(compile(dormsTemplate)({ foundDorms, room, student }));
            addClickables(dorms, student, foundDorms, user);
            document.querySelector('.yes__button').addEventListener('click', (e) => {
              e.preventDefault();
              favoritArray.push(room.id);
              database.ref(`users/${user}/favorites`).set(favoritArray);
              dormsPassed += 1;
              getRoomAndLike(dorms, student, foundDorms, user);
              addClickables(dorms, student, foundDorms, user);
            }, false);
            document.querySelector('.no__button').addEventListener('click', (e) => {
              e.preventDefault();
              dormsPassed += 1;
              getRoomAndLike(dorms, student, foundDorms, user);
              addClickables(dorms, student, foundDorms, user);
            }, false);
          } else {
            update(compile(dormsTemplate)({ foundDorms, student }));
            addClickables(dorms, student, foundDorms, user);
            
          } 
        }
      }
    });
};

const addClickables = (dorms, student, foundDorms, user) => {
  document.querySelector('.menu-open').addEventListener('click', functions.openMenu, false);
  document.querySelector('.menu-close').addEventListener('click', functions.closeMenu, false);
  document.querySelector('.log-out').addEventListener('click', functions.signOut, false);
  document.querySelector('.list-link').addEventListener('click', (e) => {
    e.preventDefault();
    showSearchOption('.list', '.map', '.tinder');
    update(compile(dormsTemplate)({
      student, dorms, foundDorms,
    }));
    addClickables(dorms, student, foundDorms, user);
  }, false);
  document.querySelector('.map-link').addEventListener('click', (e) => {
    e.preventDefault();
    showSearchOption('.map', '.list', '.tinder');
    if (config.mapBoxToken) {
      mapboxgl.accessToken = config.mapBoxToken;
      const map = new mapboxgl.Map({
        container: 'map-box',
        center: [3.7174243, 51.0543422],
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 11,
      });

      dorms.forEach((dorm) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([dorm.coords.longitude, dorm.coords.latitude])
          .addTo(map);
      });
    } else {
      console.error('Mapbox will crash the page if no access token is given.');
    }
    addClickables(dorms, student, foundDorms, user);
  }, false);
  document.querySelector('.tinder-link').addEventListener('click', (e) => {
    e.preventDefault();
    showSearchOption('.tinder', '.map', '.list');
    getRoomAndLike(dorms, student, foundDorms, user);
    addClickables(dorms, student, foundDorms, user);
  }, false);
};

export default () => {
  const user = localStorage.getItem('currentUserId');
  const student = functions.getUserType();

  functions.getRooms(user, student)
    .then((dorms) => {
      let foundDorms = false;

      if (dorms.length > 0) {
        foundDorms = true;
      }
      update(compile(dormsTemplate)({ student, dorms, foundDorms }));
      addClickables(dorms, student, foundDorms, user);
    });
};

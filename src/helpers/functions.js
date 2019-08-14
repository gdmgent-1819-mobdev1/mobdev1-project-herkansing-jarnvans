const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
const database = firebase.database();

const convertObjectToArray = object => Object.keys(object).map(i => object[i]);

const showElement = (hiddenElement, checkElement, checkValue) => {
  if (checkElement.value === checkValue) {
    hiddenElement.classList.remove('hidden');
  } else {
    hiddenElement.classList.add('hidden');
  }
};

const getCoordinatesFromAddress = (search) => {
  return new Promise((resolve, reject) => {
    const address = encodeURI(search);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?limit=1&access_token=pk.eyJ1IjoiamFybnZhbnMiLCJhIjoiY2puY2NjOGFoMDV3czNrbnZjNzJicTFvbiJ9.YmULBJZC1OMMVucfXxLliA`;
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        const coordinates = data.features[0].center;
        const addressCoords = { longitude: 0, latitude: 0 };
        addressCoords.longitude = coordinates[0];
        addressCoords.latitude = coordinates[1];
        resolve(addressCoords);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        database.ref(`users/${user.uid}`).once('value')
          .then(snapshot => snapshot.val())
          .then((currentUser) => {
            resolve(currentUser);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  });
};

const openMenu = (e) => {
  e.preventDefault();
  document.querySelector('.nav').classList.remove('hidden');
};

const closeMenu = (e) => {
  e.preventDefault();
  document.querySelector('.nav').classList.add('hidden');
};

const checkNav = (type) => {
  if (type === 'student') {
    return true;
  }
  return false;
};

const getRooms = (id, student) => {
  return new Promise((resolve, reject) => {
    database.ref('rooms').once('value')
      .then(snapshot => snapshot.val())
      .then((rooms) => {
        const roomsArray = convertObjectToArray(rooms);
        const roomsUser = [];
        if (!student) {
          roomsArray.forEach((room) => {
            if (room.ownerId === id) {
              roomsUser.push(room);
            }
          });
          resolve(roomsUser);
        }
        resolve(roomsArray);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const signOut = (e) => {
  e.preventDefault();
  firebase.auth().signOut()
    .then(() => {
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('type');
      window.location.replace('/#');
    })
    .catch((error) => {
      console.log(error);
    });
};

const getUserType = () => {
  const typeUser = localStorage.getItem('type');
  if (typeUser === 'student') {
    return true;
  }
  return false;
};

export default {
  showElement,
  getCoordinatesFromAddress,
  getCurrentUser,
  openMenu,
  closeMenu,
  checkNav,
  getRooms,
  signOut,
  getUserType,
};

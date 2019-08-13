// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import { Room } from '../helpers/classes';
import functions from '../helpers/functions';


const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
const database = firebase.database();
// Import the template to use
const addRoomTemplate = require('../templates/add_room.handlebars');

const addRoom = (e) => {
  e.preventDefault();
  const roomId = database.ref('rooms').push().getKey();
  const userId = localStorage.getItem('currentUserId');
  const roomTypeInput = document.querySelector('.roomType').value;
  const streetInput = document.querySelector('.street').value;
  const numberInput = document.querySelector('.number').value;
  const cityInput = document.querySelector('.city').value;
  const postalCodeInput = document.querySelector('.postal-code').value;
  const rentPriceInput = document.querySelector('.rent-price').value;
  const guaranteeInput = document.querySelector('.guarantee').value;
  const acreageInput = document.querySelector('.acreage').value;
  const levelInput = document.querySelector('.level').value;
  const personsInput = document.querySelector('.persons').value;
  const roomsInput = document.querySelector('.rooms').value;
  const toiletInput = document.querySelector('.toilet').value;
  const showerInput = document.querySelector('.shower').value;
  const bathInput = document.querySelector('.bath').value;
  const kitchenInput = document.querySelector('.kitchen').value;
  const furnitureInput = document.querySelector('.furniture').value;
  const descriptionFurnitureInput = document.querySelector('.description-furniture').value;
  const extraInput = document.querySelector('.extra').value;

  const address = `${streetInput} ${numberInput} ${cityInput}`;

  functions.getCoordinatesFromAddress(address)
    .then((coordinates) => {
      const addressInfo = {
        street: streetInput,
        number: numberInput,
        postalCode: postalCodeInput,
        city: cityInput,
      };

      const price = {
        rent: rentPriceInput,
        guarantee: guaranteeInput,
      };

      const roomInfo = {
        type: roomTypeInput,
        acreage: acreageInput,
        level: levelInput,
        persons: personsInput,
        rooms: roomsInput,
        toilet: toiletInput,
        shower: showerInput,
        bath: bathInput,
        kitchen: kitchenInput,
        furniture: furnitureInput,
        descriptionFurniture: descriptionFurnitureInput,
        extra: extraInput,
      };

      const room = new Room(roomId, addressInfo, coordinates, price, roomInfo, userId);

      database.ref(`rooms/${roomId}`).set(room)
        .then(() => {
          window.location.replace('#/rooms/');
        });
    });
};

export default () => {
  update(compile(addRoomTemplate)({}));
  const checkElement = document.querySelector('.furniture');
  const hiddenElement = document.querySelector('.description-furniture-input');
  document.querySelector('.furniture').addEventListener('change', () => {
    functions.showElement(hiddenElement, checkElement, 'Bemeubeld');
  }, false);
  document.querySelector('.menu-open').addEventListener('click', functions.openMenu, false);
  document.querySelector('.menu-close').addEventListener('click', functions.closeMenu, false);
  document.querySelector('.log-out').addEventListener('click', functions.signOut, false);
  document.querySelector('.send').addEventListener('click', addRoom, false);
};

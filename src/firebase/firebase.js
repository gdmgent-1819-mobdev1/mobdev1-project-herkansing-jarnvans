const firebaseInstance = require('firebase');

// Initialize Firebase
// TODO: Replace with your project's config
const config = {
  apiKey: 'AIzaSyBpoGZx4JB1UDNZHKrBvrjKWnevMAf-Ncs',
  authDomain: 'kent-8f7cd.firebaseapp.com',
  databaseURL: 'https://kent-8f7cd.firebaseio.com',
  projectId: 'kent-8f7cd',
  storageBucket: 'kent-8f7cd.appspot.com',
  messagingSenderId: '285677897051',
};

let instance = null;

const initFirebase = () => {
  instance = firebaseInstance.initializeApp(config);
};

const getInstance = () => {
  if (!instance) {
    initFirebase();
  }
  return instance;
};
export {
  initFirebase,
  getInstance,
};

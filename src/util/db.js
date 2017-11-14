import firebase from "firebase";
const config = {
  apiKey: "AIzaSyDPgIxGjdECK8caIJ5ZLK1sUVtpO7oWaZU",
  authDomain: "tride-431c6.firebaseapp.com",
  databaseURL: "https://tride-431c6.firebaseio.com",
  projectId: "tride-431c6",
  storageBucket: "tride-431c6.appspot.com",
  messagingSenderId: "1059664702731"
};

firebase.initializeApp(config);

export default firebase.database();

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

let firebaseConfig = {
  apiKey: "AIzaSyB1xNLp2OIlhqw2V1Sn07ZhWeTDEIbVq6Y",
  authDomain: "app-financas-ada09.firebaseapp.com",
  projectId: "app-financas-ada09",
  storageBucket: "app-financas-ada09.appspot.com",
  messagingSenderId: "946760256147",
  appId: "1:946760256147:web:dc93b6d048e515cbb35b66",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

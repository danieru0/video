import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

firebase.initializeApp({
    apiKey: "AIzaSyDaoj69ABC8KKt95r2vaoR2VatPeWaqFuQ",
    authDomain: "video-2bce9.firebaseapp.com",
    databaseURL: "https://video-2bce9.firebaseio.com",
    projectId: "video-2bce9",
    storageBucket: "video-2bce9.appspot.com",
    messagingSenderId: "680388611256"
});

export default firebase;
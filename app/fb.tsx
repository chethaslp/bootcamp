import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyB6xF2hngXeRHyean4VFvtgwWQfLpTJ-vw",
  authDomain: "bootcamp-clp.firebaseapp.com",
  projectId: "bootcamp-clp",
  storageBucket: "bootcamp-clp.appspot.com",
  messagingSenderId: "18731169781",
  appId: "1:18731169781:web:047d75c257c41505fc52bc"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

function getUser(){
    const user = auth.currentUser;
    if (user !== null) {
        return user
    //   const displayName = user.displayName;
    //   const email = user.email;
    //   const photoURL = user.photoURL;
    //   const emailVerified = user.emailVerified;
    //   const uid = user.uid;
    }
    return null;
}

function signin(){
    signInWithPopup(auth, new GoogleAuthProvider())
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user)
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
  });
}

function signout(){
    signOut(auth).then(() => {

    }).catch((error) => {

    });
}

export {signin,signout,getUser};
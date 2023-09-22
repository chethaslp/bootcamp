import app from "./config";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const auth = getAuth(app);

function getUser(){
    const user = auth.currentUser;
    console.log(user)
    if (user !== null) {
        return user
    }
    return null;
}

function signin(){
    signInWithPopup(auth, new GoogleAuthProvider())
  .then((result) => {
    
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

export {auth, signin, signout, getUser}
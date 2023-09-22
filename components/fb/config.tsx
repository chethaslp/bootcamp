import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyB6xF2hngXeRHyean4VFvtgwWQfLpTJ-vw",
  authDomain: "bootcamp-clp.firebaseapp.com",
  projectId: "bootcamp-clp",
  storageBucket: "bootcamp-clp.appspot.com",
  messagingSenderId: "18731169781",
  appId: "1:18731169781:web:047d75c257c41505fc52bc"
};

const app = initializeApp(firebaseConfig);

export default app;
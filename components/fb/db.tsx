import { getUser } from "./auth";
import app from "./config";
import { child, get, getDatabase, ref, set } from 'firebase/database'

const db = ref(getDatabase(app));
const user = getUser();

export function getUserRooms(){
    get(child(db, `users/${user?.uid}/rooms`)).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot
        } else {
            console.log("No rooms")
          return null;
        }
      }).catch((error) => {
        console.error(error);
      });
}

export function createUserRoom(d,cb){
    const key = (Math.random() + 1).toString(36).substring(7)
    console.log(d)
    set(child(db, `rooms/${key}`),d).then(()=>{
      cb()
    });
    

}
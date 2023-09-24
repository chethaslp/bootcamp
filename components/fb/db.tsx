"use client"
import { useAuthContext } from "@/context/AuthContext";
import { getUser } from "./auth";
import app from "./config";
import { child, get, getDatabase, ref, set, equalTo, query, orderByChild} from 'firebase/database'
import { User } from "firebase/auth";

const db = ref(getDatabase(app));

export function getUserRooms(user,cb){
    
    get(query(child(db,'rooms'), ...[orderByChild("user"),equalTo(user.uid)])).then((snapshot) => {
        if (snapshot.exists()) {
            let rfr: any[] = []
            snapshot.forEach((c)=>{
                rfr.push({...c.val(), ...{'key': c.key}})
            })
            cb(rfr)
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
    d.key=key;
    set(child(db, `rooms/${key}`),d).then(()=>{
      cb()
    });
}

export async function createUser(u:User,un:string){
  await set(child(db,`users/${u.uid}`),{
    dname: un,
    name: u.displayName,
    email: u.email
  })
}
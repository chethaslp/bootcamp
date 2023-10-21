"use client"
import app from "./config";
import {ref as sRef, uploadBytes, getStorage, getDownloadURL} from 'firebase/storage'
import { child, get, getDatabase, ref, set, equalTo, query, orderByChild} from 'firebase/database'
import { User } from "firebase/auth";

const db = ref(getDatabase(app));
const st = getStorage(app)

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
            cb(null)
        }
      }).catch((error) => {
        console.error(error);
      });
}

export function createUserRoom(d,roomImg?:File,cb){
    const key = (Math.random() + 1).toString(36).substring(7)
    d.key=key;

    if(!roomImg){
        set(child(db, `rooms/${key}`),d).then(()=>{
          cb()
        });
    }else{
      uploadBytes( sRef(st, 'rooms/'+key+'.png') , roomImg).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((imgURL) => { 
          d.img=imgURL;
          set(child(db, `rooms/${key}`),d).then(()=>{
            cb()
          });
        });
      });
    }
}

export async function createUser(u:User,un:string){
  await set(child(db,`users/${u.uid}`),{
    dname: un,
    name: u.displayName,
    email: u.email
  })
}

export {db}
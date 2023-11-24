
import app from "./config";
import { User, Room, userConv, roomConv } from "@/components/models"
import { ref as sRef, uploadBytes, getStorage, getDownloadURL } from 'firebase/storage'
import { doc, getDoc, collection, setDoc, getDocs, query, where, getFirestore} from "firebase/firestore"; 

const db = getFirestore(app);
const st = getStorage(app)

const userRef = collection(db, "users");
const roomRef = collection(db, "rooms");

export async function getUserRooms(user,cb){

  const querySnapshot = await getDocs(query(roomRef, where("host", "array-contains", user.uid)).withConverter(roomConv));
  let rfr = []

  querySnapshot.forEach((ss) => {
      rfr.push(ss.data())
  })

  cb((rfr.length==0)?null:rfr)
}

export async function createUserRoom(d,roomImg,cb){
    const key = (Math.random() + 1).toString(36).substring(7)

    if(!roomImg){
        setDoc(doc(roomRef, key).withConverter(roomConv), new Room(key, d.name, d.desc, d.shost, d.host)).then(()=>cb())
    }else{
      uploadBytes( sRef(st, 'rooms/'+key+'.png') , roomImg).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((imgURL) => { 
          setDoc(doc(roomRef, key).withConverter(roomConv), new Room(key, d.name, d.desc, d.shost, d.host, imgURL)).then(()=>cb())
          });
        });
    }
}

export async function createUser(u,un){

  return await setDoc(doc(userRef, u.uid).withConverter(userConv), 
  new User(
    u.uid, u.displayName, u.email, un
  ))
}

export {db}

/*
    Constructor Data class for `Room`
*/
class Room {
    constructor (key, name, desc, shost, host, img="") {
        this.key = key;
        this.name = name;
        this.desc = desc;
        this.img = img
        
        this.shost = shost
        this.host = host
    }
    toString() {
        return this.name
    }

    isHost(a){
        return this.host.includes(a)
    }
}

// Firestore data converter for Room Class
const roomConv = {
    toFirestore: (room) => {
        return {
            key: room.key,
            name: room.name,
            desc: room.desc,
            img: room.img,
            shost: room.shost,
            host: room.host
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Room(data.key, data.name, data.desc, data.shost, data.host, data.img);
    }
};

/*
    Constructor Data class for `User`
*/
class User {
    constructor (uid, name, email, dname) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.dname = dname;
    }
    toString() {
        return this.uid
    }
}

// Firestore data converter for User Class
const userConv = {
    toFirestore: (user) => {
        return {
            uid: user.uid,
            name: user.name,
            email: user.email,
            dname: user.dname
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.uid, data.name, data.email, data.dname)
    }
};


export {Room, roomConv, User, userConv}
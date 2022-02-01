const db = require("../config/Connection")
const collection = require("../config/Collection")
// const ObjectId = require("mongodb").ObjectID
const { ObjectId } = require("mongodb")


module.exports = {
    doAdminLogin: (data) => {
        console.log("s10")
        console.log(data.email)

        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get()
                .collection(collection.ADMIN_COLLECTION)
                .findOne({ email: data.email });
            console.log("user : ",user)
            if (user) {
                console.log("pasword",data.password, user.password)
                if (data.password == user.password) {
                    response.status = true;
                    response.admin = user;
                    console.log("succes1")
                    resolve(response)
                } else {
                    console.log("succes2")
                    response.status = false
                    resolve(response)
                }
            } else {
                console.log("succes3")
                response.noUser = true
                response.status = false
                resolve(response)
            }
        })
    },

    getUsers: () => {
        return new Promise(async (resolve, reject) => {
            let alluser = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(alluser)
        })
    },

    deleteUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: ObjectId(userId) })
            resolve()
        })
    },
    addUser: (userName, email, password) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.USER_COLLECTION)
                .insertOne({
                    userName,
                    email,
                    password
                }).then((res) => {
                    console.log("add user succes")
                    resolve(res)
                })
                .catch((err) => {
                    console.log(err, "adduser Failed")
                })
        })
    },

    updateUser: (data) => {
        const newemail = data.email
        const newuserName = data.userName
        console.log(newemail)
        console.log(newuserName)
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION)
                .updateOne(
                    { _id: ObjectId(data.id) },
                    {
                        $set:{
                                email:newemail ,
                                userName: newuserName
                        }
                    })
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    resolve(err)
                })
        })
    },

    //search user 
    findUser:(uName)=>{
        console.log(uName)
        console.log("search user step1")
        return new Promise(async(resolve,reject)=>{
            console.log("search user step2 ")
          let user =await  db.get().collection(collection.USER_COLLECTION)
              .find({userName:{$regex:uName,$options: 'i'}}).toArray()
              console.log("output from the search : ",user)
              resolve(user)
        })
    }

}
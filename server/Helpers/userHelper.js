const db = require("../config/Connection")
const collection = require("../config/Collection")
const objectId = require("mongodb").ObjectID;
const bcrypt = require("bcryptjs")

module.exports = {
    doSignup: (userName, email, password) => {
        return new Promise(async(resolve, reject) => {
            let checkEmail = await db.get().collection(collection.USER_COLLECTION).findOne({email:email})
            if(!checkEmail){
                db.get().collection(collection.USER_COLLECTION)
                    .insertOne({
                        userName,
                        email,
                        password
                    })
                    .then((res) => {
                        resolve(res)
                        console.log("dosignup success : ", res)
                    })
                    .catch((err) => console.log("dosignup err : ", err))
            }else{
                let response ={}
                response.emailPresent=true
                resolve(response)
            }
        })
    },

    doLogin: (Email, password) => {
        console.log("login doLogin")
        return new Promise( async(resolve, reject) => {
            let response = {};
            let user = await 
            db.get()
                .collection(collection.USER_COLLECTION)
                .findOne({ email:Email })

            if (user) {
                let status = await bcrypt.compare(password, user.password)
                console.log(password,user.password)
                if (status) {
                    response.status = true;
                    response.user = user
                    resolve(response)
                    console.log("user present login success")
                } else {
                    response.status = false;
                    response.noUser = true;
                    console.log("user found password wrong")
                    resolve(response);
                }
            } else {
                console.log("user not found")
                response.status = false;
                response.noUser = true;
                resolve(response);
            }
        })
    }
}
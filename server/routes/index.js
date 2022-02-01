var router = require('express').Router();;
const bcrypt = require("bcryptjs")
const userHelper = require("../Helpers/userHelper")
const adminHelpers = require("../Helpers/adminHelpers")
const jwt = require("jsonwebtoken")
const { json, response } = require("express")

router.post("/signup", async (req, res) => {

  try {
    console.log("request come to post/signup ")
    console.log(req.body)
    const { userName, email, password } = req.body;
    // validation
    if (!userName || !password || !email) {
      console.log("some input is null")
      res.status(400).json({ errorMessage: "please enter required field" })
    }
    if (password.length < 5) {
      console.log("password is null")
      res.status(400).json({ errorMessage: "please enter atleast 6 character" })
    }

    const passwordHash = await bcrypt.hash(password, 10)
      .catch((err) => {
        console.log("bcrypting error", err)
      })
    // Do signup
    userHelper
      .doSignup(userName, email, passwordHash)
      .then((respons) => {
        console.log("dosignup success resolve result")
       respons.emailPresent?res.status(400).json({message:"email is used"})
       : res.status(200).json({ message: "Registered" })
      })
      .catch((err) => {
        console.log(err)
        console.log(err.code)
        if (err.code === 11000) {
          res.status(400).json({ errorMessage: "This email is already exist" });
        }
      })
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
})

router.post("/login", async (req, res) => {
  console.log("login post request")
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("emptyfield")
      res.status(400).json({ errorMessage: "please enter required field" })
    }
    userHelper.doLogin(email, password).then((response) => {
      if (response.status) {
        console.log("inside response.status=true")
        // req.session.userLoggedIn = true;
        // req.session.user = response.user;
        let userId = response.user._id.toString();
        const token = jwt.sign(
          {
            user: userId
          },
          'jwt_secretKey123'
        );
        console.log(response)
        console.log(userId)
        console.log("the token is : ", token)
        //Send token to cookie
        let obj = {
          id: response.user._id.toString(),
          userName: response.user.userName,
          email: response.user.email,
        };
        console.log("obj", obj);
        res
          .cookie("token", token, {
            httpOnly: true,
          })
          .json(obj);
      } else {
        console.log("inavlide username or password")
        res.status(401).json({ errorMessage: "Invalid email or password" })

      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
})

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});


// admin login 
router.post("/admin/login", async (req, res) => {
console.log("s1")
  try {
    console.log(req.body)
    const {email, password} = req.body;
    if (!email || !password) {
      console.log("err s2")
      res.status(400).json({ errorMessage: "please enter all fields" })
    }
    adminHelpers.doAdminLogin(req.body).then((response) => {
      console.log("login passed")
      console.log(response)
      if (response.status) {
        console.log(response.status)
        let adminId = response.admin._id.toString();
        const token = jwt.sign(
          {
            admin: adminId
          },
          'jwt_secretKey123'
        );
        let obj = {
          id: response.admin._id.toString(),
          name: response.admin.userName,
          email: response.admin.email
        };
        console.log(obj)
        console.log(token)
        res.cookie("token", token, {
          httpOnly: true,
        }).json(obj);
        
      } else {
        res.status(401).json({ errorMessage: "invalid username or password" })
      }
    })
  } catch (error) {
    console.log("adminlogin fianl error",error)
    res.status(500).send();
  }
})

// get all user
router.get("/admin/getAllUser", (req, res) => {
  adminHelpers.getUsers()
    .then((response) => {
      res.status(200).json({ response })
    })
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
})

// delete user
router.post("/admin/deleteUser/:id", (req, res) => {
  console.log("delete function called")
  let id = req.params.id
  adminHelpers.deleteUser(id)
    .then(response => {
      console.log("user deleteed")
      res.status(200).json({ response })
    })
    .catch(err => {
      console.log("usernot deleted")
      console.log(err)
      res.status(500).send()
    })
})

// add user by admin
router.post("/admin/addUser", async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    console.log("somedata is missing")
    res.status(401).json({ errorMessage: "Invalid email or password" });
  } else if (password.length < 5) {
    res.status(401).json({ errorMessage: "minimum 5 charater pass word needed" });
  } else {
    const passwordHash = await bcrypt.hash(password, 10)
      .catch(err => {
        console.log("bcrypterr", err)
      })
    //add user
    adminHelpers.addUser(userName, email, passwordHash)
      .then((response) => {
        console.log("add user worked")
        res.status(200).json({ response })
      })
      .catch(err => {
        console.log(err)
        console.log(err.code)
        if (err.code === 11000) {
          res.status(400).json({ errorMessage: "This email is already exist" });
        }
      })
  }
})

//update user data
router.post("/admin/updateUser",(req,res)=>{
  console.log(req.body)
  adminHelpers.updateUser(req.body)
    .then((response)=>{
      console.log("kk")
      res.status(200).json({response})
    })
    .then((err)=>{
      res.status(401).send()
    })
})

// search user 
router.get("/admin/findUser/:data",(req,res)=>{
  let data =req.params.data
console.log(data)
  console.log("searchuser",req.body)
  adminHelpers.findUser(data)
    .then((response)=>{
      console.log("1")
      res.status(200).json({response})
     }) 
    .catch((err)=>{
      console.log("2")
      res.status(401).send()
    })
})
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;





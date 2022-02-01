// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;


var router = require("express").Router();
const bcrypt = require("bcryptjs")
const userHelpers = require("../Helpers/adminHelpers")
const jwt = require("jsonwebtoken")

router.post("/login",(req,res)=>{
  console.log("in admin login")
  console.log(req.body);
})
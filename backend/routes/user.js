const express = require("express");

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');
const router = express.Router();

router.post('/signup',(req,res,next) => {
  bcrypt.hash(req.body.password, 10, )
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
        userType: req.body.userType
      });

    //save user in the db
    user.save()
      .then(result => {
        res.status(201).json({
          message: 'User Created',
          result: result
        });
      })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
  });

});

//create a user and if successloign let him to login
router.post('/login',(req,res,next) => {
  let fetchedUser;

  //if success login, then generate a token
  User.findOne({email: req.body.email})
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password,user.password)
  })
  .then(result => {
    // check weather the result is true or not
    if(!result){
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    // now we have a valid pw and create web token
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
      'secret_this_should_be_longer',
     {expiresIn: '1h'}
    );
    res.status(200).json({
      token: token,
      userPost: fetchedUser.userPost,
      userType: fetchedUser.userType,
      userId: fetchedUser._id
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: "Auth failed"
    });
  });
});

module.exports = router;

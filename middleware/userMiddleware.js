const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const isAuthorized = (req,res,next) => {
    const jwtToken = req.cookies.jwt;
    
    // check if token exists and is not altered
    if(jwtToken){
        jwt.verify(jwtToken, 'secret-key-for-jwt',async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/users/login');
            }
            else{
                let user = await User.findById(decodedToken.id);
                req.user = user;
                // console.log(user);
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.redirect('/users/login'); // redirect them as they dont have jwt.
    }
}

// check if user exists or not

const checkUserExists = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, 'secret-key-for-jwt', async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };

module.exports = {isAuthorized, checkUserExists};
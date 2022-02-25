const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

// function to handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);

    let errorToShow = {userId: '', email: '', password: '',confirmPassword: ''};

    //error for signup: password doesnt match
    if(err.message === 'password doesnt match'){
        errorToShow.confirmPassword = "Both passwords doesnt match. Try again"
    }

    // errors for login : incorrect email
    if(err.message === 'Email not registered'){
        errorToShow.email = "Email not registered. Try again."
    }

    // errors for login : incorrect password
    if(err.message === 'You have entered wrong password'){
        errorToShow.password = "You have entered wrong password"
    }

    //validation error for unique fields
    if(err.code === 11000){
        errorToShow.userId = "ID already exists. Try with some another ID."
        errorToShow.email = "Email already exists. Try with some another Email."
        return errorToShow;
    }

    //validation errors for userid, email and password
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            //console.log(properties);
            errorToShow[properties.path] = properties.message;
        })
    }
     return errorToShow;
}

// function to generate JWT

const expireAge = 2*24*60*60;
const generateToken = (id) => {
    return jwt.sign({ id }, 'secret-key-for-jwt', {
        expiresIn: expireAge
    });
}

module.exports.signupGet = (req, res) => {
    res.render('signup');
}
  
module.exports.loginGet = (req, res) => {
    res.render('login');
}

module.exports.signupPost = async (req,res) => {

    const {userId,email,fullName,password,confirmPassword} = req.body;

    try{
        User.checkPasswords(password,confirmPassword);
        const user = await User.create({userId,email,fullName,password,confirmPassword});
        
        const jwtToken = generateToken(user._id);
        res.cookie('jwt', jwtToken, {httpOnly: true, maxAge: expireAge*1000});
        // res.status(201).json(user)
        res.status(201).json({user: user._id});

    }
    catch(err){
        const errors = handleErrors(err);
        //console.log(err);
        res.status(400).json({ errors })

    }

    
}

module.exports.loginPost = async (req,res) => {

    const {email,password} = req.body;
    try{
        const user = await User.logIn(email, password);
        const jwtToken = generateToken(user._id);
        res.cookie('jwt', jwtToken, {httpOnly: true, maxAge: expireAge*1000});
        res.status(200).json({user: user._id});
        //console.log(user);
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logoutGet = (req,res) => {
    res.cookie('jwt','', {maxAge: 1})
    res.redirect('/');
}

module.exports.findById = async (req,res) => {
    
    
    try {
        const user = await User.find({userId: req.params.userId });
        res.send(user);
    } 
    catch (err){
        res.status(500).send(err);
    }
}

module.exports.listUsers = (req,res) => {
    User.find({},(err,docs) => {
        if(!err){
            res.render('list', { user: req.user, users: docs } );
        }
        else{
            res.status(500).send(err);
        }
    })
}


module.exports.updateUser = async (req,res) => {
    try{
         
         //const updateUser = await User.findByIdAndUpdate({id: req.params.userId}, req.body, {new : true })
         const updateUser = await User.findOneAndUpdate({ id: req.params.userId }, req.body, { new: true });
         console.log(updateUser);
         res.send(updateUser);

    }
    catch(err){
        res.status(500).send(err);
    }
}


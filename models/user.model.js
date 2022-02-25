const mongoose = require('mongoose');
const { isEmail } = require('validator');

const bcrypt = require('bcrypt');


var userSchema = new mongoose.Schema({


    userId : {
        type: String,
        required: [true, 'Please enter userId'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter valid email']
    },
    fullName: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please enter password']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please enter the password again.']
    },
    savedQuestions: {
        //type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}],
        default: []
    }
});

// functions to fire before and after insertion of data

userSchema.post('save', function(doc,next) {
    console.log('Record inserted');
    next();
});


// hashing password
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
   // this.confirmPassword = undefined;
    next();
});


userSchema.statics.checkPasswords=function(password,confirmPassword){
    if(password === confirmPassword){
        
        return;
    }
    else{
        throw Error('password doesnt match');
    }
    

       
}






//static method for logging in 
userSchema.statics.logIn = async function(email,password){
    const findUser = await this.findOne({ email });

    if(findUser){
        //// isPasswordCorrect? 
       const comparePassword = await bcrypt.compare(password, findUser.password);
       if(comparePassword){
           return findUser;
       }
       throw Error('You have entered wrong password');
    }
    throw Error('Email not registered');
}




mongoose.model('User', userSchema);

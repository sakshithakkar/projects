const res = require('express/lib/response');
const mongoose = require('mongoose');
const { listUsers } = require('../controllers/userController');
// Schema = mongoose.Schema;
//const User = mongoose.model('User');

var questionSchema = new mongoose.Schema({
    questionId : {
        type: String,
        required: [true, 'Please enter question id'],
        unique: true
    },
    questionBody: {
        type: String,
        required: [true, 'Please enter the question'],
        minlength: 1
    },
    category: {
        type: Array,
        required: [true, 'Please enter the category']
    },
    replies: [
        
        {
            replyId: { type: String, unique: true},
            replyBody: String,                       // -	replyId: a unique id for the reply
             repliedBy: String,
             repliedOn: Date                       // -	replyBody: the body of the reply
                                    // -	repliedBy: userId of the user who replied to the question
                                    // -	repliedOn: Datetime string when the reply was made
 
        }
    ],
    
    replyMeta: {
        
         votes: {
            type: Number,
            default: 0
        },
        createdOn: {
            type: String,
            required: true,
            default: new  Date().toISOString()
        },
        createdBy: {
            type: String,
        },
        
        updatedOn: {
            type: String,
            required: true,//Datetime string of when the question was last replied/voted
            default: new Date().toISOString()
        },
        // updatedBy: {
        //     type: String,
        //     required: true //userId of the user who last replied/voted to the question
        // }
    }

})

mongoose.model('Question',questionSchema);
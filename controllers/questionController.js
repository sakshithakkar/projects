const mongoose = require('mongoose');
const { checkUserExists } = require('../middleware/userMiddleware');
const Question = mongoose.model('Question');
const User = mongoose.model('User');

module.exports.questionsGet = (req,res) => {
    res.render('question');
}

module.exports.questionPost = async (req,res) => {


    try{

        const question = new Question( {
            questionId : req.body.questionId,
            questionBody : req.body.questionBody,
            category : req.body.category,
            createdBy :  req.user.userId
        })
        await question.save();
        console.log(question.questionId);
       
       saveQuestion2(req.user,question.questionId);
        res.status(201).redirect('/questions_list');
        
        Question.create(question, function(err,doc){
            if(err){
                console.log(err);
            }
            else{
                res.redirect('/');
            }
        })
    }
    catch(err){
        console.log(err);
    }

}

module.exports.questionListGet = (req,res) => {
    Question.find({}, (err,docs) => {
        if(!err){
            res.render('questions_list', {question: req.question, questions : docs});
        }
        else{
            res.status(500).send(err);
        }
    })
}

module.exports.findByCategory = async (req,res) => {
    try{
        const question = await Question.find({category: req.params.category});
        res.send(question);
    }
    catch(err){
        res.status(500).send(err);
    }

}

// Check after getting createdBy value in the DB.
module.exports.findByCreatedBy = async (req,res) => {
    try{
        const question = await Question.find({createdBy: req.params.createdBy});
        res.send(question);
    }
    catch(err){
        res.status(500).send(err);
    }
}

module.exports.findByIdAndDelete = (req,res) => {
    Question.findOneAndRemove(req.params.questionId, (err,doc) => {
        if(!err){
            res.end('Deleted');
        }
        else{
            console.log(err);
        }
    })
} 

const saveQuestion = (req,res) => {
    var questionId = req.body.questionId;
    Question.save().
        then((result) => {
            User.findOne({ userId }, (err, user) => {
                if(user){
                    user.savedQuestions.push(questionId);
                    user.save();
                    res.end('Question saved')
                }
            })
        })
        .catch((error) => {
            res.status(500).send(err);
        })
}

const saveQuestion2 = (user,questionId) => {
    User.findOneAndUpdate(
        {userId: user.userId},
        { $push: {savedQuestions: questionId}},
        function(error, success){
            if(error){
                console.log(error)
            }
            else{
                console.log(success)
            }
        }
    );
}



module.exports.findByQuestionId = async (req,res) => {
    try{
        const question = await Question.find({questionId: req.params.questionId});
        res.send(question);
        
        
    }
    catch(err){
        res.status(500).send(err);
    }
}

module.exports.getReply = async (req,res) => {
    res.render('replies');
}

module.exports.postReply = async (req,res) => {

    try{

    const replyUpdate = {
        replies: {
            replyId: req.body.replyId,
            replyBody: req.body.replyBody,
            repliedBy: req.user.userId,
            repliedOn: Date.now()
        }
    }
    

    Question.findOneAndUpdate(
        
            {questionId: req.params.questionId}, replyUpdate, {upsert: true, new: true}, (err, doc) => {
                if (err){
                    console.log(err)
                }
                else{
                    // res.send(doc);
                    console.log(doc)
                }
    }) 

    res.redirect('/');
    }
    
    catch(err){
        console.log(err);
    }

}

module.exports.upVote =  (req,res) => {
    try{
        Question.findOneAndUpdate( {questionId: req.params.questionId}, {$inc: {replyMeta: {votes: 1}}}, {upsert: true}, (err,doc) => {
            if(err){
                console.log(err)
            }
            else{
                console.log(doc)
            }
        })
        res.redirect('/questions_list');
    }
    catch(err){
        console.log(err);
    }
}


const { Router } = require('express');
const questionController = require('../controllers/questionController');
const { isAuthorized, checkUserExists } = require('../middleware/userMiddleware');

const router = Router();

router.get('/questions', isAuthorized, questionController.questionsGet );

router.post('/questions',isAuthorized, questionController.questionPost );

router.get('/questions_list', isAuthorized, questionController.questionListGet);

router.get('/questions_list/:category', isAuthorized, questionController.findByCategory);

router.get('/questions_list/:createdBy',isAuthorized, questionController.findByCreatedBy);

router.get('/questions/:questionId', isAuthorized, questionController.findByQuestionId);

router.get('/questions/:questionId/replies', isAuthorized, questionController.getReply);

router.post('/questions/:questionId/replies', isAuthorized, questionController.postReply);

router.delete('/questions_list/:questionId', questionController.findByIdAndDelete);

router.get('/questions/:questionId/upvote', questionController.upVote);

module.exports = router;
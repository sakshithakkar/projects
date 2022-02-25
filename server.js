require('./models/db');
const express = require('express');
const bodyparser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const {isAuthorized, checkUserExists} = require('./middleware/userMiddleware');


const app = express();
app.use(express.static('public'));

app.use(morgan('tiny'));

app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

// views
app.set('view engine','ejs');


//routes

app.get('*', checkUserExists);
// app.post('*', checkUserExists);
app.get('/', (req,res) => res.render('home'))

app.listen(3000, () => console.log('Server running on port 3000'))

app.use(userRoutes);

app.use(questionRoutes);




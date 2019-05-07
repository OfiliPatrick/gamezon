const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');
const secret = require('./config/secret');
const Category = require('./models/category')
const User = require('./models/user');
const knex = require('knex');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');



const app = express(); 



// Connect to our Database and handle an bad connections
mongoose.connect('mongodb://localhost:27017/GameData');
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});


// Middleware
app.use(express.static(__dirname +'/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(session({
  resave:true,
  saveUnitialized: true,
  secret: secret.secretKey,
  // store: new MongoStore({url: secret.database, autoReconnect: true })
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use( function (req,res,next){
  res.locals.user = req.user;
  next();
});

app.use(function(req,res,next){
  Category.find({}, function(err, categories) {
    if(err) return next(err);
    res.locals.categories = categories;
    next();
  });
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

// Routes
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api',apiRoutes);

app.listen(secret.port, () => {
    console.log('app is running on port ' + secret.port)
});
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://lioncrazed:wrpnst1!@cluster0-ef34a.mongodb.net/shop?retryWrites=true&w=majority'

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const csrfProtection = csrf();

// multer definition setting for destination and filename
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

// multer definition for only allowing certain mimetypes
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// express template settings
app.set('view engine', 'ejs');
app.set('views', 'views');

// enable bodyParsr to be able to parse request body
app.use(bodyParser.urlencoded({extended: false}));

// enable multer to be able to upload files and images
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

// enable serving of statics files from the public folder for views and the images folder for image files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// enable sessions
app.use(session({ 
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

// enable csrf token protection and to flash store messages in response 
app.use(csrfProtection);
app.use(flash());

// add session login status and csrf token to response
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// add current user to request
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  })
  .catch(err => {
    next(new Error(err));
  });
});

// enable routes with actual routes in corresponding router files
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// handle general-error route and render page
app.get('/error/general-error', errorController.getGeneralError);

// render not-found page if not path not caught in any other route 
app.use(errorController.getNotFound);

// prevent infinite loop by rendering general-error page here
app.use((error, req, res, next) => {
  res.status(500).render('general-error', {
    pageTitle: 'General Error',
    path: '/error/general-error'
  });
});

// connect to mongoDB database via mongoose and start node server
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

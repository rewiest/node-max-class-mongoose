const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false }));

app.use((req, res, next) => {
  User.findById('5d1b6b28be1a530731249d57')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getNotFound);

mongoose.connect(
  'mongodb+srv://lioncrazed:wrpnst1!@cluster0-ef34a.mongodb.net/shop?retryWrites=true&w=majority', 
  { useNewUrlParser: true }
)
  .then(result => {
    User.findOne()
      .then(user => {
        if (!user) {
          const user = new User({
            name: 'Ralph',
            email: 'rewiest@us.ibm.com',
            cart: {
              items: []
            }
          });
          user.save();
        }
      })
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

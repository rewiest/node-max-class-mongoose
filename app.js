const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('5d1a733fa29b7af2b3cfff51')
//     .then(user => {
//       req.user = new User(
//         user.name,
//         user.email,
//         user.cart,
//         user._id
//       );
//       next();
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getNotFound);

mongoose.connect(
  'mongodb+srv://lioncrazed:wrpnst1!@cluster0-ef34a.mongodb.net/shop?retryWrites=true&w=majority', 
  { useNewUrlParser: true }
)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

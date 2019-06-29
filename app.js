const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
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

app.use(errorController.getNotFound);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    // create dummy user
    User.findByPk(1)
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Ralph', email: 'rewiest@us.ibm.com' });
    }
    return Promise.resolve(user);
    // note that adding 'Promise.resolve()' is optional here because
    // when you return a value in a .then() block it is automatically wrapped into a Promise
  })
  .then(user => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

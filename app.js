
const DB_PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;
const MONGODB_URI = `mongodb+srv://omarhashy:${DB_PASSWORD}@cluster0.qzjhm.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`;



const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const User = require("./models/user");


const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected");
    return User.findOne();
  })
  .then((user) => {
    if (!user) {
      const user = new User({
        name: "Max",
        email: "max@test.com",
        cart: {
          items: [],
        },
      });
      return user.save();
    }
    return user;
  })
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });

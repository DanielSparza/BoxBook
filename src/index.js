const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const { use } = require("passport");
const MySQLStore = require("express-mysql-session");
const passport = require("passport");
const { database } = require("./keys.js");

//Initializations
const app = express();
require("./lib/passport.js");

//Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars.js") 
}));
app.set("view engine", ".hbs");

//Middlewares
app.use(session ({ //Se guardara la sesion en mysql
    secret: "sesion_a_guardar",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash("success");
    app.locals.message = req.flash("message");
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require("./routes"));
app.use(require("./routes/authentication"));
app.use("/books",require("./routes/books"));

//Public
app.use(express.static(path.join(__dirname, "public")));

//Starting the server
app.listen(app.get("port"), () => {
    console.log("Server on port ", app.get("port"));
});
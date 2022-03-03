const express = require("express");
const router = express.Router();
const passport = require("passport");
const pool = require("../database");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");

router.get("/signup", isNotLoggedIn, (req, res) => {
    res.render("auth/signup.hbs");
});

router.post("/signup", isNotLoggedIn, passport.authenticate("local.signup", {
        successRedirect: "/profile",
        failureRedirect: "/signup",
        failureFlash: true
}));

router.get("/signin", isNotLoggedIn, (req, res) => {
    res.render("auth/signin");
});

router.post("/signin", isNotLoggedIn, (req, res, next) => {
    passport.authenticate("local.signin", {
        successRedirect: "/profile",
        failureRedirect: "/signin",
        failureFlash: true
    })(req, res, next);
});

router.get("/profile", isLoggedIn, async (req, res) => {
    const user = {
        user_id: req.user.id_usuario
    };
    const mybooks = await pool.query("SELECT COUNT(fk_isbn) AS number FROM readings WHERE fk_usuario = ?", [user.user_id]);
    const reads = await pool.query("SELECT COUNT(fk_isbn) AS finished FROM readings WHERE avance = 100 and fk_usuario = ?", [user.user_id]);
    res.render("profile", { mybook: mybooks[0], read: reads[0] });
});

router.get("/logout", isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect("/signin");
});

module.exports = router;
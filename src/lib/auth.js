module.exports = { //metodo para verificar si el usuario esta logeado para mostrar las vistas de perfil y links
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            return res.redirect("/signin");
        }
    },

    //metodo para ocultar las vistas de signin y signup cuando un usuario ya esta logeado
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()){
            return next();
        } else {
            return res.redirect("/profile");
        }
    }
};
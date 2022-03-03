const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/add", isLoggedIn,(req, res) => {
    res.render("books/add.hbs");
});

router.post("/add", isLoggedIn, async (req, res) => {
    const { isbn, titulo, autor, genero, paginas, calificacion } = req.body;
    const newBook = {
        isbn,
        titulo,
        autor,
        genero,
        paginas,
        calificacion,
        user_id: req.user.id_usuario
    };
    const rows = await pool.query("SELECT * FROM books WHERE isbn = ?", [isbn]);
    if (rows.length > 0){
        await pool.query("INSERT INTO readings (fk_usuario, fk_ISBN, avance, calificacion) VALUES ("+ newBook.user_id + ",'" + newBook.isbn + "','0%','" + newBook.calificacion + "');");
        req.flash("success", "Libro guardado correctamente");
        res.redirect("/books");

    } else {
         await pool.query("INSERT INTO books (isbn, titulo, autor, genero, paginas) VALUES ('" + newBook.isbn + "','" + newBook.titulo + "','" + newBook.autor + "','" + newBook.genero + "'," + newBook.paginas + ");");
         await pool.query("INSERT INTO readings (fk_usuario, fk_ISBN, avance, calificacion) VALUES ("+ newBook.user_id + ",'" + newBook.isbn + "','0%','" + newBook.calificacion + "');");
         req.flash("success", "Libro guardado correctamente");
         res.redirect("/books");
    }
});

router.get("/", isLoggedIn, async (req, res) => {
    const readings = await pool.query("SELECT b.titulo, b.autor, b.paginas, r.avance, r.calificacion, r.id_lectura FROM books b, readings r WHERE r.fk_ISBN =b.isbn and r.fk_usuario = ?", [req.user.id_usuario]);
    res.render("books/list.hbs", { readings });
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM links WHERE id = ?", [id]);
    req.flash("success", "Link eliminado correctamente");
    res.redirect("/links");
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
    
    const { id } = req.params;
    const books = await pool.query("SELECT b.titulo, b.autor, b.paginas, r.calificacion FROM books b, readings r WHERE r.fk_ISBN = b.isbn AND r.id_lectura = ?", [id]);
    const comments = await pool.query("SELECT u.nombre, c.comentario, c.fecha FROM users u, comments c, books b WHERE c.fk_usuario = u.id_usuario and c.fk_post = b.isbn and b.isbn = (SELECT b.isbn from books b, readings r where b.isbn = r.fk_isbn and r.id_lectura = " + id + ") ORDER BY(c.fecha) DESC;");
    
    res.render("books/edit.hbs", {book: books[0], comments, id});
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { pagina, comentario } = req.body;
    const newAvance = {
        pagina
    };
    const newComment = {
        comentario,
        user_id: req.user.id_usuario
    };

    if (newAvance.pagina.length > 0)
    {
        await pool.query("UPDATE readings SET avance = ((" + newAvance.pagina + "/(select b.paginas from books b, readings r where r.fk_isbn = b.isbn and r.id_lectura = " + id + "))*100) where id_lectura = " + id + ";");
        req.flash("success", "Se actualizó el avance");
        res.redirect("/books");
    } else if (newComment.comentario.length > 0) {
        await pool.query("INSERT INTO comments (fk_usuario, comentario, fk_post) VALUES (" + newComment.user_id + ", '" + newComment.comentario + "', (SELECT fk_isbn FROM readings WHERE id_lectura = " + id + " AND fk_usuario = " + newComment.user_id + "));");
        req.flash("success", "Se agregó el comentario.");
        res.redirect("#");
    } else {
        req.flash("message", "No se pueden dejar campos vacios.");
        res.redirect("#");
    }
});

module.exports = router;
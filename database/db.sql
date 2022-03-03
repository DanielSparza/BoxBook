CREATE DATABASE boxbook;
USE boxbook;

CREATE TABLE users(
    id_usuario INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    usuario VARCHAR(20) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    email VARCHAR(80) NOT NULL,
    nombre VARCHAR(100)
);

CREATE TABLE books(
    isbn VARCHAR(20) PRIMARY KEY NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    paginas INT NOT NULL
);

CREATE TABLE readings(
    id_lectura INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    fk_usuario INT NOT NULL,
    fk_ISBN VARCHAR(20) NOT NULL,
    avance VARCHAR(20) NOT NULL,
    calificacion VARCHAR(20) NOT NULL,
    FOREIGN KEY(fk_usuario) REFERENCES users(id_usuario),
    FOREIGN KEY(fk_ISBN) REFERENCES books(isbn)
);

CREATE TABLE comments(
    id_comentario INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    fk_usuario INT NOT NULL,
    comentario TEXT NOT NULL,
    fecha timestamp NOT NULL DEFAULT current_timestamp,
    fk_post VARCHAR(20) NOT NULL,
    FOREIGN KEY(fk_usuario) REFERENCES users(id_usuario),
    FOREIGN KEY(fk_post) REFERENCES books(isbn)
);

CREATE TABLE goals(
    fk_usuario INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    meta INT NOT NULL,
    leidos INT,
    FOREIGN KEY(fk_usuario) REFERENCES users(id_usuario) 
);
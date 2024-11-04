const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

app.use(cors());
app.use(express.json());

//app.use(express.static('static'));

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllMovies() {
  let query = 'SELECT * FROM movies';
  let response = await db.all(query, []);

  return { movies: response };
}

app.get('/movies', async (req, res) => {
  let results = await fetchAllMovies();

  res.status(200).json(results);
});

async function fetchMoviesByGenre(genre) {
  let query = 'SELECT * FROM movies WHERE genre = ?';
  let response = await db.all(query, [genre]);

  return { movies: response };
}

app.get('/movies/genre/:genre', async (req, res) => {
  let genre = req.params.genre;
  let results = await fetchMoviesByGenre(genre);

  res.status(200).json(results);
});

async function fetchMovieById(id) {
  let query = 'SELECT * FROM movies WHERE id = ?';
  let response = await db.get(query, [id]);

  return { movie: response };
}

app.get('/movies/details/:id', async (req, res) => {
  let id = req.params.id;
  let results = await fetchMovieById(id);

  res.status(200).json(results);
});

async function fetchMoviesByReleaseYear(releaseYear) {
  let query = 'SELECT * FROM movies WHERE release_year = ?';
  let response = await db.all(query, [releaseYear]);

  return { movies: response };
}

app.get('/movies/release-year/:year', async (req, res) => {
  let releaseYear = req.params.year;
  let results = await fetchMoviesByReleaseYear(releaseYear);

  res.status(200).json(results);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

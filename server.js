const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const notes = [];

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  //const newNote = req.body;
  readFileAsync(path.join(__dirname, "/db/db.json"), "utf8").then(function (
    error
  ) {
    if (error) {
      console.log(error);
    }
  });

  return res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;

  newNote.id = Math.floor(Math.random() * 1000);
  console.log(newNote);

  notes.push(newNote);

  writeFileAsync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(notes)
  ).then(function (error) {
    if (error) {
      console.log(error);
    }
  });

  res.json(newNote);
});

app.get("/api/notes/:title", (req, res) => {
  const chosen = req.params.title;

  console.log(chosen);
  for (let i = 0; i < notes.length; i++) {
    if (chosen === notes[i].title) {
      return res.json(notes[i]);
    }
  }

  return res.json(false);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});

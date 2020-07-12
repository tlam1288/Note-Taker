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
  readFileAsync(path.join(__dirname, "/db/db.json"), "utf8").then(function (
    error
  ) {
    if (error) {
      console.log(error);
    }
  });

  return res.json(notes);
});

//creates new notes with unique id
app.post("/api/notes", (req, res) => {
  const newNote = req.body;

  newNote.id = Math.floor(Math.random() * 1000).toString();
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

app.delete("/api/notes/:id", (req, res) => {
  const chosen = req.params.id;
  //finds matching id for array item and if searched it will remove it from array
  for (let i = 0; i < notes.length; i++) {
    if (chosen === notes[i].id) {
      notes.splice(i, 1);

      writeFileAsync(
        path.join(__dirname, "/db/db.json"),
        JSON.stringify(notes)
      ).then(function (error) {
        if (error) {
          console.log(error);
        }
      });
    }
  }

  // readFileAsync(
  //   path.join(__dirname, "/db/db.json"),
  //   "utf8"
  // ).then(function () {});

  return res.json(notes);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});

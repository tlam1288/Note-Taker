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

const notes = [
  {
    id: 1,
    test: "hello!",
  },
];

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  //const newNote = req.body;
  return res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  notes.push(newNote);

  writeFileAsync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(notes)
  ).then(function (error) {
    if (error) {
      console.log(error);
    }
  });

  return res.json(true);
});

app.get("/api/notes/:id", (req, res) => {
  const chosen = req.params.character;

  console.log(chosen);

  return res.json(false);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});

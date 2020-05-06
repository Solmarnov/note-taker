const dbNotes = require('../db/db.json');
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

module.exports = function(app) {

  app.get("/api/notes", function(req, res) {
    fs.readFile('db/db.json', (err, data) => {
      if (err) throw err;
      res.json(JSON.parse(data));
    })
  });

  // Research how to listen for note id where * is
  app.delete("/api/notes/:id", function(req, res) {
    // delete note from db.json with specified id
  });

  app.post("/api/notes", function(req, res) {
    saveNote(req);
    res.end();
  });

  async function saveNote(req) {
    try {
      let data = await getJSON();
      let json = JSON.parse(data);
      let noteId = json.length + 1;
      let newNote = {
        "title": req.body.title,
        "text": req.body.text,
        "id": noteId
      }
      json.push(newNote);
      console.log('2: ' + JSON.stringify(json));
      fs.writeFile('db/db.json', JSON.stringify(json), err => {
        if (err) throw err;
        console.log("db.json updadated successfully.");
      });
    }
    catch {
      console.log(err);
    }
  }

  function getJSON() {
    return readFile('db/db.json');
  }
};
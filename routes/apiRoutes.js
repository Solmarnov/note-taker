const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

module.exports = function(app) {

  // Delete notes by id function
  async function deleteNote(req) {
    const searchKey = 'id';
    const searchVal = +req.params.id;
    try {
      let data = await getJSON();
      let json = JSON.parse(data);
      // Find id in JSON array then splice it
      for (let i = 0; i < json.length; i++) {
        if (json[i][searchKey] === searchVal) {
          json.splice(i, 1);
          break;
        }
      }
      // Reassign id for each note to prevent duplicate id when new note is added
      for (let i = 0; i < json.length; i++) {
        json[i][searchKey] = i + 1;
      }
      overwriteJSON(json);
      return json;
    }
    catch {
      console.log(`
        Error caught in deleteNote async function. Error message: 
        ${err}`
      );
    }
  }

  // Save new notes function
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
      overwriteJSON(json)
      return newNote;
    }
    catch {
      console.log(`
      Error caught in saveNote async function. Error message: 
      ${err}`
      );
    }
  }

  // Get/Read JSON file function
  function getJSON() {
    return readFile('db/db.json');
  }

  // Overwrite JSON file with latest array data
  function overwriteJSON(json) {
    fs.writeFile('db/db.json', JSON.stringify(json), err => {
      if (err) throw err;
      console.log("db.json updadated successfully.");
    });
  }

  // Handle /api/notes get requests
  app.get("/api/notes", function(req, res) {
    getJSON()
    .then(data => {
      res.json(JSON.parse(data));
    });
  });

  // Handle /api/notes/:id delete requests
  app.delete("/api/notes/:id", function(req, res) {
    const json = deleteNote(req);
    res.json(json);
  });

  // Handle /api/notes post requests
  app.post("/api/notes", function(req, res) {
    const newNote = saveNote(req);
    res.json(newNote);
  });
};
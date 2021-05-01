const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5550;

let notes = require("./public/assets/db.json");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', function (request, response) {
    response.sendFile(`${__dirname}/public/index.html`);
});

app.get('/notes', function (request, response) {
    response.sendFile(`${__dirname}/public/notes.html`)
});


app.get('/api/notes', function (request, response) {
    console.log("Successfully sent saved notes");
    response.json(notes);

});


app.post('/api/notes', function (request, response) {
const makeNote = request.body;
fs.readFile('./public/assets/db.json', "utf-8", function (err,data) {
    notes = JSON.parse(data);
    makeNote.id = parseInt(notes.length + 1);
    notes.push(makeNote);

    console.log(notes);

    fs.writeFile("./public/assets/db.json", JSON.stringify(notes), function (err) {
        if (err) throw err;
        response.json(notes);
    });
});

});

app.delete("./api/notes/:id", function (request,response) {
    console.log(request.params.id);
    notes = notes.filter(function (notes) {
        return notes.id != request.params.id;
    });
    fs.writeFile("./public/assets/db.json", JSON.stringify(notes), function (err) {
        if (err) throw err;
        response.json(notes);
    });
})

app.listen(PORT, function () {
    console.log(`Listening on http://localhost:${PORT}`);
});

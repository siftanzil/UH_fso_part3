const express = require("express");
const app = express();

// phonebook data

let phonebook = [
   {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456",
   },
   {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523",
   },
   {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345",
   },
   {
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122",
   },
   {
      id: 5,
      name: "Mars Poppendieck",
      number: "38-23-6423122",
   },
];

// use express for HTTP requests

app.get("/", (req, res) => {
   res.send("<h1>Let's find the number in the Phonebook!</h1>");
});

app.get("/api/persons", (req, res) => {
   res.json(phonebook);
});

app.get("/info", (req, res) => {
   res.send(`<p>Phonebook has info for ${phonebook.length} people</p>
    <p>${new Date()}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
   let id = Number(req.params.id);
   let contact = phonebook.find((contact) => contact.id === id);
   res.send(`${contact.id} - ${contact.name} - ${contact.number}`);
});

app.delete("/api/persons/:id", (req, res) => {
   const id = Number(req.params.id);
   phonebook = phonebook.filter((contact) => contact.id !== id);

   res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
   console.log(`server is running on port ${PORT}`);
});

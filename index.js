const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

morgan.token("body", (req) => {
   return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :response-time ms :body"));

const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: "unknown endpoint" });
};

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
];

// use express for HTTP requests

app.get("/", (req, res) => {
   res.send(
      `<h1>Let's find the number in the Phonebook!</h1><br/><a href="./api/persons">./api/persons/</a><br/><p>./api/persons/{id}</p>`,
   );
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
   if (contact) {
      res.send(
         `<h2 style = "color: blue; font-size: 30">(${contact.id}) ___ ${contact.name} ___ +${contact.number}</h2>`,
      );
   } else {
      res.status(400).send(
         `<p style = "color: red; font-size: 30">No matching contact found with id <b>${id}</b>!</p>`,
      );
   }
});

app.delete("/api/persons/:id", (req, res) => {
   const id = Number(req.params.id);
   phonebook = phonebook.filter((contact) => contact.id !== id);

   res.status(204).end();
});

app.post("/api/persons", (req, res) => {
   const person = req.body;
   let matchingContact;

   if (person.name && person.number) {
      matchingContact = phonebook.find(
         (contact) => contact.name === person.name,
      );
      // console.log(matchingContact);
   }

   if (person.name && person.number && !matchingContact) {
      person.id = Math.random();
      phonebook = phonebook.concat(person);
      res.json(phonebook).status(201);
   } else {
      res.status(406).send(
         "{'error': 'name must be unique and form must be fully filled'}",
      );
   }
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
   console.log(`server is running on port ${PORT}`);
});

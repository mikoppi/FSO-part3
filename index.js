const express = require("express");
const app = express();
const morgan = require('morgan')
const cors = require('cors')

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040123456",
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
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.use(express.json());
app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
app.use(express.static('build'))

//get all persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

//get info page
app.get("/info", (req, res) => {
  let dateInfo = new Date();
  res.send(`<div>
    <p>Phonebook has info for ${persons.length}</p>
    <p>${dateInfo}</p>
    </div>`);
});

//get one person
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

//delete one person
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

//add one person
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  if (persons.some((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

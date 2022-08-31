require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.use(express.static("build"));
app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);
app.use(cors());

//get all persons
app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((persons) => {
      if (persons) {
        res.json(persons);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//get info page
app.get("/info", (req, res) => {
  Person.find({})
    .then((persons) => {
      if (persons) {
        res.send(`<div>
                  <p>Phonebook has info for ${persons.length}</p>
                  <p>${new Date()}</p>
                </div>`);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//get one person
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//delete one person
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

//update one person
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

//add one person
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  });

  Person.find({}).then((persons) => {
    if (persons.some((person) => person.name === body.name)) {
      return res.status(400).json({
        error: "name must be unique",
      });
    } else {
      person
        .save()
        .then((savedPerson) => savedPerson.toJSON())
        .then((formattedPerson) => {
          res.json(formattedPerson);
          console.log(`added ${body.name} number ${body.number} to phonebook`);
        });
    }
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

// if the endpoint does not match
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Default error handler function
const errorHandler = (error, request, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' })
  }

  next(error)
}

// Morgan token
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

// Loading Middlewares
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms :body'))

// Express for HTTP requests routes

// Home page
app.get('/', (request, res) => {
  res.send(
    '<h1>Let\'s find the number in the Phonebook!</h1><br/><a href="./api/persons">./api/persons/</a><br/><p>./api/persons/{id}</p>',
  )
})

// get all persons from db
app.get('/api/persons', (request, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

// manual data
const phonebook = [
  {
    name: 'Sifat Ullah Tanzil',
    number: '018-878876868',
    id: '6494eac41c37103e73f7aeb8',
  },
  {
    name: 'Turzo Ishtiak',
    number: '880-123123111',
    id: '6494eadd1c37103e73f7aeba',
  },
  {
    name: 'Sifat Ullah Tanzil',
    number: '018-88888888',
    id: '64950171361f604628c8eac8',
  },
]

// get info of the db
app.get('/info', (request, res) => {
  res.send(`<p>Phonebook has info for ${phonebook.length} people</p>
    <p>${new Date()}</p>`)
})

// get specific person
app.get('/api/persons/:id', (request, res, next) => {
  console.log(request.params.id)
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).send({ error: 'not found' })
      }
    })
    .catch((error) => next(error))
})

// delete a person
app.delete('/api/persons/:id', (request, res, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

// add new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (false || (body.name && body.number)) {
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person
      .save()
      .then((savedPerson) => {
        response.json(savedPerson)
      })
      .catch((error) => response.status(409).send(error.message))
  } else {
    response.status(400).json({ error: 'fill both name and number!' })
  }
})

// update existing person
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => {
      console.log(error.message)
      response.status(409).send(error.message)
      next(error)
    })
})

// if the endpoint does not match
app.use(unknownEndpoint)

// handler of requests with result to errors
app.use(errorHandler)

// server port
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})

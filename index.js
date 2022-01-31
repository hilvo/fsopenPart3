require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Subject = require('./models/subject')


morgan.token('content', (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body)
  } else {
    return "No content"
  }
  
})

app.use(express.static('build'))
app.use(express.json())
// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

/*
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
*/

  
app.get('/api/persons', (request, response) => {
    //response.json(persons)
    
    Subject.find({}).then(subject => {
      response.json(subject)
    })
})

app.get('/api/persons/:id', (request, response, next) => {

    /*
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
    */

    Subject.findById(request.params.id).
      then(subject => {
        if (subject) {
          response.json(subject)
        } else {
          response.status(404).end()
        }
    })
    .catch(error => next(error))
  })

  const generateId = () => {
    return Math.floor(Math.random() * 100000)
  }
  
  app.post('/api/persons', (request, response, next) => {
    const body = request.body
  
    /*
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }

    // const personFind = persons.find(person => person.name === body.name)
    const personFind = Subject.findById(body.name).then(subject => {
      response.json(subject)
    })

    if (personFind) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
    */
  
    /*
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
    */

    const subject = new Subject({
      name: body.name,
      number: body.number,
      id: generateId(),
    })
  
    // persons = persons.concat(person)
    // response.json(person)

    subject.save()
      .then(savedSubject => {
        response.json(savedSubject.toJSON())
      })
      .catch(error => next(error))
  })

app.delete('/api/persons/:id', (request, response, next) => {
  /*
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
    */
    Subject.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

app.get('/info', async (request, response) => {
    const d = new Date()

    /*response.send(`<p>Phonebook has info for ${persons.length} people</p>
                   <p>${d.toUTCString()}</p>`)*/
    let numDocs = await Subject.countDocuments({})

    response.send(`<p>Phonebook has info for ${numDocs} people</p>
                   <p>${d.toUTCString()}</p>`)
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const subject = {
    name: body.name,
    number: body.number,
  }

  Subject.findByIdAndUpdate(request.params.id, subject, { new: true })
    .then(updatedSubject => {
      response.json(updatedSubject)
    })
    .catch(error => next(error))
})



const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
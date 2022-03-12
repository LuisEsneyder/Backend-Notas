require('dotenv').config()
const express= require('express')
const cors = require('cors')
const Note = require('./models/note')
const app = express()
app.use(express.json())

  

  const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
app.use(requestLogger)
app.use(cors())
app.use(express.static('build'))
app.get('/', (request, response)=>{
    response.send('<h1>hello world<h1/>')
})
app.get('/api/notes',(request,response)=>{
    Note.find({}).then(nota=>{
      response.json(nota)
    })
} )

app.get('/api/notes/:id', (request,response)=>{
    const id =request.params.id
    Note.findById(id).then(result=>{
      response.json(result)
    })
})

app.delete('/api/notes/:id',(request,response)=>{
    const id = request.params.id 
    Note.findByIdAndRemove(id).then(result=>{
      response.status(204).end()
    })
    
})
app.post('/api/notes',(request,response)=>{
    const body = request.body
    if(!body.content){
        return response.status(400).json({
            error : "content missing"
        })
    }
    const note = Note({
      content : body.content,
      important : body.important || false,
      date : new Date(),
    })
     note.save().then(result=>{
       response.json(result)
     })
})
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001

app.listen(process.env.PORT || 3001,()=>{
    console.log(`Server running on port ${PORT}`)
})
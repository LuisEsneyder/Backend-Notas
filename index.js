require('dotenv').config()
const express= require('express')
const cors = require('cors')
const Note = require('./models/note')
const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())


app.get('/', (request, response) => {
    response.send('<h1>hello world<h1/>')
})
app.get('/api/notes',(request,response) => {
    Note.find({}).then( nota => {
        response.json(nota)
    })
} )

app.get('/api/notes/:id', (request,response,next) => {
    const id =request.params.id
    Note.findById(id).then( note => {
        if(note){
            response.json(note)
        }
        response.status(404).end()
    }).catch(error => next(error))
})

app.delete('/api/notes/:id',(request,response,next) => {
    const id = request.params.id
    Note.findByIdAndRemove(id).then( result => {
        response.status(204).end()
    }).catch(error => next(error))
})
app.post('/api/notes',(request,response, next) => {
    const body = request.body
    const note = Note({
        content : body.content,
        important : body.important || false,
        date : new Date(),
    })
    note.save().then(SaveNote => SaveNote.toJSON()).then(SaveNoteFOrmat => {
        response.json(SaveNoteFOrmat)
    }).catch(error => next(error))
})
app.put('/api/notes/:id',(req,res,next) => {
    const body = req.body
    const note={
        name : body.name,
        important : body.important
    }
    Note.findByIdAndUpdate(req.params.id,note, { new : true }).then(ubdateNote => {
        res.json(ubdateNote)
    }).catch(error => next(error))
})
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error,request,response,next) => {
    console.error(error.message)
    if(error.name==='CastError'){
        return response.status(400).send({ error : 'malformatted id' })
    }
    if (error.name==='ValidationError'){
        return response.status(400).json({ error:error.message } )
    }
    next(error)
}
app.use(errorHandler)

app.listen(process.env.PORT || 3001,() => {
    console.log(`Server running on port ${process.env.PORT}`)
})
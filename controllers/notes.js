const notesRoutes = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = req =>{
    const authorization = req.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer')){
        return authorization.substring(7)
    }
    return null
}

notesRoutes.get('/', async (request, response) => {
    const notas = await Note.find({}).populate('user',{username : 1, name : 1})
    response.json(notas)
})
notesRoutes.get('/:id', async (request, response) => {
    const id = request.params.id
    const note = await Note.findById(id)
    if (note) {
        response.json(note)
    }
    response.status(404).end()

})
notesRoutes.post('/', async (request, response, next) => {
    const body = request.body
    const token = getTokenFrom(request)
    
    //decodificar token
    const decoddedToken = jwt.verify(token,process.env.SECRET)
    if(!token || !decoddedToken.id){
        return response.status(401).json({error : 'token missing or invalid'})
    }
    const user = await User.findById(decoddedToken.id)
    const note =new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        user : user._id
    })
    const SaveNote = await note.save()
    user.notes = user.notes.concat(SaveNote._id)
    await User.findByIdAndUpdate(decoddedToken.id,user)
    response.json(SaveNote)
})
notesRoutes.delete('/:id', async (request, response) => {
    const id = request.params.id
    await Note.findByIdAndRemove(id)
    response.status(204).end
})
notesRoutes.put('/:id', (req, res, next) => {
    const body = req.body
    const note = {
        name: body.name,
        important: body.important
    }
    Note.findByIdAndUpdate(req.params.id, note, { new: true }).then(ubdateNote => {
        res.json(ubdateNote)
    }).catch(error => next(error))
})
module.exports = notesRoutes
const userRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

userRouter.get('/',async (req,res,next)=>{
    const ListUser = await User.find({}).populate('notes',{content : 1, date : 1})
    res.json(ListUser)
})

userRouter.post('/',async (req,res,next)=>{
    const body = req.body
    const saltRounds = 10
    const passwordHas = await bcrypt.hash(body.passwordHas,saltRounds)
    const user =new  User({
        username : body.username,
        name : body.name,
        passwordHas : passwordHas
    })
    const saveUser = await user.save()
    res.status(201).json(saveUser)
})
module.exports = userRouter

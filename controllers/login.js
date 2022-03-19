const User = require('../models/user')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const bcrypt = require('bcryptjs')

loginRouter.post('/',async (req,res,next)=>{
    const body = req.body
    const user = await User.findOne({username:body.username})
    const passwordCorrect = user===null ? false : await bcrypt.compare(body.passwordHas, user.passwordHas)
    if(!(user && passwordCorrect)){
        res.status(401).json({
            error : 'inavalid username or pasword'
        })
    }
    const userForToken={
        username : user.username,
        id : user._id,
    }
    const token = jwt.sign( userForToken, process.env.SECRET)
    res.status(200)
    .send({token, username : user.username, name : user.name})
})
module.exports = loginRouter 
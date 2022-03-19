const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const UserShema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    name : String,
    passwordHas : String,
    notes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'note-app'
        }
    ]
})
UserShema.plugin(uniqueValidator)
UserShema.set('toJSON',{
    transform : (document,returObject)=>{
        returObject.id = returObject._id.toString()
        delete returObject._id
        delete returObject.__v
        delete returObject.passwordHas 
    }
})
module.exports =mongoose.model('User',UserShema)
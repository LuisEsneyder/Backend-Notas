const mongoose=require('mongoose')
const url = process.env.MONGODB_URI
console.log('connecting to', url);

mongoose.connect(url).then(result=>{
    console.log('connected to mongodb')
})
.catch((error)=>{
    console.log('error connecting to MongoDb',error.message)
})

const noteShema = new mongoose.Schema({
    content : {
      type :  String,
      minlength : 5,
      required: true
    },
    date :  {
      type: Date,
      required: true
    },
    important : Boolean,
})
noteShema.set('toJSON',{
  transform : (document, returnedObject)=>{
    returnedObject.id= returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('note-app', noteShema)


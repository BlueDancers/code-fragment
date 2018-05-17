var mongoose = require('mongoose')
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/m_data')

mongoose.connection.once('open',()=> {
  console.log("[mongoose]mongdb is start");
})

var userSchema  = new Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  call: {
    type: Number
  },
  email: {
    type: String
  }
})

var user = mongoose.model('User',userSchema);


module.exports = user
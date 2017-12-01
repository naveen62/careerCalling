var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs")

var camSchema = new mongoose.Schema({
    name: String,
    work: String,
    number: Number,
    address: String,
    desc: String,
    email: String,
    username: String,
    password: String,
    type: {type: Number, default: 2},
    applied: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
        ]
})

camSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}
camSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}
module.exports = mongoose.model('Company', camSchema)

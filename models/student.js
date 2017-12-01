var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs")
var studSchema = new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    qualification: String,
    Bdate: String,
    passout: Number,
    marks: Number,
    number: Number,
    email: String,
    address: String,
    desc: String,
    pass: Boolean,
    username: String,
    password: String,
    type: {type: Number, default: 1},
    accepted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        }
        ],
    rejected: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Company'
            }
        ]
})

studSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}
studSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}
module.exports = mongoose.model('Student', studSchema);
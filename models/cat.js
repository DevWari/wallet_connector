const mongoose = require('mongoose')

const catSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    status: { type: String, enum: ['live', 'dead'], required: true }
})

module.exports = mongoose.model('Cat', catSchema);
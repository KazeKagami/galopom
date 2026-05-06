const mongoose = require('mongoose');

const baseSchema = new mongoose.Schema({
    'title': {
        type: String,
        unique: true,
        required: true,
    }
})

const AttractionTypes = mongoose.model('AttractionTypes', baseSchema, 'attractionTypes');
const Cities = mongoose.model('Cities', baseSchema, 'cities');
const Countries = mongoose.model('Countries', baseSchema, 'countries');
const Architects = mongoose.model('Architects', baseSchema, 'architects');
const Sculptors = mongoose.model('Sculptors', baseSchema, 'sculptors');
const IdeaAuthors = mongoose.model('IdeaAuthors', baseSchema, 'ideaAuthors');

module.exports = {
    Cities,
    Countries,
    Architects,
    Sculptors,
    IdeaAuthors,
    AttractionTypes
}
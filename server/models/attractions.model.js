const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
    // Ваш id из CSV становится _id
    m_id: {
        type: Number,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    other_titles: {
        type: String,
        default: ''
    },
    kind: {
        type: [String],
        default: []
    },
    idea_author: {
        type: String,
        default: ''
    },
    architector: {
        type: String,
        default: ''
    },
    sculptor: {
        type: String,
        default: ''
    },
    year_arise: {
        type: Number,  // Int32
        min: 0,
        max: new Date().getFullYear()
    },
    country: {
        type: String,
        default: 'Россия'
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    history: {
        type: String,
        default: ''
    },
    trivia: {
        type: String,
        default: ''
    },
    yandex_link: {
        type: String,
        default: ''
    }
}
);

attractionSchema.index({ m_id: 1 });

// Создаём модель
const Attraction = mongoose.model('Attraction', attractionSchema, 'attractions');

module.exports = Attraction;
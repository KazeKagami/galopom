const Attraction = require('../models/attractions.model');
const getNextId = require('../../shared/utils/getNextId');

const getNextMId = () => getNextId(Attraction, 'm_id');

// Получить все
const getAllAttractions = async () => {
    return await Attraction.find();
};

// Получить по m_id
const getAttractionById = async (m_id) => {
    if (isNaN(m_id)) {
        throw new Error('m_id должен быть числом');
    }

    const attraction = await Attraction.findOne({ m_id });

    if (!attraction) {
        throw new Error(`Достопримечательность с m_id ${m_id} не найдена`);
    }

    return attraction;
};

// Создать
const createAttraction = async (data) => {
    const nextMId = await getNextMId();

    delete data.m_id;

    const attraction = new Attraction({
        m_id: nextMId,
        ...data
    });

    return await attraction.save();
};

module.exports = {
    getAllAttractions,
    getAttractionById,
    createAttraction
};
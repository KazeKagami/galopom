const Attraction = require('../models/attractions.model');
const getNextId = require('../../shared/utils/getNextId');

const getNextMId = () => getNextId(Attraction, 'm_id');

// Получить все
const getAllAttractions = async (options = {}) => {
    let query = Attraction.find();

    // 1. ПРИМЕНЯЕМ ФИЛЬТРАЦИЮ (если есть)
    if (options.filter) {
        query = query.find(options.filter);
    }

    // 2. ПРИМЕНЯЕМ СОРТИРОВКУ
    // Приоритет 1: Сложная сортировка объектом
    if (options.sort && typeof options.sort === 'object') {
        query = query.sort(options.sort);
    }
    // Приоритет 2: Простая сортировка полем
    else if (options.sortBy) {
        const allowedSortFields = ['m_id', 'title', 'kind'];
        if (!allowedSortFields.includes(options.sortBy)) {
            throw new Error(`Недопустимое поле для сортировки: ${options.sortBy}`);
        }

        const sortDirection = options.sortOrder === 'desc' ? -1 : 1;
        query = query.sort({ [options.sortBy]: sortDirection });
    }
    // Приоритет 3: Базовая сортировка по умолчанию (по m_id)
    else {
        query = query.sort({ m_id: 1 });
    }

    // 3. ПАГИНАЦИЯ (опционально)
    if (options.limit) {
        query = query.limit(options.limit);
    }

    if (options.skip) {
        query = query.skip(options.skip);
    }

    return await query;
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
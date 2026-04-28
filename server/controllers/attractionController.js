const Attraction = require('../models/attractions');
const getNextId = require('../../shared/utils/getNextId');

// Локальная обёртка для удобства
const getNextMId = () => getNextId(Attraction, 'm_id');

// Получить все достопримечательности
const getAllAttractions = async (req, res) => {
    try {
        const attractions = await Attraction.find();
        res.status(200).json(attractions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Получить одну достопримечательность по ID
const getAttractionById = async (req, res) => {
    try {
        const m_id = parseInt(req.params.m_id);

        if (isNaN(m_id)) {
            return res.status(400).json({
                message: 'm_id должен быть числом'
            });
        }

        const attraction = await Attraction.findOne({ m_id: m_id });

        if (!attraction) {
            return res.status(404).json({
                message: `Достопримечательность с m_id ${m_id} не найдена`
            });
        }

        res.status(200).json(attraction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Получить по году
const getAttractionsByYear = async (req, res) => {
    try {
        const attractions = await Attraction.find({ year_arise: parseInt(req.params.year) });
        res.status(200).json(attractions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Получить по городу
const getAttractionsByCity = async (req, res) => {
    try {
        const attractions = await Attraction.find({ city: req.params.city });
        res.status(200).json(attractions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Создать новую (POST) — ИСПРАВЛЕНО
const createAttraction = async (req, res) => {
    try {
        // Получаем следующий m_id через универсальную функцию
        const nextMId = await getNextMId();

        // Убираем m_id из тела запроса (защита от перезаписи)
        delete req.body.m_id;

        // Создаём документ с автоматическим m_id
        const attraction = new Attraction({
            m_id: nextMId,
            ...req.body
        });

        const saved = await attraction.save();

        res.status(201).json({
            success: true,
            message: `Достопримечательность создана с m_id: ${saved.m_id}`,
            data: saved
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Обновить (PUT) — ВНИМАНИЕ: тут используется _id MongoDB, а не m_id
const updateAttraction = async (req, res) => {
    try {
        const updated = await Attraction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Не найдено' });
        }
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Удалить (DELETE) — тоже использует _id MongoDB
const deleteAttraction = async (req, res) => {
    try {
        const deleted = await Attraction.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Не найдено' });
        }
        res.status(200).json({ message: 'Удалено успешно' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllAttractions,
    getAttractionById,
    getAttractionsByYear,
    getAttractionsByCity,
    createAttraction,
    updateAttraction,
    deleteAttraction
};
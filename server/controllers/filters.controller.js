const getSortItems = require("../services/filters.service");
const models = require("../models/baseFilter.model");

// Фабрика — создаёт обработчик для любой модели
const createHandler = (modelName) => {
    return async (req, res, next) => {
        try {
            const Model = models[modelName];
            const items = await getSortItems(Model);
            res.status(200).json(items);
        } catch (error) {
            next(error);
        }
    };
};

// Создаём обработчики для всех моделей
const getFilterOptions = {
    types: createHandler('AttractionTypes'),
    cities: createHandler('Cities'),
    countries: createHandler('Countries'),
    architects: createHandler('Architects'),
    sculptors: createHandler('Sculptors'),
    ideaAuthors: createHandler('IdeaAuthors')
};

module.exports = getFilterOptions;
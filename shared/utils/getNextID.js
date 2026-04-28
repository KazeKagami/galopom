// shared/utils/getNextId.js

/**
 * Универсальная функция получения следующего ID для любой модели
 * @param {Model} model - Mongoose модель (Attraction, User, Post и т.д.)
 * @param {string} idField - Название поля ID (по умолчанию 'm_id', можно 'user_id', 'post_id')
 * @returns {Promise<number>}
 */
const getNextId = async (model, idField = 'm_id') => {
    // Строим объект сортировки динамически
    const sortObject = {};
    sortObject[idField] = -1;

    const lastDoc = await model.findOne()
        .sort(sortObject)
        .select(idField);

    if (!lastDoc) {
        return 1;
    }

    return lastDoc[idField] + 1;
};

module.exports = getNextId;
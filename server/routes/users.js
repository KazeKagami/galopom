var express = require('express');
var { getUsers } = require('../../database/connection');
var router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const users = await getUsers(); // ждем результат асинхронной функции
    res.json(users); // отправляем как JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при получении пользователей');
  }
});

router.get('/cool', async function (req, res, next) {
  res.send('ur so cool')
});

module.exports = router;
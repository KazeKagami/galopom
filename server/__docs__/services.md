# services
***
## attraction.service
Функции для получения данных из базы достопримечательностей.
### getAllAttractions
Асинхронная функция получения достопримечательностей с условной выборкой.
**Параметры**
> ***options*** - массив различных аттрибутов, которые могут фильровать и сортировать исходный список.

**Описание**
В любом из случаев options передаётся в функцию. В зависимости от переданных данных решает что выводить:
* Если options NaN: возвращает весь список объектов с базовой сортировкой по m_id.
* Возвращает фильтрацию (сложную и единичную).
* Возвращает комплексную сортировку по данному объекту.
* Возвращает упрощённую сортировку по **allowedSortFields** если запрос был строкой.
* Поддерживает пагинацию.

**Синтаксис**
```javascript
// ваши опции здесь
const options = {};
await getAllAttractions(options);
```

**Примеры**
Вызов функции по умолчанию:
```javascript
const attractions = await getAllAttractions()
// или
const attractions = await getAllAttractions({})
// даже если передаются нулевые значения:
const attractions = await getAllAttractions({filter: {}, skip: null})
```
Включает любые столбцы из базы:
```javascript
// фильтрация + сложная сортировка + пагинация
const attractions = await getAllAttractions({
    filter: {
        kind: 'some_word'
    },
    sort: {
        rating: -1,
        price: 1
    },
    limit: 5,
    skip: 10
})
```
Включает только **allowedSortFields**, для упрощённой однострочной сортировки:
```javascript
// упрощённая сортировка + пагинация
const attractions = await getAllAttractions({
    sort: 'title',
    order: 'desc',
    limit: 10
})
```
Фильтрация может включаться несколько аттрибутов, включая списки:
```javascript
// сложная фильтрация
const attractions = await getAllAttractions({
    filter: {
        city: 'city_name',
        kind: { $in: ['some_other_name', 'kebab']}
    }
})
```
>! Если вы не используете [контроллеры](/server/__docs__/controllers.md#getattractions), то для оптимального поиска по массивам можно включить следующие команды:
> * *filter: {col: {**$in**: ['your', 'array', 'you', 'want', 'to', 'parse']}}* - выведет записи если хотя бы один элемент из массива удовлетворяет запрос
> * *filter: {col: {**$all**: ['your', 'array', 'you', 'want', 'to', 'parse']}}* - выведет только те записи, если все элементы из массива удовлетворяют запрос
***
### getAttractionById
Асинхронная функция получения достопримечательности по его m_id.\
**Параметры**
> ***m_id*** - уникальный цифровой идентификатор объекта.

**Описание**
Служит для поиска конкретных объектов из базы достопримечательностей.
* Если m_id не число - выдаёт ошибку.
* Если нет объектов с таким m_id - выдаёт ошибку.
* В остальных случаях возвращает все поля объекта.

**Синтаксис**
```javascript
// (int) -> число обязательно целое
const objectID = (int);
await getAttractionById(objectID);
```
**Примеры**
```javascript
// это лишь визуализация данных из базы
const data = {
    {m_id: 1,title: 'lflflf'},
    {m_id: 2,title: 'srhsrhshs'},
    {m_id: 3,title: 'gakaka'}
};
await getAttractionById('int'); // -> Error: m_id должен быть числом
await getAttractionById(5);     // -> Error: Достопримечательность с m_id 5 не найдена
await getAttractionById(1);     // -> {m_id: 1,title: 'lflflf'}
```
***
### createAttraction
Асинхронная функция для создания достопримечательностей.
**Параметры**
> ***data*** - все поля из [модели](/server/models/attractions.model.js),
! исключая поле *m_id*.
Поля ***title*** и ***city*** - являются обязательными к заполнению.

**Описание**
Создаёт новые объекты в коллекцию достопримечательностей по переданным значениям.
* Поле m_id не передаётся в data ни в каком виде.
* data.m_id удаляется (даже если его нет), а потом автоматически генерируется с помощью [getNextID](/shared/__docs__/utils.md#getnextid).

**Синтаксис**
```javascript
const data = {'your data here'};
await createAttraction(data);
```
**Примеры**
```javascript
const newAttraction = await createAttraction({
    title: "Тачанка-Ростовчанка",   // обязатаельное поле
    city: "Ростов-на-Дону",         // обязатаельное поле
    kind: ["памятник", "мемориал"], // необязатаельное поле
    year_arise: 1977                // необязатаельное поле
});
```
***
***
## filters.service
Функции для парсинга объектов для фильтрации.
### getSortItems
Асинхронная функция получения объектов из переданных моделей
**Параметры**
> ***Model*** - mongoose модель (Attraction, User, Post и т.д.)

**Описание**
Обычный поиск всоех записей по переданнйо модели.
**Синтаксис**
```javascript
await getSortItems(modelName);
```
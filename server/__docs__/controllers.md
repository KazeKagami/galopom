# controllers
> ***req*** - Express запрос. То, что передаётся в url.
***res*** - Express ответ. То, что сервре передаёт в ответ на req.
***next*** - Express следующий. Говорит, что пора запускать следующий контроллер. Можно передавать ошибки, возникшие во время обработки.
***
## attraction.controller
### getAttractions
Асинхронная функция Express-контроллер, для получения, фильтрации и сортировки объектов коллекции.
**Параметры**
Внутри функции создаётся константа **options**, собирающая в себе следующие параметры:
> ***req.query.sort*** - поле для сортировки.
***req.query.order*** - поле для направления.
***req.query.limit*** - сколько записей взять.
***req.query.skip*** - сколько записей пропустить.
***filter*** - условия фильтрации. По умолчанию пустой список.

**Описание**
Сбор условий для фильтрации и сортировки происходит по этому приоритету:
1. POST запрос, с req.body для сложных фильтраций и сортировок.
2. Одиночный запрос на парсинг городов.
3. Одиночный запрос на парсинг года возведения.
4. Одиночный запрос на вид объекта.
5. GET запрос, на самые простые строки.

С помощью [сервиса](/server/__docs__/services.md#getallattractions) делаем запрос в базу данных, передавая **options**.

**Синтаксис**
```javascript
import attractionController from '../controllers/attraction.controller'
(...attractionController.getAttractions)
```
***
### buildFilterFromBody
Вспомогателная функция для формирования запроса из req.body.
**Параметры**
> ***filters*** - передаются значения из req.body.

**Описание**
В начале создаётся пустой список для последующего сбора требований.
Условным оператором проходится по всем полям, которые могут фильтроваться, и если в req.body есть запросы - добавляем в соответвующий отдел в пустом списке.
**Синтаксис**
```javascript
buildFilterFromBody(req.body)
```
***
### buildFilterFromQuery
Функция выполняет точно те же действия, что и [builfFilterFromBody](/server/__docs__/controllers.md#buildfilterfrombody), за исключением того, что тут идёт разделение строк:
```javascript
if (query.kinds) {
    filterQuery.kind = { $in: query.kinds.split(',') };
}
```
Query строки преобразуются в массивы, и вновь собираются в один пустой список.
***
### getAttractionById
Контроллер на парсинг одиночных объектов по их m_id.
**Параметры**
> ***req.params.m_id*** - уникальный цифровой идентификатор объекта, переданный в запросах.

**Синтаксис**
```javascript
import attractionController from '../controllers/attraction.controller'
(...attractionController.getAttractionById)
```
***
### createAttraction
Контроллер, с помощью которого создаются новые объекты.
**Параметры**
> ***req.body*** - полный запрос.

**Описание**
Для создания, используется соответсвующая [функция](/server/__docs__/services.md#createattraction) из сервисов. В параметр **data**, полностью передаётся **req.body**.
**Синтаксис**
```javascript
import attractionController from '../controllers/attraction.controller'
(...attractionController.createAttraction)
```
***
***
## filters.controller
### createHandler
Универсальный контроллер для парсинга данных с разных моделей.
**Параметры**
> Model - mongoose модель (Attraction, User, Post и т.д.)

**Описание**
Передаём mongoose модель в контроллер.\
Через [getSortItems](/server/__docs__/services.md#getsortitems), получаем все объекты конкретной модели.
**Синтаксис**
```javascript
const filters = {
    filter_1: createHandler('Model_Name'),
};
```
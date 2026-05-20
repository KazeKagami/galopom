# types.ts
Шаблоны для типизации собранного материала из коллекций базы данных.
Обязателен для фронтенда, преимущественно для TypeScript.

```typescript
field_name: sting; // -> обязательные поля для заполения
other_field?: int; // -> необязательные поля
```
***
## attractions.types
Типизация для коллекции **Attractions**. Должна быть идентичной описанию модели в mongoose.
***
## baseSort.types
Типизация для парсинга объектов для фильтрации.\
Включает такие модели как **Cities, Countries, Architects, Sculptors, IdeaAuthors, Kinds**, т.к. они имеют одинаковые аттрибуты.
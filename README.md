Это программный лабораторный стенд, который реализован на NodeJS для возможности его запуска на окружении для тестирования без установки дополнительного программного обеспечения и обладает следующим функционалом.

1. Стенд поддерживает возможность его подключения к тестовой базе данных PostgreSql, настройки подключения меняются в исходном коде стенда.
2. Стенд содержит REST API запрос для создания таблиц пользователем, формат POST-запроса и его тела приведён далее:
   Адрес:<br>
   `/create?name=student`
   Тело:<br>
   `{ "name": "text", "id": "int8", "birthdate": "timestamp"}`
3. Стенд содержит REST API запрос для удаления таблиц пользователем, формат GET-запроса:
   Адрес:<br>
   `/drop?name=student`
4. Стенд поддерживает REST API запросы для заполнения таблиц пользователем, формат POST-запроса и его тела приведён далее:
   Адрес:<br>
   `/insert?name=student`
   Тело:<br>
   `{ "id": 1, "name": "Иванов", "birthdate": "2000-01-01"}`
5. Стенд поддерживает REST API запросы для изменения записей пользователем, формат POST-запроса и его тела приведён далее:
   Адрес:<br>
   `/update?name=student`
   Тело:<br>
   `{ "id": 1, "name": "Петров", "birthdate": "2000-01-02"}`
6. Стенд поддерживает REST API запросы для удаления записей пользователем, формат POST-запроса и его тела приведён далее:
   Адрес:<br>
   `/delete?name=student`
   Тело:<br>
   `{ "id": 3}`
7. Стенд поддерживает REST API запросы для выборки записей пользователем, формат POST-запроса и его тела приведён далее:
   Адрес:<br>
   `/select?name=student`
   Тело:<br>
   `{ "id": 1}`
8. Стенд возвращает HTML-страницу, содержащую список записей из
   определенной таблицы с селекторами разного типа и возможностью фильтрации по столбцам выводимой таблицы.
   Адрес:<br>
   `/index.html?name=student&id=1`
   Данный функционал предназначен имитировать работу простейшего веб-приложения в произвольной предметной области для обеспечения возможности отладки и проверки тестовых сценариев.

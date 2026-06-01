const db = require("../database");

function createTasksTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            paragraph TEXT NOT NULL
        )
    `;

    db.run(sql, (err) => {
        if (err) {
            console.error("Ошибка создания таблицы tasks: ", err.message);
        } else {
            console.log("Таблица tasks создана или уже существует");
        }
    })
}

module.exports = { createTasksTable };
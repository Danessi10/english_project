const db = require("../database");

function createUsersTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            password TEXT UNIQUE NOT NULL
        )
    `;

    db.run(sql, (err) => {
        if (err) {
            console.error("Ошибка создания таблицы users: ", err.message);
        } else {
            console.log("Таблица users создана или уже существует");
        }
    })
}

module.exports = { createUsersTable };
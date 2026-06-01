const db = require("../database");

function createChallengesTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            vars TEXT NOT NULL,
            answer TEXT NOT NULL,
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
        )
    `;

    db.run(sql, (err) => {
        if (err) {
            console.error("Ошибка создания таблицы challenges: ", err.message);
        } else {
            console.log("Таблица challenges создана или уже существует");
        }
    })
}

module.exports = { createChallengesTable };
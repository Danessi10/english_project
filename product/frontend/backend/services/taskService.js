const withOpenDbConnection = require("../database");

class TaskService {
    static async addTask(name, paragraph, challenges) {
        const response = {};

        await withOpenDbConnection(async (db) => {
            await new Promise((resolve, reject) => {
                db.run("INSERT INTO tasks (name, paragraph) VALUES (?, ?)", [name, paragraph],
                    function (err) {
                        if (err) {
                            response.success = false;

                            if (err.code === "SQLITE_CONSTRAINT") {
                                response.status = 409;
                                response.message = "Название уже существует";
                            } else {
                                response.status = 500;
                                response.message = "Ошибка на стороне сервера, повторите попытку позже";
                            }
                            reject(err)
                        } else {
                            response.success = true;
                            response.status = 201;
                            response.message = "Задача добавлена успешно";
                            response.data = {
                                id: this.lastID,
                                name
                            };
                            resolve(response);
                        }
                    }
                )

                const stmt = db.prepare("INSERT INTO challenges (task_id, question, vars, answer) VALUES (?, ?, ?, ?)");

                challenges.forEach((challenge => {
                    const { task_id, question, vars, answer } = challenge;
                    stmt.run([task_id, question, vars.join(", "), answer]);
                }));

                stmt.finalize();

            }).catch(err => err);
        });

        return response;
    }

    static async getTask(name) {
        const response = {};

        await withOpenDbConnection(async (db) => {
            await new Promise((resolve, reject) => {
                db.get("SELECT * FROM tasks WHERE name = ?", [name], (err, task) => {
                    if (err) {
                        response.success = false;
                        response.status = 500;
                        response.message = "Ошибка на стороне сервера, повторите попытку позже";
                        reject(err);
                    } else if (!task) {
                        response.success = false;
                        response.status = 401;
                        response.message = "Введены неверные/несуществующие данные";
                        reject(err);
                    } else {
                        response.success = true;
                        response.status = 200;
                        response.message = "Задача обнаружена";
                        response.data = {
                            id: task.id,
                            name: task.name,
                            paragraph: task.paragraph
                        };

                        resolve(response);
                    }
                });
            }).catch(err => err);
        });

        return response;
    }

    static async getAllTasks() {
        const response = {};

        await withOpenDbConnection(async (db) => {
            await new Promise((resolve, reject) => {
                db.all(
                    `SELECT
                        t.id AS id,
                        t.name AS name,
                        t.paragraph,
                        c.question,
                        c.vars,
                        c.answer
                    FROM tasks t
                    LEFT JOIN challenges c ON t.id = c.task_id
                    ORDER BY t.id, c.id
                    `, (err, rows) => {
                    if (err) {
                        response.success = false;
                        response.status = 500;
                        console.error(err.message)
                        response.message = "Ошибка на стороне сервера, повторите попытку позже";
                        reject(err);
                    } else {
                        response.success = true;
                        response.status = 200;
                        response.data = rows;
                        resolve(response);
                    }
                });
            }).catch(err => err);
        });

        return response;
    }
}

module.exports = TaskService;
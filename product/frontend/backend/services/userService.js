const withOpenDbConnection = require("../database");

class UserService {
    static async addUser(name, password) {
        const response = {};

        await withOpenDbConnection(async (db) => {
            await new Promise((resolve, reject) => {
                db.run("INSERT INTO users (name, password, role) VALUES (?, ?, ?)", [name, password, "user"],
                    function (err) {
                        if (err) {
                            response.success = false;

                            if (err.code === "SQLITE_CONSTRAINT") {
                                response.status = 409;
                                response.message = "Имя уже существует";
                            } else {
                                response.status = 500;
                                response.message = "Ошибка на стороне сервера, повторите попытку позже";
                            }

                            reject(err)
                        } else {
                            response.success = true;
                            response.status = 201;
                            response.message = "Регистрация прошла успешно";
                            response.data = {
                                id: this.lastID,
                                name,
                                role
                            };
                            resolve(response);
                        }
                    }
                )
            }).catch(err => err);
        });

        return response;
    }

    static async getUser(name, password) {
        const response = {};

        await withOpenDbConnection(async (db) => {
            await new Promise((resolve, reject) => {
                db.get("SELECT * FROM users WHERE name = ?", [name], (err, user) => {
                    if (err) {
                        response.success = false;
                        response.status = 500;
                        response.message = "Ошибка на стороне сервера, повторите попытку позже";
                        reject(err);
                    } else if (!user || !(password === user.password)) {
                        response.success = false;
                        response.status = 401;
                        response.message = "Введены неверные/несуществующие данные";
                        reject(err);
                    } else {
                        response.success = true;
                        response.status = 200;
                        response.message = "Вход выполнен успешно";
                        response.data = {
                            id: user.id,
                            name: user.name,
                            role: user.role
                        };

                        resolve(response);
                    }
                });
            }).catch(err => err);
        });

        return response;
    }

    static async getAllUsers() {
        const response = {};

        await withOpenDbConnection(async (db) => {
            await new Promise((resolve, reject) => {
                db.all("SELECT * FROM users", [], (err, rows) => {
                    if (err) {
                        response.success = false;
                        response.status = 500;
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

module.exports = UserService;
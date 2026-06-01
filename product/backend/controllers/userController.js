const userService = require("../services/userService");

class UserController {
    static async handleUserReq(req, res, callback) {
        const { name, password } = req.body;
        const isUserDataValid = name && password;

        const dbResponse = isUserDataValid ? await callback(name, password) :
            {
                success: false,
                status: 400,
                message: "Имя и пароль обязательны",
                data: null
            };

        const { success, status, message, data } = dbResponse;

        return res.status(status).json({
            success,
            status,
            message,
            data
        });
    }

    static registerUser(req, res) {
        UserController.handleUserReq(req, res, userService.addUser);
    }

    static loginUser(req, res) {
        UserController.handleUserReq(req, res, userService.getUser);
    }

    static async getAllUsers(req, res) {
        const dbResponse = await userService.getAllUsers();
        const { message, status, success, data } = dbResponse;

        return res.status(status).json({
            success,
            status,
            message,
            data
        });
    }
}

module.exports = UserController;
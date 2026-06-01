const taskService = require("../services/taskService");

class TaskController {
    static getTask(req, res) {
        taskService.getTask();
    }

    static async getAllTasks(req, res) {
        const dbResponse = await taskService.getAllTasks();
        const { message, status, success, data } = dbResponse;

        return res.status(status).json({
            success,
            status,
            message,
            data
        });
    }
}

module.exports = TaskController;
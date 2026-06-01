const express = require("express");
const path = require("path");
const withOpenDbConnection = require("./database");
const userController = require("./controllers/userController");
const taskController = require("./controllers/tasksController");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, "../")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

// app.get("/login", (req, res) => {
//     withOpenDbConnection((db) => {
//         db.get("SELECT 1 FROM users WHERE name = ?", [name], (err, user) => {
//             if (err) {
//                 console.error(err.message);
//                 return;
//             }

//             const userExists = user !== undefined;
//             const passwordValid = password === user.password;

//             if (userExists && passwordValid) {
//                 res.status(200).json({
//                     success: true,
//                     message: "Успешный вход",
//                     user: { id: user.id, username: user.name }
//                 });
//             } else if (!userExists) {
//                 res.status(404).json({
//                     success: false,
//                     message: "Пользователь не найден"
//                 })
//             } else {
//                 res.status(401).json({
//                     success: false,
//                     message: "Неправильный пароль"
//                 })
//             }
//         })
//     }
//     );
// });

app.post("/login", userController.loginUser);
app.post("/registration", userController.registerUser);

app.get("/users", userController.getAllUsers);
app.get("/tasks", taskController.getAllTasks);

// app.post("/users", (req, res) => {
//     addUser(req.body.name, req.body.password)
// });

// app.get("/tasks", (req, res) => {
//     db.all("SELECT * FROM tasks", [], (err, rows) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }

//         res.json(rows);
//     });
// });

// app.post("/tasks", (req, res) => {
//     const task = req.body;

//     if (!task ||
//         !(typeof task === "object") ||
//         !task.name ||
//         !task.paragraph ||
//         !task.challenges ||
//         !(typeof task.challenges === "object")) {
//         return res.status(400).json({ error: "Данные не соответствуют формату отправки!" });
//     }

//     const {
//         name,
//         paragraph,
//         challenges
//     } = task;

//     for (const key in challenges) {
//         const challenge = challenges[key];

//         if (!challenge.question ||
//             !challenge.vars ||
//             !challenge.answer
//         ) {
//             return res.status(400).json({ error: "Данные не соответствуют формату отправки!" });
//         }
//     }

//     db.run("BEGIN TRANSACTION;");

//     const insertStmt = db.prepare(`
//         INSERT INTO challenges (question, vars, answer) VALUES (?, ?, ?)
//     `);

//     let insertCount = 0;
//     let errors = [];

//     for (const key in challenges) {
//         const challenge = challenges[key];

//         insertStmt.run([
//             challenge.question, challenge.vars.join(","), challenge.answer
//         ], function (err) {
//             if (err) {
//                 errors.push({ key, error: err.message, challenge })
//             } else {
//                 insertCount++;
//             }

//             if (key === Object.keys(challenges).length) {
//                 insertStmt.finalize(() => {
//                     if (errors.length > 0) {
//                         db.run("ROLLBACK;", () => {
//                             res.status(400).json({
//                                 message: "Some records failed to insert",
//                                 inserted: insertCount,
//                                 errors
//                             })
//                         });
//                     } else {
//                         db.run("COMMIT;", () => {
//                             res.json({
//                                 message: "All users inserted successfully",
//                                 count: insertCount
//                             });
//                         });
//                     }
//                 });
//             }
//         });
//     }

//     db.run(
//         `INSERT INTO tasks (name, paragraph) VALUES (?, ?)`,
//         [name, paragraph],
//         function (err) {
//             if (err) {
//                 res.status(400).json({ error: err.message });
//                 return;
//             }

//             res.json({ id: this.lastID, name, paragraph });
//         }
//     );
// });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
const TABLES = {
    users: `
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL, 
        password TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL
    `,
    tasks: `
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        paragraph TEXT NOT NULL
    `,
    challenges: `
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        vars TEXT NOT NULL,
        answer TEXT NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    `
};

module.exports = TABLES;
const hasCorrectType = require("./helpers/hasCorrectType");
const sqlite3 = require("sqlite3").verbose();
const TABLES = require("./databaseTables");

createTables(TABLES);

async function withOpenDbConnection(callback) {
    const db = new sqlite3.Database("./db.sqlite", (err) => {
        if (err) {
            console.error("Database connection error: ", err.message);
        } else {
            console.log("Successfully connected to the database");
        }
    });

    await callback(db);

    db.close((err) => {
        if (err) {
            console.error("Database closing error: ", err.message);
        } else {
            console.log("The database connection was closed successfully")
        }
    });
}

function createTable(name, fieldsString) {
    const sql = `
        CREATE TABLE IF NOT EXISTS ${name} (
            ${fieldsString}
        )
    `;

    withOpenDbConnection((db) => {
        db.run(sql, (err) => {
            if (err) {
                console.error(`Unable to initialize ${name} table: `, err.message);
                return;
            }

            console.log(`The ${name} table is existing or was created successfully`);
        });
    });
}

function createTables(tablesList) {
    if (!(hasCorrectType(tablesList, "object"))) {
        console.error("Tables List type must be an object");
        return;
    }

    for (const name in tablesList) {

        if (!tablesList.hasOwnProperty(name)) {
            continue;
        }

        const fieldsString = tablesList[name];

        if (!fieldsString ||
            !(hasCorrectType(fieldsString, "string"))
        ) {
            console.error(`fieldsString type of the ${name} table must be a string`);
            return;
        }

        createTable(name, fieldsString);
    }
}

module.exports = withOpenDbConnection;
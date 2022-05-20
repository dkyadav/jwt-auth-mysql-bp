const mysql = require('mysql2');

const database = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'test',
    connectionLimit: 10
}

let globPool = {};

const getPool = async (db) => {

    if (db == undefined) { db = database; } //if db is not provided, use default db 

    let pool = db.host;
    pool = pool.split('.').join('_');

    try {
        //if pool exists
        if (globPool.hasOwnProperty(pool)) {

            console.log('pool exists');

        } else {

            globPool[pool] = await mysql.createPool(db);

            globPool[pool].on('error', (error) => {
                console.log(error);
                if (error.fatal) {
                    delete globPool[pool]; //delete the pool so it can reconnect on next call
                }
            });

            globPool[pool].on('connection', (connection) => {
                console.log("Connected", connection.threadId);
            });

            globPool[pool].on('release', (connection) => {
                console.log('connection %d released:', connection.threadId);
            })

            globPool[pool].on('acquire', (connection) => {
                console.log('Connection %d acquired', connection.threadId);

            });

        }

        return globPool[pool];

    } catch (err) {
        console.log(`getPool => error ${err.message}`);
        return {
            error: err.message
        };
    }
}


// Function for make connection and return pool to call prepare and query
const executeQuery = async (pool = globPool[pool], SQL, argumentsArray) => {
    try {
        const promisePool = pool.promise();
        return await promisePool.execute(SQL, argumentsArray);
    }
    catch (err) {
        return { error: err.message, code: err.code };
    }
}


// Function for make connection and return pool to call query
const query = async (pool = globPool[pool], SQL, argumentsArray) => {
    try {
        const promisePool = pool.promise();
        return await promisePool.query(SQL, argumentsArray);
    }
    catch (err) {
        return { error: err.message, code: err.code };
    }
}



module.exports = {
    getPool,
    executeQuery,
    query
}

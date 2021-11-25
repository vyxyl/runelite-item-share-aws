const MONGODB_SYNC_FREQUENCY_MS = 15 * 1000;

const AWS = require('aws-sdk');
const client = new AWS.SecretsManager({ region: "us-east-2" });
const MongoClient = require("mongodb").MongoClient;

exports.handler = async(event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;
        const groupId = getGroupId(event);
        if (groupId) {
            const players = await getPlayers(groupId);
            return success(players);
        } else {
            return badRequest();
        }
    } catch (error) {
        return serverError();
    }
};

function getGroupId(event) {
    const params = event["queryStringParameters"];
    const groupId = params ? params['groupId'] : undefined;
    return typeof groupId === 'string' ? groupId : undefined;
}

async function getPlayers(groupId) {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
        db.collection("players").find({ groupId }, { sort: { name: 1 } }).toArray((error, items) => error ? reject(error) : resolve(items));
    });
}

// common
function serverError(message = "") {
    return {
        statusCode: 500,
        body: JSON.stringify({ message })
    };
}

function badRequest(message = "") {
    return {
        statusCode: 400,
        body: JSON.stringify({ message })
    };
}

function success(data = {}) {
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
}

let dbCache = null;

async function getDatabase() {
    const secrets = await getDatabaseSecrets();
    if (dbCache) {
        return dbCache;
    } else {
        const client = await MongoClient.connect(getConnectionString(secrets));
        dbCache = client.db(secrets.database);
        return dbCache;
    }
}

function getConnectionString(secrets) {
    return "mongodb+srv://" + secrets.username + ":" + secrets.password + "@" + secrets.cluster + "/" + secrets.database +
        "?retryWrites=true" +
        "&w=majority" +
        "&heartbeatFrequencyMS=" + MONGODB_SYNC_FREQUENCY_MS;
}

function getDatabaseSecrets() {
    return new Promise((resolve, reject) => {
        client.getSecretValue({ SecretId: "item-share-mongodb" }, (error, data) => {
            try {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(data.SecretString))
                }
            } catch (error) {
                reject(error)
            }
        });
    });
}
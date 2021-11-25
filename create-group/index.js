const MONGODB_SYNC_FREQUENCY_MS = 15 * 1000;

const AWS = require('aws-sdk');
const client = new AWS.SecretsManager({ region: "us-east-2" });
const MongoClient = require("mongodb").MongoClient;
const { "v4": uuidv4 } = require('uuid');

exports.handler = async(event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const db = await getDatabase();

    const doc = {
        id: uuidv4(),
        players: []
    };

    await db.collection("groups").insertOne(doc);

    const response = {
        statusCode: 200,
        body: JSON.stringify(doc)
    };

    return response;
};

// common

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
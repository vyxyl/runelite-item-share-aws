const MONGODB_SYNC_FREQUENCY_MS = 15 * 1000;

const AWS = require('aws-sdk');
const client = new AWS.SecretsManager({ region: "us-east-2" });
const MongoClient = require("mongodb").MongoClient;

exports.handler = async(event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;
        const id = getId(event);
        const player = getPlayer(event);
        if (id && player) {
            const group = await updateGroup(id, player);
            return success(group);
        } else {
            return badRequest();
        }
    } catch (error) {
        return serverError();
    }
};

function getId(event) {
    const queryStringParameters = event["queryStringParameters"];
    const id = queryStringParameters ? queryStringParameters['id'] : undefined;
    return id;
}

function getPlayer(event) {
    return event.body;
}

async function updateGroup(id, player) {
    const db = await getDatabase();
    db.collection("groups").updateOne({ id, players: { $elemMatch: { name: player.name } } }, { $addToSet: { players: player }, $set: { updatedDate: new Date() } }, { upsert: true });
    return {};
}

// common
function serverError() {
    return {
        statusCode: 500,
        body: JSON.stringify({})
    };
}

function badRequest() {
    return {
        statusCode: 400,
        body: JSON.stringify({})
    };
}

function success(doc) {
    return {
        statusCode: 200,
        body: JSON.stringify(doc)
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
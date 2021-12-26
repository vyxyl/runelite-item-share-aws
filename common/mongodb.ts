import { Db, MongoClient } from 'mongodb';

const MONGODB_SYNC_FREQUENCY_MS = 15 * 1000;

let db: any = null;

export async function getDatabase(): Promise<Db> {
  return db ? db : await getNewDatabase();
}

async function getNewDatabase() {
  const url = getConnectionUrl();
  const client = await MongoClient.connect(url);
  db = client.db(process.env.MONGO_DB_DATABASE);
  return db;
}

export function getConnectionUrl() {
  return (
    'mongodb+srv://' +
    process.env.MONGO_DB_USERNAME +
    ':' +
    process.env.MONGO_DB_PASSWORD +
    '@' +
    process.env.MONGO_DB_CLUSTER +
    '/' +
    process.env.MONGO_DB_DATABASE +
    '?retryWrites=true' +
    '&w=majority' +
    '&heartbeatFrequencyMS=' +
    MONGODB_SYNC_FREQUENCY_MS
  );
}

export function getDatabaseSecrets(): any {
  return process.env.MONGO_DB_SECRETS
    ? JSON.parse(process.env.MONGO_DB_SECRETS)
    : {};
}

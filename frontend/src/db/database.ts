import { RxCollection, RxDatabase, RxStorage, addRxPlugin } from "rxdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { createRxDatabase } from "rxdb";

import { initialItems } from "./data";
import { Item } from "./types";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

const env = process.env.NODE_ENV || "development";

if (env === "development") {
  addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBQueryBuilderPlugin);

export type ItemCollection = RxCollection<Item>;
type DatabaseCollections = {
  items: ItemCollection;
};
export type Database = RxDatabase<DatabaseCollections>;

export async function createDatabase(
  storage?: RxStorage<unknown, unknown>
): Promise<Database> {
  const database: Database = await createRxDatabase({
    name: "cookie",
    storage: storage || getRxStorageMemory(),
  });

  const itemSchema = {
    version: 0,
    primaryKey: "name",
    type: "object",
    properties: {
      name: {
        type: "string",
        maxLength: 200, // <- the primary key must have set maxLength
      },
      active: {
        type: "boolean",
      },
    },
    required: ["name", "active"],
  } as const;

  await database.addCollections({
    items: {
      schema: itemSchema,
    },
  });

  return database;
}

export async function insertDefaultData(database: Database) {
  await database.items.bulkInsert(initialItems);
}

export async function initialize() {
  const storage = env !== "development" ? getRxStorageDexie() : undefined;
  const db = await createDatabase(storage);
  await insertDefaultData(db);
  return db;
}

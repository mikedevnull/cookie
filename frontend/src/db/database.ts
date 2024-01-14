import { RxCollection, RxDatabase, RxStorage, addRxPlugin } from "rxdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration-schema";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { createRxDatabase } from "rxdb";

import { initialItems } from "./data";
import { Item } from "./types";
const env = process.env.NODE_ENV || "development";

if (env === "development") {
  addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBMigrationPlugin);

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
    version: 1,
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
      rankOrder: {
        type: "number",
      },
    },
    required: ["name", "active"],
  } as const;

  await database.addCollections({
    items: {
      schema: itemSchema,
      migrationStrategies: {
        1: function (oldDoc) {
          oldDoc.rankOrder = 0;
          return oldDoc;
        },
      },
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
  if (env === "development") {
    await insertDefaultData(db);
  }
  return db;
}

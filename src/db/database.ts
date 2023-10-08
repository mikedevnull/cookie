import { RxCollection, RxDatabase, RxStorage, addRxPlugin } from "rxdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { createRxDatabase } from "rxdb";

import { initialItems } from "./data";
import { Item } from "./types";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";

if (import.meta.env.DEV) {
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
    ignoreDuplicate: true,
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
  const db = await createDatabase();
  await insertDefaultData(db);
  return db;
}

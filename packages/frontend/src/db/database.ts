import {
  type RxCollection,
  type RxDatabase,
  type RxStorage,
  addRxPlugin,
  removeRxDatabase,
} from "rxdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration-schema";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { createRxDatabase } from "rxdb";
import { itemListSchema, itemSchema, type Item, type ItemList } from "./schema";

if (import.meta.env.DEV) {
  addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBMigrationPlugin);

export type ItemListCollection = RxCollection<ItemList>;
export type ItemCollection = RxCollection<Item>;
type DatabaseCollections = {
  itemLists: ItemListCollection;
  items: Item;
};
export type Database = RxDatabase<DatabaseCollections>;

type DatabaseCreationOptions = {
  ignoreDuplicate?: boolean;
  storage?: RxStorage<unknown, unknown>;
};

export async function createDatabase({
  storage,
  ignoreDuplicate = false,
}: DatabaseCreationOptions = {}): Promise<Database> {
  const database: Database = await createRxDatabase({
    name: "cookie",
    storage: storage || getRxStorageMemory(),
    ignoreDuplicate,
    closeDuplicates: true,
  });

  await database.addCollections({
    itemLists: {
      schema: itemListSchema,
    },
    items: {
      schema: itemSchema,
    },
  });

  return database;
}

export async function initialize() {
  const storage = import.meta.env.PROD
    ? getRxStorageDexie()
    : wrappedValidateAjvStorage({ storage: getRxStorageDexie() });
  const db = await createDatabase({ storage });
  return db;
}

export async function clearDatabase() {
  await removeRxDatabase("cookie", getRxStorageDexie());
}

import {
  type RxCollection,
  type RxDatabase,
  type RxStorage,
  addRxPlugin,
  nativeSha256,
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
import { hash } from "ohash";
if (import.meta.env.DEV) {
  addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBMigrationPlugin);

export type ItemListCollection = RxCollection<ItemList>;
export type ItemCollection = RxCollection<Item>;
type DatabaseCollections = {
  itemLists: ItemListCollection;
  items: ItemCollection;
};
export type Database = RxDatabase<DatabaseCollections>;

type DatabaseCreationOptions = {
  ignoreDuplicate?: boolean;
  storage?: RxStorage<unknown, unknown>;
};

const hashFunction: (input: string) => Promise<string> =
  crypto?.subtle?.digest === undefined
    ? nativeSha256
    : (input) => Promise.resolve(hash(input));

export async function createDatabase({
  storage,
  ignoreDuplicate = false,
}: DatabaseCreationOptions = {}): Promise<Database> {
  const database: Database = await createRxDatabase({
    name: "cookie",
    storage: storage || getRxStorageMemory(),
    ignoreDuplicate,
    closeDuplicates: true,
    hashFunction,
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

let dbCreation: Promise<Database> | undefined = undefined;

export async function initialize(): Promise<Database> {
  if (dbCreation) {
    return dbCreation;
  }
  const storage = import.meta.env.PROD
    ? getRxStorageDexie()
    : wrappedValidateAjvStorage({ storage: getRxStorageDexie() });
  dbCreation = createDatabase({ storage });

  return dbCreation;
}

export async function clearDatabase(db?: Database) {
  if (db) {
    await db.remove();
  } else {
    await removeRxDatabase("cookie", getRxStorageDexie());
  }
}

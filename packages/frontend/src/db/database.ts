import { type RxCollection, type RxDatabase, type RxStorage, addRxPlugin, removeRxDatabase } from "rxdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { RxDBMigrationPlugin } from "rxdb/plugins/migration-schema";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { createRxDatabase } from "rxdb";

import { type Item } from "./types";


if (import.meta.env.DEV) {
    addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBMigrationPlugin);

export type ItemCollection = RxCollection<Item>;
type DatabaseCollections = {
    items: ItemCollection;
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

    const itemListSchema = {
        version: 0,
        primaryKey: "id",
        type: "object",
        properties: {
            id: {
                type: "string",
                maxLength: 200, // <- the primary key must have set maxLength
                final: true,
            },
            label: {
                type: "string",
                maxLength: 255,
            },
            categories: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            maxLength: 200,
                            final: true,
                        },
                        label: {
                            type: "string",
                        }
                    },
                    required: ["id", "label"]
                }
            },
             items: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            maxLength: 200,
                        },
                        checked: {
                            type: "boolean",
                        },
                        category: {
                            type: "string",
                        }
                    },
                    required: ["name", "checked"]
                }
            },
        },
        required: ["label", "id", "categories", "items" ],
    } as const;

    await database.addCollections({
        itemLists: {
            schema: itemListSchema,
        },
    });

    return database;
}

export async function initialize() {
    const storage = import.meta.env.PROD ? getRxStorageDexie() : wrappedValidateAjvStorage({ storage: getRxStorageDexie() })
    const db = await createDatabase({ storage });
    return db;
}

export async function clearDatabase() {
    await removeRxDatabase('cookie', getRxStorageDexie())
}
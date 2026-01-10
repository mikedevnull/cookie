import { type ExtractDocumentTypeFromTypedRxJsonSchema } from "rxdb";

export const itemListSchema = {
    version: 0,
    primaryKey: "id",
    type: "object",
    properties: {
        id: {
            type: "string",
            maxLength: 255, // <- the primary key must have set maxLength
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
                        maxLength: 255,
                        final: true,
                    },
                    label: {
                        type: "string",
                    },
                },
                required: ["id", "label"]
            },
        }
    },
    required: ["label", "id", "categories"],
} as const;

export const itemSchema = {
    version: 0,
    primaryKey: {
        key: 'id',
        fields: [
            'name',
            'listId'
        ],
        // separator which is used to concat the fields values.
        separator: '|'
    },
    type: "object",
    properties: {
        id: {
            type: "string",
            maxLength: 255
        },
        name: {
            type: "string",
            maxLength: 200,
        },
        listId: {
            type: "string",
            maxLength: 50,
            final: true,
        },
        checked: {
            type: "boolean",
            default: false,
        },
        category: {
            type: "string",
            maxLength: 255,
        },
        rankOrder: {
            type: "number",
        }
    },
    required: ["id", "name", "listId", "checked", "category", "rankOrder"]
} as const;


export type ItemList = ExtractDocumentTypeFromTypedRxJsonSchema<typeof itemListSchema>
export type Category = ItemList['categories'][number]
export type Item = ExtractDocumentTypeFromTypedRxJsonSchema<typeof itemSchema>
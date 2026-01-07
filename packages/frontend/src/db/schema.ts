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

            },
            required: ["id", "label", "items"]
        }
    },
    required: ["label", "id", "categories"],
} as const;

export const itemSchema = {
    version: 0,
    primaryKey: "name",
    type: "object",
    properties: {
        name: {
            type: "string",
            maxLength: 255,
        },
        listId: {
            type: "string",
            maxLength: 255,

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
    required: ["name", "listId", "checked", "category", "rankOrder"]
} as const;


export type ItemList = ExtractDocumentTypeFromTypedRxJsonSchema<typeof itemListSchema>
export type Category = ItemList['categories'][number]
export type Item = ExtractDocumentTypeFromTypedRxJsonSchema<typeof itemSchema>
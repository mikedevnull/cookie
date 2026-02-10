import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { createDatabase, type Database } from "./database";
import {
  addNewCategory,
  changeCategoryLabel,
  changeItemCategory,
  deleteCategory,
  insertOrUncheckItem,
  moveCategory,
} from "./utilts";
import type { ItemList } from "./schema";
import type { RxDocument } from "rxdb";

describe("Database utils", function () {
  let db: Database;
  let itemList: RxDocument<ItemList>;

  beforeEach(async function () {
    const storage = wrappedValidateAjvStorage({
      storage: getRxStorageMemory(),
    });
    db = await createDatabase({ storage });
    itemList = await db.collections.itemLists.insert({
      id: "0",
      label: "TestList",
      categories: [
        { id: "categoryA", label: "A" },
        { id: "categoryB", label: "B" },
        { id: "categoryC", label: "C" },
      ],
    });
  });
  afterEach(async function () {
    await db?.remove();
  });

  describe("Category utils", function () {
    it("addNewCategory adds a new category to the end the list", async function () {
      await addNewCategory("New Category", itemList);
      const modifiedList = await db.collections.itemLists
        .findOne()
        .where("id")
        .equals("0")
        .exec();
      expect(modifiedList?.categories).toContainEqual({
        id: expect.any(String),
        label: "New Category",
      });
    });

    it("deleteCategory removes a new category from the list", async function () {
      await deleteCategory("categoryA", itemList);
      const modifiedList = await db.collections.itemLists
        .findOne()
        .where("id")
        .equals("0")
        .exec();
      expect(modifiedList?.categories).not.toContainEqual({
        id: "categoryA",
        label: "A",
      });
      expect(modifiedList?.categories).toHaveLength(2);
    });

    it("moveCategory changes order of the categories", async function () {
      await moveCategory("categoryC", "categoryA", itemList);
      const modifiedList = await db.collections.itemLists
        .findOne()
        .where("id")
        .equals("0")
        .exec();
      const categoryLabels = modifiedList?.categories.map((c) => c.label);
      expect(categoryLabels).toEqual(["C", "A", "B"]);
    });

    it("changeCategoryLabel changes label of a category", async function () {
      await changeCategoryLabel("New Category Label", "categoryB", itemList);
      const modifiedList = await db.collections.itemLists
        .findOne()
        .where("id")
        .equals("0")
        .exec();
      expect(modifiedList?.categories).toHaveLength(3);
      expect(modifiedList?.categories).toContainEqual({
        id: "categoryB",
        label: "New Category Label",
      });
    });
  });

  describe("item utils", function () {
    beforeEach(async function () {
      await db.collections.items.insert({
        id: db.collections.items.schema.getPrimaryOfDocumentData({
          name: "SomeItem",
          listId: "0",
        }),
        name: "SomeItem",
        checked: true,
        listId: "0",
        category: "",
        rankOrder: 0,
      });
      await db.collections.items.insert({
        id: db.collections.items.schema.getPrimaryOfDocumentData({
          name: "OtherItem",
          listId: "0",
        }),
        name: "OtherItem",
        checked: false,
        listId: "0",
        category: "",
        rankOrder: 10,
      });
    });
    describe("insertOrUncheckItem", function () {
      it("inserts a new item if it does not exists", async function () {
        await insertOrUncheckItem(db.collections.items, "New item", "0", {
          category: "foo",
          rankOrder: 20,
        });
        const item = await db.collections.items
          .findOne()
          .where("name")
          .equals("New item")
          .exec();
        expect(item?.toJSON()).toEqual({
          name: "New item",
          listId: "0",
          category: "foo",
          rankOrder: 20,
          checked: false,
          id: expect.any(String),
        });
      });

      it("updates status of existing item if checked", async function () {
        await insertOrUncheckItem(db.collections.items, "SomeItem", "0", {
          category: "foo",
          rankOrder: 20,
        });
        const item = await db.collections.items
          .findOne()
          .where("name")
          .equals("SomeItem")
          .exec();
        expect(item?.toJSON()).toEqual({
          name: "SomeItem",
          listId: "0",
          category: "",
          rankOrder: 0,
          checked: false,
          id: expect.any(String),
        });
      });

      it("Does not change existing item if already unchecked", async function () {
        await insertOrUncheckItem(db.collections.items, "OtherItem", "0", {
          category: "foo",
          rankOrder: 20,
        });
        const item = await db.collections.items
          .findOne()
          .where("name")
          .equals("OtherItem")
          .exec();
        expect(item?.toJSON()).toEqual({
          name: "OtherItem",
          listId: "0",
          category: "",
          rankOrder: 10,
          checked: false,
          id: expect.any(String),
        });
      });
    });

    it("does change an items category", async function () {
      const item = await db.collections.items
        .findOne()
        .where("name")
        .equals("OtherItem")
        .exec();
      expect(item).toBeDefined();
      expect(item?.category).not.toBe("categoryA");
      if (item) {
        await changeItemCategory(item, "categoryA");
      }
      const changedItem = await db.collections.items
        .findOne()
        .where("name")
        .equals("OtherItem")
        .exec();
      expect(changedItem).toBeDefined();
      expect(changedItem?.category).toBe("categoryA");
    });
  });
});

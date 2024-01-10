import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import "@testing-library/react";
import { Database, createDatabase } from "@/db";
import { createRenderWithDb } from "./render";

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

export interface DbTestContext {
  db: Database;
  render: (children: React.ReactElement) => void;
}

beforeEach<DbTestContext>(async (context) => {
  context.db = await createDatabase();
  context.render = createRenderWithDb(context.db);
});

afterEach<DbTestContext>(async (context) => {
  await context.db.remove();
});

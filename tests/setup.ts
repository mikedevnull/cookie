import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Database, createDatabase } from "@/db";
import { createRenderWithDb } from "./render";

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
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

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

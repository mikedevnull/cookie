import "@testing-library/jest-dom";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

beforeAll(() => {
  const _jest = globalThis.jest;

  globalThis.jest = {
    ...globalThis.jest,
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
  };

  return () => void (globalThis.jest = _jest);
});

import {
  RenderOptions,
  render as testingLibraryRender,
} from "@testing-library/react";
import React from "react";
import { Database } from "@/db";
import { Provider } from "rxdb-hooks";

export function renderWithDb(
  db: Database,
  ui: React.ReactElement,
  options?: RenderOptions
) {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return <Provider db={db}>{children}</Provider>;
  };

  return testingLibraryRender(ui, { wrapper: AllProviders, ...options });
}

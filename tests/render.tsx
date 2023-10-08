import {
  RenderOptions,
  render as testingLibraryRender,
} from "@testing-library/react";
import React from "react";
import { MantineProvider } from "@mantine/core";
import { DEFAULT_THEME } from "@mantine/core";
import { Database } from "@/db";
import { Provider } from "rxdb-hooks";

export function render(
  ui: React.ReactElement,
  db?: Database,
  options?: RenderOptions
) {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider db={db}>
        <MantineProvider theme={DEFAULT_THEME}>{children}</MantineProvider>
      </Provider>
    );
  };

  return testingLibraryRender(ui, { wrapper: AllProviders, ...options });
}

export function createRenderWithDb(db: Database) {
  return (children: React.ReactElement) => {
    return render(<Provider db={db}>{children}</Provider>);
  };
}

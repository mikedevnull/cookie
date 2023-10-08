import {
  RenderOptions,
  render as testingLibraryRender,
} from "@testing-library/react";
import React from "react";
import { MantineProvider } from "@mantine/core";
import { DEFAULT_THEME } from "@mantine/core";

export function render(ui: React.ReactElement, options?: RenderOptions) {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return <MantineProvider theme={DEFAULT_THEME}>{children}</MantineProvider>;
  };

  return testingLibraryRender(ui, { wrapper: AllProviders, ...options });
}

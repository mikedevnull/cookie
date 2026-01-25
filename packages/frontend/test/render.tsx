import { render, type RenderOptions } from "vitest-browser-react";
import type { Database } from "../src/db/database";
import { Provider } from "rxdb-hooks"

export function renderWithDb(
  db: Database,
  ui: React.ReactElement,
  options?: RenderOptions
) {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return <Provider db={db}>{children}</Provider>;
  };

  return render(ui, { wrapper: AllProviders, ...options });
}
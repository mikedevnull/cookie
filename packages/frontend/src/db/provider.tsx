import { useEffect, useState } from "react";
import { clearDatabase, type Database, initialize } from "./database";
import { Provider } from "rxdb-hooks";
import React from "react";

type DatabaseConstructor = () => Promise<Database>;
type Props = React.PropsWithChildren<{
  databaseConstructor?: DatabaseConstructor;
}>;

export const DatabaseProvider = ({
  children,
  databaseConstructor = initialize,
}: Props) => {
  const [db, setDb] = useState<Database>();

  useEffect(() => {
    databaseConstructor().then(setDb);
  }, [databaseConstructor]);

  let resetDatabaseButton;
  if (import.meta.env.DEV) {
    resetDatabaseButton = (
      <button className="btn"
        onClick={() => {
          clearDatabase(db);
          window.location.reload();
        }}
      >
        Clear database
      </button>
    );
  }

  return (
    <Provider db={db}>
      {children}
      {resetDatabaseButton}
    </Provider>
  );
};

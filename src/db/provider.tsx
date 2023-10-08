import { useEffect, useState } from "react";
import { Database, initialize } from ".";
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

  return <Provider db={db}>{children}</Provider>;
};

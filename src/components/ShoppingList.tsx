import { Item, ItemCollection } from "@/db";
import {
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { TransitionGroup } from "react-transition-group";

import { RxDocument } from "rxdb";
import { useRxData } from "rxdb-hooks";

export default function ShoppingList() {
  const { result: items } = useRxData("items", (collection: ItemCollection) =>
    collection?.find({
      selector: {
        active: true,
      },
    })
  );

  const itemSelectedCallback = (item: Item) => {
    const document = items.find(
      (doc: RxDocument<Item>) => doc.name === item.name
    );
    if (document) {
      document.patch({ active: !item.active });
    }
  };

  const renderedItems = items.map((i, index) => {
    const labelId = `checkbox-list-label-${index}`;

    return (
      <Collapse key={i.name}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => itemSelectedCallback(i)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={i.active === false}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={i.name} />
          </ListItemButton>
        </ListItem>
      </Collapse>
    );
  });

  return (
    <section>
      <List>
        <TransitionGroup>{renderedItems}</TransitionGroup>
      </List>
    </section>
  );
}

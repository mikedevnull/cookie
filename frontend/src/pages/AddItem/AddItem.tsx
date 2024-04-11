import { IconButton, Button, Container, TextField } from "@mui/material";

import BackIcon from "@mui/icons-material/ArrowBack";
import { Form, Link } from "react-router-dom";
import { AppNavBar } from "@/components/AppNavBar";

export default function AddItem() {
  const BackAction = (
    <IconButton
      edge="start"
      color="inherit"
      component={Link}
      to="/"
      aria-label="back"
    >
      <BackIcon />
    </IconButton>
  );

  return (
    <>
      <Form method="post">
        <AppNavBar leftAction={BackAction} title="Add item">
          <Button color="inherit" type="submit">
            add
          </Button>
        </AppNavBar>
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
          <TextField
            fullWidth
            name="itemName"
            autoFocus
            label="Add new or existing item"
          />
        </Container>
      </Form>
    </>
  );
}

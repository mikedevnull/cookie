import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AddItemSection from "./AddItemSection";
import { DbTestContext } from "@testing/setup";

function sleepForMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

test<DbTestContext>("Adds new items to the database", async ({
  db,
  render,
}) => {
  const user = userEvent.setup();

  render(<AddItemSection />);

  await expect(
    db.collections.items.findOne("Foobar").exec()
  ).resolves.toBeNull();

  const input = await screen.findByLabelText<HTMLInputElement>("Add item");
  expect(input).toBeDefined();

  await user.type(input, "Foobar");
  expect(input.value).toBe("Foobar");
  await user.type(input, "{Enter}");
  expect(input.value).toBe("");
  const newItem = await db.collections.items.findOne("Foobar").exec();
  expect(newItem).not.toBeNull();
  expect(newItem).toMatchObject({ name: "Foobar", active: true });
});

test<DbTestContext>("Modifies existing items in the database", async ({
  db,
  render,
}) => {
  const user = userEvent.setup();

  render(<AddItemSection />);

  await db.collections.items.insert({ name: "Foobar", active: false });

  const input = await screen.findByLabelText("Add item");
  expect(input).toBeDefined();

  await user.type(input, "Foobar");
  await user.type(input, "{Enter}");
  const newItem = await db.collections.items.findOne("Foobar").exec();
  expect(newItem).toMatchObject({ name: "Foobar", active: true });
});

test<DbTestContext>("Updates search input with more than three character entered", async ({
  render,
}) => {
  const user = userEvent.setup();
  const mockSearchCallback = vi.fn();

  render(<AddItemSection searchFilterCallback={mockSearchCallback} />);
  const input = await screen.findByLabelText("Add item");
  await user.type(input, "123");

  // wait for any debounce interval to happen
  // await sleepForMs(500);
  expect(mockSearchCallback).not.toHaveBeenCalled();
});

test<DbTestContext>("Updates search input with more than three character entered", async ({
  render,
}) => {
  const user = userEvent.setup();
  const mockSearchCallback = vi.fn();

  render(<AddItemSection searchFilterCallback={mockSearchCallback} />);

  const input = await screen.findByLabelText("Add item");
  await user.type(input, "123");

  await user.type(input, "45");
  await sleepForMs(50);
  await user.type(input, "67");

  await sleepForMs(400);
  expect(mockSearchCallback).toHaveBeenCalledOnce();
  expect(mockSearchCallback).toHaveBeenCalledWith("1234567");
});

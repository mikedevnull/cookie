import { render, type RenderResult } from "vitest-browser-react";
import NewItemInput from "./new-item-input";
import { userEvent } from "vitest/browser";

describe("New Item Input", () => {
  const cb = vi.fn();
  let renderResult: RenderResult;

  beforeEach(async () => {
    renderResult = await render(<NewItemInput onNewItemCallback={cb} />);
    cb.mockReset();
  });

  test("No real checkbox is present", async () => {
    const checkbox = renderResult.getByRole("checkbox");
    expect(checkbox).not.toBeInTheDocument();
  });

  test("Entering a new label and pressing the add button will trigger callback", async () => {
    const labelEdit = renderResult.getByRole("textbox");
    const addButton = renderResult.getByRole("button");
    expect(labelEdit).toBeInTheDocument();
    expect(labelEdit).toHaveValue("");

    // ensure twhitespace are trimmed
    await labelEdit.fill(" New item  ");
    await expect.element(labelEdit).toHaveValue(" New item  ")
    await addButton.click();
    expect(cb).toHaveBeenCalledExactlyOnceWith("New item");
    await expect.element(labelEdit).toHaveValue("")
  });

  test("Entering a new label and pressing enter will trigger callback", async () => {
    const labelEdit = renderResult.getByRole("textbox");
    expect(labelEdit).toBeInTheDocument();
    expect(labelEdit).toHaveValue("");

    // ensure twhitespace are trimmed
    await userEvent.type(labelEdit, " New item  {Enter}");
    expect(cb).toHaveBeenCalledExactlyOnceWith("New item");
    await expect.element(labelEdit).toHaveValue("")
  });

  test("Entering an empty label will not trigger callback", async () => {
    const labelEdit = renderResult.getByRole("textbox");
    expect(labelEdit).toBeInTheDocument();
    expect(labelEdit).toHaveValue("");

    await labelEdit.fill("");
    await userEvent.tab();
    expect(cb).not.toHaveBeenCalled();
  });

  test("Entering an empty label and pressing enter will not trigger callback", async () => {
    const labelEdit = renderResult.getByRole("textbox");
    expect(labelEdit).toBeInTheDocument();
    expect(labelEdit).toHaveValue("");

    await labelEdit.fill("");
    await userEvent.keyboard("{Enter}");
    expect(cb).not.toHaveBeenCalled();
  });
});

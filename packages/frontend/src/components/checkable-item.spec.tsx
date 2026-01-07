import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import CheckableItem from "./checkable-item";
import { userEvent } from "vitest/browser";

describe("Checkable Item Editor", () => {
  const label = "Test Label";
  const cb = vi.fn();

  beforeEach(() => {
    cb.mockReset();
  });

  test("renders the unchecked checkbox correctly", async () => {
    const { getByRole } = await render(
      <CheckableItem label={label} changeCallback={cb} checked={false} />
    );
    const checkbox = getByRole("checkbox", { name: label });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    await checkbox.click();
    expect(cb).toHaveBeenCalledExactlyOnceWith({ checked: true, label: label });
  });

  test("renders the checked checkbox correctly", async () => {
    const { getByRole } = await render(
      <CheckableItem label={label} changeCallback={cb} checked={true} />
    );

    const checkbox = getByRole("checkbox", { name: label });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();

    await checkbox.click();
    expect(cb).toHaveBeenCalledExactlyOnceWith({
      checked: false,
      label: label,
    });
  });

  test("changing label calls callback with new label", async () => {
    const { getByRole } = await render(
      <CheckableItem label={label} changeCallback={cb} checked={false} />
    );

    const labelEdit = getByRole("textbox");
    expect(labelEdit).toBeInTheDocument();
    expect(labelEdit).toHaveValue(label);

    await labelEdit.fill("A new label");
    await userEvent.tab();
    expect(cb).toHaveBeenCalledExactlyOnceWith({
      checked: false,
      label: "A new label",
    });
  });

  test("changing label to empty will call callback with empty label", async () => {
    const { getByRole } = await render(
      <CheckableItem label={label} changeCallback={cb} checked={false} />
    );

    const labelEdit = getByRole("textbox");
    expect(labelEdit).toBeInTheDocument();
    expect(labelEdit).toHaveValue(label);

    await labelEdit.fill("");
    await userEvent.tab();
    expect(cb).toHaveBeenCalledExactlyOnceWith({
      checked: false,
      label: "",
    });
  });

  test("Editing label without changing actual value does not call callback", async () => {
    const { getByRole } = await render(
      <CheckableItem label={label} changeCallback={cb} checked={true} />
    );

    const labelEdit = getByRole("textbox");
    expect(labelEdit).toBeInTheDocument();
    expect(labelEdit).toHaveValue(label);

    await labelEdit.fill(label);
    await userEvent.tab();

    expect(cb).not.toHaveBeenCalled();
  });

  test("Focusing label, entering text and pressing enter changes label", async () => {
    const { getByRole } = await render(
      <CheckableItem label={label} changeCallback={cb} checked={true} />
    );
    const labelEdit = getByRole("textbox");
    await labelEdit.fill("foo");
    await userEvent.keyboard("{Enter}");

    expect(cb).toHaveBeenCalledExactlyOnceWith({ label: "foo", checked: true });
  });
});

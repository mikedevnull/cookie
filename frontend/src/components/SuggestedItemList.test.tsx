import { render } from "@testing-library/react";
import SuggestedItemList from "./SuggestedItemList";
import { Item } from "@/db";

const fakeItems: Item[] = [
  {
    name: "testItem1",
    state: "hidden",
    rankOrder: 0,
  },
  {
    name: "testItem2",
    state: "active",
    rankOrder: 0,
  },
  {
    name: "testItem3",
    state: "active",
    rankOrder: 0,
  },
  {
    name: "testItem4",
    state: "active",
    rankOrder: 0,
  },
];

describe("SuggestedItemList", () => {
  it("Should render active and inactive items correctly", () => {
    const renderedItem = render(<SuggestedItemList items={fakeItems} />);
    expect(renderedItem).toMatchSnapshot();
  });
});

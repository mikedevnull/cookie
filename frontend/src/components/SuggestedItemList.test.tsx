import { render } from "@testing-library/react";
import SuggestedItemList from "./SuggestedItemList";

const fakeItems = [
  {
    name: "testItem1",
    active: false,
    rankOrder: 0,
  },
  {
    name: "testItem2",
    active: true,
    rankOrder: 0,
  },
  {
    name: "testItem3",
    active: true,
    rankOrder: 0,
  },
  {
    name: "testItem4",
    active: true,
    rankOrder: 0,
  },
];

describe("SuggestedItemList", () => {
  it("Should render active and inactive items correctly", () => {
    const renderedItem = render(<SuggestedItemList items={fakeItems} />);
    expect(renderedItem).toMatchSnapshot();
  });
});

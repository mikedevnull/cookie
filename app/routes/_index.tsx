import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="mx-auto xl:max-w-4xl">
      <div className="divide-y-4 w-full">
        <div className="">
          <h2 className="font-bold  ">Section</h2>
          <ul className="list-disc">
            <li>Foo</li>
            <li>Bar</li>
            <li>Baz</li>
          </ul>
        </div>
        <div className="">
          <h2>Section</h2>
          <ul
            style={{
              "list-style-image": "linear-gradient(to left bottom, red, blue)",
            }}
          >
            <li>Foo</li>
            <li>Bar</li>
            <li>Baz</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

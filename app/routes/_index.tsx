import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <Link to="test">Test</Link>
        </li>
        <li>
          <Link to="defer">Defer</Link>
        </li>
        <li>
          <Link to="redirect">Redirect</Link>
        </li>
      </ul>
    </div>
  );
}

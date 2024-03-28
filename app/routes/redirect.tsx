import { redirect } from "@remix-run/node";

export async function loader() {
  throw redirect("/");
}

export default function Component() {
  return null;
}

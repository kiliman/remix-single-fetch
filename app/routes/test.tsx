import { type ActionFunctionArgs } from "@remix-run/node";
import {
  useTypedLoaderData,
  useTypedActionData,
  useTypedRouteLoaderData,
} from "~/hooks";
import { loader as rootLoader } from "~/root";
import { Form } from "@remix-run/react";
export async function loader() {
  return { id: 123, now: new Date() };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = Number(formData.get("id"));
  return { id };
}

export default function Component() {
  const loaderData = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<typeof action>();
  const rootData = useTypedRouteLoaderData<typeof rootLoader>("root");
  return (
    <div>
      <h2>Loader Data</h2>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
      <p>Today is {loaderData.now.toLocaleString()}</p>

      <h2>Action Data</h2>
      <Form method="post">
        <input
          type="text"
          placeholder="Enter numeric id"
          name="id"
          required
          pattern="\d+"
        />
        <button>Submit</button>
      </Form>
      <pre>{JSON.stringify(actionData, null, 2)}</pre>

      <h2>Root Loader Data</h2>
      <pre>{JSON.stringify(rootData, null, 2)}</pre>
    </div>
  );
}

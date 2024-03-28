import { Await } from "@remix-run/react";
import { Suspense } from "react";
import { useTypedLoaderData } from "~/hooks";

export function loader() {
  return {
    fastData: { message: "This is fast data", today: new Date() },
    slowData: new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
      return { message: "This is slow data", tomorrow: new Date() };
    }),
  };
}

export default function DeferRoute() {
  const data = useTypedLoaderData<typeof loader>();

  return (
    <main>
      <h1>Defer Route</h1>
      <h2>Fast Data</h2>
      <p>
        <span>{data.fastData.message}</span> at{" "}
        <span>{data.fastData.today.toLocaleString()}</span>
      </p>
      <Suspense fallback={<p>Loading slow data...</p>}>
        <Await
          resolve={data.slowData}
          errorElement={<p>Error loading slow data!</p>}
        >
          {(slowData) => (
            <p>
              <span>{slowData.message}</span> at{" "}
              <span>{slowData.tomorrow.toLocaleString()}</span>
            </p>
          )}
        </Await>
      </Suspense>
    </main>
  );
}

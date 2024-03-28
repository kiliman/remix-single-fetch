# Remix Single Data Fetch typed data

This example shows how to use the new [Single Data Fetch RFC](https://github.com/remix-run/remix/discussions/7640) coming in Remix v2.19.

⚡️ StackBlitz https://stackblitz.com/edit/remix-run-remix-3phtht?file=README.md

## Configuration

First, enable the `future` flag for this feature in _vite.config.ts_

```ts
export default defineConfig({
  plugins: [
    remix({
      future: {
        unstable_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
});
```

## Returning data

No, in your `loader` and `action`, instead of using the `json` utility to return data, simply return a _naked_ object.

```diff
- return json({ id: 123 })
+ return { id: 123 }
```

In addition to returning all loader data in a single request, this feature will
stream native results automatically. This includes native types like `Date`, `BigInt`,
`Map`, `Set`, and even `Promise` values. You no longer need to use the `defer` utility
to return promises.

See [turbo-stream](https://github.com/jacob-ebey/turbo-stream) for more details.

```ts
export function loader() {
  return {
    fastData: { message: "This is fast data", today: new Date() },
    slowData: new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
      return { message: "This is slow data", tomorrow: new Date() };
    }),
  };
}
```

### Using data

The current `useLoaderData` and `useActionData` hooks currently expect the result to be JSON objects, so native types like `Date` will be treated as `string` via IntelliSense, but it is still actually a `Date`.

To make sure your types are accurate, I've created helper functions that return the correct type (`~/hooks`)

- `useTypedLoaderData`
- `useTypedActionData`
- `useTypedRouteLoaderData`

```ts
export default function Component() {
  const loaderData = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<typeof action>();
  const rootData = useTypedRouteLoaderData<typeof rootLoader>("root");
  //...
}
```

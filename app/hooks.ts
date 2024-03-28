import { LoaderFunction, ActionFunction } from "@remix-run/node";
import {
  useLoaderData,
  useActionData,
  useRouteLoaderData,
} from "@remix-run/react";

export function useTypedLoaderData<T extends LoaderFunction>() {
  return useLoaderData() as unknown as Awaited<ReturnType<T>>;
}

export function useTypedActionData<T extends ActionFunction>() {
  return useActionData() as unknown as Awaited<ReturnType<T>> | undefined;
}

export function useTypedRouteLoaderData<T extends LoaderFunction>(id: string) {
  return useRouteLoaderData(id) as unknown as Awaited<ReturnType<T>>;
}

import { useEffect, useState, createContext, useContext } from "react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import {
  useLoaderData,
  useActionData,
  useRouteLoaderData,
} from "@remix-run/react";
import { decode } from "~/turbo";

export function useTypedLoaderData<T extends LoaderFunction>() {
  return useLoaderData() as unknown as Awaited<ReturnType<T>>;
}

export function useTypedActionData<T extends ActionFunction>() {
  return useActionData() as unknown as Awaited<ReturnType<T>> | undefined;
}

export function useTypedRouteLoaderData<T extends LoaderFunction>(id: string) {
  return useRouteLoaderData(id) as unknown as Awaited<ReturnType<T>>;
}

// EventSource implementation borrowed from `remix-util` package
// Updated to support async data decoding

export interface EventSourceOptions {
  init?: EventSourceInit;
  event?: string;
}

export type EventSourceMap = Map<
  string,
  { count: number; source: EventSource }
>;

const context = createContext<EventSourceMap>(
  new Map<string, { count: number; source: EventSource }>()
);

export const EventSourceProvider = context.Provider;

/**
 * Subscribe to an event source and return the latest event.
 * @param url The URL of the event source to connect to
 * @param options The options to pass to the EventSource constructor
 * @returns The last event received from the server
 */
export function useTypedEventSource<T>(
  url: string | URL,
  { event = "message", init }: EventSourceOptions = {}
): T | null {
  const map = useContext(context);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const key = [url.toString(), init?.withCredentials].join("::");

    const value = map.get(key) ?? {
      count: 0,
      source: new EventSource(url, init),
    };

    ++value.count;

    map.set(key, value);

    value.source.addEventListener(event, handler<T>);

    // reset data if dependencies change
    setData(null);

    // async handler to decode data
    async function handler<T>(event: MessageEvent) {
      const data = await decode<T>(event.data);
      // not sure why data type is Awaited<T> here
      // @ts-expect-error data is of type T
      setData(data);
    }

    return () => {
      value.source.removeEventListener(event, handler);
      --value.count;
      if (value.count <= 0) {
        value.source.close();
        map.delete(key);
      }
    };
  }, [url, event, init, map]);

  return data;
}

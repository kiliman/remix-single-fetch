import { useEventSource } from "remix-utils/sse/react";

export default function Component() {
  return (
    <div>
      <h1>EventSource</h1>
      <Counter />
    </div>
  );
}

function Counter() {
  // Here `/sse/time` is the resource route returning an eventStream response
  const time = useEventSource("/sse/time", { event: "time" });

  if (!time) return null;

  return (
    <time dateTime={time}>
      {new Date(time).toLocaleTimeString("en", {
        minute: "2-digit",
        second: "2-digit",
        hour: "2-digit",
      })}
    </time>
  );
}

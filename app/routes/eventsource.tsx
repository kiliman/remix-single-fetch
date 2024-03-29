import { useTypedEventSource } from "~/hooks";
import { TimeEventType } from "./sse.time";

export default function Component() {
  return (
    <div>
      <h1>Typed Event Source</h1>
      <Counter />
    </div>
  );
}

function Counter() {
  // Here `/sse/time` is the resource route returning an eventStream response
  const time = useTypedEventSource<TimeEventType>("/sse/time", {
    //  ^?
    event: "time",
  });

  if (!time) return null;

  return (
    <>
      <pre>{time.toLocaleString()}</pre>
      <pre>time instanceof Date: {time instanceof Date ? "true" : "false"}</pre>
    </>
  );
}

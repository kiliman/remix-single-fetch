import * as turbo from "turbo-stream";
import { Buffer } from "buffer";

export async function encode<T>(payload: T): Promise<string> {
  const encodedStream = turbo.encode(payload);
  const buffer = await streamToBuffer(encodedStream);
  return buffer.toString("utf-8");
}

export async function decode<T>(encoded: string): Promise<T | null> {
  const buffer = Buffer.from(encoded, "utf-8");
  const stream = bufferToStream(buffer);
  const result = await turbo.decode(stream);
  if (!result.done) return null;
  return result.value as T;
}

async function streamToBuffer(stream: ReadableStream<Uint8Array>) {
  const chunks = [];
  // @ts-expect-error async iterator
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function bufferToStream(buffer: Buffer) {
  const blob = new Blob([buffer]);
  return blob.stream();
}

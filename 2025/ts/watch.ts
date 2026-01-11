import { watch } from "node:fs/promises";
import { $ } from "bun";
import { ass } from "./common.ts";

async function validate(): Promise<void> {
  await $`clear`;
  await $`FORCE_COLOR=true bun watcher`.nothrow();
}

await validate();

const watcher = watch(import.meta.dir, { maxQueue: 1, recursive: true });

let debounceTimer: ReturnType<typeof setImmediate> | null = null;

const gray = (msg: string) => `\x1b[90m${msg}\x1b[0m`;

for await (const event of watcher) {
  const f = event?.filename;
  ass(f);
  if (f.includes("node_modules") || f.includes("coverage")) {
    console.log(gray(`Skipping ${event.eventType} in ${event.filename}`));
  } else {
    console.log(gray(`Detected ${event.eventType} in ${event.filename}`));

    if (debounceTimer) {
      clearImmediate(debounceTimer);
    }

    debounceTimer = setImmediate(async () => {
      await validate();
      debounceTimer = null;
    });
  }
}

import { watch } from "node:fs/promises";
import { $ } from "bun";

async function validate() {
  await $`FORCE_COLOR=1 bun validate --colors=force`.nothrow();
}

await validate();

const watcher = watch(import.meta.dir);

for await (const event of watcher) {
  console.log(`Detected ${event.eventType} in ${event.filename}`);
  await validate();
}

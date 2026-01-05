import { watch } from "node:fs/promises";
import { $ } from "bun";
import { ass } from "./common";

async function validate() {
  await $`FORCE_COLOR=true bun i --silent && bun tsgo --noEmit --pretty && bun test --coverage --coverage-reporter=lcov --only-failures && bun run format --colors=force`.nothrow();
}

await validate();

const watcher = watch(import.meta.dir, { recursive: true, maxQueue: 1 });

let debounceTimer: ReturnType<typeof setImmediate> | null = null;

for await (const event of watcher) {
  const f = event?.filename;
  ass(f);
  if (f.includes("node_modules") || f.includes("coverage")) {
    console.log(`Skipping ${event.eventType} in ${event.filename}`);
  } else {
    console.log(`Detected ${event.eventType} in ${event.filename}`);

    if (debounceTimer) {
      clearImmediate(debounceTimer);
    }

    debounceTimer = setImmediate(async () => {
      await $`clear`;
      await validate();
      debounceTimer = null;
    });
  }
}

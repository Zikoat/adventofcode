import { watch } from "fs";
import { $ } from "bun";

const watcher = watch(import.meta.dir, async (event, filename) => {
  console.log("test");
  await build();
});

async function build() {
  await $`clear`;
//   console.log("build");
  await $`idris2 TheFork.idr --color -Werror -x main`.throws(false);
//   console.log("\nfinish");
}

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  console.log("Closing watcher...");
  watcher.close();

  process.exit(0);
});

console.log("watching");
await build();

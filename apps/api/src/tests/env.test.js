
import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const envModule = pathToFileURL(
  fileURLToPath(new URL("../config/env.js", import.meta.url)),
).href;

describe("Environment configuration", () => {
  it("rejects an invalid port", () => {
    const result = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", `import(${JSON.stringify(envModule)})`],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          NODE_ENV: "test",
          PORT: "70000",
          HOST: "127.0.0.1",
          WEB_ORIGIN: "http://localhost:5173",
          LOG_LEVEL: "info",
        },
      },
    );

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Invalid environment configuration");
  });

  it("rejects an invalid web origin", () => {
    const result = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", `import(${JSON.stringify(envModule)})`],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          NODE_ENV: "test",
          PORT: "4000",
          HOST: "127.0.0.1",
          WEB_ORIGIN: "not-a-url",
          LOG_LEVEL: "info",
        },
      },
    );

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Invalid environment configuration");
  });
});

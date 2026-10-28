
import { afterEach, describe, expect, it, vi } from "vitest";
import { createServer } from "../utils/create-server.js";

describe("API server lifecycle", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = 0;
  });

  it("starts the server with the configured host and port", async () => {
    const app = {
      listen: vi.fn((_port, _host, callback) => {
        callback();
        return { close: vi.fn() };
      }),
    };

    const logger = {
      log: vi.fn(),
      error: vi.fn(),
    };

    const { server } = createServer(app, {
      host: "127.0.0.1",
      port: 4000,
      logger,
    });

    expect(app.listen).toHaveBeenCalledWith(
      4000,
      "127.0.0.1",
      expect.any(Function),
    );

    expect(server).toBeDefined();
    expect(logger.log).toHaveBeenCalledWith(
      "ChartWars API listening at http://127.0.0.1:4000",
    );
  });

  it("closes the server only once when shutdown is called repeatedly", () => {
    const close = vi.fn((callback) => callback());

    const app = {
      listen: vi.fn((_port, _host, callback) => {
        callback();
        return { close };
      }),
    };

    const logger = {
      log: vi.fn(),
      error: vi.fn(),
    };

    const { shutdown } = createServer(app, {
      host: "127.0.0.1",
      port: 4000,
      logger,
    });

    shutdown("SIGINT");
    shutdown("SIGTERM");

    expect(close).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(
      "ChartWars API shut down successfully.",
    );
  });

  it("sets a failure exit code when shutdown fails", () => {
    const shutdownError = new Error("Shutdown failed");
    const close = vi.fn((callback) => callback(shutdownError));

    const app = {
      listen: vi.fn((_port, _host, callback) => {
        callback();
        return { close };
      }),
    };

    const logger = {
      log: vi.fn(),
      error: vi.fn(),
    };

    const { shutdown } = createServer(app, {
      host: "127.0.0.1",
      port: 4000,
      logger,
    });

    shutdown("SIGTERM");

    expect(logger.error).toHaveBeenCalledWith(
      "Server shutdown failed:",
      shutdownError,
    );
    expect(process.exitCode).toBe(1);
  });
});

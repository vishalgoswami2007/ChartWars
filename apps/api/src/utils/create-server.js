
export function createServer(app, { host, port, logger = console }) {
  const server = app.listen(port, host, () => {
    logger.log(`ChartWars API listening at http://${host}:${port}`);
  });

  let isShuttingDown = false;

  function shutdown(signal) {
    if (isShuttingDown) return;

    isShuttingDown = true;
    logger.log(`${signal} received. Shutting down gracefully...`);

    server.close((error) => {
      if (error) {
        logger.error("Server shutdown failed:", error);
        process.exitCode = 1;
        return;
      }

      logger.log("ChartWars API shut down successfully.");
    });
  }

  return { server, shutdown };
}

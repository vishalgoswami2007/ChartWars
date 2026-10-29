import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/database.js";

await connectDB();
app.listen(env.PORT, () => {
  console.log(`ChartWars API listening at http://127.0.0.1:${env.PORT}`);
});
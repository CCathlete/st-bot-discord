// Main entry point for the application.

import { Bot } from "./Bot";
import { config } from "dotenv";

config(); // Loading env vars.

async function main(): Promise<void> {
  const bot: Bot = new Bot();
  await bot.start(process.env.DISCORD_TOKEN!); // Asserting that the var exists.
}

main().catch(console.error);

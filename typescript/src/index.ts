// Main entry point for the application.

import { Bot } from "./Bot";
import { CONFIG } from "./config/config";

async function main(): Promise<void> {
  const bot: Bot = new Bot();
  await bot.start(CONFIG.DISCORD_TOKEN);
}

main().catch(console.error);

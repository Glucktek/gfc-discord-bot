import CreateBot from "./services/bot.ts";
import { validateEnv } from "./env.ts";
import type { BotConfig } from "./types.ts";

async function main() {
  const env = validateEnv();
  console.log("Starting bot service...");

  const botConfig: BotConfig = {
    token: env.discordToken,
    guildId: env.guildId,
    adminRole: env.adminRole,
  };

  const bot = CreateBot(botConfig);
  bot.startBot();
}

main();

import { Bot } from "./services/bot.ts";
import { validateEnv } from "./env.ts";

async function main() {
  const env = validateEnv();
  console.log("Starting bot service...");

  const bot = new Bot({
    token: env.discordToken,
    guildId: env.guildId,
    adminRole: env.adminRole,
  });
  bot.start();
}

main();

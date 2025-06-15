import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  GuildMember,
  REST,
  Routes,
  ChatInputCommandInteraction,
} from "discord.js";
import { LightsailClient } from "./lightsail"; // Assuming you'll create this

import type { BotConfig } from "../types.ts";

const CreateBot = (config: BotConfig) => {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  });

  const lightsailClient = new LightsailClient();

  const hasRequiredRole = (member: GuildMember): boolean => {
    return member.roles.cache.has(config.adminRole);
  };

  const getCommands = () => [
    new SlashCommandBuilder()
      .setName("gfcbot")
      .setDescription("GFC Bot commands")
      .addSubcommandGroup((group) =>
        group
          .setName("server")
          .setDescription("Manage the server")
          .addSubcommand((subcommand) =>
            subcommand.setName("start").setDescription("Start the server"),
          )
          .addSubcommand((subcommand) =>
            subcommand.setName("stop").setDescription("Stop the server"),
          )
          .addSubcommand((subcommand) =>
            subcommand.setName("reboot").setDescription("Reboot the server"),
          )
          .addSubcommand((subcommand) =>
            subcommand.setName("status").setDescription("Get server status"),
          )
          .addSubcommand((subcommand) =>
            subcommand
              .setName("check-website")
              .setDescription(
                "Check if the website is returning a 200 success code",
              ),
          ),
      )
      .addSubcommandGroup((group) =>
        group
          .setName("bot")
          .setDescription("Bot management commands")
          .addSubcommand((subcommand) =>
            subcommand.setName("status").setDescription("Check bot status"),
          ),
      ),
  ];

  const handleCommands = async (
    interaction: ChatInputCommandInteraction,
  ): Promise<void> => {
    if (!interaction.member || !(interaction.member instanceof GuildMember)) {
      await interaction.reply({
        content: "🚫 Unable to verify your permissions!",
        ephemeral: true,
      });
      return;
    }

    if (!hasRequiredRole(interaction.member)) {
      await interaction.reply({
        content: "🚫 You need the required role to use this bot!",
        ephemeral: true,
      });
      return;
    }

    const instanceName = "GreaterFaithChurchSite";
    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    try {
      if (group === "server") {
        switch (subcommand) {
          case "start":
            console.log("Start command received");
            await lightsailClient.startInstance(instanceName);
            await interaction.reply(
              "✅ Server start command successfully sent!",
            );
            break;

          case "stop":
            console.log("Stop command received");
            await lightsailClient.stopInstance(instanceName);
            await interaction.reply(
              "✅ Server stop command successfully sent, Please wait 5 minutes!",
            );
            break;

          case "reboot":
            console.log("Reboot command received");
            await lightsailClient.rebootInstance(instanceName);
            await interaction.reply(
              "✅ Server rebooted successfully, please wait 5 mins and check status again!",
            );
            break;

          case "status":
            console.log("Status command received");
            const state = await lightsailClient.getInstanceState(instanceName);
            await interaction.reply(`Current Instance state: ${state}`);
            break;

          case "check-website":
            await checkWebsite(interaction);
            break;
        }
      } else if (group === "bot") {
        switch (subcommand) {
          case "status":
            console.log("Status command received: Bot is running normally");
            await interaction.reply(
              "🟢 Bot is running normally! Nothing to see here.",
            );
            break;
        }
      }
    } catch (error) {
      console.error("Command error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await interaction.reply(`❌ Command failed: ${errorMessage}`);
    }
  };

  const checkWebsite = async (
    interaction: ChatInputCommandInteraction,
  ): Promise<void> => {
    console.log("Check website command received");
    const websiteURL = "https://greaterfaithchurch.org";

    try {
      const response = await fetch(websiteURL);

      if (response.status === 200) {
        await interaction.reply(
          "✅ Website is up returned a 200 success code!",
        );
      } else {
        await interaction.reply(
          `⚠️ Website returned a non-200 status code: \n${response.status}`,
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await interaction.reply(
        `❌ Failed to reach the website: \n${errorMessage}`,
      );
    }
  };

  const registerCommands = async (): Promise<void> => {
    const rest = new REST().setToken(config.token);
    const commands = getCommands().map((command) => command.toJSON());

    await rest.put(
      Routes.applicationGuildCommands(client.user!.id, config.guildId),
      { body: commands },
    );
  };

  const removeCommands = async (): Promise<void> => {
    const rest = new REST().setToken(config.token);

    await rest.put(
      Routes.applicationGuildCommands(client.user!.id, config.guildId),
      { body: [] },
    );
  };

  const startBot = async (): Promise<void> => {
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      await handleCommands(interaction);
    });

    await client.login(config.token);
    await registerCommands();

    console.log("Bot is running. Press CTRL+C to exit.");

    process.on("SIGINT", async () => {
      console.log("Shutting down...");
      try {
        await removeCommands();
      } catch (error) {
        console.error("Error removing commands:", error);
      }
      await client.destroy();
      process.exit(0);
    });
  };

  return {
    startBot,
  };
};

export default CreateBot;

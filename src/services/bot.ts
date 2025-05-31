import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  GuildMember,
  REST,
  Routes,
  ChatInputCommandInteraction,
} from "discord.js";

// You'll need to implement this based on your AWS SDK setup
import { LightsailClient } from "./lightsail"; // Assuming you'll create this

interface BotConfig {
  token: string;
  guildId: string;
  adminRole: string;
}

export class Bot {
  private client: Client;
  private token: string;
  private guildId: string;
  private adminRole: string;
  private lightsailClient: LightsailClient;

  constructor(config: BotConfig) {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });
    this.token = config.token;
    this.guildId = config.guildId;
    this.adminRole = config.adminRole;
    this.lightsailClient = new LightsailClient();
  }

  private hasRequiredRole(member: GuildMember): boolean {
    return member.roles.cache.has(this.adminRole);
  }

  private getCommands() {
    return [
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
  }

  private async handleCommands(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.member || !(interaction.member instanceof GuildMember)) {
      await interaction.reply({
        content: "🚫 Unable to verify your permissions!",
        ephemeral: true,
      });
      return;
    }

    if (!this.hasRequiredRole(interaction.member)) {
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
            await this.lightsailClient.startInstance(instanceName);
            await interaction.reply(
              "✅ Server start command successfully sent!",
            );
            break;

          case "stop":
            console.log("Stop command received");
            await this.lightsailClient.stopInstance(instanceName);
            await interaction.reply(
              "✅ Server stop command successfully sent, Please wait 5 minutes!",
            );
            break;

          case "reboot":
            console.log("Reboot command received");
            await this.lightsailClient.rebootInstance(instanceName);
            await interaction.reply(
              "✅ Server rebooted successfully, please wait 5 mins and check status again!",
            );
            break;

          case "status":
            console.log("Status command received");
            const state =
              await this.lightsailClient.getInstanceState(instanceName);
            await interaction.reply(`Current Instance state: ${state}`);
            break;

          case "check-website":
            await this.checkWebsite(interaction);
            break;
        }
      } else if (group === "bot") {
        switch (subcommand) {
          case "status":
            console.log("Status command received: Bot is running normally");
            await interaction.reply("🟢 Bot is running normally!");
            break;
        }
      }
    } catch (error) {
      console.error("Command error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await interaction.reply(`❌ Command failed: ${errorMessage}`);
    }
  }

  private async checkWebsite(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
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
  }

  private async registerCommands(): Promise<void> {
    const rest = new REST().setToken(this.token);
    const commands = this.getCommands().map((command) => command.toJSON());

    await rest.put(
      Routes.applicationGuildCommands(this.client.user!.id, this.guildId),
      { body: commands },
    );
  }

  private async removeCommands(): Promise<void> {
    const rest = new REST().setToken(this.token);

    await rest.put(
      Routes.applicationGuildCommands(this.client.user!.id, this.guildId),
      { body: [] },
    );
  }

  public async start(): Promise<void> {
    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      await this.handleCommands(interaction);
    });

    await this.client.login(this.token);
    await this.registerCommands();

    console.log("Bot is running. Press CTRL+C to exit.");

    process.on("SIGINT", async () => {
      console.log("Shutting down...");
      try {
        await this.removeCommands();
      } catch (error) {
        console.error("Error removing commands:", error);
      }
      await this.client.destroy();
      process.exit(0);
    });
  }
}

// Usage example:
// const bot = new Bot({
//   token: process.env.DISCORD_TOKEN!,
//   guildId: process.env.GUILD_ID!,
//   adminRole: process.env.ADMIN_ROLE!
// });
// bot.start();

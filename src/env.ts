// Environment variable validation
export function validateEnv() {
  const requiredEnvVars = [
    "DISCORD_BOT_TOKEN",
    "DISCORD_ADMIN_ROLE",
    "DISCORD_GUILD_ID",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar],
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`,
    );
  }

  return {
    discordToken: process.env.DISCORD_BOT_TOKEN!,
    adminRole: process.env.DISCORD_ADMIN_ROLE!,
    guildId: process.env.DISCORD_GUILD_ID!,
    instanceName:
      process.env.LIGHTSAIL_INSTANCE_NAME || "GreaterFaithChurchSite",
    websiteUrl: process.env.WEBSITE_URL || "https://greaterfaithchurch.org",
    awsRegion: process.env.AWS_REGION || "us-east-1",
  };
}

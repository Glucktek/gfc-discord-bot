# GFC Discord Bot

A modern Discord bot designed for Greater Faith services, rebuilt in TypeScript from the original Go version. This project uses [Bun](https://bun.sh/) as its runtime for lightning-fast performance and modern developer experience.

## Features

- **Service Management:** Automate, announce, and manage Greater Faith service events.
- **Slash Commands:** Interact with the bot using Discord's modern slash command interface for clear, user-friendly experiences.
- **Moderation Tools:** Keep your server safe with configurable moderation features.
- **Event Notifications:** Send reminders and alerts for upcoming events and services.
- **Extensible:** Built with scalability and customization in mind.

## Tech Stack

- **Language:** TypeScript
- **Runtime:** [Bun](https://bun.sh/)
- **Discord API:** [discord.js](https://discord.js.org/) or [Eris](https://abal.moe/Eris/) (_specify here based on actual usage_)
- **Containerization:** Docker (optional)

## Commands

All interactions are performed via Discord's **slash commands**. The main command is `/gfcbot`, with the following subcommands and groups:

| Command                        | Description                                     | Required Role |
| ------------------------------ | ----------------------------------------------- | ------------- |
| `/gfcbot server start`         | Start the server                                | Admin role    |
| `/gfcbot server stop`          | Stop the server                                 | Admin role    |
| `/gfcbot server reboot`        | Reboot the server                               | Admin role    |
| `/gfcbot server status`        | Get server status                               | Admin role    |
| `/gfcbot server check-website` | Check if the website returns a 200 success code | Admin role    |
| `/gfcbot bot status`           | Check if the bot is running normally            | Admin role    |

> **Note:** You must have the configured admin role to use these commands.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`)
- [Node.js](https://nodejs.org/) (if Bun is not used everywhere)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- Discord Bot Token ([How to create a bot account](https://discord.com/developers/applications))

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Glucktek/gfc-discord-bot.git
   cd gfc-discord-bot
   ```

2. **Install dependencies:**

   ```sh
   bun install
   ```

3. **Configure environment:**

   - Copy `.env.example` to `.env` and fill in your credentials.

     ```sh
     cp .env.example .env
     ```

   - Set your Discord bot token and any other required environment variables in `.env`.

4. **Run the bot:**

   ```sh
   bun run start
   ```

   Or, if using Docker:

   ```sh
   docker build -t gfc-discord-bot .
   docker run --env-file .env gfc-discord-bot
   ```

## Usage

- Invite the bot to your Discord server using the OAuth2 URL with the required permissions.
- Use Discord's **slash commands** (type `/` in the chat) to interact with the bot and view all available commands.
- Configure additional settings via the `.env` file or command line as needed.

## Scripts

| Script          | Description               |
| --------------- | ------------------------- |
| `bun run start` | Start the bot             |
| `bun run dev`   | Start in development mode |
| `bun run build` | Build the project         |
| `bun run lint`  | Lint the codebase         |
| `bun run test`  | Run tests                 |

## Configuration

All configuration is managed through environment variables. See `.env.example` for all available options.

- `DISCORD_TOKEN` - Your Discord bot token.
- `GUILD_ID` - Your Discord server's Guild ID.
- `ADMIN_ROLE` - The Role ID required to use bot commands.
- _Add other configuration options as needed._

## Contributing

Contributions are welcome! Please open issues and pull requests for new features, bug fixes, or suggestions.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the GNU General Public License v3.0 License. See [LICENSE](LICENSE) for details.

## Credits

- [Greater Faith Church](https://greaterfaithchurch.org/)

---

_Redesigned with ❤️ in TypeScript and powered by Bun._

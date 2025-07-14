import { Client, GatewayIntentBits, Partials, ActivityType } from "discord.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message],
  presence: {
    activities: [
      {
        name: "Stalking",
        type: ActivityType.Watching,
      },
    ],
    status: "online",
  },
});

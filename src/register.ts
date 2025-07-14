import path from "node:path";
import fs from "node:fs";
import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import { CLIENT_ID, GUILD_ID } from "./config";
import { development } from "./commands/quickstart";

config();

const commands = [];

const commandsDir = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsDir)
  .filter((file) => file.endsWith(".js") || file.endsWith(".jsx"));

for (const file of commandFiles) {
  const commandPath = path.join(commandsDir, file);
  const commandModule = require(commandPath);

  if (commandModule.default && commandModule.builder) {
    console.info(`Registering command: ${commandModule.name}`);
    commands.push(commandModule.builder.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(process.env["TOKEN"] || "");

(async () => {
  try {
    console.log("Refreshing message context menu commands...");

    if (development) {
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commands,
      });
    } else {
      await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: commands,
      });
    }

    console.log("Successfully registered context commands.");
  } catch (error) {
    console.error(error);
  }
})();

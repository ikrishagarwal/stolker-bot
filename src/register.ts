import path from "node:path";
import fs from "node:fs";
import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import { CLIENT_ID, GUILD_ID } from "./config";
import { Command } from "#lib/command";

config();

const commands = [];
const developmentCommands = [];

const commandsDir = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsDir)
  .filter((file) => file.endsWith(".js") || file.endsWith(".jsx"));

for (const file of commandFiles) {
  const commandPath = path.join(commandsDir, file);
  const commandModule = require(commandPath);
  const commandClass = commandModule.default as typeof Command;

  if (commandClass && commandClass.builder) {
    if (commandClass.development)
      developmentCommands.push(commandClass.builder().toJSON());
    else commands.push(commandClass.builder().toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(process.env["TOKEN"] || "");

(async () => {
  try {
    console.log("\nRegistering commands...");

    if (developmentCommands.length) {
      console.log(
        `${developmentCommands.length} Development Commands`,
        developmentCommands.map((c) => c.name)
      );
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commands,
      });
    }

    if (commands.length) {
      console.log(
        `${commands.length} Global Commands`,
        commands.map((c) => c.name)
      );

      //// temporary way to register commands one by one ////

      // for (const command of commands) {
      //   console.log(`Registering command: ${command.name}`);
      //   await rest.post(Routes.applicationCommands(CLIENT_ID), {
      //     body: command,
      //   });
      // }

      await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: commands,
      });
    }

    console.log("Successfully registered context commands.");
  } catch (error) {
    console.error(error);
  }
})();

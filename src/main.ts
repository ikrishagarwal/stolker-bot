import { client } from "#lib/client";
import { config } from "dotenv";
import path from "node:path";
import fs from "node:fs";
import {
  ChatInputCommandInteraction,
  Collection,
  Events,
  MessageContextMenuCommandInteraction,
} from "discord.js";
import { Command } from "#lib/command";

config();

const commands = new Collection<string, typeof Command>();

const commandsDir = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsDir)
  .filter((file) => file.endsWith(".js") || file.endsWith(".jsx"));

for (const file of commandFiles) {
  const commandPath = path.join(commandsDir, file);
  const commandModule = require(commandPath);
  const commandClass = commandModule.default as typeof Command;

  if (commandClass) {
    console.info(`Registering command: ${commandClass.commandName}`);
    commands.set(commandClass.commandName, commandClass);
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (
    !interaction.isMessageContextMenuCommand() &&
    !interaction.isChatInputCommand()
  )
    return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    if (interaction.isChatInputCommand() && command.chatInputRun)
      await command.chatInputRun(interaction as ChatInputCommandInteraction);

    if (interaction.isMessageContextMenuCommand() && command.contextMenuRun)
      await command.contextMenuRun(
        interaction as MessageContextMenuCommandInteraction
      );
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "Something went wrong.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Something went wrong.",
        ephemeral: true,
      });
    }
  }
});

client.once(Events.ClientReady, () => {
  console.log(`
    
 ░▒▓███████▓▒░▒▓████████▓▒░▒▓██████▓▒░░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓███████▓▒░  
░▒▓█▓▒░         ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓█▓▒░         ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
 ░▒▓██████▓▒░   ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓███████▓▒░░▒▓██████▓▒░ ░▒▓███████▓▒░  
       ░▒▓█▓▒░  ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
       ░▒▓█▓▒░  ░▒▓█▓▒░  ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
░▒▓███████▓▒░   ░▒▓█▓▒░   ░▒▓██████▓▒░░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░ 
                                                                                            
`);
});

client.on(Events.Error, (error) => {
  console.error("An error occurred:", error);
});

client
  .login(process.env.TOKEN)
  .catch((error) => console.error("Failed to log in:", error));

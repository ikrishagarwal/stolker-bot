import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import { CLIENT_ID } from "./config";

config();

const rest = new REST({ version: "10" }).setToken(process.env["TOKEN"] || "");

(async () => {
  try {
    const commands = (await rest.get(
      Routes.applicationCommands(CLIENT_ID)
    )) as Command[];

    console.log("\nCommands registered:");
    let count = 1;
    for (const command of commands) {
      console.log(`${String(count++).padStart(2, "0")}. ${command.name}`);
    }

    console.log(
      "\nChoose the command to deregister by giving it's serial number:"
    );

    process.stdin.on("data", async (data) => {
      const input = Number(data.toString().trim());
      if (isNaN(input) || input < 1 || input > commands.length) {
        console.log("Invalid input. Please enter a valid serial number.");
        return;
      }

      const command = commands.at(input - 1)!;

      console.log(`De-registering command: ${command.name} (${command.id})`);
      await rest.delete(Routes.applicationCommand(CLIENT_ID, command.id));
    });
  } catch (error) {
    console.error(error);
  }
})();

interface Command {
  name: string;
  id: string;
}

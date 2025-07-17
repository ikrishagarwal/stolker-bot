import type {
  Awaitable,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export class Command {
  /*
   * The name of the command, used for registration and invocation
   */
  public static commandName: string;

  /*
   * if set to true, the command will register for guild only
   * @default false
   */
  public static development: boolean = false;

  /*
   * define the command builder, mandatory
   * @returns {SlashCommandBuilder | ContextMenuCommandBuilder | SlashCommandOptionsOnlyBuilder}
   */
  public static builder?():
    | SlashCommandBuilder
    | ContextMenuCommandBuilder
    | SlashCommandOptionsOnlyBuilder;

  /*
   * The method to run when the command is invoked via Chat Input Interaction
   * @param {ChatInputCommandInteraction} interaction - The interaction object
   */
  public static chatInputRun?(
    interaction: ChatInputCommandInteraction
  ): Awaitable<unknown>;

  /*
   * The method to run when the command is invoked via Context Menu Interaction
   * @param {ContextMenuCommandInteraction} interaction - The interaction object
   */
  public static contextMenuRun?(
    interaction: ContextMenuCommandInteraction
  ): Awaitable<unknown>;

  /*
   * The method to run when the command is invoked via Button Interaction
   * @param {ButtonInteraction} interaction - The interaction object
   */
  public static buttonRun?(interaction: ButtonInteraction): Awaitable<unknown>;
}

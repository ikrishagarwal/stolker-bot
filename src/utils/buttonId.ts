const DELIMITER = ":";

export const generateButtonId = (
  commandName: string,
  customID: string,
  delimiter: string = DELIMITER
): string => {
  return `${commandName}${delimiter}${customID}`;
};

export const parseButtonId = (
  buttonId: string,
  delimiter: string = DELIMITER
): {
  commandName: string;
  customId: string;
} => {
  const [commandName, customId] = buttonId.split(delimiter);
  return { commandName, customId };
};

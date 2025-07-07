import { Settings, SettingsUpdateData } from "../interfaces/settings.interface";

let mockSettings: Settings = {
  provider: "OpenAI",
  apiKey: "",
};

export const getSettings = async (): Promise<Settings> => {
  // No artificial delay
  return { ...mockSettings };
};

export const updateSettings = async (
  data: SettingsUpdateData
): Promise<Settings> => {
  // No artificial delay
  mockSettings = { ...mockSettings, ...data };
  return { ...mockSettings };
};

export interface Settings {
  provider: string;
  apiKey: string;
}

export interface SettingsUpdateData {
  provider?: string;
  apiKey?: string;
}

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

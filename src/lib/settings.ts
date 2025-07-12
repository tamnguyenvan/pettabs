import { Attribution } from '../types';

export interface Settings {
  appearance: {
    zenMode: boolean;
    showUsage?: boolean;
  };
  background: {
    category: string;
    attribution: Attribution | null;
  };
  sound: {
    zenMusic: string;
  };
}

export const DEFAULT_SETTINGS: Settings = {
  appearance: {
    zenMode: false,
    showUsage: true,
  },
  background: {
    category: 'cat',
    attribution: null,
  },
  sound: {
    zenMusic: 'light-rain',
  },
};

const SETTINGS_STORAGE_KEY = 'pettabs_settings';

export const loadSettings = (): Settings => {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return { ...DEFAULT_SETTINGS };
};

export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const updateSettings = (updates: Partial<Settings>): Settings => {
  const currentSettings = loadSettings();
  const newSettings = { ...currentSettings, ...updates };
  saveSettings(newSettings);
  return newSettings;
};

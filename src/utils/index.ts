import { Platform } from 'react-native';

let sessionCounter = 0;

export const generateUniqueId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  // Fallback: High-entropy, timestamped, platform-aware unique ID
  sessionCounter += 1;

  const timestamp = Date.now().toString(36); // Short, millisecond precision
  const randomPart1 = Math.random().toString(36).substring(2, 10); // 8-char random
  const randomPart2 = Math.floor(Math.random() * 1e9).toString(36); // extra randomness
  const platform = Platform.OS; // 'ios' or 'android'

  return `id-${platform}-${timestamp}-${randomPart1}-${randomPart2}-${sessionCounter}`;
};

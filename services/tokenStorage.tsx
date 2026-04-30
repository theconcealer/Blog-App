
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: "onboarding_completed",
};

/**
 * Mark onboarding as completed
 */
export const setOnboardingCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, "true");
  } catch (error) {
    console.error("Error saving onboarding state:", error);
  }
};

/**
 * Check if onboarding is completed
 */
export const isOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(
      STORAGE_KEYS.ONBOARDING_COMPLETED
    );
    return value === "true";
  } catch (error) {
    console.error("Error reading onboarding state:", error);
    return false;
  }
};

/**
 * Clear onboarding (useful for testing or logout reset)
 */
export const clearOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  } catch (error) {
    console.error("Error clearing onboarding state:", error);
  }
};
import { DARK_MODE_VALUES, LOCAL_STORAGE_KEYS } from "@src/constants";

export function getDarkModeEnabledFromLocalStorage() {
  return (
    localStorage.getItem(LOCAL_STORAGE_KEYS.DARK_MODE) === DARK_MODE_VALUES.DARK
  );
}

export function setDarkModeEnabledToLocalStorage(enabled: boolean) {
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.DARK_MODE,
    enabled ? DARK_MODE_VALUES.DARK : DARK_MODE_VALUES.LIGHT
  );
}

import { trim, isEmpty, upperCase } from "lodash";
import { AppStore } from "~/Store";

export function validateEmpty(text) {
  if (trim(text).length > 0) return true;
  return false;
}

export async function validateBlockWords(text = "") {
  const { config: { weoBlockWords: blockWords = [] } = {} } =
    AppStore.getState();
  if (isEmpty(blockWords)) {
    return true;
  }
  const invalidWords = blockWords.filter(
    (word) => upperCase(text).indexOf(upperCase(word)) !== -1
  );
  return invalidWords.length === 0;
}

export default {
  validateEmpty,
  validateBlockWords,
};

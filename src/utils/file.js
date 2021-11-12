export function extractFileExtensionByFileName(filename) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
}

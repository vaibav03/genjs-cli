export function stripIndents(value) {
  if (typeof value === "string") {
    return _stripIndents(value);
  }

  const processedString = value.reduce((acc, curr, i) => {
    acc += curr + (arguments[i + 1] ?? "");
    return acc;
  }, "");

  return _stripIndents(processedString);
}

function _stripIndents(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trimStart()
    .replace(/[\r\n]$/, "");
}

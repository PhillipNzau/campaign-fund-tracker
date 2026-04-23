export const parseData = (input) => {
  return input
    .split("\n")
    .map((line) => {
      let clean = line.trim();
      if (!clean) return null;

      clean = clean.replace(/^\d+[\.\)]?\s*/, "");

      const match = clean.match(/([\d,]+)$/);
      if (!match) return null;

      const amount = parseInt(match[1].replace(/,/g, ""), 10);

      let name = clean.slice(0, match.index).trim().replace(/[-–]$/, "").trim();

      return { Name: name, Amount: amount };
    })
    .filter(Boolean);
};

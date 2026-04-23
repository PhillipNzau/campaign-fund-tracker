const URL =
  "https://script.google.com/macros/s/AKfycbzMhlFyA1q2g8OIf9lEce3Ki5jTI1gSM9N4bYp6V1GmFckxpA_AFUwcNlNiEPT-VuR1fg/exec";

export const sendToSheets = async (fundraiser, data) => {
  await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fundraiser, data }),
  });
};

export const loadFromSheets = async (fundraiser) => {
  const res = await fetch(URL);
  const data = await res.json();

  return data.contributions
    .filter((c) => c.Fundraiser === fundraiser)
    .map((item, i) => `${i + 1}. ${item.Name} - ${item.Amount}`)
    .join("\n");
};

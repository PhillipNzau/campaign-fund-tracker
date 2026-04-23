export const mergeData = (data) => {
  const map = {};

  data.forEach((item) => {
    const key = item.Name.toLowerCase();

    if (!map[key]) {
      map[key] = { Name: item.Name, Amount: 0, Count: 0 };
    }

    map[key].Amount += item.Amount;
    map[key].Count++;
  });

  return Object.values(map);
};

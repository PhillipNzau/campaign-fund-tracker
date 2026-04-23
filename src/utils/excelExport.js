import * as XLSX from "xlsx";

export const exportToExcel = (data, fileName) => {
  const ws = XLSX.utils.json_to_sheet(data.map((r) => ({ Name: r.Name, Amount: r.Amount })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Contributions");
  XLSX.writeFile(wb, `${fileName || "contributions"}.xlsx`);
};

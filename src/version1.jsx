// import React, { useState, useMemo } from "react";
// import * as XLSX from "xlsx";

// export default function TextToExcelApp() {
//   const [text, setText] = useState("");
//   const [useMerged, setUseMerged] = useState(true);
//   const [edits, setEdits] = useState({}); // {index: {Name, Amount}}

//   const parseData = (input) => {
//     const lines = input.split("\n");
//     const data = [];

//     lines.forEach((line) => {
//       let clean = line.trim();
//       if (!clean) return;

//       clean = clean.replace(/^\d+[\.\)]?\s*/, "");

//       const match = clean.match(/([\d,]+)$/);
//       if (!match) return;

//       const amount = parseInt(match[1].replace(/,/g, ""), 10);
//       let name = clean.slice(0, match.index).trim();
//       name = name.replace(/[-–]$/, "").trim();

//       data.push({ Name: name, Amount: amount });
//     });

//     return data;
//   };

//   const parsedData = useMemo(() => parseData(text), [text]);

//   // Apply inline edits
//   const editedData = useMemo(() => {
//     return parsedData.map((item, i) => ({
//       Name: edits[i]?.Name ?? item.Name,
//       Amount: edits[i]?.Amount ?? item.Amount,
//     }));
//   }, [parsedData, edits]);

//   // Merge duplicates by name
//   const mergedData = useMemo(() => {
//     const map = {};
//     editedData.forEach((item) => {
//       const key = item.Name.trim().toLowerCase();
//       if (!map[key]) {
//         map[key] = { Name: item.Name.trim(), Amount: 0, Count: 0 };
//       }
//       map[key].Amount += Number(item.Amount) || 0;
//       map[key].Count += 1;
//     });
//     return Object.values(map).sort((a, b) => a.Name.localeCompare(b.Name));
//   }, [editedData]);

//   const viewData = useMerged ? mergedData : editedData;

//   const totals = useMemo(() => {
//     const total = viewData.reduce((sum, i) => sum + (Number(i.Amount) || 0), 0);
//     const count = viewData.length;
//     const duplicates = mergedData.filter((i) => i.Count > 1);
//     return { total, count, duplicates };
//   }, [viewData, mergedData]);

//   const handleDownload = () => {
//     if (viewData.length === 0) {
//       alert("No valid data found");
//       return;
//     }

//     const exportData = viewData.map((i) => ({
//       Name: i.Name,
//       Amount: i.Amount,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Contributions");
//     XLSX.writeFile(workbook, useMerged ? "contributions_merged.xlsx" : "contributions.xlsx");
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];

//     if (file && file.type === "text/plain") {
//       const reader = new FileReader();
//       reader.onload = (event) => setText(event.target.result);
//       reader.readAsText(file);
//     } else {
//       alert("Please drop a .txt file");
//     }
//   };

//   const isDuplicate = (name) => {
//     const key = name.toLowerCase();
//     return mergedData.find((i) => i.Name.toLowerCase() === key)?.Count > 1;
//   };

//   const updateCell = (index, field, value) => {
//     setEdits((prev) => ({
//       ...prev,
//       [index]: {
//         ...prev[index],
//         [field]: field === "Amount" ? Number(value) || 0 : value,
//       },
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Contribution Dashboard</h1>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-white p-4 rounded-xl shadow">
//             <p className="text-gray-500">Total Amount</p>
//             <p className="text-xl font-bold">KES {totals.total.toLocaleString()}</p>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow">
//             <p className="text-gray-500">Rows</p>
//             <p className="text-xl font-bold">{totals.count}</p>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow">
//             <p className="text-gray-500">Duplicates (names)</p>
//             <p className="text-xl font-bold">{totals.duplicates.length}</p>
//           </div>
//         </div>

//         {/* Input */}
//         <div className="bg-white p-6 rounded-2xl shadow mb-6">
//           <div
//             onDrop={handleDrop}
//             onDragOver={(e) => e.preventDefault()}
//             className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-4 text-center"
//           >
//             Drag & drop a .txt file OR paste below
//           </div>

//           <textarea
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Paste your contribution list here..."
//             className="w-full h-40 border rounded-lg p-3"
//           />

//           <div className="flex items-center gap-3 mt-4">
//             <input
//               id="mergeToggle"
//               type="checkbox"
//               checked={useMerged}
//               onChange={(e) => setUseMerged(e.target.checked)}
//             />
//             <label htmlFor="mergeToggle" className="text-sm">
//               Merge duplicates by name
//             </label>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white p-6 rounded-2xl shadow mb-6 overflow-auto">
//           <h2 className="text-xl font-semibold mb-4">
//             Preview {useMerged ? "(Merged)" : "(Editable)"}
//           </h2>

//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="p-2">#</th>
//                 <th className="p-2">Name</th>
//                 <th className="p-2">Amount</th>
//                 {useMerged && <th className="p-2">Entries</th>}
//               </tr>
//             </thead>
//             <tbody>
//               {viewData.map((item, index) => (
//                 <tr
//                   key={index}
//                   className={`border-t ${isDuplicate(item.Name) ? "bg-yellow-50" : ""}`}
//                 >
//                   <td className="p-2">{index + 1}</td>

//                   <td className="p-2">
//                     {useMerged ? (
//                       item.Name
//                     ) : (
//                       <input
//                         value={item.Name}
//                         onChange={(e) => updateCell(index, "Name", e.target.value)}
//                         className="border rounded px-2 py-1 w-full"
//                       />
//                     )}
//                   </td>

//                   <td className="p-2">
//                     {useMerged ? (
//                       `KES ${Number(item.Amount).toLocaleString()}`
//                     ) : (
//                       <input
//                         type="number"
//                         value={item.Amount}
//                         onChange={(e) => updateCell(index, "Amount", e.target.value)}
//                         className="border rounded px-2 py-1 w-full"
//                       />
//                     )}
//                   </td>

//                   {useMerged && <td className="p-2">{item.Count}</td>}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Duplicates list */}
//         {totals.duplicates.length > 0 && (
//           <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-xl mb-6">
//             <p className="font-semibold">Merged duplicates:</p>
//             <ul className="list-disc ml-6">
//               {totals.duplicates.map((d) => (
//                 <li key={d.Name}>
//                   {d.Name} → KES {d.Amount.toLocaleString()} ({d.Count} entries)
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         <button
//           onClick={handleDownload}
//           className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
//         >
//           Download {useMerged ? "Merged" : "Raw"} Excel
//         </button>
//       </div>
//     </div>
//   );
// }

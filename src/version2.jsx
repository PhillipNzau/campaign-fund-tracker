// import React, { useState, useMemo, useEffect } from "react";
// import * as XLSX from "xlsx";

// export default function SaaSContributionDashboard() {
//   const [fundraisers, setFundraisers] = useState([]);
//   const [activeId, setActiveId] = useState(null);
//   const [newName, setNewName] = useState("");

//   // Load from localStorage
//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("fundraisers") || "[]");
//     setFundraisers(saved);
//     if (saved.length) setActiveId(saved[0].id);
//   }, []);

//   // Persist
//   useEffect(() => {
//     localStorage.setItem("fundraisers", JSON.stringify(fundraisers));
//   }, [fundraisers]);

//   const active = fundraisers.find((f) => f.id === activeId);

//   const updateActive = (updates) => {
//     setFundraisers((prev) => prev.map((f) => (f.id === activeId ? { ...f, ...updates } : f)));
//   };

//   const createFundraiser = () => {
//     if (!newName.trim()) return;
//     const newF = {
//       id: Date.now().toString(),
//       name: newName,
//       text: "",
//       edits: {},
//       useMerged: true,
//     };
//     setFundraisers((prev) => [newF, ...prev]);
//     setActiveId(newF.id);
//     setNewName("");
//   };

//   const deleteFundraiser = (id) => {
//     const filtered = fundraisers.filter((f) => f.id !== id);
//     setFundraisers(filtered);
//     if (filtered.length) setActiveId(filtered[0].id);
//     else setActiveId(null);
//   };

//   const parseData = (input) => {
//     return input
//       .split("\n")
//       .map((line) => {
//         let clean = line.trim();
//         if (!clean) return null;

//         clean = clean.replace(/^\d+[\.\)]?\s*/, "");
//         const match = clean.match(/([\d,]+)$/);
//         if (!match) return null;

//         const amount = parseInt(match[1].replace(/,/g, ""), 10);
//         let name = clean.slice(0, match.index).trim();
//         name = name.replace(/[-–]$/, "").trim();

//         return { Name: name, Amount: amount };
//       })
//       .filter(Boolean);
//   };

//   const parsedData = useMemo(() => parseData(active?.text || ""), [active]);

//   const editedData = useMemo(() => {
//     if (!active) return [];
//     return parsedData.map((item, i) => ({
//       Name: active.edits[i]?.Name ?? item.Name,
//       Amount: active.edits[i]?.Amount ?? item.Amount,
//     }));
//   }, [parsedData, active]);

//   const mergedData = useMemo(() => {
//     const map = {};
//     editedData.forEach((item) => {
//       const key = item.Name.toLowerCase();
//       if (!map[key]) map[key] = { Name: item.Name, Amount: 0, Count: 0 };
//       map[key].Amount += item.Amount;
//       map[key].Count++;
//     });
//     return Object.values(map);
//   }, [editedData]);

//   const viewData = active?.useMerged ? mergedData : editedData;

//   const total = viewData?.reduce((s, i) => s + i.Amount, 0) || 0;

//   const updateCell = (index, field, value) => {
//     updateActive({
//       edits: {
//         ...active.edits,
//         [index]: {
//           ...active.edits[index],
//           [field]: field === "Amount" ? Number(value) : value,
//         },
//       },
//     });
//   };

//   const download = () => {
//     const ws = XLSX.utils.json_to_sheet(viewData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Data");
//     XLSX.writeFile(wb, `${active.name}.xlsx`);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-white p-4 shadow">
//         <h2 className="font-bold mb-4">Fundraisers</h2>

//         <div className="mb-4">
//           <input
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//             placeholder="New fundraiser"
//             className="w-full border p-2 rounded mb-2"
//           />
//           <button onClick={createFundraiser} className="w-full bg-blue-600 text-white p-2 rounded">
//             Create
//           </button>
//         </div>

//         <ul>
//           {fundraisers.map((f) => (
//             <li
//               key={f.id}
//               className={`p-2 rounded cursor-pointer flex justify-between ${f.id === activeId ? "bg-blue-100" : ""}`}
//             >
//               <span onClick={() => setActiveId(f.id)}>{f.name}</span>
//               <button onClick={() => deleteFundraiser(f.id)} className="text-red-500">
//                 ×
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Main */}
//       <div className="flex-1 p-6">
//         {active ? (
//           <>
//             <h1 className="text-2xl font-bold mb-4">{active.name}</h1>

//             <div className="mb-4 bg-white p-4 rounded shadow">
//               <textarea
//                 value={active.text}
//                 onChange={(e) => updateActive({ text: e.target.value })}
//                 className="w-full h-32 border p-2 rounded"
//               />

//               <label className="flex items-center gap-2 mt-2">
//                 <input
//                   type="checkbox"
//                   checked={active.useMerged}
//                   onChange={(e) => updateActive({ useMerged: e.target.checked })}
//                 />
//                 Merge duplicates
//               </label>
//             </div>

//             <div className="bg-white p-4 rounded shadow mb-4">
//               <p className="font-bold">Total: KES {total.toLocaleString()}</p>
//             </div>

//             <table className="w-full bg-white rounded shadow">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th>#</th>
//                   <th>Name</th>
//                   <th>Amount</th>
//                   {active.useMerged && <th>Count</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {viewData.map((row, i) => (
//                   <tr key={i} className="border-t">
//                     <td>{i + 1}</td>
//                     <td>
//                       {active.useMerged ? (
//                         row.Name
//                       ) : (
//                         <input
//                           value={row.Name}
//                           onChange={(e) => updateCell(i, "Name", e.target.value)}
//                         />
//                       )}
//                     </td>
//                     <td>
//                       {active.useMerged ? (
//                         row.Amount
//                       ) : (
//                         <input
//                           type="number"
//                           value={row.Amount}
//                           onChange={(e) => updateCell(i, "Amount", e.target.value)}
//                         />
//                       )}
//                     </td>
//                     {active.useMerged && <td>{row.Count}</td>}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <button onClick={download} className="mt-4 bg-green-600 text-white p-2 rounded">
//               Download Excel
//             </button>
//           </>
//         ) : (
//           <p>No fundraiser selected</p>
//         )}
//       </div>
//     </div>
//   );
// }

// .......2
// import React, { useState, useMemo, useEffect } from "react";
// import * as XLSX from "xlsx";

// export default function SaaSContributionDashboard() {
//   const [fundraisers, setFundraisers] = useState([]);
//   const [activeId, setActiveId] = useState(null);
//   const [newName, setNewName] = useState("");
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const GOOGLE_SCRIPT_URL =
//     "https://script.google.com/macros/s/AKfycbzMhlFyA1q2g8OIf9lEce3Ki5jTI1gSM9N4bYp6V1GmFckxpA_AFUwcNlNiEPT-VuR1fg/exec";

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("fundraisers") || "[]");
//     setFundraisers(saved);
//     if (saved.length) setActiveId(saved[0].id);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("fundraisers", JSON.stringify(fundraisers));
//   }, [fundraisers]);

//   const active = fundraisers.find((f) => f.id === activeId);

//   const updateActive = (updates) => {
//     setFundraisers((prev) => prev.map((f) => (f.id === activeId ? { ...f, ...updates } : f)));
//   };

//   const createFundraiser = () => {
//     if (!newName.trim()) return;
//     const newF = { id: Date.now().toString(), name: newName, text: "", edits: {}, useMerged: true };
//     setFundraisers((prev) => [newF, ...prev]);
//     setActiveId(newF.id);
//     setNewName("");
//   };

//   const deleteFundraiser = (e, id) => {
//     e.stopPropagation();
//     const filtered = fundraisers.filter((f) => f.id !== id);
//     setFundraisers(filtered);
//     if (filtered.length) setActiveId(filtered[0].id);
//     else setActiveId(null);
//   };

//   const parseData = (input) => {
//     return input
//       .split("\n")
//       .map((line) => {
//         let clean = line.trim();
//         if (!clean) return null;
//         clean = clean.replace(/^\d+[\.\)]?\s*/, "");
//         const match = clean.match(/([\d,]+)$/);
//         if (!match) return null;
//         const amount = parseInt(match[1].replace(/,/g, ""), 10);
//         let name = clean.slice(0, match.index).trim().replace(/[-–]$/, "").trim();
//         return { Name: name, Amount: amount };
//       })
//       .filter(Boolean);
//   };

//   const parsedData = useMemo(() => parseData(active?.text || ""), [active]);
//   const editedData = useMemo(() => {
//     if (!active) return [];
//     return parsedData.map((item, i) => ({
//       Name: active.edits[i]?.Name ?? item.Name,
//       Amount: active.edits[i]?.Amount ?? item.Amount,
//     }));
//   }, [parsedData, active]);

//   const mergedData = useMemo(() => {
//     const map = {};
//     editedData.forEach((item) => {
//       const key = item.Name.toLowerCase();
//       if (!map[key]) map[key] = { Name: item.Name, Amount: 0, Count: 0 };
//       map[key].Amount += item.Amount;
//       map[key].Count++;
//     });
//     return Object.values(map);
//   }, [editedData]);

//   const viewData = active?.useMerged ? mergedData : editedData;
//   const total = viewData?.reduce((s, i) => s + i.Amount, 0) || 0;

//   const updateCell = (index, field, value) => {
//     updateActive({
//       edits: {
//         ...active.edits,
//         [index]: { ...active.edits[index], [field]: field === "Amount" ? Number(value) : value },
//       },
//     });
//   };

//   const download = () => {
//     const ws = XLSX.utils.json_to_sheet(viewData.map((r) => ({ Name: r.Name, Amount: r.Amount })));
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Contributions");
//     XLSX.writeFile(wb, `${active.name}.xlsx`);
//   };

//   const sendToGoogleSheets = async () => {
//     if (!viewData.length) return alert("No data to send");
//     try {
//       await fetch(GOOGLE_SCRIPT_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fundraiser: active.name, data: viewData }),
//       });
//       alert("✅ Synced with Google Sheets");
//     } catch (err) {
//       alert("❌ Failed to sync");
//     }
//   };

//   const loadFromGoogleSheets = async () => {
//     try {
//       const res = await fetch(GOOGLE_SCRIPT_URL);
//       const data = await res.json();
//       const filtered = data.contributions.filter((c) => c.Fundraiser === active.name);
//       const text = filtered.map((item, i) => `${i + 1}. ${item.Name} - ${item.Amount}`).join("\n");
//       updateActive({ text });
//       alert("✅ Loaded from Google Sheets");
//     } catch (err) {
//       alert("❌ Failed to load");
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
//       {/* Mobile Nav */}
//       <div className="md:hidden flex items-center justify-between p-4 bg-[#1E293B] text-white">
//         <span className="font-bold tracking-tight">SaaS Contribution</span>
//         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-2xl">
//           {isMobileMenuOpen ? "✕" : "☰"}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <div
//         className={`${isMobileMenuOpen ? "block" : "hidden"} md:block w-full md:w-72 bg-[#1E293B] text-slate-300 p-6 shadow-xl z-10`}
//       >
//         <div className="hidden md:block mb-8 text-white">
//           <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
//           <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Management</p>
//         </div>

//         <div className="mb-8">
//           <input
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//             placeholder="Fundraiser name..."
//             className="w-full bg-[#334155] border-none text-white text-sm p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition mb-2"
//           />
//           <button
//             onClick={createFundraiser}
//             className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg"
//           >
//             + New Campaign
//           </button>
//         </div>

//         <nav className="space-y-1">
//           {fundraisers.map((f) => (
//             <div
//               key={f.id}
//               onClick={() => {
//                 setActiveId(f.id);
//                 setIsMobileMenuOpen(false);
//               }}
//               className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
//                 f.id === activeId
//                   ? "bg-blue-600/20 text-white ring-1 ring-blue-500/50"
//                   : "hover:bg-slate-800"
//               }`}
//             >
//               <span className="truncate pr-2 font-medium">{f.name}</span>
//               <button
//                 onClick={(e) => deleteFundraiser(e, f.id)}
//                 className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 p-4 md:p-10 overflow-x-hidden">
//         {active ? (
//           <div className="max-w-5xl mx-auto">
//             <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//               <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
//                 {active.name}
//               </h2>
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   onClick={sendToGoogleSheets}
//                   className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium"
//                 >
//                   Sync Sheets
//                 </button>
//                 <button
//                   onClick={loadFromGoogleSheets}
//                   className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium"
//                 >
//                   Import
//                 </button>
//                 <button
//                   onClick={download}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
//                 >
//                   Export Excel
//                 </button>
//               </div>
//             </header>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//               {/* Text Input Area */}
//               <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
//                 <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
//                   Raw Contributions
//                 </h3>
//                 <textarea
//                   value={active.text}
//                   onChange={(e) => updateActive({ text: e.target.value })}
//                   placeholder="Paste name and amount lists here..."
//                   className="w-full h-40 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition text-slate-700"
//                 />
//                 <label className="flex items-center gap-3 mt-4 text-slate-600 font-medium cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={active.useMerged}
//                     onChange={(e) => updateActive({ useMerged: e.target.checked })}
//                     className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   Auto-merge duplicates
//                 </label>
//               </div>

//               {/* Summary Card */}
//               <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white flex flex-col justify-center">
//                 <p className="text-blue-100 text-sm font-medium uppercase tracking-widest mb-1">
//                   Total Collection
//                 </p>
//                 <p className="text-4xl font-black tracking-tight">KES {total.toLocaleString()}</p>
//                 <div className="mt-4 pt-4 border-t border-blue-400/30">
//                   <p className="text-xs text-blue-100 italic">
//                     Based on {viewData.length} unique entries
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Data Table */}
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
//                       <th className="px-6 py-4 font-bold">#</th>
//                       <th className="px-6 py-4 font-bold">Contributor Name</th>
//                       <th className="px-6 py-4 font-bold">Amount (KES)</th>
//                       {active.useMerged && <th className="px-6 py-4 font-bold text-center">Qty</th>}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100 text-sm">
//                     {viewData.map((row, i) => (
//                       <tr key={i} className="hover:bg-blue-50/50 transition">
//                         <td className="px-6 py-4 text-slate-400 font-mono">{i + 1}</td>
//                         <td className="px-6 py-4 font-semibold text-slate-700">
//                           {active.useMerged ? (
//                             row.Name
//                           ) : (
//                             <input
//                               value={row.Name}
//                               onChange={(e) => updateCell(i, "Name", e.target.value)}
//                               className="bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none w-full py-1"
//                             />
//                           )}
//                         </td>
//                         <td className="px-6 py-4 font-mono font-bold text-slate-900">
//                           {active.useMerged ? (
//                             row.Amount.toLocaleString()
//                           ) : (
//                             <input
//                               type="number"
//                               value={row.Amount}
//                               onChange={(e) => updateCell(i, "Amount", e.target.value)}
//                               className="bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none w-24 py-1"
//                             />
//                           )}
//                         </td>
//                         {active.useMerged && (
//                           <td className="px-6 py-4 text-center text-slate-500 font-medium">
//                             {row.Count}
//                           </td>
//                         )}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-full text-slate-400">
//             <p className="text-lg">Welcome back. Select a campaign to view analytics.</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

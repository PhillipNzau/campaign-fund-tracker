import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import ContributionsTable from "../components/ContributionsTable";
import { useFundraisers } from "../hooks/useFundraisers";
import { sendToSheets, loadFromSheets } from "../services/googleSheetsService";
import { exportToExcel } from "../utils/excelExport";

export default function Dashboard() {
  const {
    fundraisers,
    active,
    activeId,
    setActiveId,
    viewData,
    total,
    updateActive,
    createFundraiser,
    deleteFundraiser,
  } = useFundraisers();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSync = async () => {
    if (!viewData.length) return alert("No data to sync");
    try {
      await sendToSheets(active.name, viewData);
      alert("✅ Synced with Google Sheets");
    } catch (err) {
      alert("❌ Sync failed");
    }
  };

  // const handleLoad = async () => {
  //   try {
  //     const text = await loadFromSheets(active.name);
  //     updateActive({ text });
  //     console.log("====================================");
  //     console.log(text);
  //     console.log("====================================");
  //     alert("✅ Data loaded");
  //   } catch (err) {
  //     alert("❌ Load failed");
  //   }
  // };
  const handleLoad = async () => {
    try {
      const newText = await loadFromSheets(active.name);

      if (!newText) {
        alert("No data found for this campaign name.");
        return;
      }

      // Explicitly update the text AND reset edits
      // to ensure the table reflects the imported data
      updateActive({
        text: newText,
        edits: {},
      });

      alert("✅ Data loaded and parsed");
    } catch (err) {
      alert("❌ Failed to load from Google Sheets");
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile state

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1E293B] text-white">
        <span className="font-bold">SaaS Contributions</span>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-2xl">
          ☰
        </button>
      </div>

      <Sidebar
        fundraisers={fundraisers}
        activeId={activeId}
        onSelect={setActiveId}
        onCreate={createFundraiser}
        onDelete={deleteFundraiser}
        isOpen={isSidebarOpen} // Pass state
        setIsOpen={setIsSidebarOpen} // Pass setter
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-x-hidden">
        {!active ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-lg">Select or create a campaign to get started.</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* DASHBOARD HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {active.name}
                </h1>
                <p className="text-sm text-slate-500 mt-1">Campaign Analytics & Sync</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSync}
                  className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-cloud-check-icon lucide-cloud-check"
                  >
                    <path d="m17 15-5.5 5.5L9 18" />
                    <path d="M5.516 16.07A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 3.501 7.327" />
                  </svg>{" "}
                  Sync Sheets
                </button>

                <button
                  onClick={handleLoad}
                  className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-folder-input-icon lucide-folder-input"
                  >
                    <path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1" />
                    <path d="M2 13h10" />
                    <path d="m9 16 3-3-3-3" />
                  </svg>{" "}
                  Import
                </button>

                <button
                  onClick={() => exportToExcel(viewData, active.name)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-medium flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-file-spreadsheet-icon lucide-file-spreadsheet"
                  >
                    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                    <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                    <path d="M8 13h2" />
                    <path d="M14 13h2" />
                    <path d="M8 17h2" />
                    <path d="M14 17h2" />
                  </svg>{" "}
                  Export Excel
                </button>
              </div>
            </header>

            {/* INPUT & SUMMARY SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Raw Contribution Data
                </h3>
                <textarea
                  value={active.text}
                  onChange={(e) => updateActive({ text: e.target.value })}
                  placeholder="Paste list here (e.g. 1. John Doe - 1,000)"
                  className="w-full h-44 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition text-slate-700 font-mono text-sm"
                />
                <div className="flex items-center gap-3 mt-4">
                  <input
                    type="checkbox"
                    id="merge-toggle"
                    checked={active.useMerged}
                    onChange={(e) => updateActive({ useMerged: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600"
                  />
                  <label
                    htmlFor="merge-toggle"
                    className="text-slate-600 font-medium cursor-pointer select-none"
                  >
                    Auto-merge duplicate names
                  </label>
                </div>
              </div>

              <SummaryCard total={total} count={viewData.length} />
            </div>

            {/* TABLE SECTION */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <ContributionsTable
                data={viewData}
                isMerged={active.useMerged}
                onEdit={(i, field, value) =>
                  updateActive({
                    edits: {
                      ...active.edits,
                      [i]: {
                        ...active.edits?.[i],
                        [field]: field === "Amount" ? Number(value) : value,
                      },
                    },
                  })
                }
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

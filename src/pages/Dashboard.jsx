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

  const handleLoad = async () => {
    try {
      const text = await loadFromSheets(active.name);
      updateActive({ text });
      alert("✅ Data loaded");
    } catch (err) {
      alert("❌ Load failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <Sidebar
        fundraisers={fundraisers}
        activeId={activeId}
        onSelect={setActiveId}
        onCreate={createFundraiser}
        onDelete={deleteFundraiser}
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
                  className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium flex items-center gap-2"
                >
                  🔄 Sync Sheets
                </button>

                <button
                  onClick={handleLoad}
                  className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium flex items-center gap-2"
                >
                  📥 Import
                </button>

                <button
                  onClick={() => exportToExcel(viewData, active.name)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-medium flex items-center gap-2"
                >
                  📊 Export Excel
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

import React from "react";
import { exportToExcel } from "../utils/excelExport";

export default function DashboardHeader({ active, data, onSync, onImport }) {
  const handleExport = () => {
    exportToExcel(data, active.name);
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{active.name}</h2>
        <p className="text-sm text-slate-500">Campaign Management & Analytics</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onSync}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium flex items-center gap-2"
        >
          <span>🔄</span> Sync Sheets
        </button>

        <button
          onClick={onImport}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium flex items-center gap-2"
        >
          <span>📥</span> Import
        </button>

        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-medium flex items-center gap-2"
        >
          <span>📊</span> Export Excel
        </button>
      </div>
    </header>
  );
}

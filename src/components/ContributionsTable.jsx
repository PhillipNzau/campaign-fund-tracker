export default function ContributionsTable({ data, isMerged, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
            <th className="px-6 py-4 font-bold">#</th>
            <th className="px-6 py-4 font-bold">Name</th>
            <th className="px-6 py-4 font-bold">Amount</th>
            {isMerged && <th className="px-6 py-4 font-bold text-center">Qty</th>}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-sm">
          {data.map((row, i) => (
            <tr className="hover:bg-blue-50/50 transition" key={i}>
              <td className="px-6 py-4 text-slate-400 font-mono">{i + 1}</td>

              <td className="px-6 py-4 font-semibold text-slate-700">
                {isMerged ? (
                  row.Name
                ) : (
                  <input
                    className="bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none w-full py-1"
                    value={row.Name}
                    onChange={(e) => onEdit(i, "Name", e.target.value)}
                  />
                )}
              </td>

              <td className="px-6 py-4 font-mono font-bold text-slate-900">
                {isMerged ? (
                  row.Amount
                ) : (
                  <input
                    type="number"
                    value={row.Amount}
                    className="bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none w-24 py-1"
                    onChange={(e) => onEdit(i, "Amount", e.target.value)}
                  />
                )}
              </td>

              {isMerged && (
                <td className="px-6 py-4 text-center text-slate-500 font-medium">{row.Count}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

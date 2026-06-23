export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {Array(cols).fill(0).map((_, i) => (
              <th key={i} className="p-4">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array(rows).fill(0).map((_, i) => (
            <tr key={i}>
              <td className="p-4 pl-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                    <div className="h-2 bg-gray-100 rounded animate-pulse w-24"></div>
                  </div>
                </div>
              </td>
              {Array(cols - 1).fill(0).map((_, j) => (
                <td key={j} className="p-4">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-24 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
          <div className="h-2 bg-gray-100 rounded animate-pulse w-20"></div>
        </div>
      ))}
    </div>
  )
}
export function ChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mb-6"></div>
      <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
    </div>
  )
}

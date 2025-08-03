// src/components/EventsTableSkeleton.tsx

export default function EventsTableSkeleton() {
  const SkeletonRow = () => (
    <tr className="border-b border-gray-700">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-700 rounded-full w-28"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </td>
    </tr>
  );

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow animate-pulse">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="bg-gray-700 text-xs text-gray-400 uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">Кой (Потребител)</th>
            <th scope="col" className="px-6 py-3">Какво (Тип събитие)</th>
            <th scope="col" className="px-6 py-3">Детайли</th>
            <th scope="col" className="px-6 py-3">Дата и час</th>
          </tr>
        </thead>
        <tbody>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </tbody>
      </table>
    </div>
  );
}
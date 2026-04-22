import { useContext } from "react";
import AnimeContext from "./AnimeContext";

export default function StatusCards() {
  const { personalList } = useContext(AnimeContext)!;

  const watching = personalList?.Watching?.length || 0;
  const completed = personalList?.Completed?.length || 0;
  const plan = personalList?.["Plan to Watch"]?.length || 0;
  const total = watching + completed + plan;

  const card = (label: string, count: number, accent: string) => (
    <div className="min-w-[160px] flex-1 bg-[#0f1724] border border-gray-700 rounded-xl p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300">{label}</div>
        <div className={`h-3 w-3 rounded-full ${accent}`} />
      </div>
      <div className="mt-3 text-2xl font-semibold text-white">{count}</div>
    </div>
  );

  return (
    <section className="px-4 sm:px-0 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 items-stretch overflow-x-auto">
          {card("Currently Watching", watching, "bg-pink-400")}
          {card("Completed", completed, "bg-green-400")}
          {card("Plan to Watch", plan, "bg-yellow-400")}
          {card("All", total, "bg-purple-400")}
        </div>
      </div>
    </section>
  );
}

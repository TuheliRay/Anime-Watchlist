import type { RowProps } from "../../types/animeModal";

export default function Row({ label, value, valueClass }: RowProps) {
  return (
    <div className="flex justify-between items-center py-3 gap-4">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={`text-sm font-semibold text-right ${valueClass ?? "text-white"}`}>
        {value}
      </span>
    </div>
  );
}

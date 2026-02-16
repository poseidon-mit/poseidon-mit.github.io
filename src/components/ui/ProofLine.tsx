import { Info } from 'lucide-react';

interface ProofLineProps {
  items: { label: string; value: string }[];
}

export function ProofLine({ items }: ProofLineProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B]">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <span>{item.label}</span>
          <span className="font-medium text-[#94A3B8]">{item.value}</span>
          {i < items.length - 1 && <span className="ml-2 text-white/20">|</span>}
        </span>
      ))}
      <Info className="ml-1 h-3 w-3 shrink-0 text-[#64748B]" />
    </div>
  );
}

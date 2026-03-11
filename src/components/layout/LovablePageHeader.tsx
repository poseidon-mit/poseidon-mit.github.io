import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

export function LovablePageHeader({ icon: Icon, iconBg, iconColor, title, description }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-white/50 text-sm">{description}</p>
      </div>
    </div>
  );
}

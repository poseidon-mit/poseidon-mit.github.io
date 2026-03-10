import { Lock, Check } from 'lucide-react'

const items = [
  { icon: Lock, label: 'MIT Capstone Project' },
  { icon: Lock, label: 'Bank-Level Security' },
  { icon: Check, label: 'SOC 2 Compliant' },
  { icon: Lock, label: '256-bit Encryption' },
]

export default function SocialProofBar() {
  return (
    <section className="bg-[#F0EFEB] border-y border-stone-200 py-6 px-4">
      <div className="flex flex-wrap justify-center gap-8 md:gap-16">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-sm text-stone-500 font-medium"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

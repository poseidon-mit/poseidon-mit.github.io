import { TrendingUp } from 'lucide-react'
import { CountUp } from '@/components/poseidon'
import { accountsSummary } from '@/data/accounts'
import { persona } from '@/data/persona'
import { formatCurrency } from '@/lib/formatters'

export function NetWorthCard() {
  const { netWorth, totalAssets, totalLiabilities } = accountsSummary

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 border-t-4 border-t-[var(--engine-dashboard)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-stone-500 font-medium">Total Net Worth</p>
          <p className="text-4xl md:text-5xl font-bold text-[#1A1A1A] font-mono tabular-nums mt-2">
            $<CountUp value={netWorth} duration={1500} decimals={2} />
          </p>
          <p className="text-sm font-medium text-[#16A34A] flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            +$1,247 (1.3%) this month
          </p>
        </div>

        {/* Credit Score */}
        <div className="text-right shrink-0">
          <p className="text-sm text-stone-500 font-medium">Credit Score</p>
          <p className="text-3xl font-bold text-[#1A1A1A] font-mono tabular-nums mt-1">
            <CountUp value={persona.creditScore} duration={1200} />
          </p>
          <p className="text-xs font-medium text-emerald-600 mt-0.5">Excellent</p>
        </div>
      </div>

      <div className="border-t border-stone-100 pt-5 mt-5 flex flex-wrap gap-6">
        <div>
          <p className="text-sm text-stone-500">Assets</p>
          <p className="font-semibold text-[#1A1A1A] font-mono tabular-nums">
            {formatCurrency(totalAssets)}
          </p>
        </div>
        <div>
          <p className="text-sm text-stone-500">Liabilities</p>
          <p className="font-semibold text-[#1A1A1A] font-mono tabular-nums">
            {formatCurrency(totalLiabilities)}
          </p>
        </div>
      </div>
    </div>
  )
}

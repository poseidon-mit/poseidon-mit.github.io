import { TrendingUp } from 'lucide-react'
import { MOCK_NET_WORTH, MOCK_SPARKLINE_DATA } from '@/lib/mock-data'
import { AnimatedNumber } from '@/components/ui/animated-number'

function MiniSparkline({ data }: { data: number[] }) {
  const width = 120
  const height = 40
  const padding = 2
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2)
      const y =
        height - padding - ((v - min) / range) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
    >
      <polyline
        points={points}
        fill="none"
        stroke="#16A34A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const fmtSigned = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
  signDisplay: 'always',
})

export function NetWorthCard() {
  const { total, change, changePercent, assets, liabilities, monthlyCashFlow } =
    MOCK_NET_WORTH

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 border-t-4 border-t-[var(--engine-dashboard)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone-500 font-medium">Total Net Worth</p>
          <p className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-2">
            <AnimatedNumber value={total} format={(n) => fmt.format(n)} />
          </p>
          <p className="text-sm font-medium text-[#16A34A] flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <AnimatedNumber value={change} format={(n) => fmtSigned.format(n)} /> ({changePercent}%) this month
          </p>
        </div>
        <MiniSparkline data={MOCK_SPARKLINE_DATA} />
      </div>

      <div className="border-t border-stone-100 pt-6 mt-6 flex flex-wrap gap-6">
        <div>
          <p className="text-sm text-stone-500">Assets</p>
          <p className="font-semibold text-[#1A1A1A]">
            <AnimatedNumber value={assets} format={(n) => fmt.format(n)} />
          </p>
        </div>
        <div>
          <p className="text-sm text-stone-500">Liabilities</p>
          <p className="font-semibold text-[#1A1A1A]">
            <AnimatedNumber value={liabilities} format={(n) => fmt.format(n)} />
          </p>
        </div>
        <div>
          <p className="text-sm text-stone-500">Monthly Cash Flow</p>
          <p className="font-semibold text-[#1A1A1A]">
            <AnimatedNumber value={monthlyCashFlow} format={(n) => fmtSigned.format(n)} />
          </p>
        </div>
      </div>
    </div>
  )
}

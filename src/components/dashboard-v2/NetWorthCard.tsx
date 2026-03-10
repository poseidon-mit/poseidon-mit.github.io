import { TrendingUp } from 'lucide-react'
import { MOCK_NET_WORTH, MOCK_SPARKLINE_DATA } from '@/lib/mock-data'

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
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500 font-medium">Total Net Worth</p>
          <p className="text-4xl md:text-5xl font-bold text-[#0A1628] mt-2">
            {fmt.format(total)}
          </p>
          <p className="text-sm font-medium text-[#16A34A] flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            {fmtSigned.format(change)} ({changePercent}%) this month
          </p>
        </div>
        <MiniSparkline data={MOCK_SPARKLINE_DATA} />
      </div>

      <div className="border-t border-zinc-100 pt-6 mt-6 flex flex-wrap gap-6">
        <div>
          <p className="text-sm text-zinc-500">Assets</p>
          <p className="font-semibold text-[#0A1628]">{fmt.format(assets)}</p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Liabilities</p>
          <p className="font-semibold text-[#0A1628]">
            {fmt.format(liabilities)}
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Monthly Cash Flow</p>
          <p className="font-semibold text-[#0A1628]">
            {fmtSigned.format(monthlyCashFlow)}
          </p>
        </div>
      </div>
    </div>
  )
}

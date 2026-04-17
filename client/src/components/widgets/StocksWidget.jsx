import { useState, useEffect } from 'react'
import { FaChartLine, FaCaretUp, FaCaretDown } from 'react-icons/fa'

// Simulated stock data (real API would need a key)
const MOCK_STOCKS = [
  { symbol: 'AAPL', name: 'Apple', price: 198.45, change: 2.31, pct: 1.18 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 171.82, change: -0.96, pct: -0.56 },
  { symbol: 'MSFT', name: 'Microsoft', price: 428.15, change: 5.20, pct: 1.23 },
  { symbol: 'AMZN', name: 'Amazon', price: 186.49, change: 1.87, pct: 1.01 },
  { symbol: 'TSLA', name: 'Tesla', price: 245.30, change: -3.15, pct: -1.27 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 875.28, change: 12.45, pct: 1.44 },
]

function StocksWidget() {
  const [stocks, setStocks] = useState(MOCK_STOCKS)

  // Simulate minor price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((s) => {
          const delta = (Math.random() - 0.48) * 2
          const newPrice = +(s.price + delta).toFixed(2)
          const change = +(newPrice - (s.price - s.change)).toFixed(2)
          const pct = +((change / (newPrice - change)) * 100).toFixed(2)
          return { ...s, price: newPrice, change, pct }
        })
      )
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <FaChartLine className="text-brand-green" size={14} />
        <span className="text-sm font-bold text-gray-800">Markets</span>
      </div>

      <div className="space-y-2">
        {stocks.map((stock) => {
          const isUp = stock.change >= 0
          return (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-800">{stock.symbol}</p>
                <p className="text-[9px] text-gray-400">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-800">${stock.price}</p>
                <p className={`text-[9px] font-medium flex items-center justify-end gap-0.5 ${isUp ? 'text-brand-green' : 'text-brand-red'}`}>
                  {isUp ? <FaCaretUp size={9} /> : <FaCaretDown size={9} />}
                  {isUp ? '+' : ''}{stock.change} ({isUp ? '+' : ''}{stock.pct}%)
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StocksWidget

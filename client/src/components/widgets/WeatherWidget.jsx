import { useState, useEffect } from 'react'
import { FaCloudSun, FaMapMarkerAlt, FaThermometerHalf, FaWind, FaTint } from 'react-icons/fa'

function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Use wttr.in free API (no key needed)
        const res = await fetch('https://wttr.in/?format=j1')
        if (!res.ok) throw new Error('Weather fetch failed')
        const data = await res.json()
        const current = data.current_condition?.[0]
        const area = data.nearest_area?.[0]

        if (current) {
          setWeather({
            temp: current.temp_F,
            tempC: current.temp_C,
            feelsLike: current.FeelsLikeF,
            desc: current.weatherDesc?.[0]?.value || 'Unknown',
            humidity: current.humidity,
            windMph: current.windspeedMiles,
            city: area?.areaName?.[0]?.value || 'Unknown',
            region: area?.region?.[0]?.value || '',
            icon: current.weatherCode,
          })
        }
      } catch (err) {
        setError('Unable to load weather')
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-32" />
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 text-center">
        <FaCloudSun className="mx-auto text-gray-300 mb-2" size={24} />
        <p className="text-xs text-gray-400">{error || 'No weather data'}</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[10px] opacity-80 flex items-center gap-1">
            <FaMapMarkerAlt size={8} />
            {weather.city}{weather.region ? `, ${weather.region}` : ''}
          </p>
          <p className="text-3xl font-bold mt-1">{weather.temp}°F</p>
          <p className="text-xs opacity-80">{weather.tempC}°C</p>
        </div>
        <FaCloudSun size={36} className="opacity-80" />
      </div>

      <p className="text-sm font-medium mb-3">{weather.desc}</p>

      <div className="flex gap-4 text-[10px] opacity-80">
        <span className="flex items-center gap-1">
          <FaThermometerHalf size={9} />
          Feels {weather.feelsLike}°F
        </span>
        <span className="flex items-center gap-1">
          <FaTint size={9} />
          {weather.humidity}%
        </span>
        <span className="flex items-center gap-1">
          <FaWind size={9} />
          {weather.windMph} mph
        </span>
      </div>
    </div>
  )
}

export default WeatherWidget

import { WeatherAPIRoot } from "src/types/Api";
import axios from "axios";
import { useState, useEffect } from "react";
import { Droplet, Wind, Eye, Sun, Search } from "lucide-react";

const WeatherWidget = () => {
  const [apiData, setApiData] = useState<WeatherAPIRoot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("Pune");
  const [inputValue, setInputValue] = useState("Pune");

  const fetchWeatherData = async (location: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${
          import.meta.env.VITE_WEATHER_API_KEY
        }&q=${location}&days=4&aqi=no&alerts=no`
      );
      setApiData(response.data as WeatherAPIRoot);
      setError(null);
    } catch (err) {
      setError(
        "Failed to fetch weather data. Please check the location name and try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return "bg-gradient-to-r from-orange-500 to-amber-500";
    if (temp >= 20) return "bg-gradient-to-r from-yellow-500 to-amber-400";
    if (temp >= 10) return "bg-gradient-to-r from-blue-300 to-blue-400";
    return "bg-gradient-to-r from-blue-600 to-blue-800";
  };

  const getWeatherIcon = (iconUrl: string) => {
    return iconUrl.startsWith("//") ? `https:${iconUrl}` : iconUrl;
  };

  return (
    <div className="font-sans w-full max-w-md mx-auto px-4 mt-2">
      <form onSubmit={handleSubmit} className="mb-2">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for a location..."
            className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="text-lg">Loading weather data...</div>
        </div>
      ) : error ? (
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      ) : apiData ? (
        <>
          <div
            className={`${getTemperatureColor(
              apiData.current.temp_c
            )} rounded-t-lg p-4 sm:p-6 text-white shadow-lg`}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {apiData.location.name}
                </h2>
                <p className="text-sm opacity-90">
                  {apiData.location.region}, {apiData.location.country}
                </p>
                <p className="text-sm mt-1">{apiData.current.last_updated}</p>
              </div>
              <div className="text-center">
                <img
                  src={getWeatherIcon(apiData.current.condition.icon)}
                  alt={apiData.current.condition.text}
                  className="w-16 h-16 mx-auto sm:mx-0"
                />
                <p className="text-lg font-medium">
                  {apiData.current.condition.text}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="mb-4 sm:mb-0 text-center sm:text-left">
                <p className="text-4xl sm:text-5xl font-bold">
                  {Math.round(apiData.current.temp_c)}°C
                </p>
                <p className="text-sm">
                  Feels like: {Math.round(apiData.current.feelslike_c)}°C
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:text-base">
                <div className="flex items-center">
                  <Wind size={20} className="ml-1 mr-1" />
                  <span>Wind: {apiData.current.wind_kph} km/h</span>
                </div>
                <div className="flex items-center">
                  <Droplet size={20} className="ml-1 mr-1" />
                  <span>Humidity: {apiData.current.humidity}%</span>
                </div>
                <div className="flex items-center">
                  <Sun size={20} className="ml-1 mr-1" />
                  <span>UV: {apiData.current.uv}</span>
                </div>
                <div className="flex items-center">
                  <Eye size={20} className="ml-1 mr-1" />
                  <span>Vis: {apiData.current.vis_km} km</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-b-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Forecast
            </h3>
            <div className="space-y-3">
              {apiData.forecast.forecastday.map((day, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex items-center mb-2 sm:mb-0">
                    <img
                      src={getWeatherIcon(day.day.condition.icon)}
                      alt={day.day.condition.text}
                      className="w-10 h-10 mr-2"
                    />
                    <div>
                      <p className="font-medium">{formatDate(day.date)}</p>
                      <p className="text-sm text-gray-600">
                        {day.day.condition.text}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right ml-12 sm:ml-0">
                    <p className="font-medium">
                      {Math.round(day.day.maxtemp_c)}° /{" "}
                      {Math.round(day.day.mintemp_c)}°
                    </p>
                    <p className="text-sm text-gray-600">
                      Rain: {day.day.daily_chance_of_rain}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default WeatherWidget;

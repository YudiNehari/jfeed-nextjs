import { getCurrentWeather, getWeatherForecast } from "@/data/weather";
import { locations } from "@/data/locations";
import LocationSelector from "@/components/LocationSelector";

export default async function WeatherPage({
  params,
}: {
  params: { state: string; city: string };
}) {
  const selectedState = locations.states.find(
    (state) => state.slug === params.state
  );
  const selectedCity = locations.cities.find(
    (city) => city.state.slug === params.state && city.slug === params.city
  );

  if (!selectedState || !selectedCity) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-semibold">Location not found</h1>
        <p className="mt-4 text-gray-500">Please select a valid location.</p>
      </div>
    );
  }

  const [currentWeather, forecast] = await Promise.all([
    getCurrentWeather(
      selectedCity.coordinates.lat,
      selectedCity.coordinates.lon
    ),
    getWeatherForecast(
      selectedCity.coordinates.lat,
      selectedCity.coordinates.lon
    ),
  ]);

  return (
    <div className="container mx-auto py-8 px-4">
      <LocationSelector currentState={params.state} currentCity={params.city} />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-xl font-bold">
            {Math.round(currentWeather.main.temp)}°C
          </p>
          <p>{currentWeather.weather[0].description}</p>
          <p className="mt-2 text-sm text-gray-600">
            Feels like: {Math.round(currentWeather.main.feels_like)}°C
          </p>
          <p className="text-sm text-gray-600">
            Humidity: {currentWeather.main.humidity}%
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forecast.list
            .filter((_, index) => index % 8 === 0)
            .map((day) => (
              <div key={day.dt} className="p-4 bg-gray-100 rounded-lg">
                <p className="font-semibold">
                  {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </p>
                <p>{Math.round(day.main.temp)}°C</p>
                <p className="text-sm">{day.weather[0].description}</p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

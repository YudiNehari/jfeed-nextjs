"use client";

import { useRouter } from "next/navigation";
import { locations } from "@/data/locations";

export default function LocationSelector({
  currentState,
  currentCity,
}: {
  currentState: string;
  currentCity: string;
}) {
  const router = useRouter();
  const citiesInState = locations.cities.filter(
    (city) => city.state.slug === currentState
  );

  return (
    <div className="flex gap-4 mb-6">
      <select
        value={currentState}
        onChange={(e) => {
          const newState = e.target.value;
          const firstCity = locations.cities.find(
            (city) => city.state.slug === newState
          )?.slug;
          if (firstCity) {
            router.push(`/weather/${newState}/${firstCity}`);
          }
        }}
        className="p-2 border rounded-md"
      >
        {locations.states.map((state) => (
          <option key={state.slug} value={state.slug}>
            {state.name}
          </option>
        ))}
      </select>

      <select
        value={currentCity}
        onChange={(e) => {
          router.push(`/weather/${currentState}/${e.target.value}`);
        }}
        className="p-2 border rounded-md"
      >
        {citiesInState.map((city) => (
          <option key={city.slug} value={city.slug}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}

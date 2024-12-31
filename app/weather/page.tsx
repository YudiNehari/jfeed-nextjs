import { redirect } from "next/navigation";

export const metadata = {
  title: "Redirecting...",
};

export default function WeatherHomePage() {
  redirect("/weather/il/jerusalem");
  return null;
}

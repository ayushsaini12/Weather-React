export interface WeatherAPIRoot {
  location: Location;
  current: Current;
  forecast: Forecast;
}

export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}
export interface Current {
  last_updated: string;
  temp_c: number;
  is_day: number;
  condition: Condition;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  windchill_c: number;
  heatindex_c: number;
  dewpoint_c: number;
  vis_km: number;
  uv: number;
}

export interface Condition {
  text: string;
  icon: string;
  code: number;
}

export interface Forecast {
  forecastday: Forecastday[];
}

export interface Forecastday {
  date: string;
  day: Day;
}

export interface Day {
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  avgvis_km: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  condition: Condition2;
}

export interface Condition2 {
  text: string;
  icon: string;
  code: number;
}

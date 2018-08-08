interface Coordinates {
    lon: number;
    lat: number;
}

interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface OpenWeatherMain {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
}

interface Wind {
    speed: number;
    deg: number;
}

interface Clouds {
    all: number;
}

interface OpenWeatherSys {
    type: number;
    id: number;
    message: number;
    country: string;
    sunrise: number;
    sunset: number;
}

export interface OpenWeather {
    coord: Coordinates;
    weather: Weather;
    base: string;
    main: OpenWeatherMain;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: OpenWeatherSys
    id: string;
    name: string;
    cod: number;
}
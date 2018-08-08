import axios from 'axios';
import {OpenWeather} from '../models/weather.model';

const config = require('../../service.config.json');

export class OpenWeatherHandler {

    private readonly WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';
    private appId: string;
    private cityId: string;

    constructor() {
        this.appId = config.openWeather.secretKey;
        this.cityId = config.openWeather.cityId;
    }

    getCurrentWeather(): void {
        axios.get<OpenWeather>(this.WEATHER_URL, {
            params: {
                id: this.cityId,
                appid: this.appId
            }
        }).then(response => {
            const weather = response.data;

            console.log(this.processDate(weather.sys.sunrise));
            console.log(this.processDate(weather.sys.sunset));

            console.log(new Date().getTimezoneOffset());
        });
    }

    private processDate(epoch: number): Date {
        const date = new Date(0);
        const newDate = date.setUTCSeconds(epoch);

        return new Date(newDate);
    }
}
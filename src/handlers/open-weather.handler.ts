import axios, { AxiosPromise } from 'axios';
import { Job, scheduleJob } from 'node-schedule';
import { OpenWeather } from '../models/weather.model';

const config = require('../../service.config.json');

export class OpenWeatherHandler {

    private readonly WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';

    private sunriseJob: Job;
    private sunsetJob: Job;

    constructor() {
        this.setNewSunriseJob();
        this.setNewSunsetJob();
    }

    setNewSunriseJob(): void {
        this.getCurrentWeather()
            .then(weather => {
                if (this.sunriseJob) {
                    this.sunriseJob.cancel();
                }

                this.sunriseJob = scheduleJob('sunrise', new Date(weather.data.sys.sunrise * 1000),
                    () => {
                        console.log(`Fetched data was apparently set, sunrise executed at: ${new Date()}`);
                    });
            });
    }

    setNewSunsetJob(): void {
        this.getCurrentWeather()
            .then(weather => {
                if (this.sunsetJob) {
                    this.sunsetJob.cancel();
                }

                this.sunsetJob = scheduleJob('sunset', new Date(weather.data.sys.sunset * 1000),
                    () => {
                        console.log(`Fetched data was apparently set, sunset is executed at: ${new Date()}`);
                    });
            });
    }

    private getCurrentWeather(): AxiosPromise<OpenWeather> {
        return axios.get<OpenWeather>(this.WEATHER_URL, {
            params: {
                id: config.openWeather.cityId,
                appid: config.openWeather.secretKey
            }
        });
    }
}

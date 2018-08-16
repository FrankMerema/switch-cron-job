import axios, { AxiosPromise } from 'axios';
import { Job, scheduleJob } from 'node-schedule';
import { processDate } from '../helpers/time-zone-parser';
import { OpenWeather } from '../models/weather.model';
import { MessageLogHandler } from './message-log.handler';

const config = require('../../service.config.json');

export class OpenWeatherHandler {

    private readonly WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';

    private sunriseJob: Job;
    private sunsetJob: Job;
    private logHandler: MessageLogHandler;

    constructor(logHandler: MessageLogHandler) {
        this.setNewSunriseJob();
        this.setNewSunsetJob();
        this.logHandler = logHandler;
    }

    setNewSunriseJob(): void {
        this.getCurrentWeather()
            .then(weather => {
                if (this.sunriseJob) {
                    this.sunriseJob.cancel();
                }

                this.sunriseJob = scheduleJob('sunrise', new Date((weather.data.sys.sunrise + 600) * 1000),
                    () => {
                        this.logHandler.addToLog({
                            description: 'Fetched data was apparently set, sunrise executed!',
                            timestamp: processDate(new Date())
                        });
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

                this.sunsetJob = scheduleJob('sunset', new Date((weather.data.sys.sunset - 600) * 1000),
                    () => {
                        this.logHandler.addToLog({
                            description: 'Fetched data was apparently set, sunset executed!',
                            timestamp: processDate(new Date())
                        });
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

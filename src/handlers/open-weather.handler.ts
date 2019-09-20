import axios, { AxiosPromise } from 'axios';
import { settings } from 'cluster';
import { Job, scheduleJob } from 'node-schedule';
import { processDate } from '../helpers/time-zone-parser';
import { State } from '../models/state.enum';
import { OpenWeather } from '../models/weather.model';
import { MessageLogHandler } from './message-log.handler';
import { SwitchHandler } from './switch.handler';

const config = require('../../service.config.json');

export class OpenWeatherHandler {

    private sunriseJob: Job;
    private sunsetJob: Job;
    private logHandler: MessageLogHandler;
    private switchHandler: SwitchHandler;

    constructor(switchHandler: SwitchHandler, logHandler: MessageLogHandler) {
        this.switchHandler = switchHandler;
        this.logHandler = logHandler;
        this.initialSetup();
        this.setNewSunriseJob();
        this.setNewSunsetJob();
    }

    initialSetup(): void {
        setTimeout(() =>
            this.getCurrentWeather()
                .then(weather => {
                    const sunrise = new Date(weather.data.sys.sunrise * 1000);
                    const sunset = new Date(weather.data.sys.sunset * 1000);
                    const now = new Date();

                    if (sunrise < now && sunset < now) {
                        this.switchHandler.changeState(State.ON)
                            .then(() => {
                                this.logHandler.addToLog({
                                    description: `Initial state is set to ON!`,
                                    timestamp: processDate(new Date())
                                });
                                console.log(`Initial state is set to 'ON' at: ${new Date()}`);
                            });
                    }
                }), 10000);
    }

    setNewSunriseJob(): void {
        this.getCurrentWeather()
            .then(weather => {
                if (this.sunriseJob) {
                    this.sunriseJob.cancel();
                }

                this.sunriseJob = this.scheduleAJob('sunrise', new Date((weather.data.sys.sunrise + 600) * 1000), State.OFF);
            });
    }

    setNewSunsetJob(): void {
        this.getCurrentWeather()
            .then(weather => {
                if (this.sunsetJob) {
                    this.sunsetJob.cancel();
                }

                this.sunsetJob = this.scheduleAJob('sunset', new Date((weather.data.sys.sunset - 600) * 1000), State.ON);
            });
    }

    getSchedules(): Promise<{ sunset: Date, sunrise: Date }> {
        let schedules: any = {};

        if (this.sunriseJob) {
            schedules.sunrise = this.sunriseJob.nextInvocation();
        }
        if (this.sunsetJob) {
            schedules.sunset = this.sunsetJob.nextInvocation();
        }

        return Promise.resolve(schedules);
    }

    private scheduleAJob(name: string, date: Date, state: State): Job {
        return scheduleJob(name, date,
            () => {
                this.logHandler.addToLog({
                    description: `Fetched data was apparently set, ${name} executed!`,
                    timestamp: processDate(new Date())
                });
                console.log(`Fetched data was apparently set, sunset is executed at: ${new Date()}`);

                this.switchHandler.changeState(state);
            });
    }

    private getCurrentWeather(): AxiosPromise<OpenWeather> {
        return axios.get<OpenWeather>(config.openWeather.baseUrl + config.openWeather.cityId);
    }
}

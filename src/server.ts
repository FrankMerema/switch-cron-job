import { Request, Response } from 'express';
import { RecurrenceRule, scheduleJob } from 'node-schedule';
import { OpenWeatherHandler } from './handlers/open-weather.handler';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const config = require('../service.config.json');

export function start() {
    const port = config.serverPort || 8080;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    const weatherHandler = new OpenWeatherHandler();

    const sunriseRule = new RecurrenceRule();
    sunriseRule.hour = 3;
    sunriseRule.minute = 0;

    const sunsetRule = new RecurrenceRule();
    sunsetRule.hour = 15;
    sunsetRule.minute = 0;

    scheduleJob('sunriseFetching', sunriseRule, () => {
        console.log(`Fetching new weather data at: ${new Date()}`);
        weatherHandler.setNewSunriseJob();
    });

    scheduleJob('sunsetFetching', sunsetRule, () => {
        console.log(`Fetching new weather data at: ${new Date()}`);
        weatherHandler.setNewSunsetJob();
    });

    app.get('/api/status', (req: Request, res: Response) => {
        res.json({status: 'OK'});
    });

    app.listen(port, () => {
        console.log(`Express app listening on port ${port}!`);
    });
}

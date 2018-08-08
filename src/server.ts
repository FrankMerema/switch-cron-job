// https://api.openweathermap.org/data/2.5/weather?id=2750466&appid=5c9ddbb99091bfc41122d3e0dad08a61
import axios from 'axios';

import {Request, Response} from 'express';
import {OpenWeatherHandler} from './handlers/open-weather.handler';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const config = require('../service.config.json');

export function start() {
    const port = config.serverPort || 8080;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    const weather = new OpenWeatherHandler();

    weather.getCurrentWeather();

    // app.use('/api/switch', new SwitchRoutes().getRouter());

    app.get('/api/status', (req: Request, res: Response) => {
        res.json({status: 'OK'});
    });

    app.listen(port, () => {
        console.log(`Express app listening on port ${port}!`);
    });
}
import { Request, Response, Router } from 'express';
import { OpenWeatherHandler } from '../handlers/open-weather.handler';

export class WeatherRoutes {

    private readonly router: Router;
    private weatherHandler: OpenWeatherHandler;

    constructor(weatherHandler: OpenWeatherHandler) {
        this.router = Router();
        this.weatherHandler = weatherHandler;
        this.setupRoutes();
    }

    getRouter(): Router {
        return this.router;
    }

    private setupRoutes(): void {
        this.router.get('/schedules', (req: Request, res: Response) => this.getNextSchedules(req, res));
    }

    private getNextSchedules(req: Request, res: Response): void {
        this.weatherHandler.getSchedules()
            .then(schedules => {
                res.json(schedules);
            });
    }
}

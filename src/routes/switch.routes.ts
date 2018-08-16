import { Request, Response, Router } from 'express';
import { SwitchHandler } from '../handlers/switch.handler';

export class SwitchRoutes {

    private readonly router: Router;
    private switchHandler: SwitchHandler;

    constructor(switchHandler: SwitchHandler) {
        this.router = Router();
        this.switchHandler = switchHandler;
        this.setupRoutes();
    }

    getRouter(): Router {
        return this.router;
    }

    private setupRoutes(): void {
        this.router.get('/state', (req: Request, res: Response) => this.getStateOfSwitch(req, res));

        this.router.post('/state', (req: Request, res: Response) => this.changeState(req, res));
    }

    private getStateOfSwitch(req: Request, res: Response): void {
        this.switchHandler.getStateOfSwitch()
            .then(state => {
                res.json({state: state});
            }).catch(error => {
            res.status(404).json(error);
        });
    }

    private changeState(req: Request, res: Response): void {
        this.switchHandler.switchState()
            .then(() => {
                res.json({});
            }).catch(error => {
            res.status(404).json(error);
        });
    }
}

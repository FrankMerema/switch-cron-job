import { Request, Response, Router } from 'express';
import { MessageLogHandler } from '../handlers/message-log.handler';
import { SwitchHandler } from '../handlers/switch.handler';

export class SwitchRoutes {

    private readonly router: Router;
    private switchHandler: SwitchHandler;

    constructor(messageLogHandler: MessageLogHandler) {
        this.router = Router();
        this.switchHandler = new SwitchHandler(messageLogHandler);
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
        this.switchHandler.changeState()
            .then(() => {
                res.json({});
            }).catch(error => {
            res.status(404).json(error);
        });
    }
}

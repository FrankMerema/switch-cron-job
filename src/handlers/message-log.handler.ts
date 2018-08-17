import { LogMessage } from '../models/log-message.model';

export class MessageLogHandler {

    private log: Array<LogMessage>;

    constructor() {
        this.log = [];
    }

    addToLog(message: LogMessage): void {
        if (this.log.length > 100) {
            this.log.splice(0, 20);
        }

        this.log.push(message);
    }

    getLog(): Array<LogMessage> {
        return this.log;
    }
}

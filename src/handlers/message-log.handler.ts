import { LogMessage } from '../models/log-message.model';

export class MessageLogHandler {

    private log: Array<LogMessage>;

    constructor() {
        this.log = [];
    }

    addToLog(message: LogMessage): void {
        this.log.push(message);
    }

    getLog(): Array<LogMessage> {
        return this.log;
    }
}

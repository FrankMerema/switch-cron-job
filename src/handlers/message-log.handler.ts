export interface LogMessage {
    description: string,
    timestamp: Date
}

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

import { createGpio, readPinState, writePinState } from '../helpers/gpio-helper';
import { processDate } from '../helpers/time-zone-parser';
import { State } from '../models/state.enum';
import { MessageLogHandler } from './message-log.handler';

const config = require('../../service.config.json');

export class SwitchHandler {

    private switchList: { [key: number]: any } = {};
    private logHandler: MessageLogHandler;

    constructor(logHandler: MessageLogHandler) {
        this.logHandler = logHandler;
        this.addSwitch();
    }

    getStateOfSwitch(): Promise<any> {
        if (this.switchList[config.switch.pin]) {
            this.logHandler.addToLog({
                description: `Getting state of pin!`,
                timestamp: processDate(new Date())
            });
            console.log(`Getting state of pin at ${new Date()}`);

            return readPinState(this.switchList[config.switch.pin]);
        } else {
            return Promise.reject({error: `No switch known!`});
        }
    }

    switchState(): Promise<any> {
        if (this.switchList[config.switch.pin]) {
            return this.getStateOfSwitch()
                .then(state => {
                    const newState = state === State.ON ? State.OFF : State.ON;

                    this.logHandler.addToLog({
                        description: `Switched state of pin to state: ${newState}!`,
                        timestamp: processDate(new Date())
                    });
                    console.log(`Switching pin state to ${newState} at ${new Date()}`);

                    return writePinState(this.switchList[config.switch.pin], newState)
                        .then(() => {
                            return Promise.resolve({state: newState});
                        });
                });
        } else {
            return Promise.reject({error: `No switch known!`});
        }
    }

    changeState(state: State): Promise<void> {
        if (this.switchList[config.switch.pin]) {
            return writePinState(this.switchList[config.switch.pin], state).then(() => {
                this.logHandler.addToLog({
                    description: `Switched state of pin to state: ${state}!`,
                    timestamp: processDate(new Date())
                });
                console.log(`Switching pin state to ${state} at ${new Date()}`);

                return Promise.resolve();
            });
        } else {
            return Promise.reject({error: `No switch known!`});
        }
    }

    private addSwitch(): void {
        createGpio(config.switch.pin, 'out')
            .then(gpio => {
                this.switchList[config.switch.pin] = gpio;
                this.switchAddingAnimation(gpio);
            });
    }

    private switchAddingAnimation(gpio: any): void {
        writePinState(gpio, State.OFF)
            .then(() => this.timeoutHandler(1000))
            .then(() => writePinState(gpio, State.ON))
            .then(() => this.timeoutHandler(1000))
            .then(() => writePinState(gpio, State.OFF))
            .then(() => this.timeoutHandler(1000))
            .then(() => writePinState(gpio, State.ON))
            .then(() => this.timeoutHandler(1000))
            .then(() => writePinState(gpio, State.OFF));
    }

    private timeoutHandler(ms: number): Promise<any> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }
}

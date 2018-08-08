import {readPinState, writePinState} from '../helpers/gpio-helper';
import {State} from '../models/state.enum';

export class SwitchHandler {

    private switchList: { [key: number]: any } = {};

    constructor() {
    }

    getStateOfSwitch(pin: number): Promise<any> {
        if (this.switchList[pin]) {
            return readPinState(this.switchList[pin]);
        } else {
            return Promise.reject({error: `No switch for pin: ${pin}`});
        }
    }

    changeState(pin: number, state: State): Promise<any> {
        if (this.switchList[pin]) {
            return writePinState(this.switchList[pin], state);
        } else {
            return Promise.reject({error: `No switch for pin: ${pin}`});
        }
    }
}
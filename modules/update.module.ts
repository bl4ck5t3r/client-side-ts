import { singleton } from "tsyringe";
import { IUpdate } from "../interfaces/update.interface";
import { UUIDV4 } from "../helpers";
import * as alt from 'alt-client';

@singleton()
export class UpdateModule {
    private updates: IUpdate[] = []

    public constructor() {
        alt.everyTick(() => {
            for (const update of this.updates) {
                if (update === undefined)
                    continue;

                update.f();
            }
        });
    }

    private disconnect() {
        this.updates = []
    }

    public add(func: Function) {
        const r = { f: func, uuid: UUIDV4() }
        this.updates.push(r);
        return r.uuid;
    }

    public remove(uuid: string) {
        this.updates = this.updates.filter(m => m.uuid !== uuid);
    }
}
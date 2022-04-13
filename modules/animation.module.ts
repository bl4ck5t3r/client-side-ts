import * as alt from "alt-client";
import * as native from "natives";
import { AnimationOptions } from "../enums/animation.options";
import { singleton } from "tsyringe";

@singleton()
export class AnimationModule {
    private dicts = new Map();

    public constructor() {
    }

    /**
     * Load and cache animations
     *
     * @param {string} dict
     * @returns {Promise<boolean>}
     */
    public load(dict: string): Promise<boolean> {
        return new Promise((resolve) => {

            if (this.dicts.has(dict)) {
                return resolve(true);
            }

            native.requestAnimDict(dict);

            let interval = alt.setInterval(() => {
                if (native.hasAnimDictLoaded(dict)) {
                    this.dicts.set(dict, true);
                    alt.clearInterval(interval);
                    return resolve(true);
                }
            }, 10);
        });
    }

    /**
     * Play Animation for current player
     *
     * @param {string} dict
     * @param {string} clip
     * @param {AnimationOptions} options
     */
    public play(dict: string, clip: string, options: AnimationOptions = {}): void {
        const defaultOptions = new AnimationOptions();
        options = { ...defaultOptions, ...options };

        native.taskPlayAnim(
            alt.Player.local.scriptID,
            dict,
            clip,
            options.speed,
            options.speedMultiplier,
            options.duration,
            options.flag,
            options.playbackRate,
            options.lockX,
            options.lockY,
            options.lockZ,
        );
    }

    public clear(): void {
        native.clearPedTasks(alt.Player.local.scriptID);
    }

    public isPlaying(dict: string, clip: string): boolean {
        return native.isEntityPlayingAnim(alt.Player.local.scriptID, dict, clip, 3);
    }
}
﻿import * as alt from "alt-client";
import * as native from "natives";
import { singleton } from "tsyringe";
import { EventModule } from "./event.module";
import { DialogInterface } from "../interfaces/dialog.interface";
import { Player } from "../extensions/player.extensions";
import {GuiModule} from "./gui.module";

@singleton()
export class DialogModule {
    get getCurrentDialog() {
        return this.currentDialog;
    }

    private currentDialog: DialogInterface;

    public constructor(
        private readonly event: EventModule,
        private readonly gui: GuiModule,
        private readonly player: Player) { }

    public create(dialog: DialogInterface): void {
        this.player.openMenu();
        this.player.showCursor();
        this.gui.focusView();
        this.currentDialog = dialog;

        if (dialog.freezeGameControls) {
            this.player.blockGameControls(true);
        }

        this.event.emitGui("dialog:create", dialog);
    }

    public destroy(): void {
        this.player.closeMenu();
        this.player.hideCursor();
        this.gui.unfocusView();
        
        if (this.currentDialog.freezeGameControls) {
            this.player.blockGameControls(false);
        }

        this.currentDialog = undefined;

        this.event.emitGui("dialog:destroy");
    }
} 
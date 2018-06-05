import { ipcRenderer } from "electron";
import * as path from "path";
import * as Config from "electron-config";

const config = new Config();

export class Configuration {
    private _autostart: boolean;

    public get dateformat(): string {
        let value = <string>config.get('dateformat');
        return value || 'ddd DD MMM HH:mm';
    }

    public set dateformat(value: string) {
        config.set('dateformat', value);
    }

    public get locale(): string {
        let value = <string>config.get('locale');
        return value || 'en-US';
    }

    public set locale(value: string) {
        config.set('locale', value);
    }

    public get firstDayOfWeek(): number {
        let value = config.get('firstDayOfWeek');
        if (!isNaN(value)) return <number>value;
        return 1;
    };

    public set firstDayOfWeek(value: number) {
        config.set('firstDayOfWeek', value);
    }

    public get autostart(): boolean {
        let value = config.get('autostart');
        return !!value;
    }

    public set autostart(value: boolean) {
        ipcRenderer.send('run-startup', value);
        config.set('autostart', value);
    }
}


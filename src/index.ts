import { ipcRenderer, shell } from "electron";
import { Calendar } from "./calendar/calendar";
import { Configuration } from "./configuration";

const config = new Configuration();

const togglePanel = () => {
    let cal = document.getElementById('calendar-container');
    let config = document.getElementById('config-container');
    let settings = document.getElementById('settings');

    if (cal.classList.contains('visible')) {
        cal.classList.remove('visible');
    } else {
        cal.classList.add('visible');
    }
    if (config.classList.contains('visible')) {
        config.classList.remove('visible');
    } else {
        config.classList.add('visible');
    }

    if (settings.className !== "config icon icon-cog") {
        ipcRenderer.send('reload-window');
    }
};

const onLoaded = () => {
    const calendar = new Calendar({ locale: config.locale, firstDayOfWeek: config.firstDayOfWeek });
    calendar.create(document.getElementById('calendar-container'));

    const settings = document.getElementById('settings');
    settings.addEventListener('click', togglePanel);  

    const dateformat = <HTMLInputElement>document.getElementById('dateformat');
    dateformat.value = config.dateformat;
    dateformat.addEventListener('blur', () => {
        config.dateformat = dateformat.value;
        settings.className = 'config icon icon-arrows-ccw';
    });

    const locale = <HTMLInputElement>document.getElementById('locale');
    locale.value = config.locale;
    locale.addEventListener('blur', () => {
        config.locale = locale.value;
        settings.className = 'config icon icon-arrows-ccw';
    });

    const firstDayOfWeek = <HTMLSelectElement>document.getElementById('firstDayOfWeek');
    firstDayOfWeek.value = config.firstDayOfWeek.toString();
    firstDayOfWeek.addEventListener('change', () => {
        config.firstDayOfWeek = parseInt(firstDayOfWeek.value);
        settings.className = 'config icon icon-arrows-ccw';
    });

    const autostart = <HTMLInputElement>document.getElementById('autostart');
    autostart.checked = config.autostart;
    autostart.addEventListener('click', () => {
        config.autostart = autostart.checked;
        settings.className = 'config icon icon-arrows-ccw';
    });
};

document.addEventListener('DOMContentLoaded', onLoaded);
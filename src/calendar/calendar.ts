interface CalendarOptions {
    locale?: string,
    firstDayOfWeek?: number
}

interface CalendarNames {
    long: string,
    short: string,
    narrow: string
}

export class Calendar {
    private element: HTMLElement;
    private locale: string
    private firstDayOfWeek: number;
    private dayNames: CalendarNames[];
    private monthNames: CalendarNames[];
    private currentMonth: number;
    private currentYear: number;
    
    constructor(options: CalendarOptions) {
        this.locale = options.locale || 'en-US';
        this.firstDayOfWeek = options.firstDayOfWeek || 0;
        this.dayNames = this.getDayNames();
        this.monthNames = this.getMonthNames();
        this.currentMonth = this.now.getMonth();
        this.currentYear = this.now.getFullYear();
        this.element = document.createElement('div');
    }

    public get now(): Date {
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    public create(rootElement: HTMLElement): void {
        rootElement.appendChild(this.element);
        this.draw();
    }

    public goNext(): void {
        let date = new Date(this.currentYear, this.currentMonth, 1);
        date.setMonth(date.getMonth() + 1);
        this.currentMonth = date.getMonth();
        this.currentYear = date.getFullYear();
        this.draw();
    }

    public goPrev(): void {
        let date = new Date(this.currentYear, this.currentMonth, 1);
        date.setMonth(date.getMonth() - 1);
        this.currentMonth = date.getMonth();
        this.currentYear = date.getFullYear();
        this.draw();
    }

    private draw(): void {
        let top = this.createTop();
        let table = this.createTable();
        this.element.innerHTML = '';
        this.element.appendChild(top);
        this.element.appendChild(table);
        this.element.className = 'calendar'; 
    }

    private createTop(): HTMLElement {
        let top = document.createElement('div');
        let next = document.createElement('i');
        let prev = document.createElement('i');
        let text = document.createElement('span');

        text.className = 'title';
        text.innerText = this.monthNames[this.currentMonth].long + ' ' + this.currentYear;

        prev.className = 'button button icon icon-left-open';
        next.className = 'button button icon icon-right-open';

        prev.onclick = () => this.goPrev();
        next.onclick = () => this.goNext();

        top.className = 'header';
        top.appendChild(prev);
        top.appendChild(text);
        top.appendChild(next);

        return top;
    }

    private createTable(): HTMLElement {
        let table = document.createElement('table');
        let header = this.createHeader();
        let body = this.createBody();
        table.appendChild(header);
        table.appendChild(body);
        return table;
    }

    private createHeader(): HTMLElement {
        let header = document.createElement('thead');
        let headerRow = document.createElement('tr');
        
        for (let i = this.firstDayOfWeek; i < 7; i++) {
            let headerCell = document.createElement('th');
            headerCell.innerText = this.dayNames[i].short;
            headerRow.appendChild(headerCell);
        }

        for (let i = 0; i < this.firstDayOfWeek; i++) {
            let headerCell = document.createElement('th');
            headerCell.innerText = this.dayNames[i].short;
            headerRow.appendChild(headerCell);
        }

        header.appendChild(headerRow);
        return header;
    }

    private createBody(): HTMLElement {
        let body = document.createElement('tbody');
        let baseDate = new Date(this.currentYear, this.currentMonth, 1);
        let row: HTMLElement = document.createElement('tr');
        let counter: number = 0;
        body.appendChild(row);

        if (baseDate.getDay() !== this.firstDayOfWeek) {
            for(let i = this.firstDayOfWeek; i < 7; i++) {
                if (i === baseDate.getDay()) break;
                let cell = document.createElement('td');
                row.appendChild(cell);
                counter++;
            }

            if (baseDate.getDay() < this.firstDayOfWeek) {
                for(let i = 0; i < this.firstDayOfWeek; i++) {
                    if (i === baseDate.getDay()) break;
                    let cell = document.createElement('td');
                    row.appendChild(cell);
                    counter++;
                }
            }
        }

        do {
            if (counter >= 7) {
                counter = 0;
                row = document.createElement('tr');
                body.appendChild(row);
            }

            let cell = document.createElement('td');
            cell.innerText = baseDate.getDate().toString();
            row.appendChild(cell);

            if (baseDate.toString() === this.now.toString()) {
                cell.className = 'today';
            }

            counter++;
            baseDate.setDate(baseDate.getDate() + 1);
        } while (baseDate.getMonth() === this.currentMonth);

        for (let i = counter; i < 7; i++) {
            let cell = document.createElement('td');
            row.appendChild(cell);
        }

        return body;
    }

    private getDayNames(): CalendarNames[] {
        let result: CalendarNames[] = [];
        let baseDate = new Date(2017, 0, 1); //sunday
        for(let i = 0; i < 7; i++) {
            result.push({
                long: baseDate.toLocaleDateString(this.locale, { weekday: 'long' }),
                short: baseDate.toLocaleDateString(this.locale, { weekday: 'short' }),
                narrow: baseDate.toLocaleDateString(this.locale, { weekday: 'narrow' })
            });
            baseDate.setDate(baseDate.getDate() + 1);
        }

        return result;
    }

    private getMonthNames(): CalendarNames[] {
        let result: CalendarNames[] = [];
        for(let i = 0; i < 12; i++) {
            let baseDate = new Date(2017, i, 1); //sunday
            result.push({
                long: baseDate.toLocaleDateString(this.locale, { month: 'long' }),
                short: baseDate.toLocaleDateString(this.locale, { month: 'short' }),
                narrow: baseDate.toLocaleDateString(this.locale, { month: 'narrow' })
            });
        }

        return result;
    }
}
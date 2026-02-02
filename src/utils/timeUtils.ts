export type ViewType = 'month' | 'year' | 'life';

export interface TimeData {
    totalDays: number;
    passedDays: number;
    remainingDays: number;
    label: string;
    progress: number;
}

export interface DotCell {
    index: number;
    isPassed: boolean;
    isToday: boolean;
}

const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

const getDaysInYear = (year: number): number => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
};

const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

export const getTimeData = (viewType: ViewType, birthYear: number): TimeData => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    switch (viewType) {
        case 'month': {
            const totalDays = getDaysInMonth(currentYear, currentMonth);
            const passedDays = currentDay - 1;
            return {
                totalDays,
                passedDays,
                remainingDays: totalDays - passedDays,
                label: 'days left this month',
                progress: passedDays / totalDays,
            };
        }
        case 'year': {
            const totalDays = getDaysInYear(currentYear);
            const passedDays = getDayOfYear(now) - 1;
            return {
                totalDays,
                passedDays,
                remainingDays: totalDays - passedDays,
                label: 'days left this year',
                progress: passedDays / totalDays,
            };
        }
        case 'life': {
            const lifeExpectancy = 85;
            const totalYears = lifeExpectancy;
            const ageInYears = currentYear - birthYear;
            const passedYears = Math.min(ageInYears, totalYears);
            return {
                totalDays: totalYears,
                passedDays: passedYears,
                remainingDays: Math.max(0, totalYears - passedYears),
                label: 'years remaining',
                progress: passedYears / totalYears,
            };
        }
        default:
            return { totalDays: 0, passedDays: 0, remainingDays: 0, label: '', progress: 0 };
    }
};

export const generateDotCells = (timeData: TimeData, viewType: ViewType): DotCell[] => {
    const cells: DotCell[] = [];
    const now = new Date();
    const currentDay = viewType === 'month' ? now.getDate() : getDayOfYear(now);
    const todayIndex = viewType === 'life' ? -1 : currentDay - 1;

    for (let i = 0; i < timeData.totalDays; i++) {
        cells.push({
            index: i,
            isPassed: i < timeData.passedDays,
            isToday: i === todayIndex,
        });
    }
    return cells;
};

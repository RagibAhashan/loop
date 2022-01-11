import { Country, getRegions } from '@common/Regions';
import { v4 as uuid } from 'uuid';
import { AccountStatusLevel } from './models/account';
import { TaskStatusLevel } from './task';

export const generateId = (prefix?: string): string => {
    const id = uuid().replace(/-/g, '');

    if (prefix) {
        return `${prefix}_${id}`;
    } else {
        return id;
    }
};

export const getMonths = (): { value: string; label: string }[] => {
    return [
        { value: '01', label: '01' },
        { value: '02', label: '02' },
        { value: '03', label: '03' },
        { value: '04', label: '04' },
        { value: '05', label: '05' },
        { value: '06', label: '06' },
        { value: '07', label: '07' },
        { value: '08', label: '08' },
        { value: '09', label: '09' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
        { value: '12', label: '12' },
    ];
};

export const getYears = (): { value: string; label: string }[] => {
    const year = new Date().getFullYear();
    const years: any = [];
    for (let i = year; i < year + 15; i++) {
        years.push({
            value: i.toString(),
            label: i,
        });
    }
    return years;
};

export const getCountriesOptions = (): { value: Country; label: Country }[] => {
    return [
        { value: 'Canada', label: 'Canada' },
        { value: 'United States', label: 'United States' },
    ];
};

export const getRegionsOptions = (country: string | undefined): { value: string; label: string }[] => {
    if (!country) return [];

    return Object.keys(getRegions(country as Country)).map((region) => {
        return { value: region, label: region };
    });
};

export const taskStatusColor = (level: TaskStatusLevel) => {
    switch (level) {
        case 'idle':
            return '#faa61a';
        case 'info':
            return 'white';
        case 'success':
            return 'green';
        case 'error':
            return '#ff001e';
        case 'cancel':
        case 'fail':
            return '#f7331e';
        default:
            return 'white';
    }
};

export const accountStatusColor = (level: AccountStatusLevel) => {
    switch (level) {
        case 'info':
            return 'white';
        case 'success':
            return 'green';
        case 'error':
            return '#ff001e';
        default:
            return 'white';
    }
};

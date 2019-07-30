import moment from 'moment';

export function formatMomentDate(date, format = 'DD.MM.YYYY') {
    if (date) {
        return moment(date).format(format);
    }
    return undefined;
}

export function formatMomentDateTime(date, format = 'DD.MM.YYYY HH:mm') {
    return formatMomentDate(date, format);
}

export function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
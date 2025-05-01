class DateUtils {
    static formatTimeDifference(date1, date2) {
        const diff = date2 - date1;
        const isNegative = diff < 0;
        const absDiff = Math.abs(diff);

        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

        return {
            days: days.toString().padStart(3, '0'),
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            isNegative
        };
    }

    static formatCurrentTime(date) {
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        const day = days[date.getDay()];
        const month = months[date.getMonth()];
        const dateNum = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}, ${month} ${dateNum}, ${year} ${hours}:${minutes}:${seconds}`;
    }

    static formatCountdownTime(timeObj) {
        const prefix = timeObj.isNegative ? '-' : '';
        return `${prefix}${timeObj.days}:${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}`;
    }

    static formatTabTitle(timeObj) {
        const prefix = timeObj.isNegative ? '-' : '';
        return `${prefix}${timeObj.days}d ${timeObj.hours}h ${timeObj.minutes}m ${timeObj.seconds}s`;
    }
} 
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

    static formatLongDate(date) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        const dayOfWeek = days[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        // Add ordinal suffix to the day
        const ordinalSuffix = this.getOrdinalSuffix(dayOfMonth);
        
        return `${dayOfWeek}, ${dayOfMonth}${ordinalSuffix}, ${month} ${year}`;
    }
    
    static getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
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
class WeekendCalculator {
    static getNextWeekendEvent(currentTime) {
        const thursday = 4;
        const sunday = 0;
        
        const currentDay = currentTime.getDay();
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        
        // Check if we're currently in the weekend (Thursday 3pm to Sunday 8am)
        const isThursdayAfternoon = currentDay === thursday && (currentHour > 15 || (currentHour === 15 && currentMinutes >= 0));
        const isFriday = currentDay === 5;
        const isSaturday = currentDay === 6;
        const isSundayMorning = currentDay === sunday && currentHour < 8;
        
        const isWeekend = isThursdayAfternoon || isFriday || isSaturday || isSundayMorning;
        
        let targetDate = new Date(currentTime);
        let eventType;
        
        if (isWeekend) {
            // We're in weekend - count until it ends (Sunday 8am)
            eventType = 'weekend-ending';
            
            // Set to next Sunday 8am
            if (currentDay !== sunday) {
                // Calculate days until Sunday
                const daysUntilSunday = (sunday - currentDay + 7) % 7;
                targetDate.setDate(currentTime.getDate() + daysUntilSunday);
            }
            
            // Set to 8:00 AM
            targetDate.setHours(8, 0, 0, 0);
        } else {
            // We're not in weekend - count until next weekend starts (Thursday 3pm)
            eventType = 'weekend-starting';
            
            // Calculate days until next Thursday
            let daysUntilThursday = (thursday - currentDay + 7) % 7;
            // If we're on Thursday but before 3pm, we don't need to add 7 days
            if (currentDay === thursday && currentHour < 15) {
                daysUntilThursday = 0;
            }
            
            targetDate.setDate(currentTime.getDate() + daysUntilThursday);
            
            // Set to 3:00 PM (15:00)
            targetDate.setHours(15, 0, 0, 0);
        }
        
        return { targetDate, eventType };
    }

    static createWeekendEvent() {
        const now = new Date();
        const { targetDate, eventType } = this.getNextWeekendEvent(now);
        
        const isWeekendOngoing = eventType === 'weekend-ending';
        
        return {
            id: 'weekend',
            title: isWeekendOngoing ? 'Weekend Ending' : 'Next Weekend',
            targetDate: targetDate.toISOString(),
            since_text: isWeekendOngoing ? 'Weekend has been going on for:' : '',
            until_text: isWeekendOngoing ? 'Time until weekend ends:' : 'Time until weekend:',
            final_date_text: isWeekendOngoing ? 'Weekend ends on:' : 'Weekend starts on:',
            enabled: true
        };
    }
} 
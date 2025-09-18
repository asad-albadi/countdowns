class BirthdayCalculator {
    static async loadBirthdays() {
        try {
            const response = await fetch('data/birthdays.json');
            const birthdays = await response.json();
            return birthdays.filter(birthday => birthday.enabled !== false);
        } catch (error) {
            console.error('Error loading birthdays:', error);
            return [];
        }
    }

    static createBirthdayCountdowns(birthdays) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
        const currentDay = now.getDate();
        
        return birthdays.map(birthday => {
            const { month, day } = this.parseBirthday(birthday.birthday);
            
            // Only show countdown if we're in the birthday month AND the birthday hasn't passed yet
            const shouldShowCountdown = this.shouldShowCountdown(now, month, day);
            
            if (!shouldShowCountdown) {
                return null; // Don't show this countdown
            }
            
            // Calculate the next birthday year
            let nextBirthdayYear = currentYear;
            if (month < currentMonth || (month === currentMonth && day < currentDay)) {
                nextBirthdayYear = currentYear + 1;
            }
            
            // Create the birthday date for the countdown
            const birthdayDate = new Date(nextBirthdayYear, month - 1, day, 0, 0, 0, 0);
            
            
            return {
                id: birthday.id,
                enabled: birthday.enabled,
                title: `${birthday.name}'s Birthday`,
                targetDate: birthdayDate.toISOString(),
                since_text: `Since ${birthday.name}'s Birthday:`,
                until_text: `${birthday.name}'s Birthday In:`,
                final_date_text: `Birthday Date`,
                disable_after_zero: birthday.disable_after_zero || false,
                isBirthday: true,
                birthdayMonth: month,
                birthdayDay: day,
                personName: birthday.name
            };
        }).filter(countdown => countdown !== null);
    }

    static parseBirthday(birthdayString) {
        // Parse birthday string like "12-Oct" or "1-Jan"
        const [dayStr, monthStr] = birthdayString.split('-');
        const day = parseInt(dayStr, 10);
        
        const monthNames = {
            'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
            'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
        };
        
        const month = monthNames[monthStr];
        
        return { month, day };
    }

    static shouldShowCountdown(now, birthdayMonth, birthdayDay) {
        const currentYear = now.getFullYear();

        // Create the birthday date for this year
        const birthdayThisYear = new Date(currentYear, birthdayMonth - 1, birthdayDay, 0, 0, 0, 0);
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysDiff = (birthdayThisYear - now) / msPerDay;

        // Show birthday if:
        // 1. Countdown appearance: 10 days or less remaining, OR
        // 2. Early birthday appearance: 1 day remaining until 0.5 days before birthday, OR
        // 3. Celebration appearance: 0 to -0.5 days (birthday day celebration)
        return (daysDiff >= 0 && daysDiff <= 10) || (daysDiff >= 0.5 && daysDiff <= 1) || (daysDiff >= -0.5 && daysDiff <= 0);
    }

 
    static getActiveBirthdayCountdowns(birthdays) {
        // This method returns birthday countdowns that should be currently active
        const countdowns = this.createBirthdayCountdowns(birthdays);
        return countdowns;
    }

    static getNextBirthday(birthdays) {
        // Find the next upcoming birthday
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();
        
        let nextBirthday = null;
        let shortestDays = Infinity;
        
        birthdays.forEach(birthday => {
            if (!birthday.enabled) return;
            
            const { month, day } = this.parseBirthday(birthday.birthday);
            
            // Calculate days until birthday
            let birthdayThisYear = new Date(currentYear, month - 1, day);
            let daysUntil = Math.ceil((birthdayThisYear - now) / (1000 * 60 * 60 * 24));
            
            // If birthday has passed this year, calculate for next year
            if (daysUntil < 0) {
                const birthdayNextYear = new Date(currentYear + 1, month - 1, day);
                daysUntil = Math.ceil((birthdayNextYear - now) / (1000 * 60 * 60 * 24));
            }
            
            if (daysUntil < shortestDays) {
                shortestDays = daysUntil;
                nextBirthday = birthday;
            }
        });
        
        return nextBirthday;
    }
} 

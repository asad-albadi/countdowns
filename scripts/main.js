class CountdownManager {
    constructor() {
        this.countdowns = [];
        this.currentTimeElement = document.getElementById('current-time');
        this.countdownsContainer = document.getElementById('countdowns-container');
        this.initialize();
    }

    async initialize() {
        try {
            // Load countdowns from JSON file
            const response = await fetch('data/countdowns.json');
            this.countdowns = await response.json();
            
            // Add weekend countdown
            this.countdowns.push(WeekendCalculator.createWeekendEvent());
            
            // Create countdown cards
            this.createCountdownCards();
            
            // Start updates
            this.startUpdates();
        } catch (error) {
            console.error('Error initializing countdowns:', error);
        }
    }

    createCountdownCards() {
        this.countdowns.forEach(countdown => {
            const card = document.createElement('div');
            card.className = 'countdown-card';
            card.innerHTML = `
                <div class="countdown-title">${countdown.title}</div>
                <div class="countdown-time" data-id="${countdown.id}">--:--:--:--</div>
                <div class="countdown-label" data-id="${countdown.id}">${countdown.until_text}</div>
                <div class="countdown-date" data-id="${countdown.id}">${countdown.final_date_text}</div>
            `;
            this.countdownsContainer.appendChild(card);
        });
    }

    startUpdates() {
        // Update current time
        setInterval(() => {
            const now = new Date();
            this.currentTimeElement.textContent = DateUtils.formatCurrentTime(now);
            
            // Update each countdown
            this.countdowns.forEach(countdown => {
                const targetDate = new Date(countdown.targetDate);
                const timeDiff = DateUtils.formatTimeDifference(now, targetDate);
                
                // Update time display
                const timeElement = document.querySelector(`.countdown-time[data-id="${countdown.id}"]`);
                timeElement.textContent = DateUtils.formatCountdownTime(timeDiff);
                
                // Update label
                const labelElement = document.querySelector(`.countdown-label[data-id="${countdown.id}"]`);
                labelElement.textContent = timeDiff.isNegative ? countdown.since_text : countdown.until_text;
                
                // Update date
                const dateElement = document.querySelector(`.countdown-date[data-id="${countdown.id}"]`);
                dateElement.textContent = `${countdown.final_date_text} ${targetDate.toLocaleDateString()}`;
                
                // Add animation class
                timeElement.classList.add('updating');
                setTimeout(() => timeElement.classList.remove('updating'), 500);
            });
            
            // Update tab title with weekend countdown
            const weekendCountdown = this.countdowns.find(c => c.id === 'weekend');
            if (weekendCountdown) {
                const targetDate = new Date(weekendCountdown.targetDate);
                const timeDiff = DateUtils.formatTimeDifference(now, targetDate);
                document.title = DateUtils.formatTabTitle(timeDiff);
            }
        }, 1000);
    }
}

// Initialize the countdown manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountdownManager();
}); 
class CountdownManager {
    constructor() {
        this.countdowns = [];
        this.currentTimeElement = document.getElementById('current-time');
        this.countdownsContainer = document.getElementById('countdowns-container');
        this.mainCountdownId = 'weekend'; // Default to weekend as the main countdown
        this.isFullscreen = false;
        this.fullscreenElement = null;
        this.initialize();
    }

    async initialize() {
        try {
            // Load countdowns from JSON file
            const response = await fetch('data/countdowns.json');
            this.countdowns = await response.json();
            
            // Load and add birthday countdowns
            const birthdays = await BirthdayCalculator.loadBirthdays();
            const birthdayCountdowns = BirthdayCalculator.createBirthdayCountdowns(birthdays);
            this.countdowns = this.countdowns.concat(birthdayCountdowns);
            
            // Add weekend countdown
            this.countdowns.push(WeekendCalculator.createWeekendEvent());
            
            // Filter out disabled countdowns
            this.countdowns = this.countdowns.filter(countdown => 
                countdown.enabled === undefined || countdown.enabled === true
            );
            
            // Create countdown cards
            this.createCountdownCards();
            
            // Set the main countdown
            this.setMainCountdown(this.mainCountdownId);
            
            // Start updates
            this.startUpdates();
            
            // Start birthday refresh timer (check every hour for new birthday countdowns)
            this.startBirthdayRefresh();

            // Add fullscreen change detection
            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement) {
                    this.exitFullscreenMode();
                }
            });
        } catch (error) {
            console.error('Error initializing countdowns:', error);
        }
    }

    createCountdownCards() {
        // Sort countdowns: birthdays by nearest date, others maintain order
        const sortedCountdowns = this.sortCountdowns(this.countdowns);
        
        sortedCountdowns.forEach(countdown => {
            const card = document.createElement('div');
            const category = this.getCountdownCategory(countdown);
            const icon = this.getCountdownIcon(countdown);
            
            card.className = `countdown-card ${category}`;
            card.dataset.id = countdown.id;
            card.innerHTML = `
                <div class="countdown-header">
                    <i data-lucide="${icon}" class="countdown-icon"></i>
                    <div class="countdown-title">${countdown.title}</div>
                </div>
                <div class="countdown-time" data-id="${countdown.id}">--:--:--:--</div>
                <div class="countdown-label" data-id="${countdown.id}">${countdown.until_text}</div>
                <div class="countdown-date" data-id="${countdown.id}">${countdown.final_date_text}</div>
            `;
            
            // Add click event to make this the main countdown
            card.addEventListener('click', (e) => {
                // Skip if clicking on fullscreen button
                if (e.target.closest('.fullscreen-button')) return;
                this.setMainCountdown(countdown.id);
            });
            
            this.countdownsContainer.appendChild(card);
        });
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    sortCountdowns(countdowns) {
        const now = new Date();
        const birthdays = countdowns.filter(c => c.isBirthday);
        const others = countdowns.filter(c => !c.isBirthday);
        
        // Sort birthdays by days until birthday (nearest first)
        birthdays.sort((a, b) => {
            const daysA = this.getDaysUntilTarget(now, new Date(a.targetDate));
            const daysB = this.getDaysUntilTarget(now, new Date(b.targetDate));
            return daysA - daysB;
        });
        
        // Return sorted birthdays first, then others
        return [...birthdays, ...others];
    }
    
    getDaysUntilTarget(now, targetDate) {
        const timeDiff = targetDate - now;
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }
    
    getCountdownCategory(countdown) {
        if (countdown.isBirthday) return 'birthday';
        if (countdown.id === 'weekend') return 'weekend';
        
        const title = countdown.title.toLowerCase();
        if (title.includes('steam') || title.includes('gamescom') || title.includes('game')) return 'gaming';
        if (title.includes('eid') || title.includes('holiday')) return 'holiday';
        if (title.includes('wedding') || title.includes('event')) return 'event';
        
        return 'default';
    }
    
    getCountdownIcon(countdown) {
        const category = this.getCountdownCategory(countdown);
        
        const iconMap = {
            birthday: 'cake',
            weekend: 'calendar-days',
            gaming: 'gamepad-2',
            holiday: 'star',
            event: 'party-popper',
            default: 'clock'
        };
        
        return iconMap[category] || 'clock';
    }

    setMainCountdown(countdownId) {
        // Check if the requested countdown exists and is enabled
        const countdown = this.countdowns.find(c => c.id === countdownId);
        if (!countdown) {
            // If requested countdown doesn't exist, default to the first enabled one
            countdownId = this.countdowns.length > 0 ? this.countdowns[0].id : null;
            if (!countdownId) return; // No countdowns available
        }
        
        // Remove main-countdown class from all cards
        const allCards = document.querySelectorAll('.countdown-card');
        allCards.forEach(card => {
            card.classList.remove('main-countdown');
            
            // Remove any existing fullscreen buttons
            const existingButton = card.querySelector('.fullscreen-button');
            if (existingButton) {
                existingButton.remove();
            }
        });
        
        // Add main-countdown class to the selected card
        const selectedCard = document.querySelector(`.countdown-card[data-id="${countdownId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('main-countdown');
            
            // Add fullscreen button
            this.addFullscreenButton(selectedCard, countdownId);
            
            // Update the main countdown ID
            this.mainCountdownId = countdownId;
            
            // Make it first in the container (for mobile view)
            this.countdownsContainer.prepend(selectedCard);
        }
    }
    
    addFullscreenButton(card, countdownId) {
        const button = document.createElement('button');
        button.className = 'fullscreen-button';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
        `;
        button.title = "Toggle fullscreen";
        
        button.addEventListener('click', () => {
            this.toggleFullscreen(countdownId);
        });
        
        card.appendChild(button);
    }
    
    toggleFullscreen(countdownId) {
        if (this.isFullscreen) {
            this.exitFullscreenMode();
        } else {
            this.enterFullscreenMode(countdownId);
        }
    }
    
    enterFullscreenMode(countdownId) {
        // Don't do anything if already in fullscreen
        if (this.isFullscreen) return;
        
        // Find the countdown data
        const countdown = this.countdowns.find(c => c.id === countdownId);
        if (!countdown) return;
        
        // Create fullscreen element
        this.fullscreenElement = document.createElement('div');
        this.fullscreenElement.className = 'fullscreen-mode';
        this.fullscreenElement.innerHTML = `
            <div class="countdown-title">${countdown.title}</div>
            <div class="countdown-time" data-id="${countdown.id}-fullscreen">--:--:--:--</div>
            <div class="countdown-label" data-id="${countdown.id}-fullscreen">${countdown.until_text}</div>
            <div class="countdown-date" data-id="${countdown.id}-fullscreen">${countdown.final_date_text}</div>
            <button class="fullscreen-button" style="position: absolute; top: 20px; right: 20px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                </svg>
            </button>
        `;
        
        // Add exit fullscreen button
        const exitButton = this.fullscreenElement.querySelector('.fullscreen-button');
        exitButton.addEventListener('click', () => {
            this.exitFullscreenMode();
        });
        
        // Add to body
        document.body.appendChild(this.fullscreenElement);
        
        // Set flag
        this.isFullscreen = true;
        this.fullscreenCountdownId = countdownId;
        
        // Try to request actual fullscreen if supported
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log("Error attempting to enable fullscreen:", err);
            });
        }
    }
    
    exitFullscreenMode() {
        // Remove the fullscreen element if it exists
        if (this.fullscreenElement && this.fullscreenElement.parentNode) {
            this.fullscreenElement.parentNode.removeChild(this.fullscreenElement);
        }
        
        // Reset flag
        this.isFullscreen = false;
        this.fullscreenElement = null;
        
        // Exit actual fullscreen if we're in it
        if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(err => {
                console.log("Error attempting to exit fullscreen:", err);
            });
        }
    }

    startBirthdayRefresh() {
        // Check for new birthday countdowns every hour
        setInterval(async () => {
            try {
                const birthdays = await BirthdayCalculator.loadBirthdays();
                const newBirthdayCountdowns = BirthdayCalculator.createBirthdayCountdowns(birthdays);
                
                // Check if there are new birthday countdowns to add
                newBirthdayCountdowns.forEach(newCountdown => {
                    const existingCountdown = this.countdowns.find(c => c.id === newCountdown.id);
                    if (!existingCountdown) {
                        // Add new birthday countdown
                        this.countdowns.push(newCountdown);
                        
                        // Create the countdown card
                        const card = document.createElement('div');
                        const category = this.getCountdownCategory(newCountdown);
                        const icon = this.getCountdownIcon(newCountdown);
                        
                        card.className = `countdown-card ${category}`;
                        card.dataset.id = newCountdown.id;
                        card.innerHTML = `
                            <div class="countdown-header">
                                <i data-lucide="${icon}" class="countdown-icon"></i>
                                <div class="countdown-title">${newCountdown.title}</div>
                            </div>
                            <div class="countdown-time" data-id="${newCountdown.id}">--:--:--:--</div>
                            <div class="countdown-label" data-id="${newCountdown.id}">${newCountdown.until_text}</div>
                            <div class="countdown-date" data-id="${newCountdown.id}">${newCountdown.final_date_text}</div>
                        `;
                        
                        // Add click event to make this the main countdown
                        card.addEventListener('click', (e) => {
                            // Skip if clicking on fullscreen button
                            if (e.target.closest('.fullscreen-button')) return;
                            this.setMainCountdown(newCountdown.id);
                        });
                        
                        this.countdownsContainer.appendChild(card);
                        
                        // Initialize Lucide icons for the new card
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                    }
                });
            } catch (error) {
                console.error('Error refreshing birthday countdowns:', error);
            }
        }, 3600000); // Check every hour (3600000 milliseconds)
    }

    startUpdates() {
        // Update current time
        setInterval(() => {
            const now = new Date();
            this.currentTimeElement.textContent = DateUtils.formatCurrentTime(now);
            
            // Update each countdown
            this.countdowns.forEach((countdown, index) => {
                const targetDate = new Date(countdown.targetDate);
                const timeDiff = DateUtils.formatTimeDifference(now, targetDate);
                
                // Special handling for birthday countdowns
                if (countdown.isBirthday && timeDiff.isNegative) {
                    // For birthdays, hide the countdown after the birthday passes
                    // until the next occurrence of the birthday month
                    const card = document.querySelector(`.countdown-card[data-id="${countdown.id}"]`);
                    if (card) {
                        card.remove();
                    }
                    
                    // Remove from countdowns array
                    this.countdowns.splice(index, 1);
                    
                    // If this was the main countdown, set a new main countdown
                    if (this.mainCountdownId === countdown.id) {
                        this.setMainCountdown(this.countdowns[0]?.id);
                    }
                    
                    return;
                }
                
                // Check if countdown should be disabled after reaching zero (for non-birthday countdowns)
                if (countdown.disable_after_zero && timeDiff.isNegative && !countdown.isBirthday) {
                    // Remove the countdown card
                    const card = document.querySelector(`.countdown-card[data-id="${countdown.id}"]`);
                    if (card) {
                        card.remove();
                    }
                    
                    // Remove from countdowns array
                    this.countdowns.splice(index, 1);
                    
                    // If this was the main countdown, set a new main countdown
                    if (this.mainCountdownId === countdown.id) {
                        this.setMainCountdown(this.countdowns[0]?.id);
                    }
                    
                    return;
                }
                
                // Update time display
                const timeElement = document.querySelector(`.countdown-time[data-id="${countdown.id}"]`);
                if (timeElement) {
                    timeElement.textContent = DateUtils.formatCountdownTime(timeDiff);
                    // Add animation class
                    timeElement.classList.add('updating');
                    setTimeout(() => timeElement.classList.remove('updating'), 500);
                }
                
                // Update label
                const labelElement = document.querySelector(`.countdown-label[data-id="${countdown.id}"]`);
                if (labelElement) {
                    labelElement.textContent = timeDiff.isNegative ? countdown.since_text : countdown.until_text;
                }
                
                // Update date
                const dateElement = document.querySelector(`.countdown-date[data-id="${countdown.id}"]`);
                if (dateElement) {
                    dateElement.textContent = `${countdown.final_date_text}: ${DateUtils.formatLongDate(targetDate)}`;
                }
                
                // Update fullscreen version if it exists and matches the current fullscreen countdown
                if (this.isFullscreen && this.fullscreenCountdownId === countdown.id) {
                    const fsTimeElement = document.querySelector(`.countdown-time[data-id="${countdown.id}-fullscreen"]`);
                    if (fsTimeElement) {
                        fsTimeElement.textContent = DateUtils.formatCountdownTime(timeDiff);
                        fsTimeElement.classList.add('updating');
                        setTimeout(() => fsTimeElement.classList.remove('updating'), 500);
                    }
                    
                    const fsLabelElement = document.querySelector(`.countdown-label[data-id="${countdown.id}-fullscreen"]`);
                    if (fsLabelElement) {
                        fsLabelElement.textContent = timeDiff.isNegative ? countdown.since_text : countdown.until_text;
                    }
                    
                    const fsDateElement = document.querySelector(`.countdown-date[data-id="${countdown.id}-fullscreen"]`);
                    if (fsDateElement) {
                        fsDateElement.textContent = `${countdown.final_date_text}: ${DateUtils.formatLongDate(targetDate)}`;
                    }
                }
            });
            
            // Update tab title with the main countdown
            const mainCountdown = this.countdowns.find(c => c.id === this.mainCountdownId);
            if (mainCountdown) {
                const targetDate = new Date(mainCountdown.targetDate);
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
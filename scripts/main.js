class CountdownManager {
    constructor() {
        this.countdowns = [];
        this.currentTimeElement = document.getElementById('current-time');
        this.countdownsContainer = document.getElementById('countdowns-container');
        this.mainCountdownId = 'weekend'; // Default to weekend as the main countdown
        this.isFullscreen = false;
        this.fullscreenElement = null;
        // Birthday party state
        this.birthdayPartyActive = false;
        this.birthdayPartyForId = null;
        this.currentPartyBirthdayIds = [];
        this.birthdayMessageTimer = null;
        this.birthdayMessages = [
            "Happy Birthday, {name}! 🎉",
            "Wishing you a day full of joy, {name}! 🥳",
            "Let’s celebrate YOU today, {name}! 🎂",
            "Cheers to another amazing year, {name}! 🎈",
            "Have a fantastic birthday, {name}! 🎊",
            "Cake, smiles, and good vibes, {name}! 🍰",
            "Make a wish, {name}! ✨",
            "You’re the star today, {name}! ⭐",
            "Big hugs and birthday cheers, {name}! 🎁",
            "Hope your day sparkles, {name}! 💖"
        ];
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
            
            // Filter out disabled countdowns and events more than 20 days away
            this.countdowns = this.countdowns.filter(countdown => {
                if (countdown.enabled === false) return false;

                // For non-birthday events, only show if within 20 days or until endDate
                if (!countdown.isBirthday) {
                    const targetDate = new Date(countdown.targetDate);
                    const now = new Date();
                    const msPerDay = 1000 * 60 * 60 * 24;
                    const daysDiff = Math.ceil((targetDate - now) / msPerDay);

                    // If event has an endDate, show until endDate passes
                    if (countdown.endDate) {
                        const endDate = new Date(countdown.endDate);
                        const daysFromEnd = Math.ceil((endDate - now) / msPerDay);
                        return daysFromEnd >= 0 && daysDiff <= 20;
                    }

                    // Otherwise, show only if within 20 days
                    return daysDiff >= 0 && daysDiff <= 20;
                }

                return true; // Keep all birthdays (they have their own filter)
            });
            
            // Create countdown cards
            this.createCountdownCards();
            
            // Set the main countdown
            this.setMainCountdown(this.mainCountdownId);
            
            // Start time/text updates (1s)
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

        // Check if event is currently ongoing (between start and end dates)
        if (countdown.endDate) {
            const now = new Date();
            const startDate = new Date(countdown.targetDate);
            const endDate = new Date(countdown.endDate);

            if (now >= startDate && now <= endDate) {
                // Event is ongoing - use "ongoing-" prefix with the category
                const baseCategory = countdown.category || 'default';
                return `ongoing-${baseCategory}`;
            }
        }

        // Use category field from JSON if available
        if (countdown.category) return countdown.category;

        // Fallback to title-based detection
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
            'ongoing-gaming': 'play-circle',
            holiday: 'star',
            event: 'party-popper',
            'ongoing-default': 'activity',
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
        // Mark body for fullscreen-centric styling (e.g., center birthday overlay)
        document.body.classList.add('is-fullscreen');
        
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
        document.body.classList.remove('is-fullscreen');
        
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

    // Determine if birthday is within celebration window (0 to -0.5 days)
    isWithinBirthdayWindow(now, targetDate) {
        const msPerDay = 1000 * 60 * 60 * 24;
        const diffDays = (targetDate - now) / msPerDay; // can be negative
        return diffDays <= 0 && diffDays >= -0.5;
    }

    // Activate bright celebration theme and focus birthdays
    activateBirthdayParty(birthdayCountdowns, primaryCountdown) {
        const activeIds = birthdayCountdowns.map(b => b.id);
        const idsChanged = this.currentPartyBirthdayIds.join(',') !== activeIds.join(',');
        // If already active with same set, only ensure main focus
        if (this.birthdayPartyActive && !idsChanged) {
            if (primaryCountdown && this.birthdayPartyForId !== primaryCountdown.id) {
                this.setMainCountdown(primaryCountdown.id);
                this.birthdayPartyForId = primaryCountdown.id;
            }
            return;
        }
        // Reset and start fresh
        this.deactivateBirthdayParty();
        document.body.classList.add('birthday-party');
        this.birthdayPartyActive = true;
        this.birthdayPartyForId = primaryCountdown ? primaryCountdown.id : (activeIds[0] || null);
        this.currentPartyBirthdayIds = activeIds;
        if (this.birthdayPartyForId) this.setMainCountdown(this.birthdayPartyForId);

        // Apply visibility: show only active birthdays
        this.applyPartyVisibility(activeIds);

        // Create overlay containers (top banner style)
        const overlay = document.createElement('div');
        overlay.className = 'birthday-overlay';
        overlay.id = 'birthday-overlay';
        const confetti = document.createElement('div');
        confetti.className = 'birthday-confetti';
        confetti.id = 'birthday-confetti';
        document.body.appendChild(confetti);
        document.body.appendChild(overlay);

        // Prepare names (shuffle for fairness)
        const names = birthdayCountdowns.map(b => b.personName || b.title.replace(/'s Birthday.*/i, '').trim());
        for (let i = names.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [names[i], names[j]] = [names[j], names[i]];
        }
        let idx = 0;

        const showMessage = () => {
            if (!names.length) return;
            const name = names[idx % names.length];
            idx++;
            const msgTmpl = this.birthdayMessages[Math.floor(Math.random() * this.birthdayMessages.length)];
            const msg = msgTmpl.replace('{name}', name);
            overlay.innerHTML = '';
            const msgEl = document.createElement('div');
            msgEl.className = 'birthday-message';
            msgEl.textContent = msg;
            overlay.appendChild(msgEl);
            if (names.length > 1) {
                const listEl = document.createElement('div');
                listEl.className = 'birthday-names';
                names.forEach(n => {
                    const chip = document.createElement('div');
                    chip.className = 'name-chip';
                    chip.textContent = n;
                    listEl.appendChild(chip);
                });
                overlay.appendChild(listEl);
            }
        };
        showMessage();
        this.birthdayMessageTimer = setInterval(showMessage, 6000);

        // Start lightweight confetti loop
        this.startConfetti(confetti);
    }

    // Stop celebration mode and cleanup
    deactivateBirthdayParty() {
        if (this.birthdayMessageTimer) {
            clearInterval(this.birthdayMessageTimer);
            this.birthdayMessageTimer = null;
        }
        document.body.classList.remove('birthday-party');
        const overlay = document.getElementById('birthday-overlay');
        if (overlay) overlay.remove();
        const confetti = document.getElementById('birthday-confetti');
        if (confetti) confetti.remove();
        this.birthdayPartyActive = false;
        this.birthdayPartyForId = null;
        this.currentPartyBirthdayIds = [];
        // Restore all cards visibility
        this.applyPartyVisibility(null);
    }

    applyPartyVisibility(activeIds) {
        const allCards = document.querySelectorAll('.countdown-card');
        if (!activeIds || activeIds.length === 0) {
            // show all
            allCards.forEach(card => card.style.removeProperty('display'));
            return;
        }
        const allowed = new Set(activeIds);
        allCards.forEach(card => {
            const id = card.dataset.id;
            if (allowed.has(id)) {
                card.style.removeProperty('display');
            } else {
                card.style.display = 'none';
            }
        });
    }

    startConfetti(container) {
        if (!container) return;
        const colors = ['#FF5252', '#FF9800', '#FFEB3B', '#4CAF50', '#03A9F4', '#9C27B0', '#E91E63'];
        const createPiece = () => {
            if (!document.body.classList.contains('birthday-party')) return;
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            const color = colors[Math.floor(Math.random() * colors.length)];
            piece.style.background = color;
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.top = '-10vh';
            const duration = 4 + Math.random() * 4; // 4-8s
            piece.style.animationDuration = duration + 's';
            piece.style.transform = `rotate(${Math.random()*360}deg)`;
            container.appendChild(piece);
            // Cleanup after animation
            setTimeout(() => piece.remove(), duration * 1000 + 100);
        };
        // Burst and steady trickle
        for (let i = 0; i < 30; i++) setTimeout(createPiece, i * 80);
        const interval = setInterval(() => {
            if (!document.body.classList.contains('birthday-party')) {
                clearInterval(interval);
                return;
            }
            for (let i = 0; i < 6; i++) createPiece();
        }, 1000);
    }

    // Early Birthday Bucket Filling Animation
    activateEarlyBirthday(countdown, daysDiff) {
        const card = document.querySelector(`.countdown-card[data-id="${countdown.id}"]`);
        if (!card) return;

        // Add early birthday class
        card.classList.add('early-birthday');

        // Calculate fill percentage (1 day = 0%, 0 days = 100%)
        const fillPercentage = (1 - daysDiff) * 100;
        card.style.setProperty('--fill-height', `${fillPercentage}%`);

        // Update label to show "Happy Early Birthday"
        const labelElement = card.querySelector('.countdown-label');
        if (labelElement && daysDiff > 0) {
            labelElement.textContent = "Happy Early Birthday! 🎉";
        }
    }

    deactivateEarlyBirthday(countdown) {
        const card = document.querySelector(`.countdown-card[data-id="${countdown.id}"]`);
        if (!card) return;

        // Remove early birthday class and reset styles
        card.classList.remove('early-birthday');
        card.style.removeProperty('--fill-height');

        // Reset label to original text
        const labelElement = card.querySelector('.countdown-label');
        if (labelElement) {
            const targetDate = new Date(countdown.targetDate);
            const now = new Date();
            const timeDiff = DateUtils.formatTimeDifference(now, targetDate);
            labelElement.textContent = timeDiff.isNegative ? countdown.since_text : countdown.until_text;
        }
    }

    // Removed in-card birthday sparkles per request


    startUpdates() {
        // Update current time text and countdown values
        setInterval(() => {
            const now = new Date();
            this.currentTimeElement.textContent = DateUtils.formatCurrentTime(now);
            
            // Update each countdown
            // Track birthdays within [-1, +3] window
            let closestPartyBirthday = null;
            let closestAbsDiff = Infinity;
            const activePartyBirthdays = [];

            this.countdowns.forEach((countdown, index) => {
                const targetDate = new Date(countdown.targetDate);
                const timeDiff = DateUtils.formatTimeDifference(now, targetDate);
                
                // Special handling for birthday countdowns: keep visible until 3 days after
                if (countdown.isBirthday && timeDiff.isNegative) {
                    const msPerDay = 1000 * 60 * 60 * 24;
                    const daysPast = (now - targetDate) / msPerDay; // positive after birthday
                    if (daysPast > 3) {
                        // Hide/remove only if more than 3 days past
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
                    const category = this.getCountdownCategory(countdown);

                    if (category.startsWith('ongoing-') && countdown.endDate) {
                        // For ongoing events, show countdown to end date
                        const endDate = new Date(countdown.endDate);
                        const endTimeDiff = DateUtils.formatTimeDifference(now, endDate);
                        timeElement.textContent = DateUtils.formatCountdownTime(endTimeDiff);
                    } else {
                        timeElement.textContent = DateUtils.formatCountdownTime(timeDiff);
                    }

                    // Add animation class
                    timeElement.classList.add('updating');
                    setTimeout(() => timeElement.classList.remove('updating'), 500);
                }
                
                // Update label with special handling for ongoing events
                const labelElement = document.querySelector(`.countdown-label[data-id="${countdown.id}"]`);
                if (labelElement) {
                    const category = this.getCountdownCategory(countdown);

                    if (category.startsWith('ongoing-')) {
                        // For ongoing events, show time remaining until end
                        if (countdown.endDate) {
                            const endDate = new Date(countdown.endDate);
                            const endTimeDiff = DateUtils.formatTimeDifference(now, endDate);
                            labelElement.textContent = endTimeDiff.isNegative
                                ? "Event has ended"
                                : "🔥 Event ends in:";
                        } else {
                            labelElement.textContent = "🎮 Event is live!";
                        }
                    } else {
                        labelElement.textContent = timeDiff.isNegative ? countdown.since_text : countdown.until_text;
                    }
                }
                
                // Update date
                const dateElement = document.querySelector(`.countdown-date[data-id="${countdown.id}"]`);
                if (dateElement) {
                    dateElement.textContent = `${countdown.final_date_text}: ${DateUtils.formatLongDate(targetDate)}`;
                }

                // Handle birthday special modes
                if (countdown.isBirthday) {
                    const msPerDay = 1000 * 60 * 60 * 24;
                    const daysDiff = (targetDate - now) / msPerDay;

                    // Early birthday mode: 1 day to 0 days remaining
                    if (daysDiff >= 0 && daysDiff <= 1) {
                        this.activateEarlyBirthday(countdown, daysDiff);
                    } else {
                        // Clean up early birthday mode if no longer applicable
                        this.deactivateEarlyBirthday(countdown);
                    }

                    // Check for party window [-1, +1] days for celebration
                    if (this.isWithinBirthdayWindow(now, targetDate)) {
                        activePartyBirthdays.push(countdown);
                        const absMs = Math.abs(targetDate - now);
                        if (absMs < closestAbsDiff) {
                            closestAbsDiff = absMs;
                            closestPartyBirthday = countdown;
                        }
                    }
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

            // Toggle party mode based on active birthdays
            if (activePartyBirthdays.length > 0) {
                this.activateBirthdayParty(activePartyBirthdays, closestPartyBirthday || activePartyBirthdays[0]);
            } else if (this.birthdayPartyActive) {
                this.deactivateBirthdayParty();
            }
            
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

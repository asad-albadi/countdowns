# Celebration Flows

## Timeline

### Normal Countdown (10-1 days)
- Standard birthday countdown display
- Shows days remaining until birthday
- Regular styling with birthday category colors

### Early Birthday Mode (1-0 days)
- **Label**: Changes to "Happy Early Birthday! <�"
- **Animation**: Bucket filling animation from bottom to top
  - Pink gradient "water" fills the card background
  - Fill percentage: 0% at 1 day → 100% at 0 days
- **Visual Effects**:
  - Bouncing cake emoji <� after the name
  - Holiday-themed colors and glow effects
  - Special border styling

### Full Celebration Mode (0 to -0.5 days)
- **Duration**: 12 hours from birthday start
- **Effects**:
  - Confetti animation across the screen
  - Dynamic birthday messages rotating every 6 seconds
  - Full party theme with bright colors
  - Birthday overlay with celebration messages
  - Focus on birthday countdowns (other events hidden)

### Post-Celebration
- **After -0.5 days**: Birthday disappears from display
- Returns to normal countdown view

## Technical Implementation

### CSS Classes
- `.early-birthday`: Applied during 1-0 days period
- `.birthday-party`: Applied to body during celebration
- `--fill-height`: CSS custom property for bucket fill percentage

### Animation Details
- Bucket fill uses CSS gradients and transitions
- Smooth 1-second ease-out transition for fill height
- Bouncing cake emoji with 2-second animation cycle
- Confetti pieces with random colors and 4-8 second fall duration

## Configuration

### Timing Windows
- **Early Birthday**: `daysDiff >= 0 && daysDiff <= 1`
- **Celebration**: `daysDiff <= 0 && daysDiff >= -0.5`
- **Display Filter**: `daysDiff >= 0 && daysDiff <= 10` OR early birthday OR celebration window

---

# Gaming/Event Celebration Flow

## Event States

### Pre-Event (Before targetDate)
- Standard countdown display to event start
- Shows "Event Starts In:" or custom `until_text`
- Displays event start date (`targetDate`)
- Uses category-specific styling (e.g., `gaming` category)

### Ongoing Event (targetDate to endDate)
- **Label**: Automatically changes to "🔥 Event ends in:"
- **Countdown**: Switches to counting down to `endDate` instead of `targetDate`
- **Date Display**: Changes to show "Event ends: [endDate]" instead of start date
- **Category**: Prefixed with "ongoing-" (e.g., `ongoing-gaming`)
- **Icon**: Changes to activity-specific ongoing icon (e.g., `play-circle` for gaming events)

### Post-Event (After endDate)
- **Label**: Shows "Event has ended"
- **Countdown**: Stops updating or may be removed based on configuration
- Event may be filtered out of display

## Technical Implementation

### Event Detection
- Events with both `targetDate` and `endDate` are automatically detected
- Current time is compared against both dates to determine state
- Category is dynamically updated with "ongoing-" prefix during active period

### Display Logic
```javascript
if (category.startsWith('ongoing-') && countdown.endDate) {
    // Show countdown to end date
    const endDate = new Date(countdown.endDate);
    const endTimeDiff = DateUtils.formatTimeDifference(now, endDate);

    // Update label to "Event ends in:"
    labelElement.textContent = endTimeDiff.isNegative
        ? "Event has ended"
        : "🔥 Event ends in:";

    // Update date display to show end date
    dateElement.textContent = `Event ends: ${DateUtils.formatLongDate(endDate)}`;

    // Update countdown time to end date
    timeElement.textContent = DateUtils.formatCountdownTime(endTimeDiff);
}
```

### CSS Classes
- Base category class (e.g., `gaming`)
- Ongoing state class (e.g., `ongoing-gaming`)
- Icons automatically switch based on ongoing state

## Configuration

### JSON Structure
```json
{
    "id": 6,
    "enabled": true,
    "title": "Steam Summer Sale 2025",
    "targetDate": "2025-06-26T21:00:00",
    "endDate": "2025-07-10T21:00:00",
    "until_text": "Steam Summer Sale 2025 Starts In:",
    "category": "gaming"
}
```

### Required Fields for Event Flow
- `targetDate`: When the event starts
- `endDate`: When the event ends
- `category`: For proper styling and icon selection
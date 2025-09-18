# Birthday Celebration Flow

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
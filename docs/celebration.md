# Birthday Celebration Flow

## Timeline

### Normal Countdown (10-1 days)
- Standard birthday countdown display
- Shows days remaining until birthday
- Regular styling with birthday category colors

### Early Birthday Mode (1-0.5 days)
- **Label**: Changes to "Happy Early Birthday! 🎉"
- **Animation**: Bucket filling animation from bottom to top
  - Pink gradient "water" fills the card background
  - Fill percentage: 0% at 1 day → 100% at 0.5 days
- **Visual Effects**:
  - Bouncing cake emoji 🎂 after the name
  - Holiday-themed colors and glow effects
  - Special border styling

### Full Celebration Mode (0 to -0.5 days)
- **Duration**: 12 hours from birthday start
- **Rotation System**: 30-second alternating display
  - **0-30s**: Birthday celebration mode only
    - Shows only birthday countdowns
    - Full party theme with confetti and messages
    - Bright celebration colors
    - `birthday-party` class active on body
  - **30-60s**: Normal view mode
    - Shows all countdowns (birthdays + events + gaming)
    - Normal theme and colors (no birthday styling)
    - Birthday overlay and confetti hidden
    - `birthday-party` class removed from body
  - **Continues**: Pattern repeats every 60 seconds

### Post-Celebration
- **After -0.5 days**: Birthday disappears from display
- Returns to normal countdown view

## Technical Implementation

### CSS Classes
- `.early-birthday`: Applied during 1-0.5 days period
- `.birthday-party`: Applied to body during celebration (toggles every 30s)
- `--fill-height`: CSS custom property for bucket fill percentage

### Animation Details
- Bucket fill uses CSS gradients and transitions
- Smooth 1-second ease-out transition for fill height
- Bouncing cake emoji with 2-second animation cycle
- Confetti pieces with random colors and 4-8 second fall duration

### Rotation Logic
- `birthdayRotationTimer`: 30-second interval timer
- `showingBirthdayOnly`: Boolean state tracker
- Toggles `birthday-party` class on body element
- Controls visibility of birthday overlay and confetti elements
- Alternates between celebration theme and normal theme

## Configuration

### Timing Windows
- **Normal Countdown**: `daysDiff >= 0 && daysDiff <= 10`
- **Early Birthday**: `daysDiff >= 0.5 && daysDiff <= 1`
- **Celebration**: `daysDiff >= -0.5 && daysDiff <= 0`
- **Display Filter**: 10 days or less OR early birthday OR celebration window

### State Management
- `birthdayPartyActive`: Main celebration state
- `showingBirthdayOnly`: Current rotation phase (true = birthday only, false = normal view)
- `birthdayRotationTimer`: Timer for 30-second intervals
- `birthdayMessageTimer`: Timer for message rotation (6-second intervals)
- `currentPartyBirthdayIds`: Array of active birthday IDs

### Key Updates
- **Reduced visibility window**: Changed from 15 days to 10 days
- **Theme alternation**: Complete theme switching every 30 seconds during celebration
- **Normal periods**: Full removal of birthday styling during normal view phases
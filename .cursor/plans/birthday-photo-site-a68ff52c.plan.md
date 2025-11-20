<!-- a68ff52c-4ebc-40fd-b48d-a899bfc27a7c 1dff7dfe-3749-4a40-8614-c6100d1ac857 -->
# Fix Layout Shifting, Controls Visibility, and Message Loading

## Problems Identified

1. **Layout shifting**: "Foto con X", counter, and progress bar shift around
2. **Controls covering info**: Info elements are mostly hidden behind control buttons
3. **Buttons too large**: 5 buttons + speed slider take too much space
4. **Messages not loading**: Showing "Nessun messaggio" even though message.txt exists

## Root Causes

### Layout Shifting

The `.slideshow-info` section is likely not fixed in height or the elements inside don't have fixed heights, causing the layout to adjust based on content.

### Controls Covering Info

The controls have high z-index (20) and are positioned relative, possibly overlapping the info section above them due to flexbox layout or positioning issues.

### Message Loading Bug

Looking at the code in `loadUsersData()`, messages are being read correctly from `message.txt`. The issue is in the intro slide display logic - it checks `slide.message && slide.message.trim()` which should work. Need to debug by adding console.log to see what's actually being loaded.

## Solution

### 1. Fix Layout Shifting (`chiara/assets/css/style.css`)

Make `.slideshow-info` have consistent layout:

- Set `min-height` to prevent collapsing
- Give `#slideshowUserName` and `#slideCounter` fixed or min heights
- Remove margin/padding that causes shifting
```css
.slideshow-info {
    text-align: center;
    padding: 15px 20px;
    background: rgba(0,0,0,0.9);
    width: 100%;
    position: relative;
    border-top: 1px solid rgba(255,255,255,0.2);
    min-height: 80px; /* Prevent collapsing */
}

#slideshowUserName {
    font-size: 1.2rem; /* Smaller */
    margin-bottom: 5px;
    min-height: 1.5em; /* Fixed height */
}

#slideCounter {
    margin-top: 5px;
    opacity: 0.7;
    font-size: 0.9rem;
    min-height: 1.2em; /* Fixed height */
}
```


### 2. Make Controls Smaller and Fix Overlap (`chiara/assets/css/style.css`)

Reduce button padding and font sizes:

```css
.slideshow-controls {
    display: flex;
    justify-content: center;
    gap: 10px; /* Smaller gap */
    padding: 12px 15px; /* Smaller padding */
    background: rgba(0,0,0,0.8);
    width: 100%;
    flex-wrap: wrap;
    flex-shrink: 0;
    z-index: 20;
    position: relative;
}

.slideshow-controls button {
    padding: 8px 16px; /* Smaller */
    background: rgba(255,255,255,0.2);
    color: white;
    border: 2px solid white;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.85rem; /* Smaller */
    transition: background 0.2s;
}

.speed-control {
    display: flex;
    align-items: center;
    gap: 6px; /* Smaller */
    padding: 6px 12px; /* Smaller */
    background: rgba(255,255,255,0.1);
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.3);
}

.speed-control label {
    color: white;
    font-size: 0.8rem; /* Smaller */
    white-space: nowrap;
}

#speedSlider {
    width: 80px; /* Smaller */
}

#speedValue {
    color: white;
    font-size: 0.8rem; /* Smaller */
}
```

### 3. Make Person Navigation Smaller (`chiara/assets/css/style.css`)

```css
.person-controls {
    display: flex;
    gap: 10px; /* Smaller */
    padding: 10px 15px; /* Smaller */
    justify-content: center;
    flex-wrap: wrap;
    background: rgba(0,0,0,0.8);
    width: 100%;
    flex-shrink: 0;
    z-index: 20;
    position: relative;
}

.person-controls button {
    padding: 8px 16px; /* Smaller */
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.4);
    border-radius: 20px;
    color: white;
    font-size: 0.85rem; /* Smaller */
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}
```

### 4. Debug Message Loading (`chiara/assets/js/main.js`)

Add console logging in two places to debug:

In `loadUsersData()` after reading message:

```javascript
console.log(`User: ${userName}, Message: "${message}"`);
```

In `displaySlide()` for intro slides:

```javascript
if (slide.isIntro) {
    console.log('Intro slide:', slide.userName, 'Message:', slide.message);
    // ... existing code
}
```

The issue might be:

- Message has extra whitespace that `.trim()` removes, making it falsy
- Message is empty string
- Message not being passed correctly to slideshow data

Check the condition:

```javascript
${slide.message && slide.message.trim() ? `<p>${slide.message}</p>` : '<p style="opacity: 0.5;">Nessun messaggio</p>'}
```

This is correct. The problem might be in how we're reading or storing the message. Need to verify the message is actually in the slide object.

## Files to Modify

1. `chiara/assets/css/style.css` - Reduce button sizes, fix layout shifting
2. `chiara/assets/js/main.js` - Add debug logging for messages

### To-dos

- [x] 
- [x] 
- [x] 
- [x] 
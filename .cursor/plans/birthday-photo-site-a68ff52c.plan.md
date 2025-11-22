<!-- a68ff52c-4ebc-40fd-b48d-a899bfc27a7c 23a93450-8d8e-4415-90f3-7f098c79c578 -->
# Personalize Homepage and Improve Slideshow

## Part 1: Larger Photos and Visible Messages

### 1. Reduce Floating Panel Size (`chiara/assets/css/style.css`)

Reduce panel width from 280px to 220px:

```css
.slideshow-floating-panel {
    width: 220px;  /* Was 280px */
}
```

### 2. Show Messages During Slides (`chiara/assets/js/main.js`)

Change line 501 to display messages:

```javascript
// Was: slideshowMessage.textContent = '';
slideshowMessage.textContent = slide.message || '';
```

## Part 2: Personalize Homepage

### 3. Update Hero Title (`chiara/index.html`)

Change line 13 from "🎉 Buon Compleanno! 🎉" to:

```html
<h1>🎉 Buon Compleanno <span id="chiaraName" class="chiara-name">Chiara</span>! 🎉</h1>
```

### 4. Add Easter Egg Modal (`chiara/index.html`)

After line 65 (toastContainer), add modal for Chiara's photo:

```html
<!-- Easter Egg Modal -->
<div id="easterEggModal" class="modal" style="display: none;">
    <div class="modal-content easter-egg-content">
        <button class="close-btn" onclick="closeEasterEgg()">×</button>
        <img src="assets/images/chiara-placeholder.jpg" alt="Chiara" id="easterEggPhoto">
        <p class="easter-egg-caption">🎂✨</p>
    </div>
</div>
```

### 5. Style Easter Egg (`chiara/assets/css/style.css`)

Add styles for clickable name and modal:

```css
.chiara-name {
    cursor: pointer;
    position: relative;
    animation: rainbow 3s infinite;
}

.chiara-name:hover {
    transform: scale(1.1);
}

@keyframes rainbow {
    0%, 100% { color: #667eea; }
    25% { color: #f093fb; }
    50% { color: #667eea; }
    75% { color: #764ba2; }
}

.easter-egg-content {
    text-align: center;
    max-width: 600px;
}

#easterEggPhoto {
    max-width: 100%;
    border-radius: 15px;
}
```

### 6. Add Easter Egg Logic (`chiara/assets/js/main.js`)

Add click handler and close function at end of file:

```javascript
// Easter egg
document.addEventListener('DOMContentLoaded', () => {
    const chiaraName = document.getElementById('chiaraName');
    if (chiaraName) {
        chiaraName.addEventListener('click', () => {
            document.getElementById('easterEggModal').style.display = 'block';
        });
    }
});

function closeEasterEgg() {
    document.getElementById('easterEggModal').style.display = 'none';
}
```

### 7. Create Placeholder Image Directory

Create `chiara/assets/images/` folder and add a note to replace `chiara-placeholder.jpg` with actual photo.

### To-dos

- [ ] Reduce floating panel width from 280px to 220px
- [ ] Display user message during their photos/videos in floating panel
- [ ] Change title to 'Buon Compleanno Chiara!' with clickable name
- [ ] Add easter egg modal HTML for Chiara's photo
- [ ] Add CSS for animated name and easter egg modal
- [ ] Add JavaScript for easter egg click and close handlers
- [ ] Create images directory with placeholder note
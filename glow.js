/**
 * Premium Subtle Glow Effect - Vanilla JS
 * Thin, elegant gradient that follows mouse position
 * 
 * Features:
 * - Thin border glow, not thick
 * - Premium dark colors (subtle purples/silvers)
 * - Proximity-based: multiple cards can glow
 * - Mouse-following spotlight on border
 */

(function () {
    'use strict';

    const CONFIG = {
        proximity: 150,          // How close mouse needs to be to activate
        spread: 60,              // Gradient spread in degrees (larger = wider glow segment)
        easingFactor: 0.12       // Smooth angle transition
    };

    const cardStates = new WeakMap();

    function initGlowingEffect() {
        const cards = document.querySelectorAll('.about-card');

        if (cards.length === 0) return;

        cards.forEach(card => {
            card.style.setProperty('--glow-spread', CONFIG.spread);
            card.style.setProperty('--glow-start', '0');
            card.style.setProperty('--glow-active', '0');

            cardStates.set(card, {
                currentAngle: 0,
                active: false
            });
        });

        let mousePos = { x: 0, y: 0 };

        function normalizeAngleDiff(current, target) {
            let diff = target - current;
            while (diff > 180) diff -= 360;
            while (diff < -180) diff += 360;
            return diff;
        }

        function updateAllCards() {
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const { left, top, width, height } = rect;

                const centerX = left + width * 0.5;
                const centerY = top + height * 0.5;

                // Check proximity to any edge of the card
                const closestX = Math.max(left, Math.min(mousePos.x, left + width));
                const closestY = Math.max(top, Math.min(mousePos.y, top + height));
                const distance = Math.hypot(mousePos.x - closestX, mousePos.y - closestY);

                const state = cardStates.get(card);
                if (!state) return;

                // Activate based on proximity
                const isActive = distance < CONFIG.proximity;

                // Smooth opacity transition based on distance
                const opacity = isActive ? Math.max(0, 1 - (distance / CONFIG.proximity)) : 0;
                card.style.setProperty('--glow-active', opacity.toFixed(3));

                if (!isActive) return;

                // Calculate angle from center to mouse
                const targetAngle = Math.atan2(mousePos.y - centerY, mousePos.x - centerX) * (180 / Math.PI) + 90;

                // Smooth angle interpolation
                const angleDiff = normalizeAngleDiff(state.currentAngle, targetAngle);
                state.currentAngle += angleDiff * CONFIG.easingFactor;

                card.style.setProperty('--glow-start', state.currentAngle.toFixed(2));
            });
        }

        function animate() {
            updateAllCards();
            requestAnimationFrame(animate);
        }

        function handlePointerMove(e) {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        }

        animate();
        document.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlowingEffect);
    } else {
        initGlowingEffect();
    }
})();

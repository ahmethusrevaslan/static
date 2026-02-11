/**
 * Favorites Manager
 * Handles wishlist logic using localStorage.
 */
class FavoritesManager {
    constructor() {
        this.storageKey = 'anyway_wishlist';
        this.items = this.load();
        this.listeners = [];
    }

    load() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        this.notify();
    }

    add(productId) {
        if (!this.items.includes(productId)) {
            this.items.push(productId);
            this.save();
            return true; // Added
        }
        return false; // Already exists
    }

    remove(productId) {
        const index = this.items.indexOf(productId);
        if (index > -1) {
            this.items.splice(index, 1);
            this.save();
            return true; // Removed
        }
        return false; // Not found
    }

    toggle(productId) {
        if (this.has(productId)) {
            this.remove(productId);
            return false; // Removed
        } else {
            this.add(productId);
            return true; // Added
        }
    }

    has(productId) {
        return this.items.includes(productId);
    }

    getAll() {
        return this.items;
    }

    getCount() {
        return this.items.length;
    }

    // Observer Patter for UI Updates
    subscribe(callback) {
        this.listeners.push(callback);
    }

    notify() {
        this.listeners.forEach(cb => cb(this.items));
    }
}

// Global Instance
window.favoritesManager = new FavoritesManager();

// Main application entry point
// This script wires together the map and sidebar modules and starts the map.
// It waits for the DOM to be ready before creating instances.
import { MapLoader } from './modules/mapLoader.js';
import { Sidebar } from './modules/sidebar.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Initializing map application...');
        // Instantiate MapLoader with the id of the map container
        const mapLoader = new MapLoader('map');
        // Await map setup – ensures sources/layers and event listeners are ready
        const map = await mapLoader.init();
        // Create a sidebar that will show state names when a state is clicked
        const sidebar = new Sidebar();
        // Register callback: when a state is clicked, show its name in the sidebar
        mapLoader.setStateClickHandler((state) => {
            sidebar.show(`State: ${state}`);
        });
        console.log('Map application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize map application:', error);
    }
});


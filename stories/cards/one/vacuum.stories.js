import { cardStory } from '../preview-card.js';

export default { title: 'Karty/vacuum' };

export const Docked = cardStory('hg-vacuum-card', 'Docked');
export const Cleaning = cardStory('hg-vacuum-card', 'Cleaning');
export const Returning = cardStory('hg-vacuum-card', 'Returning');
export const Paused = cardStory('hg-vacuum-card', 'Paused');
export const Error = cardStory('hg-vacuum-card', 'Error');

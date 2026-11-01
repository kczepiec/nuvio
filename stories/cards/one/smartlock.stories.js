import { cardStory } from '../preview-card.js';

export default { title: 'Karty/smartlock' };

export const Locked = cardStory('hg-smartlock-card', 'Locked');
export const Unlocked = cardStory('hg-smartlock-card', 'Unlocked');
export const Jammed = cardStory('hg-smartlock-card', 'Jammed');

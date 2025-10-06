// utils.js
import { Filter } from 'bad-words';
import leo from 'leo-profanity';

const filter = new Filter();
leo.loadDictionary('en');

export function containsBannedWords(text) {
  if (!text || !text.trim()) return false;
  return filter.isProfane(text) || leo.check(text);
}

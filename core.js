(function (root) {
  'use strict';
  const api = {
    videoId(url) {
      try {
        const parsed = new URL(url);
        return parsed.pathname === '/watch' ? parsed.searchParams.get('v') : null;
      } catch { return null; }
    },
    cleanMarks(value) {
      if (!Array.isArray(value)) return [];
      return value.filter(m => m && typeof m.id === 'string' && Number.isFinite(m.time) && m.time >= 0)
        .map(m => ({ id: m.id, time: m.time })).sort((a, b) => a.time - b.time);
    },
    settings(value = {}) {
      return {
        key: /^[a-z0-9]$/i.test(value.key || '') ? value.key.toUpperCase() : 'B',
        lead: Number.isFinite(value.lead) ? Math.min(30, Math.max(0, value.lead)) : 3
      };
    },
    replayTime(time, lead, duration) {
      return Math.min(Math.max(0, time - lead), Math.max(0, duration - 0.05));
    },
    formatTime(time) {
      const seconds = Math.floor(time);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor(seconds / 60) % 60;
      const rest = String(seconds % 60).padStart(2, '0');
      return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}` : `${minutes}:${rest}`;
    },
    position(time, duration) {
      return Math.min(100, Math.max(0, time / duration * 100));
    }
  };
  root.EnglishTimeline = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);

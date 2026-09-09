window.initTimeline = function () {
  var statsEl = document.getElementById('timeline-stats');
  if (!statsEl) return;

  var now = new Date();
  var startOfYear = new Date(now.getFullYear(), 0, 1);
  var endOfYear = new Date(now.getFullYear() + 1, 0, 1);
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  var dayOfYear = Math.ceil((now - startOfYear) / (1000 * 60 * 60 * 24));
  var yearProgress = ((now - startOfYear) / (endOfYear - startOfYear) * 100).toFixed(1);
  var dayProgress = ((now - startOfDay) / (endOfDay - startOfDay) * 100).toFixed(1);

  var dayOfYearEl = document.getElementById('timeline-day-of-year');
  if (dayOfYearEl) {
    dayOfYearEl.textContent = dayOfYear;
  }

  var yearProgressEl = document.getElementById('timeline-year-progress');
  if (yearProgressEl) {
    yearProgressEl.textContent = yearProgress + '%';
  }

  var dayProgressEl = document.getElementById('timeline-day-progress');
  if (dayProgressEl) {
    dayProgressEl.textContent = dayProgress + '%';
  }
};
// Initialized by the inline loader in layouts/posts/list.html (re-run by the
// SPA router on every navigation to /posts/), the same way neodb.js is.

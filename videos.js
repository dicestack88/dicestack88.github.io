// No-key YouTube navigation. Instead of embedding a player that can show
// "video unavailable" for some channels/playlists, these filters send visitors
// to the working YouTube channel tabs directly.
const filterBtns = document.querySelectorAll('.filter-btn');
const videoCards = document.querySelectorAll('.youtube-link-card');
const videosStatus = document.getElementById('videosStatus');

const filterMessages = {
  all: 'Showing every YouTube destination for @dicestack88. Pick a card to open the latest content directly on YouTube.',
  video: 'Showing the regular Videos tab. This avoids broken embeds and uses YouTube’s own current channel filter.',
  short: 'Showing the Shorts tab. This opens YouTube’s official Shorts view for the channel without any API key.',
};

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showFilter(btn.getAttribute('data-filter'));
  });
});

function showFilter(filter) {
  videoCards.forEach(card => {
    const cardFilter = card.getAttribute('data-filter');
    const shouldShow = filter === 'all' || cardFilter === filter || cardFilter === 'all';
    card.hidden = !shouldShow;
  });

  videosStatus.textContent = filterMessages[filter] || filterMessages.all;
}

document.addEventListener('DOMContentLoaded', () => showFilter('all'));

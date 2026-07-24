// YouTube Channel Configuration
const YOUTUBE_CHANNEL_HANDLE = '@dicestack88';
const YOUTUBE_CHANNEL_ID = 'UCjkNaM0V-PVeFcYaYP98u9A';
const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/${YOUTUBE_CHANNEL_HANDLE}`;
const YOUTUBE_RSS_FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
const RSS_TO_JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(YOUTUBE_RSS_FEED)}`;

const filterBtns = document.querySelectorAll('.filter-btn');
const videosContainer = document.getElementById('videosContainer');
const noResults = document.getElementById('noResults');
const videosStatus = document.getElementById('videosStatus');

let currentFilter = 'all';
let videoDatabase = [];

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderVideos();
  });
});

function getFilteredVideos() {
  if (currentFilter === 'all') return videoDatabase;
  return videoDatabase.filter(video => video.type === currentFilter);
}

function renderVideos() {
  const filtered = getFilteredVideos();

  if (!filtered.length) {
    videosContainer.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  const sorted = [...filtered].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  videosContainer.innerHTML = sorted.map(video => `
    <article class="video-card ${video.type === 'short' ? 'short-card' : 'video-card-full'}">
      <a href="${video.url}" target="_blank" rel="noopener noreferrer" class="video-thumbnail-link" aria-label="Watch ${escapeHtml(video.title)} on YouTube">
        <div class="video-thumbnail">
          <img src="${video.thumbnail}" alt="${escapeHtml(video.title)}" loading="lazy">
          <div class="video-overlay">
            <div class="play-icon">▶</div>
            <span class="video-type">${video.type === 'short' ? 'SHORT' : 'VIDEO'}</span>
          </div>
        </div>
      </a>
      <div class="video-info">
        <a href="${video.url}" target="_blank" rel="noopener noreferrer" class="video-title">
          <h3>${escapeHtml(video.title)}</h3>
        </a>
        <p class="video-date">${formatDate(video.publishedAt)}</p>
      </div>
    </article>
  `).join('');
}

async function fetchYouTubeVideos() {
  setStatus('Loading latest videos from YouTube…');

  try {
    const response = await fetch(RSS_TO_JSON_URL);
    if (!response.ok) throw new Error(`Feed request failed with status ${response.status}`);

    const feed = await response.json();
    if (feed.status !== 'ok' || !Array.isArray(feed.items)) {
      throw new Error(feed.message || 'The YouTube feed returned an unexpected response.');
    }

    videoDatabase = feed.items.map(mapFeedItemToVideo);
    setStatus(`Showing ${videoDatabase.length} latest uploads from ${YOUTUBE_CHANNEL_HANDLE}. Shorts are detected from YouTube Shorts links, #shorts tags, or the word “short” in the title/description.`);
    renderVideos();
  } catch (error) {
    console.error('Error loading YouTube feed:', error);
    videosContainer.innerHTML = `
      <div class="video-error">
        <h2>Videos could not load here right now.</h2>
        <p>This page uses the public YouTube RSS feed through a no-key feed reader, so no API key is needed. If the feed service is temporarily blocked, you can still open the channel directly.</p>
        <a class="channel-link" href="${YOUTUBE_CHANNEL_URL}" target="_blank" rel="noopener noreferrer">Open ${YOUTUBE_CHANNEL_HANDLE} on YouTube</a>
      </div>
    `;
    setStatus('Unable to load the live feed. Please try again later.');
  }
}

function mapFeedItemToVideo(item) {
  const id = item.guid || extractVideoId(item.link);
  const url = item.link || `https://www.youtube.com/watch?v=${id}`;

  return {
    id,
    title: item.title || 'Untitled YouTube upload',
    type: detectVideoType(item),
    thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    publishedAt: item.pubDate,
    url,
  };
}

function detectVideoType(item) {
  const text = `${item.title || ''} ${item.description || ''} ${item.link || ''}`.toLowerCase();
  return text.includes('/shorts/') || text.includes('#shorts') || /\bshorts?\b/.test(text) ? 'short' : 'video';
}

function extractVideoId(url = '') {
  try {
    return new URL(url).searchParams.get('v') || '';
  } catch {
    return '';
  }
}

function setStatus(message) {
  if (videosStatus) videosStatus.textContent = message;
}

function escapeHtml(value = '') {
  return value.replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[char]));
}

function formatDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (Number.isNaN(d.getTime())) return 'Recently uploaded';
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;

  return d.toLocaleDateString();
}

document.addEventListener('DOMContentLoaded', fetchYouTubeVideos);

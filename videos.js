// YouTube Channel Configuration
const YOUTUBE_CHANNEL = '@dicestack88';
const YOUTUBE_CHANNEL_ID = 'UCjkNaM0V-PVeFcYaYP98u9A'; // You'll need to replace this with your actual channel ID

// Sample video data - replace with actual YouTube API integration
// Format: { id, title, type: 'video' or 'short', thumbnail, publishedAt, duration }
const videoDatabase = [
  // Add your videos here in this format:
  // {
  //   id: 'video-id',
  //   title: 'Video Title',
  //   type: 'video', // or 'short'
  //   thumbnail: 'https://...',
  //   publishedAt: new Date('2026-07-20'),
  //   url: 'https://youtube.com/watch?v=...'
  // }
];

// Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const videosContainer = document.getElementById('videosContainer');
const noResults = document.getElementById('noResults');

let currentFilter = 'all';

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update filter
    currentFilter = btn.getAttribute('data-filter');
    renderVideos();
  });
});

function getFilteredVideos() {
  if (currentFilter === 'all') {
    return videoDatabase;
  }
  return videoDatabase.filter(video => video.type === currentFilter);
}

function renderVideos() {
  const filtered = getFilteredVideos();
  
  if (filtered.length === 0) {
    videosContainer.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  
  noResults.style.display = 'none';
  
  // Sort by most recent first
  const sorted = [...filtered].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  
  videosContainer.innerHTML = sorted.map(video => `
    <div class="video-card ${video.type === 'short' ? 'short-card' : 'video-card-full'}">
      <a href="${video.url}" target="_blank" class="video-thumbnail-link">
        <div class="video-thumbnail">
          <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
          <div class="video-overlay">
            <div class="play-icon">▶</div>
            <span class="video-type">${video.type === 'short' ? 'SHORT' : 'VIDEO'}</span>
          </div>
        </div>
      </a>
      <div class="video-info">
        <a href="${video.url}" target="_blank" class="video-title">
          <h3>${video.title}</h3>
        </a>
        <p class="video-date">${formatDate(video.publishedAt)}</p>
      </div>
    </div>
  `).join('');
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
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  
  return d.toLocaleDateString();
}

// Function to fetch videos from YouTube API (requires API key)
// For now, this is a placeholder - you'll need to set up YouTube Data API
async function fetchYouTubeVideos() {
  try {
    // This would require a backend or direct YouTube API key
    // For now, we'll use the videoDatabase defined above
    console.log('To fetch live videos, set up YouTube Data API with your channel ID:', YOUTUBE_CHANNEL_ID);
    renderVideos();
  } catch (error) {
    console.error('Error fetching videos:', error);
    videosContainer.innerHTML = '<p style="color: red;">Error loading videos. Please try again later.</p>';
  }
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  fetchYouTubeVideos();
});

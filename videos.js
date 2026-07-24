// No-key YouTube embed setup. This uses YouTube's public embed player instead of
// the YouTube Data API or a third-party feed proxy, so visitors do not need an API key.
const YOUTUBE_CHANNEL_HANDLE = '@dicestack88';
const YOUTUBE_CHANNEL_ID = 'UCjkNaM0V-PVeFcYaYP98u9A';
const YOUTUBE_UPLOADS_PLAYLIST_ID = YOUTUBE_CHANNEL_ID.replace(/^UC/, 'UU');
const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/${YOUTUBE_CHANNEL_HANDLE}`;

const filterBtns = document.querySelectorAll('.filter-btn');
const videosFrame = document.getElementById('videosFrame');
const videosStatus = document.getElementById('videosStatus');
const openFilterLink = document.getElementById('openFilterLink');

const filterViews = {
  all: {
    label: 'All uploads',
    embedUrl: `https://www.youtube.com/embed/videoseries?list=${YOUTUBE_UPLOADS_PLAYLIST_ID}&rel=0&modestbranding=1`,
    openUrl: `${YOUTUBE_CHANNEL_URL}/videos`,
    status: 'Showing the channel upload playlist directly from YouTube. Use the playlist button inside the player to browse more uploads.',
  },
  video: {
    label: 'Videos',
    embedUrl: `https://www.youtube.com/embed/videoseries?list=${YOUTUBE_UPLOADS_PLAYLIST_ID}&rel=0&modestbranding=1`,
    openUrl: `${YOUTUBE_CHANNEL_URL}/videos`,
    status: 'Showing regular uploads with YouTube’s no-key playlist embed. If YouTube includes Shorts in the playlist, open the Videos tab for YouTube’s exact filter.',
  },
  short: {
    label: 'Shorts',
    embedUrl: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(`${YOUTUBE_CHANNEL_HANDLE} shorts`)}&rel=0&modestbranding=1`,
    openUrl: `${YOUTUBE_CHANNEL_URL}/shorts`,
    status: 'Showing a no-key YouTube Shorts search embed. Open the Shorts tab for YouTube’s exact channel Shorts view.',
  },
};

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showFilter(btn.getAttribute('data-filter'));
  });
});

function showFilter(filter) {
  const view = filterViews[filter] || filterViews.all;

  videosFrame.src = view.embedUrl;
  videosFrame.title = `${view.label} from ${YOUTUBE_CHANNEL_HANDLE}`;
  videosStatus.textContent = view.status;
  openFilterLink.href = view.openUrl;
  openFilterLink.textContent = `Open ${view.label} on YouTube`;
}

document.addEventListener('DOMContentLoaded', () => showFilter('all'));

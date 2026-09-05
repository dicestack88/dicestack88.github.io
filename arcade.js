const challenge = getDailyDarklandsChallenge();
document.getElementById('challengeTitle').textContent = challenge.title;
document.getElementById('challengeText').textContent = challenge.text;
document.getElementById('challengeTag').textContent = challenge.tag;

document.getElementById('copyChallenge').addEventListener('click', async () => {
  const button = document.getElementById('copyChallenge');
  try {
    await navigator.clipboard.writeText(`Darklands daily challenge: ${challenge.title} — ${challenge.text}`);
    markDarklandsAchievement('challenger');
    button.textContent = 'Copied!';
  } catch {
    button.textContent = 'Copy unavailable';
  }
  setTimeout(() => { button.textContent = 'Copy challenge'; }, 1600);
  renderAchievements();
});

const TRIALS = [
  { id: 'explorer', name: 'Explorer', description: 'Visit four Darklands pages.' },
  { id: 'challenger', name: 'Mission accepted', description: 'Copy a daily challenge.' },
  { id: 'fast', name: 'Fast hands', description: 'Finish a Creeper reflex round.' },
  { id: 'memory', name: 'Pattern master', description: 'Reach level 3 in Block sequence.' },
  { id: 'voter', name: 'Community voice', description: 'Cast a Community HQ vote.' }
];

function completedTrials() {
  const completed = new Set(JSON.parse(localStorage.getItem('darklands-achievements') || '[]'));
  const visits = JSON.parse(localStorage.getItem('darklands-visits') || '[]');
  if (visits.length >= 4) completed.add('explorer');
  return completed;
}
function renderAchievements() {
  const completed = completedTrials();
  document.getElementById('achievementSummary').textContent = `${completed.size} / ${TRIALS.length} trials complete`;
  document.getElementById('achievementList').innerHTML = TRIALS.map((trial) => `<div class="achievement ${completed.has(trial.id) ? 'complete' : ''}"><span>${completed.has(trial.id) ? '✓' : '○'}</span><div><strong>${trial.name}</strong><small>${trial.description}</small></div></div>`).join('');
}
renderAchievements();
document.getElementById('resetProgress').addEventListener('click', () => {
  localStorage.removeItem('darklands-achievements');
  localStorage.removeItem('darklands-reaction-best');
  renderAchievements();
});

let reactionTimer; let reactionStartedAt; let reactionWaiting = false;
const reactionButton = document.getElementById('reactionButton');
const reactionStatus = document.getElementById('reactionStatus');
const reactionScore = document.getElementById('reactionScore');
reactionScore.textContent = `Best: ${localStorage.getItem('darklands-reaction-best') || '—'}`;
reactionButton.addEventListener('click', () => {
  if (reactionWaiting) return;
  if (reactionStartedAt) {
    const ms = Math.round(performance.now() - reactionStartedAt);
    localStorage.setItem('darklands-reaction-best', Math.min(Number(localStorage.getItem('darklands-reaction-best')) || ms, ms));
    markDarklandsAchievement('fast');
    reactionStatus.textContent = `${ms} ms. Nice reflexes.`;
    reactionScore.textContent = `Best: ${localStorage.getItem('darklands-reaction-best')} ms`;
    reactionButton.textContent = 'Start round'; reactionButton.classList.remove('ready'); reactionStartedAt = null;
    renderAchievements(); return;
  }
  reactionWaiting = true; reactionButton.textContent = 'Wait…'; reactionStatus.textContent = 'Do not click until the block turns green.';
  reactionTimer = setTimeout(() => { reactionWaiting = false; reactionStartedAt = performance.now(); reactionButton.textContent = 'CLICK!'; reactionButton.classList.add('ready'); reactionStatus.textContent = 'Creeper spotted—click now!'; }, 1200 + Math.random() * 2300);
});

const board = document.getElementById('memoryBoard');
const memoryStatus = document.getElementById('memoryStatus');
const memoryScore = document.getElementById('memoryScore');
const colors = ['grass', 'stone', 'water', 'lava'];
colors.forEach((color, index) => { const button = document.createElement('button'); button.type = 'button'; button.className = `memory-block ${color}`; button.dataset.index = index; button.setAttribute('aria-label', `${color} block`); board.append(button); });
let sequence = []; let userSequence = []; let acceptingMemory = false;
const flash = (index) => new Promise((resolve) => { const block = board.children[index]; block.classList.add('flash'); setTimeout(() => { block.classList.remove('flash'); resolve(); }, 420); });
async function showSequence() { acceptingMemory = false; for (const item of sequence) { await new Promise((resolve) => setTimeout(resolve, 260)); await flash(item); } acceptingMemory = true; memoryStatus.textContent = 'Your turn—repeat the pattern.'; }
function nextMemoryLevel() { sequence.push(Math.floor(Math.random() * colors.length)); userSequence = []; memoryScore.textContent = `Level: ${sequence.length}`; memoryStatus.textContent = 'Watch closely…'; showSequence(); }
document.getElementById('memoryStart').addEventListener('click', () => { sequence = []; nextMemoryLevel(); });
board.addEventListener('click', (event) => { const block = event.target.closest('.memory-block'); if (!block || !acceptingMemory) return; const choice = Number(block.dataset.index); flash(choice); userSequence.push(choice); const position = userSequence.length - 1; if (choice !== sequence[position]) { acceptingMemory = false; memoryStatus.textContent = `Not quite—your run ended at level ${sequence.length}. Try again.`; return; } if (userSequence.length === sequence.length) { if (sequence.length >= 3) markDarklandsAchievement('memory'); renderAchievements(); acceptingMemory = false; setTimeout(nextMemoryLevel, 700); } });

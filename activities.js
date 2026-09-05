const DARKLANDS_CHALLENGES = [
  { title: 'The two-block base', text: 'Build a survival base using only two block types. Make it look intentional.', tag: 'Creative' },
  { title: 'PvP warm-up', text: 'Play three matches. After each one, change exactly one thing about your strategy.', tag: 'Competitive' },
  { title: 'Client scout', text: 'Try a client you have not used before and share one useful observation with the community.', tag: 'Explorer' },
  { title: 'No armor run', text: 'Survive for 20 minutes without crafting or equipping armor.', tag: 'Chaos' },
  { title: 'Screenshot quest', text: 'Find the best view in your world, then capture a screenshot worthy of the Community HQ.', tag: 'Chill' },
  { title: 'Resourceful', text: 'Build something useful using materials from only one biome.', tag: 'Creative' },
  { title: 'Unexpected loadout', text: 'Pick a new client, a new playstyle, and one weird self-imposed rule for a session.', tag: 'Chaos' }
];

function getDailyDarklandsChallenge() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const today = new Date();
  const day = Math.floor((today - start) / 86400000);
  return DARKLANDS_CHALLENGES[day % DARKLANDS_CHALLENGES.length];
}

function markDarklandsAchievement(id) {
  const achievements = JSON.parse(localStorage.getItem('darklands-achievements') || '[]');
  if (!achievements.includes(id)) {
    achievements.push(id);
    localStorage.setItem('darklands-achievements', JSON.stringify(achievements));
  }
}

const homeChallengeText = document.getElementById('homeChallengeText');
if (homeChallengeText) {
  const challenge = getDailyDarklandsChallenge();
  homeChallengeText.textContent = challenge.text;
  document.getElementById('homeChallengeTag').textContent = challenge.tag;
}

const poll = document.querySelector('[data-community-poll]');
if (poll) {
  const result = document.querySelector('[data-poll-result]');
  const savedVote = localStorage.getItem('darklands-community-vote');
  const setResult = (vote) => {
    result.textContent = vote ? `Your browser vote: ${vote}. Thanks for helping choose the next thing to build.` : 'Pick an idea to cast your vote.';
    poll.querySelectorAll('button').forEach((button) => button.classList.toggle('selected', button.dataset.vote === vote));
  };
  setResult(savedVote);
  poll.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
    localStorage.setItem('darklands-community-vote', button.dataset.vote);
    markDarklandsAchievement('voter');
    setResult(button.dataset.vote);
  }));
}

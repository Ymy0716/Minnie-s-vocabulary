let vocab = [];
let remembered = new Set();
let currentIndex = 0;

// 加载词汇数据
fetch('vocab.json')
  .then(response => response.json())
  .then(data => {
    vocab = data;
    shuffle(vocab);
    showCard();
    updateStats();
  })
  .catch(err => console.error('加载词汇失败:', err));

// 随机打乱单词列表
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 显示当前单词卡片
function showCard() {
  if (vocab.length === 0) return;
  const card = vocab[currentIndex];
  document.getElementById('word').textContent = card.word;
  document.getElementById('meaning').textContent = card.meaning;

  // 自动朗读单词
  speakWord(card.word);
}

// 使用 Web Speech API 朗读单词
function speakWord(word) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'it-IT'; // 设置为意大利语
    speechSynthesis.speak(utterance);
  } else {
    console.error('当前浏览器不支持语音合成功能');
  }
}

// 更新记忆统计数据
function updateStats() {
  const total = vocab.length;
  const rememberedCount = remembered.size;
  const percentage = total > 0 ? Math.round((rememberedCount / total) * 100) : 0;
  document.getElementById('stats').textContent =
    `记住的单词：${rememberedCount}/${total} (${percentage}%)`;
}

// 用户操作：更新记忆状态
function updateResponse(responseType) {
  const card = vocab[currentIndex];
  if (responseType === 'easy') {
    remembered.add(card.id);
    localStorage.setItem('rememberedWords', JSON.stringify([...remembered]));
  }
  currentIndex = (currentIndex + 1) % vocab.length;
  showCard();
  updateStats();
}

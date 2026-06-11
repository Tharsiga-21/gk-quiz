const questions = [
  { q: "Which planet is known as the Red Planet?",          options: ["Venus", "Mars", "Jupiter", "Saturn"],                    answer: 1 },
  { q: "Who wrote the play 'Romeo and Juliet'?",            options: ["Charles Dickens", "Mark Twain", "William Shakespeare", "Jane Austen"], answer: 2 },
  { q: "What is the chemical symbol for Gold?",             options: ["Go", "Gd", "Au", "Ag"],                                  answer: 2 },
  { q: "Which is the largest ocean on Earth?",              options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: 3 },
  { q: "How many bones are in the adult human body?",       options: ["206", "186", "226", "196"],                              answer: 0 },
  { q: "Which country is home to the Great Barrier Reef?",  options: ["Brazil", "Australia", "Indonesia", "South Africa"],     answer: 1 },
  { q: "What is the capital city of Japan?",                options: ["Beijing", "Seoul", "Bangkok", "Tokyo"],                 answer: 3 },
  { q: "Which element has the atomic number 1?",            options: ["Helium", "Oxygen", "Hydrogen", "Carbon"],               answer: 2 },
  { q: "In which year did World War II end?",               options: ["1943", "1944", "1945", "1946"],                         answer: 2 },
  { q: "Who painted the Mona Lisa?",                        options: ["Michelangelo", "Raphael", "Vincent van Gogh", "Leonardo da Vinci"], answer: 3 },
];

const labels = ['A', 'B', 'C', 'D'];

let current = 0;
let score = 0;
let answered = false;

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('theme-label').textContent = isDark ? 'Light' : 'Dark';
}

function startQuiz() {
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('quiz-screen').classList.add('show');
  loadQuestion();
}

function loadQuestion() {
  answered = false;

  const q = questions[current];

  document.getElementById('q-counter').textContent =
    `Question ${current + 1} of ${questions.length}`;

  document.getElementById('progress-bar').style.width =
    `${(current / questions.length) * 100}%`;

  document.getElementById('question-text').textContent = q.q;
  document.getElementById('score-display').textContent = score;

  const container = document.getElementById('options-container');
  container.innerHTML = '';

  q.options.forEach((optionText, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-label">${labels[i]}</span>${optionText}`;
    btn.onclick = () => selectAnswer(i, btn);
    container.appendChild(btn);
  });

  document.getElementById('feedback').className = 'feedback';
  document.getElementById('feedback').textContent = '';
  document.getElementById('next-wrap').classList.remove('show');
  document.getElementById('next-label').textContent =
    current === questions.length - 1 ? 'See Results' : 'Next Question';
}

function selectAnswer(index, btn) {
  if (answered) return;
  answered = true;

  const correct = questions[current].answer;
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);

  const feedback = document.getElementById('feedback');

  if (index === correct) {
    btn.classList.add('correct');
    score++;
    document.getElementById('score-display').textContent = score;
    feedback.className = 'feedback correct-fb show';
    feedback.innerHTML = '✅ Correct! Well done.';
  } else {
    btn.classList.add('wrong');
    allBtns[correct].classList.add('correct');
    feedback.className = 'feedback wrong-fb show';
    feedback.innerHTML = `❌ Wrong! The correct answer is <strong>${questions[current].options[correct]}</strong>.`;
  }

  document.getElementById('next-wrap').classList.add('show');
}

function nextQuestion() {
  current++;
  if (current >= questions.length) {
    showResult();
  } else {
    loadQuestion();
  }
}

function showResult() {
  document.getElementById('quiz-screen').classList.remove('show');
  document.getElementById('quiz-screen').style.display = 'none';

  const resultScreen = document.getElementById('result-screen');
  resultScreen.classList.add('show');

  document.getElementById('final-score').textContent = score;
  document.getElementById('progress-bar').style.width = '100%';

  let emoji, title, message;

  if (score === 10) {
    emoji = '🏆'; title = 'Perfect Score!';
    message = "Outstanding! You got every single question right. You're a true GK champion!";
  } else if (score >= 8) {
    emoji = '🌟'; title = 'Excellent!';
    message = "Fantastic performance! You really know your stuff. Just a couple slipped by.";
  } else if (score >= 6) {
    emoji = '👍'; title = 'Good Job!';
    message = "Solid effort! You have a good general knowledge base. Keep learning!";
  } else if (score >= 4) {
    emoji = '📚'; title = 'Keep Going!';
    message = "Not bad, but there's room to grow. Read more and try again!";
  } else {
    emoji = '💪'; title = 'Keep Trying!';
    message = "Everyone starts somewhere. Keep reading and give it another shot!";
  }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-message').textContent = message;
}

function restartQuiz() {
  current = 0;
  score = 0;

  document.getElementById('result-screen').classList.remove('show');
  document.getElementById('result-screen').style.display = '';
  document.getElementById('quiz-screen').style.display = '';
  document.getElementById('quiz-screen').classList.add('show');
  document.getElementById('progress-bar').style.width = '0%';

  loadQuestion();
}

function shareScore() {
  const text = `I scored ${score}/10 on the BrainSpark GK Quiz! 🧠✨ Can you beat me?`;

  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);

  const btn = document.querySelector('.btn-share');
  const original = btn.textContent;
  btn.textContent = '✅ Copied to clipboard!';
  setTimeout(() => btn.textContent = original, 2000);
}

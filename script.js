// ============================================
//   script.js — BrainSpark GK Quiz Logic
//   DecodeLabs Frontend Internship · Project 3
// ============================================


// ─────────────────────────────────────────────
// 1. QUESTIONS DATA
// An array of objects. Each object is one question.
// q       = the question text
// options = array of 4 answer choices
// answer  = index of the correct option (0=A, 1=B, 2=C, 3=D)
// ─────────────────────────────────────────────

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

// Labels for the A B C D buttons
const labels = ['A', 'B', 'C', 'D'];

// ─────────────────────────────────────────────
// 2. STATE VARIABLES
// These track what's happening in the quiz.
// current  = which question we're on (0 to 9)
// score    = how many correct answers so far
// answered = did the user already click an option?
//            (prevents clicking twice on same question)
// ─────────────────────────────────────────────

let current = 0;
let score = 0;
let answered = false;


// ─────────────────────────────────────────────
// 3. toggleTheme()
// Called when the ☀️/🌙 button is clicked.
// It reads the current theme from the <html> tag,
// then switches it to the opposite one.
// ─────────────────────────────────────────────

function toggleTheme() {
  const html = document.documentElement; // grabs the <html> element
  const isDark = html.getAttribute('data-theme') === 'dark';

  // If currently dark → switch to light, and vice versa
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');

  // Update the button label text
  document.getElementById('theme-label').textContent = isDark ? 'Light' : 'Dark';
}


// ─────────────────────────────────────────────
// 4. startQuiz()
// Called when "Start Quiz" button is clicked.
// Hides the intro screen and shows the quiz.
// ─────────────────────────────────────────────

function startQuiz() {
  // Hide intro screen
  document.getElementById('intro-screen').style.display = 'none';

  // Show quiz screen (adding .show class triggers display:block in CSS)
  document.getElementById('quiz-screen').classList.add('show');

  // Load the first question
  loadQuestion();
}


// ─────────────────────────────────────────────
// 5. loadQuestion()
// Renders the current question and its options
// onto the page. Called every time we move to
// a new question.
// ─────────────────────────────────────────────

function loadQuestion() {
  answered = false; // reset so user can click an option

  const q = questions[current]; // get the current question object

  // Update "Question X of 10" counter
  document.getElementById('q-counter').textContent =
    `Question ${current + 1} of ${questions.length}`;

  // Update progress bar width
  // e.g. question 3 of 10 → width = 30%
  document.getElementById('progress-bar').style.width =
    `${(current / questions.length) * 100}%`;

  // Update the question text
  document.getElementById('question-text').textContent = q.q;

  // Update the live score display
  document.getElementById('score-display').textContent = score;

  // Build the 4 option buttons dynamically
  const container = document.getElementById('options-container');
  container.innerHTML = ''; // clear old buttons first

  q.options.forEach((optionText, i) => {
    // Create a <button> element for each option
    const btn = document.createElement('button');
    btn.className = 'option-btn';

    // innerHTML sets both the label (A/B/C/D) and the text
    btn.innerHTML = `<span class="option-label">${labels[i]}</span>${optionText}`;

    // When clicked, call selectAnswer with this option's index
    btn.onclick = () => selectAnswer(i, btn);

    container.appendChild(btn); // add button to the page
  });

  // Reset feedback bar (hide it)
  document.getElementById('feedback').className = 'feedback';
  document.getElementById('feedback').textContent = '';

  // Hide the Next button (only shows after answering)
  document.getElementById('next-wrap').classList.remove('show');

  // Change Next button text on the last question
  document.getElementById('next-label').textContent =
    current === questions.length - 1 ? 'See Results' : 'Next Question';
}


// ─────────────────────────────────────────────
// 6. selectAnswer(index, btn)
// Called when a user clicks an option button.
// index = which option was clicked (0,1,2,3)
// btn   = the actual button element clicked
// ─────────────────────────────────────────────

function selectAnswer(index, btn) {
  // If already answered, do nothing (prevent double clicks)
  if (answered) return;
  answered = true;

  const correct = questions[current].answer; // get correct answer index

  // Disable ALL option buttons so nothing else can be clicked
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);

  const feedback = document.getElementById('feedback');

  if (index === correct) {
    // ✅ CORRECT ANSWER
    btn.classList.add('correct');   // turns button green
    score++;                        // increase score by 1

    // Update live score display
    document.getElementById('score-display').textContent = score;

    // Show green feedback message
    feedback.className = 'feedback correct-fb show';
    feedback.innerHTML = '✅ Correct! Well done.';

  } else {
    // ❌ WRONG ANSWER
    btn.classList.add('wrong');             // turns clicked button red
    allBtns[correct].classList.add('correct'); // highlight the correct one green

    // Show red feedback with the correct answer
    feedback.className = 'feedback wrong-fb show';
    feedback.innerHTML = `❌ Wrong! The correct answer is <strong>${questions[current].options[correct]}</strong>.`;
  }

  // Show the Next button now that the user has answered
  document.getElementById('next-wrap').classList.add('show');
}


// ─────────────────────────────────────────────
// 7. nextQuestion()
// Called when the "Next Question" button is clicked.
// Moves to next question or shows result screen.
// ─────────────────────────────────────────────

function nextQuestion() {
  current++; // move to next question

  if (current >= questions.length) {
    // No more questions → show the result screen
    showResult();
  } else {
    // Load the next question
    loadQuestion();
  }
}


// ─────────────────────────────────────────────
// 8. showResult()
// Hides the quiz and shows the final score screen.
// Picks emoji/title/message based on score.
// ─────────────────────────────────────────────

function showResult() {
  // Hide quiz screen
  document.getElementById('quiz-screen').classList.remove('show');
  document.getElementById('quiz-screen').style.display = 'none';

  // Show result screen
  const resultScreen = document.getElementById('result-screen');
  resultScreen.classList.add('show');

  // Show final score number
  document.getElementById('final-score').textContent = score;

  // Fill progress bar to 100%
  document.getElementById('progress-bar').style.width = '100%';

  // Pick different message based on how well they did
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

  // Update result screen elements
  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-message').textContent = message;
}


// ─────────────────────────────────────────────
// 9. restartQuiz()
// Resets all state variables and starts over.
// ─────────────────────────────────────────────

function restartQuiz() {
  // Reset state
  current = 0;
  score = 0;

  // Hide result screen
  document.getElementById('result-screen').classList.remove('show');
  document.getElementById('result-screen').style.display = '';

  // Show quiz screen again
  document.getElementById('quiz-screen').style.display = '';
  document.getElementById('quiz-screen').classList.add('show');

  // Reset progress bar
  document.getElementById('progress-bar').style.width = '0%';

  // Load first question
  loadQuestion();
}


// ─────────────────────────────────────────────
// 10. shareScore()
// Copies the score text to clipboard.
// Uses old-school execCommand('copy') which
// works across all browsers without needing
// permissions.
// ─────────────────────────────────────────────

function shareScore() {
  const text = `I scored ${score}/10 on the BrainSpark GK Quiz! 🧠✨ Can you beat me?`;

  // Create a hidden textarea, put the text in it, select it, copy it
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';  // prevents page from scrolling
  ta.style.opacity = '0';       // invisible to user
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand('copy'); // copies selected text to clipboard
  document.body.removeChild(ta); // remove the textarea after

  // Give visual feedback on the button
  const btn = document.querySelector('.btn-share');
  const original = btn.textContent;
  btn.textContent = '✅ Copied to clipboard!';

  // Reset button text after 2 seconds
  setTimeout(() => btn.textContent = original, 2000);
}
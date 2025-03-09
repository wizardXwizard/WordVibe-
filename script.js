if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(() => console.log('Service Worker: Registered! 🎉'))
            .catch(err => console.error('Service Worker: Registration failed:', err));
    });
}
class VocabularyApp {
  constructor() {
    console.log(
      "🚀 WordVibe activated! Let's get those brain cells buzzing! 🧠✨"
    );
    this.words = [];
    this.usedWords = JSON.parse(localStorage.getItem("usedWords")) || [];
    this.currentWords = [];
    this.loadWords().then(() => this.init());
  }

  async loadWords() {
    try {
      const response = await fetch("words.json");
      this.words = await response.json();
    } catch (error) {
      console.error("Error loading words:", error);
    }
  }

  init() {
    this.loadDailyWords();
    this.setupEventListeners();
    this.renderWords();
  }

  getRandomWords(count) {
    const availableWords = this.words.filter(
      (word) => !this.usedWords.some((used) => used.word === word.word)
    );

    if (availableWords.length === 0) {
      this.usedWords = [];
      localStorage.setItem("usedWords", JSON.stringify(this.usedWords));
      return this.getRandomWords(count);
    }

    const shuffled = [...availableWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, availableWords.length));
  }

  loadDailyWords() {
    const today = new Date().toDateString();
    const lastUpdate = localStorage.getItem("lastUpdate");

    if (lastUpdate !== today) {
      this.currentWords = this.getRandomWords(5);
      this.usedWords = [...this.usedWords, ...this.currentWords];
      localStorage.setItem("usedWords", JSON.stringify(this.usedWords));
      localStorage.setItem("lastUpdate", today);
      localStorage.setItem("currentWords", JSON.stringify(this.currentWords));
    } else {
      this.currentWords =
        JSON.parse(localStorage.getItem("currentWords")) || [];
    }
  }

  renderWords() {
    const container = document.getElementById("words-container");
    container.innerHTML = this.currentWords
      .map(
        (word) => `
            <div class="word-card">
                <h2>${word.word}</h2>
                <p>English: ${word.english_meaning}</p>
                <p>Hindi: ${word.hindi_meaning}</p>
            </div>
        `
      )
      .join("");
  }

  showModal(title, content) {
    const modal = document.getElementById("modal");
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = content;
    modal.style.display = "block";
  }

  setupEventListeners() {
    document.getElementById("show-previous").addEventListener("click", () => {
      const content = this.usedWords
        .map(
          (word) => `
                <div class="word-card">
                    <h2>${word.word}</h2>
                    <p>English: ${word.english_meaning}</p>
                    <p>Hindi: ${word.hindi_meaning}</p>
                </div>
            `
        )
        .join("");
      this.showModal(
        "Time Machine: Past Words",
        content || "<p>No past words yet—start vibin’!</p>"
      );
    });

    document.getElementById("show-all").addEventListener("click", () => {
      const content = this.words
        .map(
          (word) => `
                <div class="word-card">
                    <h2>${word.word}</h2>
                    <p>English: ${word.english_meaning}</p>
                    <p>Hindi: ${word.hindi_meaning}</p>
                </div>
            `
        )
        .join("");
      this.showModal("Word Vault: All Words", content);
    });

    document.querySelector(".close").addEventListener("click", () => {
      document.getElementById("modal").style.display = "none";
    });

    window.addEventListener("click", (e) => {
      const modal = document.getElementById("modal");
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
}

const app = new VocabularyApp();

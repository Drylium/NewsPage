function sanitizeInput(str) {
    return str
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function truncateText(text, maxLength) {
    return text.length > maxLength 
        ? text.substring(0, maxLength) + "..." 
        : text;
}

const form = document.getElementById("articleForm");
const titleInput = document.getElementById("titleInput");
const textInput = document.getElementById("textInput");
const toastContainer = document.getElementById("toastContainer");

const newsSections = document.querySelectorAll(".news-section");

let articles = JSON.parse(localStorage.getItem("articles")) || [];

renderArticles();

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newArticle = {
    id: Date.now(),
    title: sanitizeInput(titleInput.value),
    text: sanitizeInput(textInput.value),
    date: new Date().toLocaleString("sv-SE")
};

    articles.push(newArticle);
    saveArticles();
    renderArticles();
    showToast("Artikel skapad!", "success");

    form.reset();
});

function saveArticles() {
    localStorage.setItem("articles", JSON.stringify(articles));
}

function renderArticles() {
    const dynamicArticles = document.querySelectorAll(".dynamic-article");
    dynamicArticles.forEach(a => a.remove());

    const targetSection = newsSections[0];

    articles.forEach(article => {
        const card = document.createElement("article");
        card.classList.add("news-card", "dynamic-article");

        // Titel
        const titleEl = document.createElement("h3");
        titleEl.textContent = article.title;

        // Text (trunkeras)
        const textEl = document.createElement("p");
        textEl.textContent = truncateText(article.text, 60);

        // Datum
        const dateEl = document.createElement("small");
        dateEl.innerHTML = `<em>${article.date}</em>`; 
        // <em> är okej här eftersom vi kontrollerar innehållet själva

        // Radera-knapp
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Radera";
        deleteBtn.dataset.id = article.id;

        // Lägg till i kortet
        card.appendChild(titleEl);
        card.appendChild(textEl);
        card.appendChild(dateEl);
        card.appendChild(deleteBtn);

        targetSection.appendChild(card);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", deleteArticle);
    });
}

function deleteArticle(e) {
    const id = Number(e.target.dataset.id);

    articles = articles.filter(a => a.id !== id);
    saveArticles();
    renderArticles();
    showToast("Artikel raderad!", "error");
}

function showToast(message, type) {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
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
    title: titleInput.value,
    text: textInput.value,
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

function truncateText(text, maxLength) {
    return text.length > maxLength 
        ? text.substring(0, maxLength) + "..." 
        : text;
}

function renderArticles() {
    const dynamicArticles = document.querySelectorAll(".dynamic-article");
    dynamicArticles.forEach(a => a.remove());

    const targetSection = newsSections[0];

    articles.forEach(article => {
        const card = document.createElement("article");
        card.classList.add("news-card", "dynamic-article");

        card.innerHTML = `
    <h3>${article.title}</h3>
    <p>${truncateText(article.text, 60)}</p>
    <small><em>${article.date}</em></small>
    <button class="delete-btn" data-id="${article.id}">Radera</button>
`;

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

const input = document.querySelector("#posterSearch");
const cards = [...document.querySelectorAll(".poster-card")];
input?.addEventListener("input", () => {
  const q = input.value.trim().toLowerCase();
  cards.forEach(card => {
    card.style.display = card.dataset.posterText.includes(q) ? "" : "none";
  });
});

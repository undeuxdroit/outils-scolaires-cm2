const problems = [
  { story: "Un casque coûte 92,50 €. Sur Internet, il coûte 20 € de moins. Combien vais-je le payer ?", operation: "soustraction", calculation: "92,50 − 20 = 72,50", answer: 72.5, unit: "€", explanation: "On cherche un prix plus petit que le prix de départ. Les mots « de moins » indiquent qu’il faut retirer 20 à 92,50 : c’est une soustraction." },
  { story: "Un tuyau mesure 92,5 cm. Le plombier en coupe 20 cm. Quelle est la longueur du tuyau restant ?", operation: "soustraction", calculation: "92,5 − 20 = 72,5", answer: 72.5, unit: "cm", explanation: "Le tuyau devient plus court. On enlève la partie coupée à la longueur totale : c’est une soustraction." },
  { story: "Une rue mesure 92,5 m. Léa fait 5 fois l’aller-retour dans cette rue. Quelle distance totale court-elle ?", operation: "multiplication", calculation: "92,5 × 2 × 5 = 925", answer: 925, unit: "m", explanation: "Un aller-retour représente deux fois la rue. Léa répète cet aller-retour 5 fois. On calcule donc 92,5 × 2 × 5 : c’est une multiplication." },
  { story: "Un jeu coûte 74,90 €. Il bénéficie d’une réduction de 15 €. Quel est son nouveau prix ?", operation: "soustraction", calculation: "74,90 − 15 = 59,90", answer: 59.9, unit: "€", explanation: "Une réduction fait baisser le prix. On retire 15 au prix de départ : c’est une soustraction." },
  { story: "Une planche mesure 125,5 cm. Le menuisier coupe un morceau de 32 cm. Quelle longueur reste-t-il ?", operation: "soustraction", calculation: "125,5 − 32 = 93,5", answer: 93.5, unit: "cm", explanation: "On connaît la longueur totale et la partie enlevée. Pour trouver ce qui reste, on soustrait la partie coupée au total." },
  { story: "La piscine mesure 25 m de long. Adam nage 7 allers-retours. Quelle distance totale nage-t-il ?", operation: "multiplication", calculation: "25 × 2 × 7 = 350", answer: 350, unit: "m", explanation: "Chaque aller-retour mesure 25 × 2, soit 50 m. Cette même distance est répétée 7 fois : on utilise la multiplication." },
  { story: "Une corde mesure 143,6 m. On en utilise 48 m. Quelle longueur de corde reste-t-il ?", operation: "soustraction", calculation: "143,6 − 48 = 95,6", answer: 95.6, unit: "m", explanation: "La quantité de corde diminue. Le mot « reste » invite à retirer la longueur utilisée à la longueur de départ : c’est une soustraction." },
  { story: "La distance entre la maison de Lina et l’école est de 42,5 m. Elle effectue 4 allers-retours. Quelle distance totale parcourt-elle ?", operation: "multiplication", calculation: "42,5 × 2 × 4 = 340", answer: 340, unit: "m", explanation: "Pour un aller-retour, Lina parcourt deux fois 42,5 m. Elle répète ce trajet 4 fois : on multiplie 42,5 par 2, puis par 4." },
  { story: "Un trajet mesure 81,5 km. Après avoir parcouru 30 km, quelle distance reste-t-il à parcourir ?", operation: "soustraction", calculation: "81,5 − 30 = 51,5", answer: 51.5, unit: "km", explanation: "On connaît la distance totale et la partie déjà parcourue. Pour trouver la partie restante, on effectue une soustraction." }
];

let current = 0;
let answers = problems.map(() => ({ operation: "", answer: "" }));

const $ = (id) => document.getElementById(id);
const exercisePage = $("exercisePage");
const solutionPage = $("solutionPage");

function readNumber(value) {
  const cleaned = value.trim().replace(/\s/g, "").replace(",", ".");
  return cleaned === "" ? NaN : Number(cleaned);
}

function saveCurrent() {
  answers[current] = {
    operation: document.querySelector('input[name="operation"]:checked')?.value || "",
    answer: $("answer").value.trim()
  };
}

function updateNavigation() {
  $("navProblemNumber").textContent = current + 1;
  $("navProblemTotal").textContent = problems.length;
  $("topPrevious").disabled = current === 0;
  $("topNext").disabled = current === problems.length - 1;
}

function setPage(page) {
  const question = page === "question";
  exercisePage.hidden = !question;
  solutionPage.hidden = question;
  $("page1Tab").classList.toggle("active", question);
  $("page2Tab").classList.toggle("active", !question);
  if (question) renderQuestion();
  else renderAnswer();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestion() {
  const problem = problems[current];
  updateNavigation();
  $("problemNumber").textContent = current + 1;
  $("problemTotal").textContent = problems.length;
  $("progressBar").style.width = `${((current + 1) / problems.length) * 100}%`;
  $("story").textContent = problem.story;
  $("unit").textContent = problem.unit;
  $("answer").value = answers[current].answer;
  document.querySelectorAll('input[name="operation"]').forEach((radio) => {
    radio.checked = radio.value === answers[current].operation;
  });
  $("previous").disabled = current === 0;
  $("message").textContent = "";
}

function renderAnswer() {
  const problem = problems[current];
  const given = answers[current];
  const numberCorrect = Math.abs(readNumber(given.answer) - problem.answer) < 0.001;
  const operationCorrect = given.operation === problem.operation;
  const completeCorrect = numberCorrect && operationCorrect;
  const studentText = given.answer
    ? `Ta réponse : ${given.answer} ${problem.unit}${given.operation ? ` — ${given.operation}` : ""}`
    : "Tu n’avais pas répondu : ce n’est pas grave, lis la méthode.";

  updateNavigation();
  $("solutionNumber").textContent = current + 1;
  $("solution").innerHTML = `
    <article class="solution-card ${completeCorrect ? "correct-card" : ""}">
      <p class="short-story">${problem.story}</p>
      <div class="result"><span class="operation-name">${problem.operation[0].toUpperCase() + problem.operation.slice(1)}</span> : ${problem.calculation} ${problem.unit}</div>
      <p class="student-answer">${studentText}</p>
      <p class="explanation"><strong>Pourquoi cette opération ?</strong> ${problem.explanation}</p>
    </article>`;
  $("nextProblem").textContent = current === problems.length - 1 ? "Recommencer au problème 1" : "Problème suivant";
}

function changeProblem(direction) {
  if (!exercisePage.hidden) saveCurrent();
  const destination = current + direction;
  if (destination < 0 || destination >= problems.length) return;
  current = destination;
  setPage("question");
}

function resetAll() {
  answers = problems.map(() => ({ operation: "", answer: "" }));
  current = 0;
  setPage("question");
}

$("next").addEventListener("click", () => { saveCurrent(); setPage("answer"); });
$("previous").addEventListener("click", () => changeProblem(-1));
$("topPrevious").addEventListener("click", () => changeProblem(-1));
$("topNext").addEventListener("click", () => changeProblem(1));

$("speak").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(problems[current].story);
  voice.lang = "fr-FR";
  voice.rate = 0.9;
  speechSynthesis.speak(voice);
});

$("backToExercises").addEventListener("click", () => setPage("question"));
$("nextProblem").addEventListener("click", () => {
  current = current === problems.length - 1 ? 0 : current + 1;
  setPage("question");
});
$("reset").addEventListener("click", resetAll);

setPage("question");

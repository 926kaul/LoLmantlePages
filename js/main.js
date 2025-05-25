let championData = [];

function loadData() {
  Papa.parse("data/data.csv", {
    download: true,
    header: true,
    complete: function (results) {
      championData = results.data;
    },
  });
}

function showSuggestions(input) {
  const box = document.getElementById("suggestion_box");
  const list = document.getElementById("suggested_items");
  const keyword = input.trim();

  if (!keyword) {
    box.style.display = "none";
    list.innerHTML = "";
    return;
  }

  const matches = championData
    .filter((c) => c.kor_name.includes(keyword))
    .slice(0, 5);

  if (matches.length === 0) {
    box.style.display = "none";
    list.innerHTML = "";
    return;
  }

  list.innerHTML = matches
    .map((m) => `<div class="suggestion-item">${m.kor_name}</div>`)
    .join("");

  box.style.display = "block";

  document.querySelectorAll(".suggestion-item").forEach((el) =>
    el.addEventListener("click", () => {
      document.getElementById("search_input").value = el.textContent;
      box.style.display = "none";
      searchChampion(el.textContent);
    })
  );
}

function searchChampion(inputKorName) {
  const guess = championData.find(
    (c) => c.kor_name.trim() === inputKorName.trim()
  );

  if (!guess) {
    alert("챔피언을 찾을 수 없습니다.");
    return;
  }

  if (Number(guess.rank) === 0) {
    alert("🎉 정답입니다!");
  }

  const tableBody = document.querySelector("#guesses tbody");
  const row = tableBody.insertRow();
  row.innerHTML = `
    <td><strong>${guess.kor_name}</strong></td>
    <td>${guess.simularity}</td>
    <td>${guess.rank}</td>
    <td>${guess.tag1} / ${guess.tag2}</td>
    <td>${guess.attack_range}</td>
    <td>${guess.position1} / ${guess.position2}</td>
    <td>${guess.rune}</td>
    <td>${guess.items}</td>
    <td>${guess.tier}</td>
    <td>${guess.region}</td>
    <td>${guess.related_champions}</td>
    <td>${Number(guess.release_code) + 1}</td>
  `;
}

function setupFAQToggle() {
  const faqTitle = document.getElementById("faq");
  const faqContent = document.getElementById("faqa");
  if (!faqTitle || !faqContent) return;

  faqTitle.addEventListener("click", () => {
    const isHidden = faqContent.style.display === "none";
    faqContent.style.display = isHidden ? "block" : "none";
    faqTitle.textContent = isHidden ? "질문과 답변 (보기 중)" : "질문과 답변 (숨김)";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  setupFAQToggle();

  document.getElementById("search_button").addEventListener("click", () => {
    const input = document.getElementById("search_input").value;
    searchChampion(input);
  });

  document.getElementById("search_input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      document.getElementById("search_button").click();
    }
  });

  document.getElementById("search_input").addEventListener("input", (e) => {
    showSuggestions(e.target.value);
  });
});

let championData = [];

function loadData() {
  Papa.parse("/data/data.csv", {
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

  // 클릭 시 입력창에 반영
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

  // 정답 여부 확인
  if (Number(guess.rank) === 0) {
    alert("🎉 정답입니다!");
  }

  const table = document.getElementById("guesses");
  const row = table.insertRow();
  row.innerHTML = `
    <td><strong>${guess.kor_name}</strong></td>
    <td>유사도: ${guess.simularity}</td>
    <td>순위: ${guess.rank}</td>
    <td>역할군: ${guess.tag1} / ${guess.tag2}</td>
    <td>라인: ${guess.position1} / ${guess.position2}</td>
    <td>출시순: ${Number(guess.release_code) + 1}</td>
  `;
}

function setupFAQToggle() {
  const faqTitle = document.getElementById("faq");
  const faqContent = document.getElementById("faqa");

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

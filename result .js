(function () {
  "use strict";

  let nextId = 8;

  let results = [
    { id: 1, studentCode: "E001", studentName: "Emma Smith", subjectCode: "M001", subjectName: "Mathematics", grade: 16 },
    { id: 2, studentCode: "E002", studentName: "Michael Johnson", subjectCode: "M002", subjectName: "Physics", grade: 14.5 },
    { id: 3, studentCode: "E001", studentName: "Emma Smith", subjectCode: "M003", subjectName: "English", grade: 17 },
    { id: 4, studentCode: "E003", studentName: "Sophia Williams", subjectCode: "M001", subjectName: "Mathematics", grade: 15.25 },
    { id: 5, studentCode: "E002", studentName: "Michael Johnson", subjectCode: "M001", subjectName: "Mathematics", grade: 13 },
    { id: 6, studentCode: "E003", studentName: "Sophia Williams", subjectCode: "M002", subjectName: "Physics", grade: 18 },
    { id: 7, studentCode: "E001", studentName: "Emma Smith", subjectCode: "M002", subjectName: "Physics", grade: 15.75 },
  ];

  const tbody = document.getElementById("results-body");
  const countEl = document.getElementById("results-count");
  const btnNew = document.getElementById("btn-new-result");
  const modal = document.getElementById("modal-new");
  const backdrop = document.getElementById("modal-backdrop");
  const form = document.getElementById("form-new-result");
  const btnClose = document.getElementById("modal-close");
  const btnCancel = document.getElementById("modal-cancel");

  const trashSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;

  function formatGrade(g) {
    const n = Number(g);
    return `${n.toFixed(2)} / 20`;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = String(text);
    return div.innerHTML;
  }

  function updateCount() {
    const n = results.length;
    countEl.textContent = `${n} result${n === 1 ? "" : "s"} recorded`;
  }

  function render() {
    tbody.innerHTML = "";
    results.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(row.studentCode)}</td>
        <td>${escapeHtml(row.studentName)}</td>
        <td>${escapeHtml(row.subjectCode)}</td>
        <td>${escapeHtml(row.subjectName)}</td>
        <td class="grade-cell">${escapeHtml(formatGrade(row.grade))}</td>
        <td>
          <button type="button" class="btn-icon" data-delete="${row.id}" aria-label="Delete result ${escapeHtml(row.studentCode)} ${escapeHtml(row.subjectCode)}">${trashSvg}</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    updateCount();
  }

  function openModal() {
    modal.hidden = false;
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
    const first = form.querySelector("input");
    if (first) first.focus();
  }

  function closeModal() {
    modal.hidden = true;
    backdrop.hidden = true;
    document.body.style.overflow = "";
    form.reset();
  }

  tbody.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-delete]");
    if (!btn) return;
    const id = Number(btn.getAttribute("data-delete"));
    if (!id) return;
    results = results.filter((r) => r.id !== id);
    render();
  });

  btnNew.addEventListener("click", openModal);
  btnClose.addEventListener("click", closeModal);
  btnCancel.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const fd = new FormData(form);
    const grade = parseFloat(String(fd.get("grade")), 10);
    if (Number.isNaN(grade) || grade < 0 || grade > 20) return;

    results.push({
      id: nextId++,
      studentCode: String(fd.get("studentCode")).trim(),
      studentName: String(fd.get("studentName")).trim(),
      subjectCode: String(fd.get("subjectCode")).trim(),
      subjectName: String(fd.get("subjectName")).trim(),
      grade: grade,
    });
    render();
    closeModal();
  });

  render();
})();

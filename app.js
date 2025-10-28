// helper to grab elements
const $ = (id) => document.getElementById(id);

// inputs
const inputs = [
  "fullName",
  "title",
  "email",
  "phone",
  "summary",
  "skills",
  "experience",
  "education",
];
inputs.forEach((id) => {
  const el = $(id);
  el && el.addEventListener("input", updatePreview);
});

// photo handling
$("photo").addEventListener("change", (e) => {
  const f = e.target.files[0];
  const wrap = $("pvPhotoWrap");
  const avatar = $("avatarPreview");
  if (!f) {
    wrap.innerHTML = "";
    avatar.innerHTML =
      '<span style="font-size:12px;color:var(--muted);padding:6px;text-align:center">No photo</span>';
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    wrap.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover"/>`;
    avatar.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover"/>`;
  };
  reader.readAsDataURL(f);
});

function updatePreview() {
  $("pvName").textContent = $("fullName").value || "Your Name";
  $("pvTitle").textContent = $("title").value || "Professional Title";
  $("pvEmail").textContent = $("email").value || "";
  $("pvPhone").textContent = $("phone").value || "";
  $("pvSummary").textContent =
    $("summary").value || "Short summary will appear here.";

  // skills -> pills
  const skills = ($("skills").value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const pvSkills = $("pvSkills");
  pvSkills.innerHTML = "";
  skills.forEach((s) => {
    const span = document.createElement("span");
    span.className = "skill-pill";
    span.textContent = s;
    pvSkills.appendChild(span);
  });
  if (!skills.length)
    pvSkills.innerHTML =
      '<span class="muted">Add skills, separated by commas</span>';

  // experience
  const expText = ($("experience").value || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const pvExp = $("pvExperience");
  pvExp.innerHTML = "";
  if (expText.length) {
    expText.forEach((line) => {
      // try to split by | into parts
      const parts = line.split("|").map((p) => p.trim());
      const meta = parts.slice(0, 3).join(" — ");
      const note = parts.slice(3).join(" | ");
      const item = document.createElement("div");
      item.className = "experience-item";
      const metaEl = document.createElement("div");
      metaEl.className = "meta";
      metaEl.textContent = meta || line;
      const noteEl = document.createElement("div");
      noteEl.textContent = note || "";
      item.appendChild(metaEl);
      if (noteEl.textContent) item.appendChild(noteEl);
      pvExp.appendChild(item);
    });
  } else {
    pvExp.innerHTML =
      '<div class="muted">Add your experience lines in the left form.</div>';
  }

  // education
  const edu = ($("education").value || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  $("pvEducation").innerHTML = edu.length
    ? edu.map((e) => `<div>${escapeHtml(e)}</div>`).join("")
    : '<div class="muted">Add education entries</div>';
}

// utility to escape HTML
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// initial update
updatePreview();

// export PDF
$("exportPdf").addEventListener("click", () => {
  // print will open print dialog; user can 'Save as PDF' in browser
  window.print();
});

// download JSON
$("downloadJson").addEventListener("click", () => {
  const data = collectData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (data.fullName || "resume").replace(/\s+/g, "_") + ".json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// load JSON
$("loadJson").addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      populateFromData(data);
    } catch (err) {
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(f);
});

function collectData() {
  return {
    fullName: $("fullName").value,
    title: $("title").value,
    email: $("email").value,
    phone: $("phone").value,
    summary: $("summary").value,
    skills: $("skills").value,
    experience: $("experience").value,
    education: $("education").value,
  };
}

function populateFromData(d) {
  inputs.forEach((k) => {
    if (d[k] !== undefined) $(k).value = d[k];
  });
  updatePreview();
}

// sample data
$("sample").addEventListener("click", () => {
  const sample = {
    fullName: "Diyor Xasanov",
    title: "Frontend Developer",
    email: "diyor@example.com",
    phone: "+998 90 123 4567",
    summary:
      "Creative frontend developer with 3+ years building responsive, accessible interfaces and reusable component libraries.",
    skills: "JavaScript, React, Next.js, SCSS, Node.js",
    experience:
      "TechBridge | Frontend Developer | 2022-2025 | Built admin dashboards and interactive training apps.\nKristall | UI Dev | 2021-2022 | Implemented marketing landing pages and performance optimizations.",
    education: "National University | BSc Computer Science | 2018-2022",
  };
  populateFromData(sample);
});

// clear
$("clear").addEventListener("click", () => {
  if (!confirm("Clear the form?")) return;
  inputs.forEach((k) => ($(k).value = ""));
  $("photo").value = "";
  $("pvPhotoWrap").innerHTML = "";
  $("avatarPreview").innerHTML =
    '<span style="font-size:12px;color:var(--muted);padding:6px;text-align:center">No photo</span>';
  updatePreview();
});

// theme toggle for preview (dark <-> light style for resume)
let light = false;
$("toggleTheme").addEventListener("click", () => {
  const root = document.documentElement;
  light = !light;
  if (light) {
    // apply a light mode to resume container
    $("resume").style.background = "white";
    $("resume").style.color = "#061225";
    $("toggleTheme").textContent = "Toggle Light";
  } else {
    $("resume").style.background = "var(--paper)";
    $("resume").style.color = "#0b1220";
    $("toggleTheme").textContent = "Toggle Dark";
  }
});

// small helper: autosave to localStorage every 6s
setInterval(() => {
  const s = collectData();
  localStorage.setItem("resume_builder_draft", JSON.stringify(s));
}, 6000);

// load draft if present
(function () {
  const draft = localStorage.getItem("resume_builder_draft");
  if (draft) {
    try {
      const d = JSON.parse(draft);
      populateFromData(d);
    } catch (e) {}
  }
})();

// prevent long prints from cutting content awkwardly
window.onbeforeprint = () => {
  // you can tweak styles here before printing if needed
};

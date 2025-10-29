let experiences = [];
let educations = [];
let skills = [];
let languages = [];

function addExperience() {
  const id = Date.now();
  experiences.push({ id, title: "", company: "", period: "", description: "" });
  renderExperiences();
}

function removeExperience(id) {
  experiences = experiences.filter((exp) => exp.id !== id);
  renderExperiences();
}

function renderExperiences() {
  const container = document.getElementById("experienceContainer");
  container.innerHTML = experiences
    .map(
      (exp) => `
                <div class="array-item">
                    <button class="btn btn-secondary remove-btn" onclick="removeExperience(${exp.id})">✕</button>
                    <div class="form-group">
                        <label>Job Title</label>
                        <input type="text" value="${exp.title}" onchange="updateExperience(${exp.id}, 'title', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" value="${exp.company}" onchange="updateExperience(${exp.id}, 'company', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Period</label>
                        <input type="text" value="${exp.period}" placeholder="Jan 2020 - Present" onchange="updateExperience(${exp.id}, 'period', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea onchange="updateExperience(${exp.id}, 'description', this.value)">${exp.description}</textarea>
                    </div>
                </div>
            `
    )
    .join("");
  updatePreview();
}

function updateExperience(id, field, value) {
  const exp = experiences.find((e) => e.id === id);
  if (exp) exp[field] = value;
  updatePreview();
}

function addEducation() {
  const id = Date.now();
  educations.push({ id, degree: "", school: "", period: "", description: "" });
  renderEducations();
}

function removeEducation(id) {
  educations = educations.filter((edu) => edu.id !== id);
  renderEducations();
}

function renderEducations() {
  const container = document.getElementById("educationContainer");
  container.innerHTML = educations
    .map(
      (edu) => `
                <div class="array-item">
                    <button class="btn btn-secondary remove-btn" onclick="removeEducation(${edu.id})">✕</button>
                    <div class="form-group">
                        <label>Degree</label>
                        <input type="text" value="${edu.degree}" onchange="updateEducation(${edu.id}, 'degree', this.value)">
                    </div>
                    <div class="form-group">
                        <label>School/University</label>
                        <input type="text" value="${edu.school}" onchange="updateEducation(${edu.id}, 'school', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Period</label>
                        <input type="text" value="${edu.period}" placeholder="2016 - 2020" onchange="updateEducation(${edu.id}, 'period', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Description (Optional)</label>
                        <textarea onchange="updateEducation(${edu.id}, 'description', this.value)">${edu.description}</textarea>
                    </div>
                </div>
            `
    )
    .join("");
  updatePreview();
}

function updateEducation(id, field, value) {
  const edu = educations.find((e) => e.id === id);
  if (edu) edu[field] = value;
  updatePreview();
}

document
  .getElementById("skillInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter" && this.value.trim()) {
      skills.push(this.value.trim());
      this.value = "";
      renderSkills();
    }
  });

function removeSkill(index) {
  skills.splice(index, 1);
  renderSkills();
}

function renderSkills() {
  const container = document.getElementById("skillsContainer");
  container.innerHTML = skills
    .map(
      (skill, index) => `
                <div class="skill-tag">${skill} <span style="cursor: pointer; margin-left: 5px;" onclick="removeSkill(${index})">✕</span></div>
            `
    )
    .join("");
  updatePreview();
}

document
  .getElementById("languageInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter" && this.value.trim()) {
      languages.push(this.value.trim());
      this.value = "";
      renderLanguages();
    }
  });

function removeLanguage(index) {
  languages.splice(index, 1);
  renderLanguages();
}

function renderLanguages() {
  const container = document.getElementById("languagesContainer");
  container.innerHTML = languages
    .map(
      (lang, index) => `
                <div class="language-tag">${lang} <span style="cursor: pointer; margin-left: 5px;" onclick="removeLanguage(${index})">✕</span></div>
            `
    )
    .join("");
  updatePreview();
}

document.getElementById("fullName").addEventListener("input", updatePreview);
document.getElementById("email").addEventListener("input", updatePreview);
document.getElementById("phone").addEventListener("input", updatePreview);
document.getElementById("location").addEventListener("input", updatePreview);
document.getElementById("summary").addEventListener("input", updatePreview);

function updatePreview() {
  document.getElementById("previewName").textContent =
    document.getElementById("fullName").value || "Your Name";
  document.getElementById("previewEmail").textContent =
    document.getElementById("email").value;
  document.getElementById("previewPhone").textContent =
    document.getElementById("phone").value;
  document.getElementById("previewLocation").textContent =
    document.getElementById("location").value;

  const summary = document.getElementById("summary").value;
  document.getElementById("summarySection").style.display = summary
    ? "block"
    : "none";
  document.getElementById("previewSummary").textContent = summary;

  const expSection = document.getElementById("experienceSection");
  const expPreview = document.getElementById("previewExperience");
  if (experiences.length > 0) {
    expSection.style.display = "block";
    expPreview.innerHTML = experiences
      .map(
        (exp) => `
                    <div class="resume-item">
                        <h4>${exp.title}</h4>
                        <div class="meta">${exp.company} ${
          exp.period ? "| " + exp.period : ""
        }</div>
                        <p>${exp.description}</p>
                    </div>
                `
      )
      .join("");
  } else {
    expSection.style.display = "none";
  }

  const eduSection = document.getElementById("educationSection");
  const eduPreview = document.getElementById("previewEducation");
  if (educations.length > 0) {
    eduSection.style.display = "block";
    eduPreview.innerHTML = educations
      .map(
        (edu) => `
                    <div class="resume-item">
                        <h4>${edu.degree}</h4>
                        <div class="meta">${edu.school} ${
          edu.period ? "| " + edu.period : ""
        }</div>
                        ${
                          edu.description
                            ? "<p>" + edu.description + "</p>"
                            : ""
                        }
                    </div>
                `
      )
      .join("");
  } else {
    eduSection.style.display = "none";
  }

  const skillsSection = document.getElementById("skillsSection");
  const skillsPreview = document.getElementById("previewSkills");
  if (skills.length > 0) {
    skillsSection.style.display = "block";
    skillsPreview.innerHTML = skills
      .map((skill) => `<div class="skill-tag">${skill}</div>`)
      .join("");
  } else {
    skillsSection.style.display = "none";
  }

  const langsSection = document.getElementById("languagesSection");
  const langsPreview = document.getElementById("previewLanguages");
  if (languages.length > 0) {
    langsSection.style.display = "block";
    langsPreview.innerHTML = languages
      .map((lang) => `<div class="language-tag">${lang}</div>`)
      .join("");
  } else {
    langsSection.style.display = "none";
  }
}

function downloadResume() {
  window.print();
}

updatePreview();

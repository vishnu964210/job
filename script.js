
document.addEventListener("DOMContentLoaded", () => {
  const jobSearch = document.getElementById("jobSearch");
  const locationFilter = document.getElementById("locationFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const searchForm = document.getElementById("searchForm");
  const jobGrid = document.getElementById("jobGrid");
  const jobCount = document.getElementById("jobCount");
  const noResults = document.getElementById("noResults");

  const applicationForm = document.getElementById("applicationForm");
  const appRole = document.getElementById("appRole");
  const resume = document.getElementById("resume");
  const fileNote = document.getElementById("fileNote");
  const formNotice = document.getElementById("formNotice");

  const toast = document.getElementById("toast");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const postJobBtn = document.getElementById("postJobBtn");

  let toastTimer;

  // Show notification
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // Job search and filtering
  function filterJobs() {
    const keyword = jobSearch.value.trim().toLowerCase();
    const location = locationFilter.value.trim().toLowerCase();
    const category = categoryFilter.value;

    const cards = [...jobGrid.querySelectorAll(".job-card")];
    let visibleCount = 0;

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cardLocation = card.dataset.location.toLowerCase();
      const cardCategory = card.dataset.category;

      const matchesKeyword = !keyword || text.includes(keyword);
      const matchesLocation = !location || cardLocation.includes(location);
      const matchesCategory = !category || cardCategory === category;

      const visible =
        matchesKeyword && matchesLocation && matchesCategory;

      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    jobCount.textContent =
      `${visibleCount} ${visibleCount === 1 ? "Job" : "Jobs"}`;

    noResults.hidden = visibleCount !== 0;
  }

  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    filterJobs();
    document.getElementById("jobs").scrollIntoView({
      behavior: "smooth"
    });
  });

  jobSearch.addEventListener("input", filterJobs);
  locationFilter.addEventListener("input", filterJobs);
  categoryFilter.addEventListener("change", filterJobs);

  // WORKING APPLY NOW BUTTONS
  // Event delegation also supports dynamically added job cards.
  jobGrid.addEventListener("click", event => {
    const button = event.target.closest(".apply-btn");

    if (!button) return;

    const role = button.dataset.role ||
      button.closest(".job-card").querySelector("h3").textContent;

    appRole.value = role;
    formNotice.textContent = "";

    document.getElementById("apply").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    appRole.focus({ preventScroll: true });
    showToast(`Application form opened for ${role}`);
  });

  // Resume validation
  resume.addEventListener("change", () => {
    const file = resume.files[0];

    if (!file) {
      fileNote.textContent = "Maximum file size: 5 MB.";
      return;
    }

    const allowedExtensions = ["pdf", "doc", "docx"];
    const extension = file.name.split(".").pop().toLowerCase();
    const maxSize = 5 * 1024 * 1024;

    if (!allowedExtensions.includes(extension)) {
      resume.value = "";
      fileNote.textContent = "Invalid file. Upload PDF, DOC or DOCX.";
      showToast("Please upload a PDF, DOC or DOCX resume.");
      return;
    }

    if (file.size > maxSize) {
      resume.value = "";
      fileNote.textContent = "File is larger than 5 MB. Choose another file.";
      showToast("Resume must be smaller than 5 MB.");
      return;
    }

    fileNote.textContent = `Selected: ${file.name}`;
  });

  // Application form submission
  applicationForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!applicationForm.reportValidity()) return;

    const file = resume.files[0];

    if (!file) {
      showToast("Please upload your resume.");
      return;
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["pdf", "doc", "docx"].includes(extension) ||
        file.size > 5 * 1024 * 1024) {
      showToast("Please choose a valid resume under 5 MB.");
      return;
    }

    const applicantName =
      document.getElementById("appName").value.trim();

    const selectedRole = appRole.value.trim();

    formNotice.textContent =
      `Thank you, ${applicantName}! Your application for ${selectedRole} has been prepared.`;

    showToast("Application form submitted successfully!");

    applicationForm.reset();
    fileNote.textContent = "Maximum file size: 5 MB.";

    // Demo only: connect this form to a backend to actually save
    // applications and upload resumes.
  });

  // Mobile navigation
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  // Post a job demo
  postJobBtn.addEventListener("click", () => {
    showToast("Job posting feature coming soon!");
  });

  // 3D card tilt effect
  const supportsFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (supportsFinePointer && !reducedMotion) {
    jobGrid.addEventListener("pointermove", event => {
      const card = event.target.closest(".job-card");
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;

      card.style.transform =
        `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    jobGrid.addEventListener("pointerout", event => {
      const card = event.target.closest(".job-card");
      if (!card) return;

      if (!card.contains(event.relatedTarget)) {
        card.style.transform = "";
      }
    });
  }

  // Initial job count
  filterJobs();
});

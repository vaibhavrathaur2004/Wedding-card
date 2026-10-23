/* Shikha & Veerpal wedding invitation
   Edit CONFIG before publishing. */
const CONFIG = {
  weddingDate: "2026-11-26T00:00:00+05:30",
  venueName: "Wedding venue to be announced",
  venueAddress: "Venue address will be added soon.",
  mapsQuery: "DIVYANI LAWN, 9FC3+4P2, Pilibhit Bypass Rd, Gardan City, Bareilly, Uttar Pradesh 243006",
  rsvpEndpoint: ""
};

const $ = (selector) => document.querySelector(selector);

const envelopeScreen = $("#envelopeScreen");
const envelope = $("#envelope");
const openButton = $("#openInvitation");
const invitationContent = $("#invitationContent");
let invitationOpened = false;

function openInvitation() {
  if (invitationOpened) return;
  invitationOpened = true;
  envelope.classList.add("open");
  openButton.disabled = true;
  openButton.textContent = "With love, just for you";

  window.setTimeout(() => {
    window.scrollTo(0, 0);
    envelopeScreen.classList.add("dismiss");
    invitationContent.inert = false;
    invitationContent.classList.add("visible");
    document.body.classList.remove("locked");

    window.setTimeout(() => {
      envelopeScreen.hidden = true;
      observeReveals();
      // Try auto-playing music after user interaction
      tryAutoPlayMusic();
    }, 950);
  }, 850);
}

envelope.addEventListener("click", openInvitation);
// Whole intro block is tappable on small screens
$(".envelope-intro").addEventListener("click", (event) => {
  if (window.matchMedia("(max-width: 760px)").matches && !event.target.closest("button")) openInvitation();
});
envelope.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openInvitation();
  }
});
openButton.addEventListener("click", openInvitation);

// Auto-play music after user interaction (opening invitation)
const music = $("#weddingMusic");
const musicToggle = $("#musicToggle");
const musicLabel = $("#musicLabel");

async function tryAutoPlayMusic() {
  try {
    await music.play();
    musicToggle.classList.add("is-playing");
    musicToggle.setAttribute("aria-pressed", "true");
    musicToggle.setAttribute("aria-label", "Pause wedding music");
    musicLabel.textContent = "Pause music";
  } catch (error) {
    // Auto-play blocked, user will need to click the button
    musicLabel.textContent = "Play music";
  }
}

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.classList.add("is-playing");
      musicToggle.setAttribute("aria-pressed", "true");
      musicToggle.setAttribute("aria-label", "Pause wedding music");
      musicLabel.textContent = "Pause music";
    } catch (error) {
      musicLabel.textContent = "Add music file";
      $("#formStatus").textContent =
        "Add your licensed MP3 file at assets/wedding-song.mp3, then try the music button again.";
    }
  } else {
    music.pause();
    musicToggle.classList.remove("is-playing");
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.setAttribute("aria-label", "Play wedding music");
    musicLabel.textContent = "Play music";
  }
});

music.addEventListener("ended", () => {
  musicToggle.classList.remove("is-playing");
  musicToggle.setAttribute("aria-pressed", "false");
  musicLabel.textContent = "Play music";
});

// Countdown uses India Standard Time by default.
const weddingTime = new Date(CONFIG.weddingDate).getTime();
const pad = (number) => String(number).padStart(2, "0");

function updateCountdown() {
  let remaining = weddingTime - Date.now();

  if (!Number.isFinite(weddingTime)) {
    $("#countdownCaption").textContent = "Please check the wedding date in script.js.";
    return;
  }

  if (remaining <= 0) {
    $("#days").textContent = "00";
    $("#hours").textContent = "00";
    $("#minutes").textContent = "00";
    $("#seconds").textContent = "00";
    $("#countdownCaption").textContent =
      Date.now() - weddingTime < 86400000
        ? "Today is the day! Let the celebrations begin."
        : "Celebrating a beautiful beginning.";
    return;
  }

  const days = Math.floor(remaining / 86400000);
  remaining %= 86400000;
  const hours = Math.floor(remaining / 3600000);
  remaining %= 3600000;
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  $("#days").textContent = String(days);
  $("#hours").textContent = pad(hours);
  $("#minutes").textContent = pad(minutes);
  $("#seconds").textContent = pad(seconds);
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

// Venue details and Google Maps destination.
$("#venueName").textContent = CONFIG.venueName;
$("#venueAddress").textContent = CONFIG.venueAddress;

if (CONFIG.mapsQuery.trim()) {
  $("#mapsLink").href =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(CONFIG.mapsQuery);
  $("#mapsLink").setAttribute(
    "aria-label",
    "Get directions to " + CONFIG.venueName
  );
}

// Reveal content as the visitor scrolls.
let revealObserver;

function observeReveals() {
  const items = document.querySelectorAll(
    ".invitation-content .reveal:not(.in-view)"
  );

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    items.forEach((item) => item.classList.add("in-view"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
  }

  items.forEach((item) => revealObserver.observe(item));
}

observeReveals();

// Gallery photo lightbox.
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");

document.querySelectorAll(".gallery-photo").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.image;
    lightboxImage.alt = button.querySelector("img").alt;
    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    }
  });
});

$("#lightboxClose").addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

// RSVP needs a backend. A Google Apps Script URL can be added to CONFIG.
const rsvpForm = $("#rsvpForm");
const formStatus = $("#formStatus");
const rsvpThanks = $("#rsvpThanks");

function showThankYou() {
  rsvpForm.hidden = true;
  rsvpThanks.hidden = false;
  rsvpThanks.scrollIntoView({ behavior: "smooth", block: "center" });
}

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(rsvpForm).entries());

  // No backend connected yet: just show the thank-you message.
  if (!CONFIG.rsvpEndpoint.trim()) {
    showThankYou();
    return;
  }

  const submitButton = rsvpForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Sending…";

  try {
    await fetch(CONFIG.rsvpEndpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: new URLSearchParams(data).toString()
    });

    formStatus.textContent = "";
    formStatus.classList.remove("status-warning");
    rsvpForm.reset();
    showThankYou();
  } catch (error) {
    formStatus.textContent =
      "We couldn't send your RSVP. Please try again or contact the hosts directly.";
    formStatus.classList.add("status-warning");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send Response <span>↗</span>';
  }
});

/**
 * The Sweet Seventeen of Anindya Prastika Fatharani
 * Interactive functionality: Cover unlock, Countdown, RSVP, Audio, and Clipboard
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. URL Query Parameter for Guest Name (?to=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestQuery = urlParams.get("to");
  const guestNameCover = document.getElementById("guest-name-cover");
  const guestNameMain = document.getElementById("guest-name-main");
  const rsvpNameInput = document.getElementById("rsvp-name");

  if (guestQuery && guestQuery.trim().length > 0) {
    const cleanGuestName = guestQuery.trim();
    if (guestNameCover) guestNameCover.textContent = cleanGuestName;
    if (guestNameMain) guestNameMain.textContent = cleanGuestName;
    if (rsvpNameInput) rsvpNameInput.value = cleanGuestName;
  }

  // 2. Cover / Envelope Unlock
  const envelopeCover = document.getElementById("envelope-cover");
  const mainContent = document.getElementById("main-content");
  const btnOpen = document.getElementById("btn-open-invitation");
  const bgAudio = document.getElementById("bg-audio");
  const btnAudio = document.getElementById("btn-audio");
  const iconSoundOn = document.getElementById("icon-sound-on");
  const iconSoundOff = document.getElementById("icon-sound-off");

  let isAudioPlaying = false;

  const playBackgroundMusic = () => {
    if (!bgAudio) return;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isAudioPlaying = true;
          updateAudioButtonState();
        })
        .catch(() => {
          // Autoplay was prevented by browser policy; user can toggle manually
          isAudioPlaying = false;
          updateAudioButtonState();
        });
    }
  };

  const updateAudioButtonState = () => {
    if (!iconSoundOn || !iconSoundOff || !btnAudio) return;
    if (isAudioPlaying) {
      iconSoundOn.removeAttribute("hidden");
      iconSoundOff.setAttribute("hidden", "true");
      btnAudio.setAttribute("aria-label", "Matikan musik latar");
    } else {
      iconSoundOn.setAttribute("hidden", "true");
      iconSoundOff.removeAttribute("hidden");
      btnAudio.setAttribute("aria-label", "Putar musik latar");
    }
  };

  if (btnOpen && envelopeCover && mainContent) {
    btnOpen.addEventListener("click", () => {
      envelopeCover.classList.add("is-hidden");
      mainContent.classList.remove("is-locked");
      playBackgroundMusic();

      // Smooth scroll to top of main content
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Audio Toggle Button
  if (btnAudio && bgAudio) {
    btnAudio.addEventListener("click", () => {
      if (isAudioPlaying) {
        bgAudio.pause();
        isAudioPlaying = false;
      } else {
        bgAudio.play().then(() => {
          isAudioPlaying = true;
        }).catch(() => {
          isAudioPlaying = false;
        });
      }
      updateAudioButtonState();
    });
  }

  // 3. Countdown Timer (Target: 7 November 2026, 18.30 WIB)
  const targetDate = new Date("2026-11-07T18:30:00+07:00").getTime();
  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMinutes = document.getElementById("cd-minutes");
  const cdSeconds = document.getElementById("cd-seconds");

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (cdDays) cdDays.textContent = "00";
      if (cdHours) cdHours.textContent = "00";
      if (cdMinutes) cdMinutes.textContent = "00";
      if (cdSeconds) cdSeconds.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (cdDays) cdDays.textContent = String(days).padStart(2, "0");
    if (cdHours) cdHours.textContent = String(hours).padStart(2, "0");
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, "0");
    if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, "0");
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. Save to Google Calendar
  const btnSaveCalendar = document.getElementById("btn-save-calendar");
  if (btnSaveCalendar) {
    btnSaveCalendar.addEventListener("click", () => {
      const eventTitle = encodeURIComponent("Sweet Seventeen Anindya Prastika Fatharani");
      const eventDetails = encodeURIComponent("Perayaan ulang tahun ke-17 Anindya Prastika Fatharani di Klakah Rejo Gg IIB No 28 pukul 18.30 WIB.");
      const eventLocation = encodeURIComponent("Jl. Klakah Rejo Gg. IIB No. 28, Klakahrejo, Benowo, Surabaya, Jawa Timur");
      // ISO strings in UTC (2026-11-07 18:30 WIB = 2026-11-07 11:30 UTC)
      const startDate = "20261107T113000Z";
      const endDate = "20261107T143000Z";

      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDate}/${endDate}&details=${eventDetails}&location=${eventLocation}`;
      window.open(gcalUrl, "_blank", "noopener,noreferrer");
    });
  }

  // 5. Copy Address to Clipboard
  const btnCopyAddress = document.getElementById("btn-copy-address");
  const copyText = document.getElementById("copy-text");
  const copyStatus = document.getElementById("copy-status");

  if (btnCopyAddress && copyText) {
    btnCopyAddress.addEventListener("click", () => {
      const addressString = "Jl. Klakah Rejo Gg. IIB No. 28, Klakahrejo, Kec. Benowo, Kota Surabaya, Jawa Timur 60198";

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(addressString).then(() => {
          showCopySuccess();
        }).catch(() => {
          fallbackCopyText(addressString);
        });
      } else {
        fallbackCopyText(addressString);
      }
    });

    const fallbackCopyText = (str) => {
      const tempInput = document.createElement("textarea");
      tempInput.value = str;
      tempInput.style.position = "fixed";
      tempInput.style.left = "-9999px";
      document.body.appendChild(tempInput);
      tempInput.focus();
      tempInput.select();
      try {
        document.execCommand("copy");
        showCopySuccess();
      } catch {
        if (copyStatus) copyStatus.textContent = "Gagal menyalin alamat secara otomatis.";
      }
      document.body.removeChild(tempInput);
    };

    const showCopySuccess = () => {
      copyText.textContent = "Alamat Tersalin";
      if (copyStatus) copyStatus.textContent = "Alamat berhasil disalin ke papan klip.";
      setTimeout(() => {
        copyText.textContent = "Salin Alamat";
        if (copyStatus) copyStatus.textContent = "";
      }, 3000);
    };
  }

  // 6. RSVP Form & Guestbook Feed (Supabase Realtime & Local Fallback)
  const formRsvp = document.getElementById("form-rsvp");
  const wishesList = document.getElementById("wishes-list");
  const rsvpFeedback = document.getElementById("rsvp-feedback");

  // -------------------------------------------------------------
  // KONFIGURASI SUPABASE (Realtime Database)
  // -------------------------------------------------------------
  const SUPABASE_URL = "https://jnziwivczognwsoobeca.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_fMKKgDpKsjujRAiWXi2ssA_VLmS2Bs4";

  let supabaseClient = null;
  if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
      console.warn("Gagal menginisialisasi Supabase:", err);
    }
  }

  const initialWishes = [
    {
      name: "Keluarga Besar Fatharani",
      status: "Hadir",
      message: "Selamat ulang tahun ke-17 Anin tersayang! Semoga selalu diberi kesehatan, kebahagiaan, dan tercapai segala cita-citamu.",
      time: "Hari ini"
    },
    {
      name: "Nabila & Teman SMA",
      status: "Hadir",
      message: "Happy sweet seventeen Anin! Tidak sabar merayakan bareng di Klakah Rejo nanti malam.",
      time: "Hari ini"
    }
  ];

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "Baru saja";
    const now = new Date();
    const date = new Date(timestamp);
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return "Baru saja";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  const getStoredWishes = () => {
    try {
      const raw = localStorage.getItem("anin_rsvp_wishes");
      if (raw) return JSON.parse(raw);
    } catch {
      // Local storage disabled or error
    }
    return initialWishes;
  };

  const saveStoredWishes = (list) => {
    try {
      localStorage.setItem("anin_rsvp_wishes", JSON.stringify(list));
    } catch {
      // Fallback
    }
  };

  // -------------------------------------------------------------
  // FITUR MODE ADMIN & HAPUS UCAPAN DENGAN PIN RAHASIA
  // -------------------------------------------------------------
  const ADMIN_PIN = "012942";
  let isAdminMode = sessionStorage.getItem("anin_admin_mode") === "true";

  const btnAdminToggle = document.getElementById("btn-admin-toggle");
  const modalAdminPin = document.getElementById("modal-admin-pin");
  const formAdminPin = document.getElementById("form-admin-pin");
  const inputAdminPin = document.getElementById("input-admin-pin");
  const pinErrorMsg = document.getElementById("pin-error-msg");
  const btnCancelPin = document.getElementById("btn-cancel-pin");
  const iconLockClosed = document.getElementById("icon-lock-closed");
  const iconLockOpen = document.getElementById("icon-lock-open");

  const handleDeleteWish = async (item) => {
    const confirmed = confirm(`Yakin ingin menghapus ucapan dari "${item.name}"?`);
    if (!confirmed) return;

    // Hapus seketika dari tampilan lokal
    currentWishes = currentWishes.filter((w) =>
      item.id
        ? w.id !== item.id
        : w.name !== item.name || w.message !== item.message
    );
    saveStoredWishes(currentWishes);
    renderWishes(currentWishes);

    // Hapus dari database Supabase
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const queryParam = item.id
          ? `id=eq.${item.id}`
          : `name=eq.${encodeURIComponent(item.name)}&message=eq.${encodeURIComponent(item.message)}`;

        await fetch(`${SUPABASE_URL}/rest/v1/wishes?${queryParam}`, {
          method: "DELETE",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
      } catch (err) {
        console.error("Gagal menghapus ucapan dari Supabase:", err);
      }
    }
  };

  const updateAdminUI = () => {
    if (!btnAdminToggle) return;
    if (isAdminMode) {
      btnAdminToggle.classList.add("is-active");
      btnAdminToggle.setAttribute("title", "Mode Admin Aktif (Klik untuk mengunci kembali)");
      if (iconLockClosed) iconLockClosed.setAttribute("hidden", "true");
      if (iconLockOpen) iconLockOpen.removeAttribute("hidden");
    } else {
      btnAdminToggle.classList.remove("is-active");
      btnAdminToggle.setAttribute("title", "Kelola Pesan (Admin)");
      if (iconLockClosed) iconLockClosed.removeAttribute("hidden");
      if (iconLockOpen) iconLockOpen.setAttribute("hidden", "true");
    }
    renderWishes(currentWishes);
  };

  if (btnAdminToggle) {
    btnAdminToggle.addEventListener("click", () => {
      if (isAdminMode) {
        isAdminMode = false;
        sessionStorage.removeItem("anin_admin_mode");
        updateAdminUI();
      } else {
        if (pinErrorMsg) pinErrorMsg.textContent = "";
        if (inputAdminPin) inputAdminPin.value = "";
        if (modalAdminPin) {
          if (typeof modalAdminPin.showModal === "function") {
            modalAdminPin.showModal();
          } else {
            modalAdminPin.setAttribute("open", "true");
          }
          if (inputAdminPin) inputAdminPin.focus();
        }
      }
    });
  }

  if (btnCancelPin && modalAdminPin) {
    btnCancelPin.addEventListener("click", () => {
      if (typeof modalAdminPin.close === "function") {
        modalAdminPin.close();
      } else {
        modalAdminPin.removeAttribute("open");
      }
    });
  }

  if (formAdminPin) {
    formAdminPin.addEventListener("submit", (e) => {
      e.preventDefault();
      const enteredPin = inputAdminPin ? inputAdminPin.value.trim() : "";
      if (enteredPin === ADMIN_PIN) {
        isAdminMode = true;
        sessionStorage.setItem("anin_admin_mode", "true");
        if (modalAdminPin) {
          if (typeof modalAdminPin.close === "function") modalAdminPin.close();
          else modalAdminPin.removeAttribute("open");
        }
        updateAdminUI();
      } else {
        if (pinErrorMsg) pinErrorMsg.textContent = "PIN salah. Silakan coba lagi.";
      }
    });
  }

  const renderWishes = (wishes) => {
    if (!wishesList) return;
    wishesList.innerHTML = "";

    wishes.forEach((item) => {
      const card = document.createElement("article");
      card.className = "wish-item";
      if (item.id) card.dataset.id = item.id;

      const header = document.createElement("div");
      header.className = "wish-header";

      const sender = document.createElement("span");
      sender.className = "wish-sender";
      sender.textContent = item.name;

      const meta = document.createElement("div");
      meta.className = "wish-meta";

      const status = document.createElement("span");
      status.className = "wish-status";
      status.textContent = item.status;
      meta.appendChild(status);

      // Jika Mode Admin Aktif, tampilkan tombol Hapus
      if (isAdminMode) {
        const btnDelete = document.createElement("button");
        btnDelete.className = "btn-delete-wish";
        btnDelete.type = "button";
        btnDelete.setAttribute("aria-label", `Hapus ucapan dari ${item.name}`);
        btnDelete.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          <span>Hapus</span>
        `;
        btnDelete.addEventListener("click", () => handleDeleteWish(item));
        meta.appendChild(btnDelete);
      }

      header.appendChild(sender);
      header.appendChild(meta);

      const msg = document.createElement("p");
      msg.className = "wish-message";
      msg.textContent = item.message;

      const time = document.createElement("span");
      time.className = "wish-time";
      time.textContent = item.time;

      card.appendChild(header);
      card.appendChild(msg);
      card.appendChild(time);

      wishesList.appendChild(card);
    });
  };

  let currentWishes = getStoredWishes();
  renderWishes(currentWishes);
  updateAdminUI();

  // Ambil data ucapan online dari Supabase
  const loadOnlineWishes = async () => {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("wishes")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          currentWishes = data.map((row) => ({
            id: row.id,
            name: row.name,
            status: row.status,
            guests: row.guests,
            message: row.message,
            time: formatRelativeTime(row.created_at)
          }));
          saveStoredWishes(currentWishes);
          renderWishes(currentWishes);
          return;
        }
      } catch (e) {
        console.warn("Supabase SDK query gagal, mencoba REST fallback:", e);
      }
    }

    // Direct REST API Fallback
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/wishes?select=*&order=created_at.desc&limit=50`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          currentWishes = data.map((row) => ({
            id: row.id,
            name: row.name,
            status: row.status,
            guests: row.guests,
            message: row.message,
            time: formatRelativeTime(row.created_at)
          }));
          saveStoredWishes(currentWishes);
          renderWishes(currentWishes);
        }
      }
    } catch (err) {
      console.warn("Gagal memuat ucapan dari Supabase:", err);
    }
  };

  // Muat ucapan online saat pertama kali halaman dibuka
  loadOnlineWishes();

  // Dengarkan ucapan baru dan penghapusan secara Realtime
  if (supabaseClient) {
    supabaseClient
      .channel("public-wishes-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wishes" },
        (payload) => {
          const row = payload.new;
          if (!row) return;

          const exists = currentWishes.some(
            (w) => w.id === row.id || (w.name === row.name && w.message === row.message)
          );

          if (!exists) {
            const incomingWish = {
              id: row.id,
              name: row.name,
              status: row.status,
              guests: row.guests,
              message: row.message,
              time: "Baru saja"
            };
            currentWishes.unshift(incomingWish);
            saveStoredWishes(currentWishes);
            renderWishes(currentWishes);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "wishes" },
        (payload) => {
          const deletedId = payload.old ? payload.old.id : null;
          if (deletedId) {
            currentWishes = currentWishes.filter((w) => w.id !== deletedId);
            saveStoredWishes(currentWishes);
            renderWishes(currentWishes);
          }
        }
      )
      .subscribe();
  }

  // Handle Pengiriman Form Kehadiran & Ucapan
  if (formRsvp) {
    formRsvp.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameField = document.getElementById("rsvp-name");
      const attendanceField = document.getElementById("rsvp-attendance");
      const guestsField = document.getElementById("rsvp-guests");
      const messageField = document.getElementById("rsvp-message");
      const btnSubmit = document.getElementById("btn-submit-rsvp");

      const errName = document.getElementById("error-name");
      const errAttendance = document.getElementById("error-attendance");
      const errMessage = document.getElementById("error-message");

      let isValid = true;

      // Validation
      if (!nameField.value.trim()) {
        errName.textContent = "Tulis nama kamu dulu ya.";
        isValid = false;
      } else {
        errName.textContent = "";
      }

      if (!attendanceField.value) {
        errAttendance.textContent = "Pilih apakah kamu bisa hadir atau belum.";
        isValid = false;
      } else {
        errAttendance.textContent = "";
      }

      if (!messageField.value.trim()) {
        errMessage.textContent = "Tulis ucapan atau doa kamu buat Anin ya.";
        isValid = false;
      } else {
        errMessage.textContent = "";
      }

      if (!isValid) return;

      const newWish = {
        name: nameField.value.trim(),
        status: attendanceField.value,
        guests: guestsField.value,
        message: messageField.value.trim(),
        time: "Baru saja"
      };

      // Tampilkan seketika di layar lokal
      currentWishes.unshift(newWish);
      saveStoredWishes(currentWishes);
      renderWishes(currentWishes);

      if (btnSubmit) btnSubmit.disabled = true;

      // Kirim ke database Supabase
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        try {
          if (supabaseClient) {
            const { error } = await supabaseClient.from("wishes").insert([
              {
                name: newWish.name,
                status: newWish.status,
                guests: newWish.guests,
                message: newWish.message
              }
            ]);
            if (error) console.error("Error insert Supabase SDK:", error);
          } else {
            await fetch(`${SUPABASE_URL}/rest/v1/wishes`, {
              method: "POST",
              headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                name: newWish.name,
                status: newWish.status,
                guests: newWish.guests,
                message: newWish.message
              })
            });
          }
        } catch (err) {
          console.error("Gagal mengirim ke Supabase:", err);
        }
      }

      if (btnSubmit) btnSubmit.disabled = false;

      if (rsvpFeedback) {
        rsvpFeedback.removeAttribute("hidden");
        rsvpFeedback.textContent = `Terima kasih banyak ${newWish.name}, konfirmasi dan doa kamu sudah tersimpan!`;
      }

      // Reset form fields except name if from query
      if (!guestQuery) nameField.value = "";
      attendanceField.value = "";
      messageField.value = "";

      setTimeout(() => {
        if (rsvpFeedback) {
          rsvpFeedback.setAttribute("hidden", "true");
          rsvpFeedback.textContent = "";
        }
      }, 6000);
    });
  }
});

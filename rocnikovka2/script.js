// ================================
// COUNTDOWN DO NOVÉ VÝSTAVY
// ================================

const datumVystavy = new Date("2026-05-15T18:00:00").getTime();

function aktualizovatOdpocet() {
  const ted = new Date().getTime();
  const rozdil = datumVystavy - ted;

  if (rozdil <= 0) {
    document.getElementById("dny").textContent = "00";
    document.getElementById("hodiny").textContent = "00";
    document.getElementById("minuty").textContent = "00";
    document.getElementById("sekundy").textContent = "00";
    return;
  }

  const dny = Math.floor(rozdil / (1000 * 60 * 60 * 24));
  const hodiny = Math.floor((rozdil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minuty = Math.floor((rozdil % (1000 * 60 * 60)) / (1000 * 60));
  const sekundy = Math.floor((rozdil % (1000 * 60)) / 1000);

  document.getElementById("dny").textContent = String(dny).padStart(2, "0");
  document.getElementById("hodiny").textContent = String(hodiny).padStart(2, "0");
  document.getElementById("minuty").textContent = String(minuty).padStart(2, "0");
  document.getElementById("sekundy").textContent = String(sekundy).padStart(2, "0");
}

aktualizovatOdpocet();
setInterval(aktualizovatOdpocet, 1000);

// ================================
// CAROUSEL PRÉMIOVÝCH VÝSTAV
// ================================

const carouselStopa = document.getElementById("carouselStopa");
const predchoziBtn = document.getElementById("predchoziBtn");
const dalsiBtn = document.getElementById("dalsiBtn");
const carouselKarty = document.querySelectorAll(".carousel_karta");

let aktualniIndex = 0;

function zjistitPocetViditelnychKaret() {
  if (window.innerWidth <= 768) {
    return 1;
  } else if (window.innerWidth <= 980) {
    return 2;
  } else {
    return 3;
  }
}

function posunoutCarousel() {
  if (!carouselStopa || carouselKarty.length === 0) {
    return;
  }

  const viditelneKarty = zjistitPocetViditelnychKaret();
  const karta = carouselKarty[0];
  const gap = 24;
  const sirkaKarty = karta.offsetWidth + gap;

  carouselStopa.style.transform = `translateX(-${aktualniIndex * sirkaKarty}px)`;

  const maxIndex = Math.max(0, carouselKarty.length - viditelneKarty);

  if (predchoziBtn) {
    predchoziBtn.disabled = aktualniIndex === 0;
  }

  if (dalsiBtn) {
    dalsiBtn.disabled = aktualniIndex >= maxIndex;
  }
}

if (dalsiBtn) {
  dalsiBtn.addEventListener("click", function () {
    const viditelneKarty = zjistitPocetViditelnychKaret();
    const maxIndex = Math.max(0, carouselKarty.length - viditelneKarty);

    if (aktualniIndex < maxIndex) {
      aktualniIndex++;
      posunoutCarousel();
    }
  });
}

if (predchoziBtn) {
  predchoziBtn.addEventListener("click", function () {
    if (aktualniIndex > 0) {
      aktualniIndex--;
      posunoutCarousel();
    }
  });
}

window.addEventListener("resize", function () {
  const viditelneKarty = zjistitPocetViditelnychKaret();
  const maxIndex = Math.max(0, carouselKarty.length - viditelneKarty);

  if (aktualniIndex > maxIndex) {
    aktualniIndex = maxIndex;
  }

  posunoutCarousel();

  // Když se okno zvětší zpátky na desktop, menu se vrátí do normálu
  if (window.innerWidth > 768 && hlavniMenu) {
    hlavniMenu.classList.remove("otevrene");
  }
});

window.addEventListener("load", posunoutCarousel);

// ================================
// MOBILNÍ MENU
// ================================

const menuTlacitko = document.getElementById("menuTlacitko");
const hlavniMenu = document.getElementById("hlavniMenu");

if (menuTlacitko && hlavniMenu) {
  menuTlacitko.addEventListener("click", function () {
    if (window.innerWidth <= 768) {
      hlavniMenu.classList.toggle("otevrene");
    }
  });

  const odkazyMenu = hlavniMenu.querySelectorAll("a");

  odkazyMenu.forEach(function (odkaz) {
    odkaz.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        hlavniMenu.classList.remove("otevrene");
      }
    });
  });
}
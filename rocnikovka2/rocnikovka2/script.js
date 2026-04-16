// COUNTDOWN


//  datum a čas nové výstavy.

const datumVystavy = new Date("2026-05-15T18:00:00").getTime();

// kolik času zbývá do výstavy
function aktualizovatOdpocet() {
  const ted = new Date().getTime();
  const rozdil = datumVystavy - ted;

  // Když už datum uplynulo, zobrazíme samé nuly
  if (rozdil <= 0) {
    document.getElementById("dny").textContent = "00";
    document.getElementById("hodiny").textContent = "00";
    document.getElementById("minuty").textContent = "00";
    document.getElementById("sekundy").textContent = "00";
    return;
  }

  // Přepočet milisekund na dny, hodiny, minuty a sekundy
  const dny = Math.floor(rozdil / (1000 * 60 * 60 * 24));
  const hodiny = Math.floor((rozdil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minuty = Math.floor((rozdil % (1000 * 60 * 60)) / (1000 * 60));
  const sekundy = Math.floor((rozdil % (1000 * 60)) / 1000);

  // Zapsání hodnot do HTML
  document.getElementById("dny").textContent = String(dny).padStart(2, "0");
  document.getElementById("hodiny").textContent = String(hodiny).padStart(2, "0");
  document.getElementById("minuty").textContent = String(minuty).padStart(2, "0");
  document.getElementById("sekundy").textContent = String(sekundy).padStart(2, "0");
}

// Odpocet se spustí hned po načtení stránky
aktualizovatOdpocet();

// každou sekundu se znovu přepočítá
setInterval(aktualizovatOdpocet, 1000);


// CAROUSEL


// Načtení prvků carouselu z HTML
const carouselStopa = document.getElementById("carouselStopa");
const predchoziBtn = document.getElementById("predchoziBtn");
const dalsiBtn = document.getElementById("dalsiBtn");
const carouselKarty = document.querySelectorAll(".carousel_karta");

// Aktuální pozice carouselu
let aktualniIndex = 0;

// Funkce zjišťuje, kolik karet má být vidět podle šířky obrazovky
function zjistitPocetViditelnychKaret() {
  if (window.innerWidth <= 768) {
    return 1; // mobil
  } else if (window.innerWidth <= 980) {
    return 2; // tablet / menší notebook
  } else {
    return 3; // desktop
  }
}

// Funkce posune carousel doleva nebo doprava
function posunoutCarousel() {
  // Když by chyběl carousel v HTML, funkce se ukončí
  if (!carouselStopa || carouselKarty.length === 0) {
    return;
  }

  const viditelneKarty = zjistitPocetViditelnychKaret();
  const karta = carouselKarty[0];
  const gap = 24;
  const sirkaKarty = karta.offsetWidth + gap;

  // Posun celé stopy pomocí translateX
  carouselStopa.style.transform = `translateX(-${aktualniIndex * sirkaKarty}px)`;

  // Výpočet maximální možné pozice
  const maxIndex = carouselKarty.length - viditelneKarty;

  // Tlačítka se deaktivují na začátku nebo na konci
  if (predchoziBtn) {
    predchoziBtn.disabled = aktualniIndex === 0;
  }

  if (dalsiBtn) {
    dalsiBtn.disabled = aktualniIndex >= maxIndex;
  }
}

// Kliknutí na tlačítko doprava
if (dalsiBtn) {
  dalsiBtn.addEventListener("click", function () {
    const viditelneKarty = zjistitPocetViditelnychKaret();
    const maxIndex = carouselKarty.length - viditelneKarty;

    if (aktualniIndex < maxIndex) {
      aktualniIndex++;
      posunoutCarousel();
    }
  });
}

// Kliknutí na tlačítko doleva
if (predchoziBtn) {
  predchoziBtn.addEventListener("click", function () {
    if (aktualniIndex > 0) {
      aktualniIndex--;
      posunoutCarousel();
    }
  });
}

// Když se změní velikost okna, carousel se přepočítá
window.addEventListener("resize", function () {
  const viditelneKarty = zjistitPocetViditelnychKaret();
  const maxIndex = carouselKarty.length - viditelneKarty;

  if (aktualniIndex > maxIndex) {
    aktualniIndex = Math.max(0, maxIndex);
  }

  posunoutCarousel();
});

//správna pozice carouselu
window.addEventListener("load", posunoutCarousel);


// MOBILNÍ MENU


// Načtení tlačítka a menu
const menuTlacitko = document.getElementById("menuTlacitko");
const hlavniMenu = document.getElementById("hlavniMenu");

// Pokud obě věci existují, přidá se logika menu
if (menuTlacitko && hlavniMenu) {
  // Po kliknutí na tlačítko se menu otevře / zavře
  menuTlacitko.addEventListener("click", function () {
    hlavniMenu.classList.toggle("otevrene");
  });

  // Když uživatel klikne na odkaz v menu na mobilu,
  // menu se zase zavře
  const odkazyMenu = hlavniMenu.querySelectorAll("a");

  odkazyMenu.forEach(function (odkaz) {
    odkaz.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        hlavniMenu.classList.remove("otevrene");
      }
    });
  });
}
// countdown do nove vystavy
const datumVystavy = new Date("2026-12-31T23:59:59").getTime();

// funkce pocita kolik casu zbyva
function aktualizovatOdpocet() {
  const ted = new Date().getTime();
  const rozdil = datumVystavy - ted;

  // kdyz datum uz probehlo, nastavi se nuly
  if (rozdil <= 0) {
    document.getElementById("dny").textContent = "00";
    document.getElementById("hodiny").textContent = "00";
    document.getElementById("minuty").textContent = "00";
    document.getElementById("sekundy").textContent = "00";
    return;
  }

  // vypocet dnu, hodin, minut a sekund
  const dny = Math.floor(rozdil / (1000 * 60 * 60 * 24));
  const hodiny = Math.floor((rozdil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minuty = Math.floor((rozdil % (1000 * 60 * 60)) / (1000 * 60));
  const sekundy = Math.floor((rozdil % (1000 * 60)) / 1000);

  // vypsani hodnot do html
  document.getElementById("dny").textContent = String(dny).padStart(2, "0");
  document.getElementById("hodiny").textContent = String(hodiny).padStart(2, "0");
  document.getElementById("minuty").textContent = String(minuty).padStart(2, "0");
  document.getElementById("sekundy").textContent = String(sekundy).padStart(2, "0");
}

// spusteni hned po nacteni
aktualizovatOdpocet();

// opakovani kazdou sekundu
setInterval(aktualizovatOdpocet, 1000);


// carousel premiovych vystav
const carouselStopa = document.getElementById("carouselStopa");
const predchoziBtn = document.getElementById("predchoziBtn");
const dalsiBtn = document.getElementById("dalsiBtn");
const carouselKarty = document.querySelectorAll(".carousel_karta");

// aktualni pozice carouselu
let aktualniIndex = 0;

// podle sirky obrazovky zjisti kolik karet ma byt videt
function zjistitPocetViditelnychKaret() {
  if (window.innerWidth <= 768) {
    return 1;
  } else if (window.innerWidth <= 980) {
    return 2;
  } else {
    return 3;
  }
}

// posouva carousel
function posunoutCarousel() {
  if (!carouselStopa || carouselKarty.length === 0) {
    return;
  }

  const karta = carouselKarty[0];
  const gap = 24;
  const sirkaKarty = karta.offsetWidth + gap;

  carouselStopa.style.transform = `translateX(-${aktualniIndex * sirkaKarty}px)`;
}

// klik na dalsi sipku - kdyz je konec, vrati se na zacatek
if (dalsiBtn) {
  dalsiBtn.addEventListener("click", function () {
    const viditelneKarty = zjistitPocetViditelnychKaret();
    const maxIndex = Math.max(0, carouselKarty.length - viditelneKarty);

    if (aktualniIndex >= maxIndex) {
      aktualniIndex = 0;
    } else {
      aktualniIndex++;
    }

    posunoutCarousel();
  });
}

// klik na predchozi sipku - kdyz je zacatek, skoci na konec
if (predchoziBtn) {
  predchoziBtn.addEventListener("click", function () {
    const viditelneKarty = zjistitPocetViditelnychKaret();
    const maxIndex = Math.max(0, carouselKarty.length - viditelneKarty);

    if (aktualniIndex <= 0) {
      aktualniIndex = maxIndex;
    } else {
      aktualniIndex--;
    }

    posunoutCarousel();
  });
}

// pri zmene sirky obrazovky se carousel prepocita
window.addEventListener("resize", function () {
  const viditelneKarty = zjistitPocetViditelnychKaret();
  const maxIndex = Math.max(0, carouselKarty.length - viditelneKarty);

  if (aktualniIndex > maxIndex) {
    aktualniIndex = 0;
  }

  posunoutCarousel();

  if (window.innerWidth > 768 && hlavniMenu) {
    hlavniMenu.classList.remove("otevrene");
  }
});

window.addEventListener("load", posunoutCarousel);

// mobilni menu
const menuTlacitko = document.getElementById("menuTlacitko");
const hlavniMenu = document.getElementById("hlavniMenu");

// otevirani a zavirani menu na mobilu
if (menuTlacitko && hlavniMenu) {
  menuTlacitko.addEventListener("click", function () {
    if (window.innerWidth <= 768) {
      hlavniMenu.classList.toggle("otevrene");
    }
  });

  const odkazyMenu = hlavniMenu.querySelectorAll("a");

  // po kliknuti na odkaz se menu zavre
  odkazyMenu.forEach(function (odkaz) {
    odkaz.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        hlavniMenu.classList.remove("otevrene");
      }
    });
  });
}


// nacteni expozic z csv
fetch("expozice.csv")
  .then(function (odpoved) {
    return odpoved.text();
  })
  .then(function (data) {
    const radky = data.trim().split("\n");
    radky.shift();

    const container = document.getElementById("expoziceContainer");

    // kdyz csv funguje, smaze zalozni html karty
    container.innerHTML = "";

    radky.forEach(function (radek) {
      const sloupce = radek.split(",");

      const nazev = sloupce[0];
      const popis = sloupce[1];
      const kategorie = sloupce[2];
      const obrazek = sloupce[3];

      container.innerHTML += `
        <article class="karta">
          <img src="${obrazek}" alt="${nazev}" class="obrazek_karty">
          <div class="cislo_karty">${kategorie}</div>
          <h3>${nazev}</h3>
          <p>${popis}</p>
        </article>
      `;
    });
  });
let playerName = "";
let hasID = false;     // Falešné ID (z cely)
let hasLever = false;  // Kovová páka (z cely)
let hasCode = false;   // Nouzový kód k výtahu (ze strážnice)
let hasN7Key = false;  // Klíč N-7 (z Komunikačního Centra)

const storyText = document.getElementById('story-text');
const choicesElement = document.getElementById('choices-container');
const restartBtn = document.getElementById('restart-button');
const bodyElement = document.body; 

function askName() {
    let name = prompt("Zadej své jméno, vězni");
    if (!name) {
        playerName = "Vězni.";
    } else {
        playerName = name + ".";
    }
}

const story = {
    //  PATRO 1: CELA A CHODBA 
    "start": {
        text: "{name} Probouzíš se ve své cele v Dělení 7, nejhlubším vězení/těžebním komplexu. Stráže špatně zavřely dveře. Jsi sám.",
        choices: [
            { text: "Jít okamžitě na chodbu", next: "main_hall" }, 
            { text: "Prohledat celu", next: "search_cell" },
            { text: "Zkusit se schovat pod postel", next: "dead_hide" }
        ]
    },

    // Cesty k předmětům a začátek
    "search_cell": {
        text: "Pod matrací jsi našel falešné ID a na zemi poškozenou kovovou páku.",
        choices: [
            { text: "Vzít ID a páku a jít na chodbu", next: "main_hall_items" },
            { text: "Křičet na stráž", next: "dead_shout" }
        ]
    },
    
    "dead_hide": {
        text: "Schoval ses, ale termální skener tě odhalil. Jsi omráčen a odveden zpět. Nula šancí na útěk.",
        choices: [{ text: "NEÚSPĚŠNÝ ÚTĚK", next: "restart" }]
    },
    "dead_shout": {
        text: "Tvé křičení přilákalo drony, které tě bleskově paralyzovaly a odnesly do samotky.",
        choices: [{ text: "PARALYZOVÁN", next: "restart" }]
    },
    
    // Chodba Patro 1
    "main_hall": {
        text: "Jsi na chodbě. Vlevo jsou zamčené dveře k ventilační šachtě. Vpravo je strážnice. Rovně vede tunel k výtahu do vyšších pater.",
        choices: [
            { text: "Jít k ventilační šachtě", next: "dead_ventilation_locked" },
            { text: "Zkusit projít strážnicí", next: "dead_guard" },
            { text: "Jít k výtahu", next: "elevator_choose" }
        ]
    },
    "main_hall_items": {
        text: "Jsi na chodbě. Máš u sebe ID a páku. Vlevo jsou dveře k šachtě. Vpravo je strážnice. Rovně výtah.",
        choices: [
            { text: "Použít páku na šachtu", next: "ventilation" }, // VÍTĚZSTVÍ 1
            { text: "Použít Falešné ID ke vstupu do Strážnice", next: "guard_room_id" }, // Kód a VÍTĚZSTVÍ 2
            { text: "Jít k výtahu", next: "elevator_choose" }
        ]
    },

    // VÍTĚZSTVÍ 1: Ventilace
    "dead_ventilation_locked": {
        text: "Dveře k šachtě jsou příliš masivní. Zkouška otevření spustila alarm. Jsi zatčen.",
        choices: [{ text: "ZAJAT STRÁŽEMI", next: "restart" }]
    },
    "ventilation": {
        text: "Páka zabrala! Jsi ve špinavé ventilační šachtě, která vede k povrchu. Už cítíš čerstvý vzduch.",
        choices: [
            { text: "Pokračovat šachtou ven", next: "win_ventilation" },
            { text: "Vrátit se na chodbu", next: "main_hall_items" }
        ]
    },
    "win_ventilation": {
        text: "Vylezl jsi z šachty ven do pustiny. Ostré světlo! Jsi volný!",
        choices: [{ text: "ÚSPĚŠNÝ ÚTĚK - VENTILACE", next: "restart" }]
    },
    
    // VÍTĚZSTVÍ 2: Tunel
    "dead_guard": {
        text: "Stráž si tě okamžitě všimla. Vydal jsi ze sebe jen 'Ách!', než tě omráčila.",
        choices: [{ text: "OMRÁČEN A ZAJAT", next: "restart" }]
    },
    "guard_room_id": {
        text: "Falešné ID funguje! Strážný tě pouští dál. Za dveřmi je nouzový únikový tunel. Na stole je i **nouzový kód k výtahu**!",
        choices: [
            { text: "Sebrat kód a jít do tunelu", next: "win_tunnel_code" }, // VÍTĚZSTVÍ 2
            { text: "Sebrat kód a jít k výtahu", next: "elevator_choose_code" } 
        ]
    },
    "win_tunnel_code": {
        text: "Máš kód. Tunel je úzký, ale vede k povrchu. Uslyšel jsi, jak za tebou bouchly nouzové dveře. Jsi volný!",
        choices: [{ text: "ÚSPĚŠNÝ ÚTĚK - NOUZOVÝ TUNEL", next: "restart" }]
    },

    //  Výtah
    "elevator_choose": {
        text: "Jsi u výtahu. Kam chceš jet? (Patro 1 = Hala / Patro 2 = Komunikace / Patro 3 = Těžba)",
        choices: [
            { text: "Zkusit jet do Komunikačního Centra", next: "dead_elevator_locked" },
            { text: "Zkusit jet do Těžební sekce", next: "dead_elevator_locked" },
            { text: "Jet zpět na hlavní chodbu", next: "main_hall" }
        ]
    },
    "elevator_choose_code": {
        text: "Jsi u výtahu. Máš kód. Kam chceš jet?",
        choices: [
            { text: "Použít kód a jet do Komunikačního Centra (Patro 2)", next: "communication_center" },
            { text: "Použít kód a jet do Těžební sekce (Patro 3)", next: "mining_sector_locked" }, 
            { text: "Jet zpět na hlavní chodbu", next: "main_hall_items" }
        ]
    },
    "dead_elevator_locked": {
        text: "Výtah vyžaduje přístupový kód. Stojíš na místě a stráže se blíží. Jsi zatčen.",
        choices: [{ text: "ZATČEN VE VÝTAHU", next: "restart" }]
    },

    // PATRO 2: KOMUNIKACE
    "communication_center": {
        text: "Jsi v Komunikačním Centru. Máš možnost zavolat pomoc (vysílačka), nebo prozkoumat data o nouzovém východu (Kód 483).",
        choices: [
            { text: "Použít vysílačku", next: "win_radio" }, // VÍTĚZSTVÍ 3
            { text: "Získat Klíč N-7 ze sejfu", next: "communication_key_found" }, // Klíč N-7
            { text: "Jít k nouzovému východu (Kód 483)", next: "emergency_exit_locked" },
            { text: "Vrátit se výtahem", next: "elevator_choose_code" }
        ]
    },

    // VÍTĚZSTVÍ 3: Rádiem
    "win_radio": {
        text: "Úspěšně jsi zavolal civilní hlídku. Přijeli pro tebe a jsi volný! Dobrá práce.",
        choices: [{ text: "ÚSPĚŠNÝ ÚTĚK - RÁDIO", next: "restart" }]
    },
    
    // Získání nového předmětu
    "communication_key_found": {
        text: "Podařilo se ti prolomit sejf v Komunikačním Centru. Získal jsi **Klíč N-7** a **Kód 483**.",
        choices: [
            { text: "Jít k nouzovému východu s klíčem N-7", next: "emergency_exit_locked_key" }, 
            { text: "Vrátit se k výtahu a jet na Patro 3", next: "elevator_choose_code_key" }
        ]
    },

    // VÍTĚZSTVÍ 4: Finální Nouzový východ
    "emergency_exit_locked": {
        text: "Nouzový východ vyžaduje Kód 483 a ID s povolením N-7. Tvé falešné ID to nezvládne. Alarm aktivován.",
        choices: [{ text: "ZABIT LASEREM", next: "restart" }]
    },
    "emergency_exit_locked_key": {
        text: "Jsi u nouzového východu. Máš Kód 483 a Klíč N-7. Systém přijímá klíč! Dveře se otevírají. Jsi volný!",
        choices: [{ text: "ÚSPĚŠNÝ ÚTĚK - N-7 KLÍČ", next: "restart" }]
    },

    // PATRO 3: TĚŽEBNÍ SEKCE
    "elevator_choose_code_key": {
        text: "Jsi u výtahu. Máš Klíč N-7. Kam chceš jet?",
        choices: [
            { text: "Těžební sekce (Patro 3)", next: "mining_sector_key" },
            { text: "Komunikační Centrum (Patro 2)", next: "communication_center" },
            { text: "Hlavní hala (Patro 1)", next: "main_hall_items" }
        ]
    },

    // Vstup do Těžební sekce bez N-7 Klíče
    "mining_sector_locked": {
        text: "Jsi v Těžební sekci. Drony tu přenášejí suroviny. Je tu řídicí terminál. **Vyžaduje Klíč N-7**.",
        choices: [
            { text: "Zkusit se schovat u zásobovací šachty", next: "mining_sector_search" }, 
            { text: "Použít páku na řídicí terminál (RISK)", next: "dead_terminal_lever" }, 
            { text: "Vrátit se výtahem", next: "elevator_choose_code" }
        ]
    },
    
    // Vstup do Těžební sekce S N-7 Klíčem
    "mining_sector_key": {
        text: "Jsi v Těžební sekci. Klíč N-7 odemkne řídicí terminál. Můžeš buď přeprogramovat drony, sabotovat systém nebo se pokusit o fyzický útěk.",
        choices: [
            { text: "Přeprogramovat Drony", next: "win_drone_override" }, // VÍTĚZSTVÍ 5
            { text: "Jít k nouzové zásobovací šachtě", next: "supply_shaft" }, // Cesta k VÍTĚZSTVÍ 6
            { text: "Sabotovat Systém", next: "dead_sabotage" }
        ]
    },
    
    // VÍTĚZSTVÍ 5: Drony
    "win_drone_override": {
        text: "Přeprogramoval jsi obří nákladní drony. Jeden tě zvedá k povrchu skrze těžební šachtu. Jsi volný!",
        choices: [{ text: "ÚSPĚŠNÝ ÚTĚK - DRON", next: "restart" }]
    },

    // VÍTĚZSTVÍ 6: Zásobovací šachta
    "supply_shaft": {
        text: "Jsi u šachty. Vyžaduje páku k násilnému otevření průlezu.",
        choices: [
            { text: "Použít páku a vlézt dovnitř", next: "win_supply_shaft" }, // VÍTĚZSTVÍ 6
            { text: "Vrátit se k terminálu", next: "mining_sector_key" }
        ]
    },
    "win_supply_shaft": {
        text: "Páka zabrala! Jsi na transportním pásu, který tě vynese až na povrch do kontejneru. Jsi volný!",
        choices: [{ text: "ÚSPĚŠNÝ ÚTĚK - ZÁSOBOVACÍ ŠACHTA", next: "restart" }]
    },
    
    // VÍTĚZSTVÍ 7: Řídicí terminál (Riskantní)
    "dead_terminal_lever": {
        text: "Páka sice terminál poškodila, ale spustila se lokální sekvence automatického úklidu. Bezpečnostní drony tě neutralizovaly.",
        choices: [{ text: "ZNEHODNOCEN", next: "restart" }]
    },
    "mining_sector_search": {
        text: "Při prohledávání narazíš na starý, nezabezpečený terminál, ale je nutné jednat rychle. Zkusit hacknout?",
        choices: [
            { text: "Hacknout terminál a spustit evakuaci", next: "win_risky_terminal" }, // VÍTĚZSTVÍ 7
            { text: "Raději se vrátit k výtahu", next: "elevator_choose_code" }
        ]
    },
    "win_risky_terminal": {
        text: "Podařilo se! Terminál spustil nouzové odblokování vnější brány. Stráže jsou zmatené. Využiješ chaosu a utíkáš ven.",
        choices: [{ text: "ÚSPĚŠNÝ ÚTĚK - TERMINÁL CHAOS", next: "restart" }]
    },

    // Prohry na Patře 3
    "dead_sabotage": {
        text: "Sabotáž způsobila řetězovou reakci. Celá sekce se zhroutila a ty s ní.",
        choices: [{ text: "ZAVALEN", next: "restart" }]
    },

    // Konec/Restart
    "restart": { 
        text: "Hra skončila. Stiskněte tlačítko pro opětovné spuštění.",
        choices: []
    }
};

function showScene(sceneKey) {
    let scene = story[sceneKey];
    
    // Logika pro sbírání předmětů
    if (sceneKey === "search_cell") {
        hasID = true; 
        hasLever = true; 
    }
    if (sceneKey === "guard_room_id") { 
        hasCode = true;
    }
    if (sceneKey === "communication_key_found") {
        hasN7Key = true; 
    }
    
    if (!scene) {
        scene = story[sceneKey]; 
    }
    
    // Vykreslení scény a UI

    storyText.innerText = scene.text.replace("{name}", playerName);
    choicesElement.innerHTML = '';
    restartBtn.style.display = 'none';
    restartBtn.className = ''; // Resetuje třídu, aby se správně aplikovala nová barva

    scene.choices.forEach(choice => {
        
        if (choice.next === "restart") {
            const buttonText = choice.text.toUpperCase();
            
            // ZELENÉ/ČERVENÉ TLAČÍTKO
            if (buttonText.includes("ÚSPĚŠNÝ ÚTĚK")) {
                restartBtn.classList.add('win-button');
            } else {
                restartBtn.classList.add('lose-button');
            }
            
            restartBtn.style.display = 'block';
            restartBtn.innerText = choice.text;
        } 
        
        else {
            const btn = document.createElement('button');
            btn.innerText = choice.text;
            btn.className = 'choice-button';
            
            // Dynamická kontrola předmětů
            let nextScene = choice.next;

            // Kontrola pro VÍTĚZSTVÍ 1: Ventilace - vyžaduje páku
            if (choice.next === "ventilation" && !hasLever) {
                 nextScene = "dead_ventilation_locked"; 
            } 
            // Kontrola pro VÍTĚZSTVÝ 2: Strážnice - vyžaduje ID
            else if (choice.next === "guard_room_id" && !hasID) {
                 nextScene = "dead_guard";
            }
            // Kontrola pro vstup do PATER 2/3 bez KÓDU
            else if ((choice.next === "communication_center" || choice.next === "mining_sector_locked") && !hasCode) {
                 nextScene = "dead_elevator_locked";
            }
            // Kontrola pro VÍTĚZSTVÍ 4: Nouzový Východ - vyžaduje Klíč N-7
            else if (choice.next === "emergency_exit_locked_key" && !hasN7Key) {
                 nextScene = "emergency_exit_locked"; 
            }
            // Kontrola pro Útěk přes ZÁSOBOVACÍ ŠACHTU (VÍTĚZSTVÍ 6) - vyžaduje Páku
            else if (choice.next === "win_supply_shaft" && !hasLever) {
                
                nextScene = "dead_supply_shaft"; 
            }
            // Kontrola pro vstup do TĚŽEBNÍ SEKCE S KLÍČEM N-7
            else if (choice.next === "mining_sector_key" && !hasN7Key) {
                 nextScene = "mining_sector_locked"; 
            }
            
            // Nastavení přechodu
            btn.onclick = () => showScene(nextScene);
            
            choicesElement.appendChild(btn);
        }
    });
}

// scéna pro chybu u zásobovací šachty
story["dead_supply_shaft"] = { 
    text: "Nemáš páku k násilnému otevření šachty. Ztratil jsi drahocenný čas a drony tě našly.",
    choices: [{ text: "ZAJAT V TĚŽBĚ", next: "restart" }] 
};
story["mining_sector_dead"] = story["dead_supply_shaft"]; // pro předchozí chybějící scénu


function startGame() {
    // Reset inventáře při restartu
    hasID = false;
    hasLever = false;
    hasCode = false;
    hasN7Key = false;
    
    askName();
    showScene("start");
}

startGame();

if (restartBtn) {
    restartBtn.onclick = startGame;
}
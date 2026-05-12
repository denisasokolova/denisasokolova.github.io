<?php

// nastaveni typu dat na json a podpora cestiny
header('Content-Type: application/json; charset=utf-8');

// prazdne pole pro expozice
$expozice = [];

// otevreni csv souboru
if (($soubor = fopen("expozice.csv", "r")) !== false) {

    // preskoceni prvniho radku s nazvy sloupcu
    fgetcsv($soubor);

    // postupne cteni vsech radku
    while (($radek = fgetcsv($soubor, 1000, ",")) !== false) {

        // ulozeni dat z csv do pole
        $expozice[] = [
            "nazev" => $radek[0],
            "popis" => $radek[1],
            "kategorie" => $radek[2],
            "obrazek" => $radek[3]
        ];

    }

    // zavreni souboru
    fclose($soubor);
}

// prevedeni php pole na json
echo json_encode($expozice, JSON_UNESCAPED_UNICODE);

?>
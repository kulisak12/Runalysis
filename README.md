# Runalysis

Runalysis je webová aplikace, která zpracovává zaznamenané sportovní aktivity jako běh či jízda na kole a nabízí jejich podrobnou analýzu.

Aplikaci můžete najít [zde](https://kulisak12.github.io/Runalysis/).

## Zobrazení aktivity

Základní funkcí je zobrazení přehledu souhrnných informací o aktivitě, kterými jsou datum, celkový čas a celková vzdálenost, výsledné tempo nebo nastoupané výškové metry. Dále je záznam vložen na mapový podklad, což uživateli umožňuje zpětné připomenutí si trasy.

### Sdílení

Tyto základní parametry aktivity spolu s mapou lze sdílet s ostatními. Pro tento účel nabízí aplikace vygenerovaní odkazu, ve kterém jsou tyto informace zakódovány.

## Analýza

### Grafy

Všechny zaznamenané veličiny jsou zobrazeny v podobě grafů, které umožňují porovnávat tyto hodnoty v různých fázích aktivity. Uživatel má možnost vybrat si rozložení těchto grafů podle svých potřeb.

Důležitou analytickou funkcí je přibližování grafů, které umožňuje důkladné prozkoumání jednotlivých částí. Aplikace dále nabízí spočtení statistik pro daný aktuálně zobrazený úsek.

### Zóny

Aplikace nabízí rozdělení aktivity podle intenzitních zón tempa a srdečního tepu. Tím umožňuje uživateli rychle zjistit, kolik času strávil v jaké zóně, a pomocí toho zohlednit tréninkový efekt. Samozřejmostí je nastavení zón podle osobní výkonnosti.

### Trimp

*Training impulse* je metrika, která zhodnocuje náročnost aktivity na základě analýzy srdečního tepu. Pro uživatele slouží jako ověření, že aktivita nebyla příliš lehká nebo příliš náročná. Pravidelné vysoké hodnoty mohou poukazovat na přetrénování.

## Podporované soubory

Momentálně lze nahrávat pouze soubory formátu `.gpx`.

## Plánované budoucí funkce

  - Synchronizace s platformou Strava
  - Podpora dalších formátů
  - Mezičasy kol

## Licence

&copy; 2020 David Klement, [Apache License 2.0](https://github.com/kulisak12/Runalysis/blob/master/LICENSE)

## Použité knihovny

  - [Dygraphs](http://dygraphs.com/), knihovna na vykreslování grafů, dostupná pod [licencí MIT](https://github.com/danvk/dygraphs/blob/master/LICENSE.txt).
  - [DropzoneJS](https://www.dropzonejs.com/#), knihovna pro drag-and-drop nahrávání souborů, dostupná pod [licencí MIT](https://github.com/enyo/dropzone/blob/master/LICENSE).
  - [noUiSlider](https://refreshless.com/nouislider/), knihovna na vytváření posuvníků pro výběr hodnot, dostupná pod [licencí MIT](https://github.com/leongersen/noUiSlider/blob/master/LICENSE.md).
  - [LZString](https://pieroxy.net/blog/pages/lz-string/index.html), knihovna na kompresi a dekompresi dat, dostupná pod [licencí MIT](https://github.com/pieroxy/lz-string/blob/master/LICENSE).
  - [TinyColor](https://github.com/bgrins/TinyColor), knihovna na operace s barvami, dostupná pod [licencí MIT](https://github.com/bgrins/TinyColor/blob/master/LICENSE).
  - [API Mapy.cz](https://api.mapy.cz/), API pro vložení mapy do stránek, dostupné pod [touto licencí](https://api.mapy.cz/#pact).
  - [Font awesome](https://fontawesome.com), zdroj ikonek, dostupný pod [licencí CC BY 4.0](https://fontawesome.com/license).
  - [JSDoc](https://jsdoc.app/), program pro vytváření dokumentací, dostupný pod [licencí Apache 2.0](https://github.com/jsdoc/jsdoc/blob/master/LICENSE).
  - [better-docs](https://github.com/SoftwareBrothers/better-docs), rozšíření pro JSDoc, dostupné pod [licencí MIT](https://github.com/SoftwareBrothers/better-docs/blob/master/LICENSE).

## Dokumentace

[Uživatelská dokumentace](https://kulisak12.github.io/Runalysis/about/userdoc/index.html)
[Vývojářská dokumentace](https://kulisak12.github.io/Runalysis/devdoc/index.html)
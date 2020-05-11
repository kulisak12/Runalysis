# Nahrání aktivity

## Zaznamenání

Existuje několik možností, jak zaznamenat své aktivity.

### Mobilní aplikace

Nejjednodušší variantou je stažení dedikované aplikace do vašeho mobilu. Ta poté využívá vestavěný GPS přijímač. Výhodou této varianty je dostupnost, mnoho aplikací lze totiž stáhnout zdarma. Nevýhodou je nutnost nosit s sebou těžký a neskladný mobil. Doporučené aplikace: Endomondo, Runtastic, Strava.

### GPS hodinky

Druhou možností je pořízení GPS hodinek. Jejich výhodou je nízká hmotnost a s tím spojené pohodlné nošení. Hodinky lze přes Bluetooth propojit s mobilní aplikací, do které se aktivity synchronizují. Tato aplikace je specifická pro každého výrobce hodinek, jedná se např. o Garmin Connect či SuuntoLink.

## Zisk souboru

Když máte aktivitu nahranou, je nutné stáhnout záznam ve formátu `.gpx`. Ať už jste nahrávali mobilem nebo hodinkami, použitá aplikace vám nabídne export právě do tohoto formátu. Ve většině případů však pro tuto funkci bude nutné navšívit její webovou verzi.

Pokud jste nahrávali hodinkami, je také možné získat soubor přímo z nich, a to připojením k počítači pomocí datového kabelu. Takto získaný soubor bude pravděpodobně v interním formátu hodinek, je proto nutné jej do `.gpx` překonvertovat. K tomu lze využít online konvertor.

## Nahrání do Runalysis

Na hlavní stránce aplikace klikněte na velké pole uprostřed a vyberte požadovaný `.gpx` soubor. Po jeho úspěšném zpracování budete přesměrováni na stránku, kde si aktivitu budete moci prohlédnout a zanalyzovat.

Soubor lze taktéž nahrát jeho přetažením do oblasti pole.

Maximální velikost souboru je 20 MB. Soubory je nutné nahrávat po jednom.


# Stránka aktivity

Na stránce aktivity naleznete zobrazená data z nahraného záznamu.

## Moduly

Stránka je rozdělena do tří částí: Mapa a souhrn, Grafy a Zóny. Každý z těchto modulů se zaměřuje na jednotlivé prvky analýzy aktivity. Pro lepší přehlednost je možné některé části dočasně skrýt kliknutím na odpovídající ikonu v horním panelu. Zpětné zobrazení funguje stejným způsobem.

## Metriky

Aplikace používá některé specifické veličiny a jednotky, se kterými se možná setkáváte poprvé. Zde je jejich vysvětlení.

### Tempo

Zatímco u většiny sportů se používá rychlost vyjádřená v kilometrech za hodinu, v běhu je obvyklejší tempo. Udává se v minutách na kilometr a říká přesně to -- za jak dlouho byste danou rychlostí uběhli jeden kilometr. Proto čím menší hodnota, tím rychlejší tempo.

Některá tempa a jejich přepočty:
	- 6:00 min/km = 10 km/h
	- 5:00 min/km = 12 km/h
	- 4:00 min/km = 15 km/h
	- 3:00 min/km = 20 km/h

### GAP

GAP je zkratka pro Grade Adjusted Pace. Jedná se o tempo, které je přepočítané podle stoupání či klesání tak, aby přesněji ukazovalo intenzitu v daný moment. Při běhu do kopce je tak GAP rychlejší než skutečné tempo, při seběhu z mírného kopce naopak pomalejší.

### Kadence

Kadence udává počet kroků za minutu.

### Trimp

Trimp neboli Training Impulse zhodnocuje náročnost aktivity na základě analýzy srdečního tepu. Čím delší je aktivita a čím vyšší je vaše tepová frekvence, tím vyšší hodnoty u kolonky Trimp uvidíte. Tato metrika slouží jako kontrola toho, že vaše aktivita byla tak těžká jak měla být. Obecným pravidlem je, že trénink by měl být polarizován: dvě třetiny aktivit by měly být jednoduché, tedy nizký Trimp, a třetina aktivit těžká, tedy výrazně vyšší Trimp. Čísla někde uprostřed by se měla objevovat méně často.

## Mapa

Celý záznam je zobrazen na mapovém podkladu. Mapu můžete posouvat a přibližovat zaprvé pomocí ovládacích prvků v pravém horním rohu, zadruhé pomocí myši a kolečka, respektive gest v případě mobilního zařízení. Při zvýraznění určitého bodu v grafu se označí i odpovídající místo na mapě.

## Souhrn

Vpravo od mapy najdete aktivitu vyjádřenou v několika číslech. Zjistíte zde datum a čas konání aktivity, její celkovou délku, čistý čas i dobu se započítáním přestávek, tempo, nasbírané výškové metry a vyhodnocenou náročnost v podobě Trimp.

## Grafy

Aplikace zobrazuje grafy naměřených veličin v čase. Každý graf zobrazuje dvě různé veličiny. Jejich rozložení lze u každého grafu přepínat kliknutím na název aktuální veličiny a vybráním nové.

Přejetím myší nad grafem zvýrazníte daný bod záznamu. V informačních polích se zobrazí hodnoty metrik pro tento bod a zároveň je dané místo označeno v mapě. Tato funkce není dostupná na mobilních zařízeních.

### Přibližování

Celý graf můžete přiblížit a tím blíže prozkoumat. Na počítači označte daný úsek myší, na mobilních zařízeních využijte přibližovacího gesta. Po přiblížení můžete zobrazený úsek posouvat podržením klávesy Shift a přetažením, na mobilu stačí přetáhnout jedním prstem.

Chcete-li získat statistiky pro daný úsek, přibližte graf tak, aby bylo vidět požadované rozmezí. V informačních polích poté najdete průměrné hodnoty metrik.

## Zóny intenzit

Pro tři veličiny -- tempo, GAP a tepová frekvence -- je k dispozici přehled zastoupení jednotlivých intenzitních zón během aktivity.

### Nastavení zón

Každý jedinec je jinak trénovaný a má tedy jiné zóny. Je tedy nutné si ty své prvně nastavit. Toho docílíte kliknutím na tlačítko *Customize* pro danou veličinu. Tempo a GAP mají nastavení společné.

Otevře se vám okno s posuvnou osou, na kterém můžete nastavit hranice mezi zónami. Oblast při levém okraji osy nespadá do žádné zóny. Následují postupně zóny 1 až 5, kde 1 je nejlehší a 5 nejtěžší. Hranice spadá vždy do lehčí zóny.

### Zobrazení zón

Zóny jsou seřazeny zleva doprava od nejlehčí po nejvyšší. Zastoupení dané zóny je znázorněno výškou odpovídajícího sloupce. Zároveň můžete pod sloupcem najít údaje o celkovém čase stráveném v dané zóně a celkové vzdálenosti. Při vybrání sloupce se zobrazí podrobnosti o zóně.

# Sdílení

Svou aktivitu můžete sdílet s ostatními.

## Sdílené údaje

Při sdílení jsou zachována pouze některá data, konkrétně trasa a souhrnné statistiky. Podrobné hodnoty veličin v průběhu aktivity sdíleny nejsou.

## Získání odkazu

Na hlavní stránce aktivity klikněte na ikonku sdílení v pravé části horního panelu. Budete přesměrování na stránku sdílené aktivity. V této podobě ji uvidí každý, se kterým ji budete sdílet. Odkaz získáte zkopírováním z adresového řádku.

Odkaz nemá omezenou dobu platnosti.
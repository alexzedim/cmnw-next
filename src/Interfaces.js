const commands = [
  {
    value: 'character',
    label: 'CHAR',
  },
  {
    value: 'guild',
    label: 'GUILD',
  },
  {
    value: 'hash',
    label: 'HASH',
    fields: ['type', 'match'],
  },
  {
    value: 'item',
    label: 'ITEM',
  },
]

const osint_commands = [
  {
    value: 'character',
    label: 'CHARACTER',
  },
  {
    value: 'guild',
    label: 'GUILD',
  },
  {
    value: 'hash',
    label: 'HASH',
  },
  {
    value: 'file',
    label: 'FILE',
  },
]

const dma_commands = [
  {
    value: 'item',
    label: 'ITEM',
  },
  {
    value: 'xrs',
    label: 'CROSS REALM',
  }
]

const type = [
  {
    value: 'a',
    label: 'A',
  },
  {
    value: 'b',
    label: 'B',
  },
  {
    value: 'c',
    label: 'C',
  }
]

const realms = [
  {
    value: "aggramar",
    label: "Aggramar"
  },
  {
    value: "arathor",
    label: "Arathor"
  },
  {
    value: "aszune",
    label: "Aszune"
  },
  {
    value: "azjolnerub",
    label: "Azjol-Nerub"
  },
  {
    value: "bloodhoof",
    label: "Bloodhoof"
  },
  {
    value: "doomhammer",
    label: "Doomhammer"
  },
  {
    value: "draenor",
    label: "Draenor"
  },
  {
    value: "dragonblight",
    label: "Dragonblight"
  },
  {
    value: "emerald-dream",
    label: "Emerald Dream"
  },
  {
    label: "Garona",
    value: "garona"
  },
  {
    label: "Vol'jin",
    value: "voljin"
  },
  {
    value: "sunstrider",
    label: "Sunstrider"
  },
  {
    label: "Arak-arahm",
    value: "arakarahm"
  },
  {
    value: "twilights-hammer",
    label: "Twilight's Hammer"
  },
  {
    value: "zenedar",
    label: "Zenedar"
  },
  {
    label: "Forscherliga",
    value: "forscherliga"
  },
  {
    label: "Medivh",
    value: "medivh"
  },
  {
    value: "agamaggan",
    label: "Agamaggan"
  },
  {
    value: "alakir",
    label: "Al'Akir"
  },
  {
    value: "bladefist",
    label: "Bladefist"
  },
  {
    value: "bloodscalp",
    label: "Bloodscalp"
  },
  {
    value: "burning-blade",
    label: "Burning Blade"
  },
  {
    value: "burning-legion",
    label: "Burning Legion"
  },
  {
    value: "crushridge",
    label: "Crushridge"
  },
  {
    value: "daggerspine",
    label: "Daggerspine"
  },
  {
    value: "deathwing",
    label: "Deathwing"
  },
  {
    value: "dragonmaw",
    label: "Dragonmaw"
  },
  {
    value: "dunemaul",
    label: "Dunemaul"
  },
  {
    label: "Dethecus",
    value: "dethecus"
  },
  {
    label: "Sinstralis",
    value: "sinstralis"
  },
  {
    label: "Durotan",
    value: "durotan"
  },
  {
    value: "argent-dawn",
    label: "Argent Dawn"
  },
  {
    label: "Kirin Tor",
    value: "kirin-tor"
  },
  {
    label: "Dalaran",
    value: "dalaran"
  },
  {
    label: "Archimonde",
    value: "archimonde"
  },
  {
    label: "Elune",
    value: "elune"
  },
  {
    label: "Illidan",
    value: "illidan"
  },
  {
    label: "Hyjal",
    value: "hyjal"
  },
  {
    label: "Kael'thas",
    value: "kaelthas"
  },
  {
    label: "Ner'zhul",
    value: "nerzhul"
  },
  {
    label: "Cho'gall",
    value: "chogall"
  },
  {
    label: "Sargeras",
    value: "sargeras"
  },
  {
    value: "runetotem",
    label: "Runetotem"
  },
  {
    value: "shadowsong",
    label: "Shadowsong"
  },
  {
    value: "silvermoon",
    label: "Silvermoon"
  },
  {
    value: "stormrage",
    label: "Stormrage"
  },
  {
    value: "terenas",
    label: "Terenas"
  },
  {
    value: "thunderhorn",
    label: "Thunderhorn"
  },
  {
    value: "turalyon",
    label: "Turalyon"
  },
  {
    value: "ravencrest",
    label: "Ravencrest"
  },
  {
    value: "shattered-hand",
    label: "Shattered Hand"
  },
  {
    value: "skullcrusher",
    label: "Skullcrusher"
  },
  {
    value: "spinebreaker",
    label: "Spinebreaker"
  },
  {
    value: "stormreaver",
    label: "Stormreaver"
  },
  {
    value: "stormscale",
    label: "Stormscale"
  },
  {
    value: "earthen-ring",
    label: "Earthen Ring"
  },
  {
    label: "Alexstrasza",
    value: "alexstrasza"
  },
  {
    label: "Alleria",
    value: "alleria"
  },
  {
    label: "Antonidas",
    value: "antonidas"
  },
  {
    label: "Baelgun",
    value: "baelgun"
  },
  {
    label: "Blackhand",
    value: "blackhand"
  },
  {
    label: "Gilneas",
    value: "gilneas"
  },
  {
    label: "Kargath",
    value: "kargath"
  },
  {
    label: "Khaz'goroth",
    value: "khazgoroth"
  },
  {
    label: "Lothar",
    value: "lothar"
  },
  {
    label: "Madmortem",
    value: "madmortem"
  },
  {
    label: "Malfurion",
    value: "malfurion"
  },
  {
    label: "Zuluhed",
    value: "zuluhed"
  },
  {
    label: "Nozdormu",
    value: "nozdormu"
  },
  {
    label: "Perenolde",
    value: "perenolde"
  },
  {
    label: "Die Silberne Hand",
    value: "die-silberne-hand"
  },
  {
    label: "Aegwynn",
    value: "aegwynn"
  },
  {
    label: "Arthas",
    value: "arthas"
  },
  {
    label: "Azshara",
    value: "azshara"
  },
  {
    label: "Blackmoore",
    value: "blackmoore"
  },
  {
    label: "Blackrock",
    value: "blackrock"
  },
  {
    label: "Destromath",
    value: "destromath"
  },
  {
    label: "Eredar",
    value: "eredar"
  },
  {
    label: "Frostmourne",
    value: "frostmourne"
  },
  {
    label: "Frostwolf",
    value: "frostwolf"
  },
  {
    label: "Gorgonnash",
    value: "gorgonnash"
  },
  {
    label: "Gul'dan",
    value: "guldan"
  },
  {
    label: "Kel'Thuzad",
    value: "kelthuzad"
  },
  {
    label: "Kil'jaeden",
    value: "kiljaeden"
  },
  {
    label: "Mal'Ganis",
    value: "malganis"
  },
  {
    label: "Mannoroth",
    value: "mannoroth"
  },
  {
    label: "Zirkel des Cenarius",
    value: "zirkel-des-cenarius"
  },
  {
    label: "Proudmoore",
    value: "proudmoore"
  },
  {
    label: "Nathrezim",
    value: "nathrezim"
  },
  {
    label: "Dun Morogh",
    value: "dun-morogh"
  },
  {
    label: "Aman'thul",
    value: "amanthul"
  },
  {
    label: "Sen'jin",
    value: "senjin"
  },
  {
    label: "Thrall",
    value: "thrall"
  },
  {
    label: "Theradras",
    value: "theradras"
  },
  {
    value: "genjuros",
    label: "Genjuros"
  },
  {
    value: "balnazzar",
    label: "Balnazzar"
  },
  {
    label: "Anub'arak",
    value: "anubarak"
  },
  {
    label: "Wrathbringer",
    value: "wrathbringer"
  },
  {
    label: "Onyxia",
    value: "onyxia"
  },
  {
    label: "Nera'thor",
    value: "nerathor"
  },
  {
    label: "Nefarian",
    value: "nefarian"
  },
  {
    label: "Kult der Verdammten",
    value: "kult-der-verdammten"
  },
  {
    label: "Das Syndikat",
    value: "das-syndikat"
  },
  {
    label: "Terrordar",
    value: "terrordar"
  },
  {
    label: "Krag'jin",
    value: "kragjin"
  },
  {
    label: "Der Rat von Dalaran",
    value: "der-rat-von-dalaran"
  },
  {
    value: "nordrassil",
    label: "Nordrassil"
  },
  {
    value: "hellscream",
    label: "Hellscream"
  },
  {
    value: "laughing-skull",
    label: "Laughing Skull"
  },
  {
    value: "magtheridon",
    label: "Magtheridon"
  },
  {
    value: "quelthalas",
    label: "Quel'Thalas"
  },
  {
    value: "neptulon",
    label: "Neptulon"
  },
  {
    value: "twisting-nether",
    label: "Twisting Nether"
  },
  {
    value: "ragnaros",
    label: "Ragnaros"
  },
  {
    value: "the-maelstrom",
    label: "The Maelstrom"
  },
  {
    value: "sylvanas",
    label: "Sylvanas"
  },
  {
    value: "vashj",
    label: "Vashj"
  },
  {
    value: "bloodfeather",
    label: "Bloodfeather"
  },
  {
    value: "darksorrow",
    label: "Darksorrow"
  },
  {
    value: "frostwhisper",
    label: "Frostwhisper"
  },
  {
    value: "korgall",
    label: "Kor'gall"
  },
  {
    value: "defias-brotherhood",
    label: "Defias Brotherhood"
  },
  {
    value: "the-venture-co",
    label: "The Venture Co"
  },
  {
    value: "lightnings-blade",
    label: "Lightning's Blade"
  },
  {
    value: "haomarush",
    label: "Haomarush"
  },
  {
    value: "xavius",
    label: "Xavius"
  },
  {
    label: "Khaz Modan",
    value: "khaz-modan"
  },
  {
    label: "Drek'Thar",
    value: "drekthar"
  },
  {
    label: "Rashgarroth",
    value: "rashgarroth"
  },
  {
    label: "Throk'Feroth",
    value: "throkferoth"
  },
  {
    label: "Conseil des Ombres",
    value: "conseil-des-ombres"
  },
  {
    label: "Varimathras",
    value: "varimathras"
  },
  {
    value: "hakkar",
    label: "Hakkar"
  },
  {
    label: "Les Sentinelles",
    value: "les-sentinelles"
  },
  {
    value: "khadgar",
    label: "Khadgar"
  },
  {
    value: "bronzebeard",
    label: "Bronzebeard"
  },
  {
    value: "kul-tiras",
    label: "Kul Tiras"
  },
  {
    value: "chromaggus",
    label: "Chromaggus"
  },
  {
    value: "dentarg",
    label: "Dentarg"
  },
  {
    value: "moonglade",
    label: "Moonglade"
  },
  {
    label: "La Croisade écarlate",
    value: "la-croisade-écarlate"
  },
  {
    value: "executus",
    label: "Executus"
  },
  {
    value: "trollbane",
    label: "Trollbane"
  },
  {
    value: "mazrigos",
    label: "Mazrigos"
  },
  {
    value: "talnivarr",
    label: "Talnivarr"
  },
  {
    value: "emeriss",
    label: "Emeriss"
  },
  {
    value: "drakthul",
    label: "Drak'thul"
  },
  {
    value: "ahnqiraj",
    label: "Ahn'Qiraj"
  },
  {
    value: "scarshield-legion",
    label: "Scarshield Legion"
  },
  {
    label: "Ysera",
    value: "ysera"
  },
  {
    label: "Malygos",
    value: "malygos"
  },
  {
    label: "Rexxar",
    value: "rexxar"
  },
  {
    label: "Anetheron",
    value: "anetheron"
  },
  {
    label: "Nazjatar",
    value: "nazjatar"
  },
  {
    label: "Tichondrius",
    value: "tichondrius"
  },
  {
    value: "steamwheedle-cartel",
    label: "Steamwheedle Cartel"
  },
  {
    label: "Die ewige Wacht",
    value: "die-ewige-wacht"
  },
  {
    label: "Die Todeskrallen",
    value: "die-todeskrallen"
  },
  {
    label: "Die Arguswacht",
    value: "die-arguswacht"
  },
  {
    label: "Uldaman",
    value: "uldaman"
  },
  {
    label: "Eitrigg",
    value: "eitrigg"
  },
  {
    label: "Confrérie du Thorium",
    value: "confrérie-du-thorium"
  },
  {
    value: "veknilash",
    label: "Vek'nilash"
  },
  {
    value: "boulderfist",
    label: "Boulderfist"
  },
  {
    value: "frostmane",
    label: "Frostmane"
  },
  {
    value: "outland",
    label: "Outland"
  },
  {
    value: "grim-batol",
    label: "Grim Batol"
  },
  {
    value: "jaedenar",
    label: "Jaedenar"
  },
  {
    value: "kazzak",
    label: "Kazzak"
  },
  {
    value: "tarren-mill",
    label: "Tarren Mill"
  },
  {
    value: "chamber-of-aspects",
    label: "Chamber of Aspects"
  },
  {
    value: "ravenholdt",
    label: "Ravenholdt"
  },
  {
    label: "Pozzo dell'Eternità",
    value: "pozzo-delleternità"
  },
  {
    value: "eonar",
    label: "Eonar"
  },
  {
    value: "kilrogg",
    label: "Kilrogg"
  },
  {
    value: "aerie-peak",
    label: "Aerie Peak"
  },
  {
    value: "wildhammer",
    label: "Wildhammer"
  },
  {
    value: "saurfang",
    label: "Saurfang"
  },
  {
    label: "Nemesis",
    value: "nemesis"
  },
  {
    value: "darkmoon-faire",
    label: "Darkmoon Faire"
  },
  {
    label: "Vek'lor",
    value: "veklor"
  },
  {
    label: "Mug'thol",
    value: "mugthol"
  },
  {
    label: "Taerar",
    value: "taerar"
  },
  {
    label: "Dalvengyr",
    value: "dalvengyr"
  },
  {
    label: "Rajaxx",
    value: "rajaxx"
  },
  {
    label: "Ulduar",
    value: "ulduar"
  },
  {
    label: "Malorne",
    value: "malorne"
  },
  {
    label: "Der Abyssische Rat",
    value: "der-abyssische-rat"
  },
  {
    label: "Der Mithrilorden",
    value: "der-mithrilorden"
  },
  {
    label: "Tirion",
    value: "tirion"
  },
  {
    label: "Ambossar",
    value: "ambossar"
  },
  {
    label: "Suramar",
    value: "suramar"
  },
  {
    label: "Krasus",
    value: "krasus"
  },
  {
    label: "Die Nachtwache",
    value: "die-nachtwache"
  },
  {
    label: "Arathi",
    value: "arathi"
  },
  {
    label: "Ysondre",
    value: "ysondre"
  },
  {
    label: "Eldre'Thalas",
    value: "eldrethalas"
  },
  {
    label: "Culte de la Rive noire",
    value: "culte-de-la-rive-noire"
  },
  {
    label: "Dun Modr",
    value: "dun-modr"
  },
  {
    label: "Zul'jin",
    value: "zuljin"
  },
  {
    label: "Uldum",
    value: "uldum"
  },
  {
    label: "C'Thun",
    value: "cthun"
  },
  {
    label: "Sanguino",
    value: "sanguino"
  },
  {
    label: "Shen'dralar",
    value: "shendralar"
  },
  {
    label: "Tyrande",
    value: "tyrande"
  },
  {
    label: "Exodar",
    value: "exodar"
  },
  {
    label: "Minahonda",
    value: "minahonda"
  },
  {
    label: "Los Errantes",
    value: "los-errantes"
  },
  {
    value: "lightbringer",
    label: "Lightbringer"
  },
  {
    value: "darkspear",
    label: "Darkspear"
  },
  {
    value: "alonsus",
    label: "Alonsus"
  },
  {
    value: "burning-steppes",
    label: "Burning Steppes"
  },
  {
    value: "bronze-dragonflight",
    label: "Bronze Dragonflight"
  },
  {
    value: "anachronos",
    label: "Anachronos"
  },
  {
    label: "Colinas Pardas",
    value: "colinas-pardas"
  },
  {
    label: "Un'Goro",
    value: "ungoro"
  },
  {
    label: "Garrosh",
    value: "garrosh"
  },
  {
    label: "Area 52",
    value: "area-52"
  },
  {
    label: "Todeswache",
    value: "todeswache"
  },
  {
    label: "Arygos",
    value: "arygos"
  },
  {
    label: "Teldrassil",
    value: "teldrassil"
  },
  {
    label: "Norgannon",
    value: "norgannon"
  },
  {
    label: "Lordaeron",
    value: "lordaeron"
  },
  {
    label: "Aggra-Portugales",
    value: "aggra-português"
  },
  {
    value: "terokkar",
    label: "Terokkar"
  },
  {
    value: "blades-edge",
    label: "Blade's Edge"
  },
  {
    value: "azuremyst",
    label: "Azuremyst"
  },
  {
    value: "hellfire",
    label: "Hellfire"
  },
  {
    value: "ghostlands",
    label: "Ghostlands"
  },
  {
    value: "nagrand",
    label: "Nagrand"
  },
  {
    value: "the-shatar",
    label: "The Sha'tar"
  },
  {
    value: "karazhan",
    label: "Karazhan"
  },
  {
    value: "auchindoun",
    label: "Auchindoun"
  },
  {
    value: "shattered-halls",
    label: "Shattered Halls"
  },
  {
    label: "Гордунни",
    value: "gordunni"
  },
  {
    label: "Король-лич",
    value: "lich-king"
  },
  {
    label: "Свежеватель Душ",
    value: "soulflayer"
  },
  {
    label: "Страж Смерти",
    value: "deathguard"
  },
  {
    value: "sporeggar",
    label: "Sporeggar"
  },
  {
    label: "Nethersturm",
    value: "nethersturm"
  },
  {
    label: "Shattrath",
    value: "shattrath"
  },
  {
    label: "Подземье",
    value: "deepholm"
  },
  {
    label: "Седогрив",
    value: "greymane"
  },
  {
    label: "Festung der Stürme",
    value: "festung-der-stürme"
  },
  {
    label: "Echsenkessel",
    value: "echsenkessel"
  },
  {
    label: "Blutkessel",
    value: "blutkessel"
  },
  {
    label: "Галакронд",
    value: "galakrond"
  },
  {
    label: "Ревущий фьорд",
    value: "howling-fjord"
  },
  {
    label: "Разувий",
    value: "razuvious"
  },
  {
    label: "Ткач Смерти",
    value: "deathweaver"
  },
  {
    label: "Die Aldor",
    value: "die-aldor"
  },
  {
    label: "Das Konsortium",
    value: "das-konsortium"
  },
  {
    label: "Chants éternels",
    value: "chants-éternels"
  },
  {
    label: "Marécage de Zangar",
    value: "marécage-de-zangar"
  },
  {
    label: "Temple noir",
    value: "temple-noir"
  },
  {
    label: "Дракономор",
    value: "fordragon"
  },
  {
    label: "Naxxramas",
    value: "naxxramas"
  },
  {
    label: "Борейская тундра",
    value: "borean-tundra"
  },
  {
    label: "Les Clairvoyants",
    value: "les-clairvoyants"
  },
  {
    label: "Азурегос",
    value: "azuregos"
  },
  {
    label: "Ясеневый лес",
    value: "ashenvale"
  },
  {
    label: "Пиратская Бухта",
    value: "booty-bay"
  },
  {
    label: "Вечная Песня",
    value: "eversong"
  },
  {
    label: "Термоштепсель",
    value: "thermaplugg"
  },
  {
    label: "Гром",
    value: "grom"
  },
  {
    label: "Голдринн",
    value: "goldrinn"
  },
  {
    label: "Черный Шрам",
    value: "blackscar"
  }
];

const connected_realms = [];

export {
  commands,
  type,
  realms,
  connected_realms,
  osint_commands,
  dma_commands
}

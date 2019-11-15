export const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.` +
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?' +
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.';


export const lorem = (characterLength) =>
    characterLength
        ? loremIpsum.slice(0, characterLength < loremIpsum.length - 1 ? characterLength : loremIpsum.length - 1)
        : loremIpsum;

export const randomUserAccounts = [{
    "first": "Alyce",
    "last": "Batz",
    "email": "whitesquirrel70@gmail.com",
    "address": "62583 Christop Fall",
    "created": "August 27, 2014",
    "balance": "$7,100.83"
}, {
    "first": "Iliana",
    "last": "Zieme",
    "email": "Iliana.Zieme@terrence.info",
    "address": "406 Feil Harbor",
    "created": "March 19, 2014",
    "balance": "$4,427.64"
}, {
    "first": "Meaghan",
    "last": "Ryan",
    "email": "ivorysquirrel70@gmail.com",
    "address": "37682 Stanton Trace",
    "created": "January 10, 2010",
    "balance": "$9,720.88"
}, {
    "first": "Easter",
    "last": "Beier",
    "email": "greenwolf25@gmail.com",
    "address": "4279 Purdy Crossroad",
    "created": "January 28, 2016",
    "balance": "$3,491.28"
}, {
    "first": "Tremaine",
    "last": "Pollich",
    "email": "Tremaine.Pollich@dexter.org",
    "address": "745 Flossie Mount",
    "created": "April 22, 2011",
    "balance": "$149.00"
}, {
    "first": "Daniella",
    "last": "Feest",
    "email": "indigosquirrel78@gmail.com",
    "address": "9973 Cecilia Throughway",
    "created": "December 10, 2011",
    "balance": "$7,830.36"
}, {
    "first": "Adrianna",
    "last": "Swaniawski",
    "email": "silverrabbit16@gmail.com",
    "address": "053 Abelardo Burg",
    "created": "October 18, 2018",
    "balance": "$5,370.38"
}, {
    "first": "Retta",
    "last": "Gorczany",
    "email": "Retta.Gorczany@reece.info",
    "address": "7914 Dayna Courts",
    "created": "February 18, 2019",
    "balance": "$3,501.30"
}, {
    "first": "Timothy",
    "last": "Kihn",
    "email": "Timothy.Kihn@brandy.info",
    "address": "8310 Jeramie Parkways",
    "created": "December 10, 2015",
    "balance": "$9,508.83"
}, {
    "first": "Makenzie",
    "last": "Spinka",
    "email": "indigofrog21@gmail.com",
    "address": "14331 Josh Landing",
    "created": "March 16, 2016",
    "balance": "$3,569.90"
}, {
    "first": "Krystina",
    "last": "Oberbrunner",
    "email": "tealsquirrel64@gmail.com",
    "address": "2481 Schuppe Brook",
    "created": "December 30, 2014",
    "balance": "$8,953.22"
}, {
    "first": "Adella",
    "last": "Kling",
    "email": "Adella.Kling@vincenza.net",
    "address": "93319 Kreiger Place",
    "created": "April 27, 2012",
    "balance": "$1,413.83"
}, {
    "first": "Waylon",
    "last": "Hermann",
    "email": "pinkturtle98@gmail.com",
    "address": "87215 Brady Center",
    "created": "January 7, 2017",
    "balance": "$1,934.58"
}, {
    "first": "Haley",
    "last": "Altenwerth",
    "email": "azuresquirrel94@gmail.com",
    "address": "1421 Reilly Estates",
    "created": "April 17, 2011",
    "balance": "$7,820.19"
}, {
    "first": "Rigoberto",
    "last": "Orn",
    "email": "greyfrog49@gmail.com",
    "address": "206 Everette Square",
    "created": "April 6, 2015",
    "balance": "$684.29"
}, {
    "first": "Concepcion",
    "last": "Bechtelar",
    "email": "Concepcion.Bechtelar@loyal.biz",
    "address": "647 Earnestine Lodge",
    "created": "February 12, 2018",
    "balance": "$2,324.56"
}, {
    "first": "Grady",
    "last": "Corkery",
    "email": "yellowwolf18@gmail.com",
    "address": "94728 Dovie Avenue",
    "created": "March 27, 2018",
    "balance": "$901.45"
}, {
    "first": "Elvie",
    "last": "Wyman",
    "email": "salmonrabbit04@gmail.com",
    "address": "3183 Borer Haven",
    "created": "November 19, 2013",
    "balance": "$8,533.62"
}, {
    "first": "Jazmyne",
    "last": "Schamberger",
    "email": "Jazmyne.Schamberger@kole.info",
    "address": "4977 Terence Ranch",
    "created": "March 19, 2019",
    "balance": "$9,143.49"
}, {
    "first": "Kraig",
    "last": "Koelpin",
    "email": "Kraig.Koelpin@felix.org",
    "address": "0262 Orn Cove",
    "created": "May 22, 2016",
    "balance": "$7,819.84"
}, {
    "first": "Myah",
    "last": "MacGyver",
    "email": "greenfrog43@gmail.com",
    "address": "3714 Bode Tunnel",
    "created": "June 20, 2012",
    "balance": "$3,192.05"
}, {
    "first": "Amalia",
    "last": "Carter",
    "email": "magentawolf34@gmail.com",
    "address": "762 Effertz Junction",
    "created": "March 17, 2012",
    "balance": "$2,622.40"
}, {
    "first": "Damon",
    "last": "Maggio",
    "email": "lavendergiraffe05@gmail.com",
    "address": "87329 Weber Prairie",
    "created": "March 21, 2015",
    "balance": "$3,433.46"
}, {
    "first": "Lizzie",
    "last": "Boyle",
    "email": "Lizzie.Boyle@violet.com",
    "address": "9559 Stroman Forest",
    "created": "June 6, 2011",
    "balance": "$8,350.41"
}, {
    "first": "Marlon",
    "last": "Pagac",
    "email": "Marlon.Pagac@sofia.info",
    "address": "0662 Treva Union",
    "created": "August 4, 2018",
    "balance": "$8,116.97"
}, {
    "first": "Grayson",
    "last": "McCullough",
    "email": "maroonturtle43@gmail.com",
    "address": "5605 Nigel Well",
    "created": "October 26, 2013",
    "balance": "$2,052.93"
}, {
    "first": "Kameron",
    "last": "Dooley",
    "email": "Kameron.Dooley@norbert.biz",
    "address": "36013 Bashirian Flats",
    "created": "April 12, 2012",
    "balance": "$803.42"
}, {
    "first": "Santos",
    "last": "Lindgren",
    "email": "silverturtle56@gmail.com",
    "address": "8129 Enos Manors",
    "created": "October 9, 2010",
    "balance": "$3,737.72"
}, {
    "first": "Mathew",
    "last": "Stark",
    "email": "tealgiraffe72@gmail.com",
    "address": "3539 Bahringer Trail",
    "created": "February 17, 2019",
    "balance": "$6,044.19"
}, {
    "first": "Greg",
    "last": "Upton",
    "email": "Greg.Upton@roosevelt.biz",
    "address": "0993 Hilda Ports",
    "created": "September 4, 2019",
    "balance": "$4,361.32"
}, {
    "first": "Oleta",
    "last": "Jenkins",
    "email": "yellowsquirrel69@gmail.com",
    "address": "94881 Anastacio Crest",
    "created": "August 3, 2016",
    "balance": "$5,950.76"
}, {
    "first": "Ryan",
    "last": "Watsica",
    "email": "Ryan.Watsica@augustine.biz",
    "address": "5293 Bradley Spur",
    "created": "February 20, 2011",
    "balance": "$3,568.40"
}, {
    "first": "Carmella",
    "last": "Bechtelar",
    "email": "Carmella.Bechtelar@emil.net",
    "address": "81791 Gordon Light",
    "created": "June 1, 2014",
    "balance": "$8,406.98"
}, {
    "first": "Kristy",
    "last": "Wolf",
    "email": "Kristy.Wolf@felipe.biz",
    "address": "424 Yundt Prairie",
    "created": "June 27, 2015",
    "balance": "$4,530.25"
}, {
    "first": "Braden",
    "last": "Lemke",
    "email": "Braden.Lemke@gust.net",
    "address": "6656 Bashirian Junction",
    "created": "December 3, 2010",
    "balance": "$6,275.01"
}, {
    "first": "Noble",
    "last": "Wehner",
    "email": "whitesquirrel99@gmail.com",
    "address": "3065 Brendon Dam",
    "created": "July 24, 2011",
    "balance": "$9,176.34"
}, {
    "first": "Eulalia",
    "last": "Shields",
    "email": "greyrabbit12@gmail.com",
    "address": "725 Ian Prairie",
    "created": "May 9, 2018",
    "balance": "$9,895.79"
}, {
    "first": "Lavinia",
    "last": "Gerhold",
    "email": "Lavinia.Gerhold@lavina.info",
    "address": "978 Peter Unions",
    "created": "February 5, 2018",
    "balance": "$6,509.60"
}, {
    "first": "Amely",
    "last": "Carroll",
    "email": "Amely.Carroll@deonte.com",
    "address": "36866 Strosin Neck",
    "created": "December 5, 2014",
    "balance": "$7,265.91"
}, {
    "first": "Dave",
    "last": "Johnson",
    "email": "Dave.Johnson@grady.biz",
    "address": "55019 Leuschke Crossroad",
    "created": "July 31, 2010",
    "balance": "$3,041.37"
}, {
    "first": "Weston",
    "last": "Rice",
    "email": "redturtle99@gmail.com",
    "address": "45239 Stephany Passage",
    "created": "February 24, 2016",
    "balance": "$2,923.61"
}, {
    "first": "Zakary",
    "last": "Harris",
    "email": "cyanrabbit10@gmail.com",
    "address": "33064 Brice Villages",
    "created": "November 18, 2017",
    "balance": "$3,308.29"
}, {
    "first": "Weldon",
    "last": "Bosco",
    "email": "Weldon.Bosco@valentina.info",
    "address": "144 Alda Parks",
    "created": "March 13, 2011",
    "balance": "$8,185.12"
}, {
    "first": "Eleazar",
    "last": "Bode",
    "email": "Eleazar.Bode@osvaldo.name",
    "address": "3952 Von Parkway",
    "created": "April 30, 2011",
    "balance": "$3,813.15"
}, {
    "first": "Ewell",
    "last": "Swaniawski",
    "email": "Ewell.Swaniawski@sanford.com",
    "address": "02409 Elmira Roads",
    "created": "October 22, 2015",
    "balance": "$492.46"
}, {
    "first": "Gerry",
    "last": "Crooks",
    "email": "Gerry.Crooks@lelah.net",
    "address": "963 Houston Fords",
    "created": "April 4, 2011",
    "balance": "$9,178.52"
}, {
    "first": "Karine",
    "last": "Parisian",
    "email": "limeturtle19@gmail.com",
    "address": "32185 Maximillia Course",
    "created": "May 11, 2010",
    "balance": "$8,212.49"
}, {
    "first": "Madelyn",
    "last": "Block",
    "email": "mintgreenwolf53@gmail.com",
    "address": "46659 Parisian Haven",
    "created": "August 1, 2017",
    "balance": "$264.06"
}, {
    "first": "Loyal",
    "last": "Heidenreich",
    "email": "tealgiraffe62@gmail.com",
    "address": "5698 Rutherford Glen",
    "created": "April 14, 2015",
    "balance": "$8,229.05"
}, {
    "first": "Jason",
    "last": "Reichert",
    "email": "orangewolf95@gmail.com",
    "address": "7104 Alejandrin Branch",
    "created": "April 3, 2019",
    "balance": "$9,987.60"
}, {
    "first": "Nelson",
    "last": "Larkin",
    "email": "Nelson.Larkin@ernestina.info",
    "address": "20776 Naomie Burgs",
    "created": "November 30, 2012",
    "balance": "$7,325.90"
}, {
    "first": "Sim",
    "last": "Nienow",
    "email": "Sim.Nienow@seth.net",
    "address": "2949 Marquardt Crescent",
    "created": "April 15, 2011",
    "balance": "$6,999.97"
}, {
    "first": "Lazaro",
    "last": "Bechtelar",
    "email": "Lazaro.Bechtelar@hayden.org",
    "address": "97833 Cloyd Ville",
    "created": "April 14, 2015",
    "balance": "$2,162.48"
}, {
    "first": "Demario",
    "last": "Sipes",
    "email": "salmongiraffe29@gmail.com",
    "address": "9364 Benedict Causeway",
    "created": "November 22, 2015",
    "balance": "$2,897.59"
}, {
    "first": "Delfina",
    "last": "Bailey",
    "email": "turquoisewolf91@gmail.com",
    "address": "365 Madie Crest",
    "created": "July 1, 2015",
    "balance": "$1,172.80"
}, {
    "first": "Paris",
    "last": "D'Amore",
    "email": "Paris.D'Amore@samantha.net",
    "address": "709 Ethel Street",
    "created": "May 29, 2018",
    "balance": "$9,720.45"
}, {
    "first": "Arturo",
    "last": "Hamill",
    "email": "turquoisegiraffe27@gmail.com",
    "address": "710 Fisher Center",
    "created": "August 17, 2015",
    "balance": "$7,004.84"
}, {
    "first": "Werner",
    "last": "Leuschke",
    "email": "skybluerabbit28@gmail.com",
    "address": "141 Torphy Mills",
    "created": "September 15, 2011",
    "balance": "$6,566.24"
}, {
    "first": "Myrtle",
    "last": "Schroeder",
    "email": "mintgreengiraffe86@gmail.com",
    "address": "169 Ariel Ville",
    "created": "January 12, 2012",
    "balance": "$1,968.73"
}, {
    "first": "Shaylee",
    "last": "Ritchie",
    "email": "olivewolf60@gmail.com",
    "address": "328 Macejkovic Trail",
    "created": "October 14, 2019",
    "balance": "$7,733.50"
}, {
    "first": "Judah",
    "last": "Abbott",
    "email": "tanrabbit20@gmail.com",
    "address": "005 DuBuque Motorway",
    "created": "May 16, 2017",
    "balance": "$3,688.66"
}, {
    "first": "Lupe",
    "last": "Prohaska",
    "email": "Lupe.Prohaska@yolanda.org",
    "address": "6864 Liana Villages",
    "created": "June 19, 2018",
    "balance": "$4,815.51"
}, {
    "first": "Erica",
    "last": "Hahn",
    "email": "magentarabbit84@gmail.com",
    "address": "6217 Ceasar River",
    "created": "February 2, 2010",
    "balance": "$7,917.70"
}, {
    "first": "Delta",
    "last": "Gutmann",
    "email": "Delta.Gutmann@antonia.biz",
    "address": "78385 Raleigh Well",
    "created": "March 1, 2011",
    "balance": "$2,012.70"
}, {
    "first": "Delpha",
    "last": "Ernser",
    "email": "Delpha.Ernser@jaclyn.name",
    "address": "17213 Lilyan Village",
    "created": "November 27, 2016",
    "balance": "$1,677.28"
}, {
    "first": "Alia",
    "last": "Stracke",
    "email": "tanwolf60@gmail.com",
    "address": "762 Elliott Key",
    "created": "January 3, 2018",
    "balance": "$6,398.65"
}, {
    "first": "Saul",
    "last": "Schmitt",
    "email": "Saul.Schmitt@josiane.biz",
    "address": "97434 Swaniawski Square",
    "created": "February 19, 2014",
    "balance": "$4,071.90"
}, {
    "first": "Mallory",
    "last": "Thiel",
    "email": "Mallory.Thiel@octavia.info",
    "address": "35038 Schumm Ways",
    "created": "May 6, 2012",
    "balance": "$2,903.06"
}, {
    "first": "Mabelle",
    "last": "Hintz",
    "email": "Mabelle.Hintz@shanie.com",
    "address": "93405 Dayna Stravenue",
    "created": "May 16, 2015",
    "balance": "$5,807.44"
}, {
    "first": "Anais",
    "last": "Hackett",
    "email": "Anais.Hackett@wilfrid.name",
    "address": "5982 Caterina Court",
    "created": "January 10, 2012",
    "balance": "$7,584.08"
}, {
    "first": "Freda",
    "last": "Barrows",
    "email": "Freda.Barrows@bruce.info",
    "address": "170 Kutch Shores",
    "created": "March 20, 2019",
    "balance": "$4,483.59"
}, {
    "first": "Marty",
    "last": "Hilpert",
    "email": "Marty.Hilpert@lauren.org",
    "address": "51066 Jada Views",
    "created": "March 11, 2013",
    "balance": "$1,431.14"
}, {
    "first": "Emmy",
    "last": "Hamill",
    "email": "indigogiraffe08@gmail.com",
    "address": "1666 MacGyver Mill",
    "created": "September 10, 2012",
    "balance": "$3,584.61"
}, {
    "first": "Audra",
    "last": "Corkery",
    "email": "whitewolf21@gmail.com",
    "address": "68420 Barton Corners",
    "created": "April 30, 2014",
    "balance": "$1,345.39"
}, {
    "first": "Calista",
    "last": "Boyle",
    "email": "Calista.Boyle@miller.biz",
    "address": "3456 Skylar Orchard",
    "created": "October 3, 2018",
    "balance": "$1,620.53"
}];

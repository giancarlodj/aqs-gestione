import { useState, useEffect, useCallback, useMemo } from "react";

var DEFAULT_USERS = {
  cinzia:{password:"cinzia2026",nome:"CINZIA",ruolo:"dipendente"},
  nicole:{password:"nicole2026",nome:"NICOLE",ruolo:"dipendente"},
  silvia:{password:"silvia2026",nome:"SILVIA",ruolo:"dipendente"},
  massimo:{password:"massimo2026",nome:"MASSIMO",ruolo:"dipendente"},
  giuseppe:{password:"giuseppe2026",nome:"GIUSEPPE",ruolo:"dipendente"},
  desena:{password:"desena2026",nome:"DE SENA",ruolo:"dipendente"},
  admin:{password:"admin2026",nome:"AMMINISTRAZIONE",ruolo:"admin"},
};

var TIPOLOGIE = ["Formazione extra contratto","Sicurezza odontoiatria","Sicurezza sanitario","Sicurezza veterinaria","Sicurezza altro","Medicina del lavoro","Autorizzazione sanitaria","Altre attivita"];

var IMPORTED = [
{id:1,data:"2025-02-25",cliente:"CONIZUGNA MEDICA SRL",sede:"MILANO",nc:"SI",tipo:"",lavoro:"NOMINA ADDETTO SICUREZZA LASER + RELAZIONE",resp:"CINZIA",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:2,data:"2025-03-27",cliente:"TRIPLA A DENTALE",sede:"ROMA Via Tevere, 39",nc:"NO",tipo:"",lavoro:"SOSTITUZIONE OPT TAC",resp:"MASSIMO",dc:"2025-03-27",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:3,data:"2025-06-13",cliente:"HDENTAL PERGINE",sede:"PERGINE",nc:"NO",tipo:"",lavoro:"INVIO PRATICA CAMBIO DIRETTORE SANITARIO",resp:"CINZIA",dc:"2025-07-21",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:4,data:"2025-06-25",cliente:"GAP MED DEMETRA CLINICS elettro",sede:"MILANO",nc:"SI",tipo:"",lavoro:"",resp:"NICOLE",dc:"",fatt:"",note:"DISDETTA",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:5,data:"2025-07-04",cliente:"DENTI E SALUTE",sede:"",nc:"",tipo:"",lavoro:"FORMAZIONE PREPOSTO FAD",resp:"",dc:"",fatt:"",note:"Ciardiello, Tosi, Barretta, Cappalunga e Papagna",dfa:"",df:"2025-09-08",cBy:"admin",uBy:"",uAt:""},
{id:6,data:"2025-07-17",cliente:"CIEMME",sede:"",nc:"",tipo:"",lavoro:"FORMAZIONE RLS SU PIATTAFORMA DE SENA",resp:"",dc:"",fatt:"",note:"",dfa:"",df:"2026-02-17",cBy:"admin",uBy:"",uAt:""},
{id:7,data:"2025-08-27",cliente:"DP DENT",sede:"MANTOVA",nc:"NO",tipo:"",lavoro:"SOSTITUZIONE APPARECCHIO RX",resp:"CINZIA",dc:"2025-09-01",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:8,data:"2025-09-18",cliente:"Ambulatorio Lorena Karanxha",sede:"CALOLZIOCORTE",nc:"SI",tipo:"",lavoro:"SCIA APERTURA E DOCUMENTI SICUREZZA",resp:"CINZIA",dc:"",fatt:"",note:"",dfa:"2025-09-15",df:"",cBy:"admin",uBy:"",uAt:""},
{id:9,data:"2025-09-18",cliente:"SAPRA (POLISPECIALISTICO)",sede:"MILANO",nc:"SI",tipo:"",lavoro:"SCIA APERTURA E DOCUMENTI SICUREZZA",resp:"CINZIA",dc:"2025-11-06",fatt:"X",note:"",dfa:"2025-10-21",df:"2025-01-14",cBy:"admin",uBy:"",uAt:""},
{id:10,data:"2025-10-22",cliente:"Serenis",sede:"",nc:"",tipo:"",lavoro:"variazio Scia per introduzione endocrinolgi e dietologi a febbraio 2026",resp:"CINZIA",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:11,data:"2025-10-31",cliente:"LONGEVITY MEDICAL SRL",sede:"MILANO SCALA",nc:"NO",tipo:"",lavoro:"REQUISITI SANITARI e poi AMPLIAMENTO NEL 2026",resp:"CINZIA",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:12,data:"2025-11-17",cliente:"DENTALPRO",sede:"NUOVA APERTURA CAMPOBASSO GENNAIO 2026",nc:"SI",tipo:"",lavoro:"NUOVA CLINICA:DOCUMENTI SICUREZZA E RX",resp:"",dc:"2026-01-08",fatt:"X",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:13,data:"2025-12-02",cliente:"Ferri Vittorio Studio dentistico S.r.l. (DENTALPRO)",sede:"Via Mario Vellani Marchi 50 – 41124 Modena (MO)",nc:"SI",tipo:"",lavoro:"NUOVA CLINICA:DOCUMENTI SICUREZZA E RX",resp:"CINZIA",dc:"2026-01-08",fatt:"X",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:14,data:"2025-12-02",cliente:"HDENTAL 1 SRL",sede:"LODI",nc:"NO",tipo:"",lavoro:"PRATICA PER CAMBIO DIRETTORE SANITARIO",resp:"CINZIA",dc:"2025-12-11",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:15,data:"2025-12-02",cliente:"LONGEVITY MEDICAL SRL",sede:"COMO",nc:"SI",tipo:"",lavoro:"AUTORIZZAZIONE SANITARIA E REQUISITI",resp:"CINZIA",dc:"",fatt:"",note:"",dfa:"",df:"2026-02-18",cBy:"admin",uBy:"",uAt:""},
{id:16,data:"2025-12-03",cliente:"ADCO Hub s.c.a.r.l.",sede:"Milano",nc:"NO",tipo:"",lavoro:"1 CORSO RISCHIO BASSO IMPIAGATA NEL SETTORE SANITARIO- Carmela Fiordaliso",resp:"NICOLE",dc:"2025-12-03",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:17,data:"2025-12-09",cliente:"LONGEVITY MEDICAL SRL",sede:"COMO",nc:"SI",tipo:"",lavoro:"dvr longevity como estetica del 9.12.2025",resp:"NICOLE",dc:"2025-12-09",fatt:"X",note:"fatto per colmare una richiesta di maternità. Il dvr ha ragione sociale medical ma contenuti come centro estetico. Il dvr definitov como sarà fatto post trasformazione",dfa:"",df:"2026-02-17",cBy:"admin",uBy:"",uAt:""},
{id:18,data:"2025-12-11",cliente:"HDENTAL 2 SRL",sede:"PARMA",nc:"NO",tipo:"",lavoro:"PRATICA PER CAMBIO DIRETTORE SANITARIO",resp:"CINZIA",dc:"2025-12-12",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:19,data:"2025-12-11",cliente:"HDENTAL 2 SRL",sede:"FROSINONE",nc:"NO",tipo:"",lavoro:"PRATICA PER CAMBIO DIRETTORE SANITARIO",resp:"CINZIA",dc:"2025-12-16",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:20,data:"2025-12-11",cliente:"DP DENT S.R.L.",sede:"MONSELICE",nc:"NO",tipo:"",lavoro:"NOMINA ADDETTO SICUREZZA LASER + RELAZIONE",resp:"CINZIA",dc:"2025-12-11",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:21,data:"2025-12-11",cliente:"Ferri Vittorio Studio Dentistico S.r.l. (DENTALPRO)",sede:"MODENA",nc:"SI",tipo:"",lavoro:"NOMINA ADDETTO SICUREZZA LASER + RELAZIONE",resp:"CINZIA",dc:"2025-12-15",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:22,data:"2025-12-11",cliente:"DP DENT S.R.L.",sede:"OLBIA",nc:"NO",tipo:"",lavoro:"NOMINA ADDETTO SICUREZZA LASER + RELAZIONE",resp:"CINZIA",dc:"2025-12-15",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:23,data:"2025-12-04",cliente:"TRIPLA A DENTALE S.R.L.",sede:"3 CLINICHE ROMANE",nc:"NO",tipo:"",lavoro:"NOMINA ADDETTO SICUREZZA LASER + RELAZIONE",resp:"CINZIA",dc:"2025-12-15",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:24,data:"2025-12-12",cliente:"A.A. Pet S.r.l.",sede:"Roma Prenestina",nc:"NO",tipo:"",lavoro:"dvr - allegati al dvr - pem e planim",resp:"NICOLE",dc:"2025-12-12",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:25,data:"2025-12-12",cliente:"Diagnostica Veterinaria S.r.l.",sede:"Diagnostica Roma Nord",nc:"NO",tipo:"",lavoro:"DVR - ALLEGATI AL DVR - PEM E PLANIMETRIE",resp:"NICOLE",dc:"2025-12-12",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:26,data:"2025-12-12",cliente:"Animal Hospital S.r.l.",sede:"Velletri",nc:"NO",tipo:"",lavoro:"dvr ED ALLEGATI AL DVR- duvri pulizie - pem e planimetrie",resp:"NICOLE",dc:"2025-12-12",fatt:"X",note:"",dfa:"",df:"2026-01-30",cBy:"admin",uBy:"",uAt:""},
{id:27,data:"2025-12-12",cliente:"Ospedale Giardini Margherita S.r.l.",sede:"Ospedale Veterinario Giardini Margherita",nc:"NO",tipo:"",lavoro:"dvr ED ALLEGATI AL DVR - duvri pulizie - pem e planimetrie evacuazione",resp:"NICOLE",dc:"2025-12-12",fatt:"X",note:"",dfa:"",df:"2026-01-30",cBy:"admin",uBy:"",uAt:""},
{id:28,data:"2025-12-12",cliente:"Ospedale Giardini Margherita S.r.l.",sede:"Ambulatorio Veterinario Vittoria",nc:"NO",tipo:"",lavoro:"dvr duvri pul pem e planimetria evacuazione",resp:"NICOLE",dc:"2025-12-12",fatt:"X",note:"",dfa:"",df:"2026-01-30",cBy:"admin",uBy:"",uAt:""},
{id:29,data:"2025-12-12",cliente:"BLUVET S.p.A.",sede:"HQ BV",nc:"SI",tipo:"",lavoro:"ALLEGATI - DVR E PEM",resp:"NICOLE",dc:"2025-12-12",fatt:"X",note:"in sede direzionale ca zampa via Gioberti-",dfa:"",df:"2026-01-30",cBy:"admin",uBy:"",uAt:""},
{id:30,data:"2025-12-15",cliente:"COLOSSEUM DENTAL SRL",sede:"VICENZA",nc:"NO",tipo:"",lavoro:"CORSO ASO PIDO NAOMI SU PIATTAFORMA POI VALIDATO DA VIDEOCALL",resp:"NICOLE",dc:"2025-12-09",fatt:"X",note:"",dfa:"",df:"2026-01-30",cBy:"admin",uBy:"",uAt:""},
{id:31,data:"2025-12-17",cliente:"Serenis",sede:"Milano viale abruzzi",nc:"NO",tipo:"",lavoro:"PRATICA PER CAMBIO DIRETTORE SANITARIO metà gennaio 2026",resp:"CINZIA",dc:"2026-01-08",fatt:"X",note:"",dfa:"",df:"2026-01-30",cBy:"admin",uBy:"",uAt:""},
{id:32,data:"2025-12-19",cliente:"STUDIO TASSERA",sede:"",nc:"",tipo:"",lavoro:"SOSTITUZIONE CBCT A GENNAIO 2026",resp:"",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:33,data:"2025-12-24",cliente:"AB S.R.L. (ACQUISIZIONE dentalpro GENNAIO 2026)",sede:"Alba (CN)",nc:"SI",tipo:"",lavoro:"SICUREZZA+RX",resp:"NICOLE",dc:"2026-01-02",fatt:"X",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:34,data:"2025-12-22",cliente:"DP DENT S.R.L.",sede:"ROVIGO 1 Corso del popolo",nc:"NO",tipo:"",lavoro:"RELAZIONE LASER + NOMINA ADDETTO SICUREZZA LASER",resp:"CINZIA",dc:"2026-01-09",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:35,data:"2026-01-09",cliente:"DP DENT S.R.L.",sede:"Pavia",nc:"NO",tipo:"",lavoro:"RELAZIONE LASER + NOMINA ADDETTO SICUREZZA LASER",resp:"CINZIA",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:36,data:"",cliente:"dentapro legionella da inserire",sede:"ARIA SERIATE, san rocco al porto, ecc..",nc:"",tipo:"",lavoro:"",resp:"",dc:"",fatt:"",note:"NICOLE MANDATO MAIL A BOSS MASSIMO CON CAMPIONAMENTI 2025 DENTALPRO - SOLO SAN ROCCO AL PORTO",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:37,data:"2026-01-15",cliente:"longevity spa",sede:"firenze e roma",nc:"NO",tipo:"",lavoro:"due corsi primo soccorso",resp:"NICOLE",dc:"2025-01-15",fatt:"X",note:"nicole firmato controo 180euro+iva a corso dati a sapra. Longevity prezzo ad hoc per corsi ps fatti fuori ufficio aqs.guardare contratto",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:38,data:"2026-01-21",cliente:"rho uno srl",sede:"rho",nc:"NO",tipo:"",lavoro:"pacchetto 12 corso radioprotezione operatori",resp:"NICOLE",dc:"2026-01-21",fatt:"X",note:"pacchetto agevolato di 12 corsi di Radioprotezione - Sicurezza per operatori. Costo: 25 EUR + IVA per corso. Totale: 300 EUR + IVA",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
{id:39,data:"2025-01-27",cliente:"studio rtd",sede:"MILANO",nc:"NO",tipo:"",lavoro:"dvr nuov per cambio sede - in regus",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:40,data:"2026-01-27",cliente:"ALTAMEDICA-PHARMARTE SRL",sede:"MILANO",nc:"NO",tipo:"",lavoro:"SUPPORTO RELAZIONE SANITARIA E INVIO ATS ELENCO PERSONALE AGGIORNATO",resp:"",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:41,data:"2026-01-28",cliente:"LONGEVITY VIA BORDONI MILANO",sede:"MILANO PORTA NUOVA",nc:"NO",tipo:"",lavoro:"VARIAZIONE DS",resp:"CINZIA",dc:"2026-01-28",fatt:"X",note:"",dfa:"",df:"2026-01-28",cBy:"admin",uBy:"",uAt:""},
{id:42,data:"2025-10-01",cliente:"LONGEVITY MEDICAL",sede:"TUTTE",nc:"SI",tipo:"",lavoro:"ELETTROMEDICALI E IMP ELETTRICO",resp:"MASSIMO",dc:"",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:43,data:"2025-10-01",cliente:"longevity spa",sede:"TUTTE",nc:"SI",tipo:"",lavoro:"ELETTROMEDICALI E IMP ELETTRICO",resp:"MASSIMO",dc:"",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:44,data:"2026-02-02",cliente:"DP DENT S.R.L.NERVIANO",sede:"NERVIANO",nc:"NO",tipo:"",lavoro:"RELAZIONE LASER + NOMINA ADDETTO SICUREZZA LASER",resp:"CINZIA",dc:"2026-02-02",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:45,data:"2026-02-02",cliente:"DP DENT S.R.L. MILANO SAN SIRO",sede:"MILANO SAN SIRO",nc:"NO",tipo:"",lavoro:"RELAZIONE LASER + NOMINA ADDETTO SICUREZZA LASER",resp:"CINZIA",dc:"2026-02-02",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:46,data:"2026-02-02",cliente:"LONGEVITY MEDICAL COMO",sede:"COMO",nc:"SI",tipo:"",lavoro:"DOCUMENTAZIONE SICUREZZA",resp:"NICOLE",dc:"",fatt:"X",note:"FATTO DIC 2025 DVR PROVVISIORIO COME CENTRO ESTETICO",dfa:"",df:"2026-02-18",cBy:"admin",uBy:"",uAt:""},
{id:47,data:"2026-02-02",cliente:"BV CA ZAMPA CLINICA VETERINARIA PONENTE GENOVA",sede:"",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"NICOLE",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-duvri pulizie-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:48,data:"2026-02-02",cliente:"BV CA ZAMPA AMBULATORIO VETERINARIO GOLFO PARADISO",sede:"",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"NICOLE",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-duvri pulizie-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:49,data:"2026-02-02",cliente:"BV CA ZAMPA CLINICA VETERINARIA SANT'ANGELO - CLINICA",sede:"",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"NICOLE",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-duvri pulizie-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:50,data:"2026-02-02",cliente:"BV CLINICA VETERINARIA SANT'ANGELO - SETTORE FISIOTERAPIA",sede:"",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"NICOLE",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-duvri pulizie-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:51,data:"2026-02-02",cliente:"BV CA ZAMPA CLINICA VETERINARIA OLTREPO'",sede:"",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"NICOLE",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-duvri pulizie-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:52,data:"2026-02-02",cliente:"BV CA ZAMPA OSPEDALE VETERINARIO SAN CONCORDIO",sede:"",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"NICOLE",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-duvri pulizie-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:53,data:"2026-02-02",cliente:"Serenis",sede:"TUTTE LE SEDI",nc:"NO",tipo:"",lavoro:"FORMAZIONE SU SITO DA SVOLGERE - SICREZZA ART 37",resp:"SILVIA",dc:"2026-02-02",fatt:"X",note:"23 CORSI",dfa:"",df:"2026-01-30",cBy:"admin",uBy:"",uAt:""},
{id:54,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Firenze Centro",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:55,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Firenze Novoli",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:56,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Sesto Fiorentino",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:57,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Scandicci",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:58,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Incisa Val d'Arno",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:59,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Santa Croce sull'Arno",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:60,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Lucca",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:61,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Viareggio",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:62,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Livorno",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:63,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Massa",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:64,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Carrara",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:65,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Sarzana",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:66,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Prato",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:67,data:"2026-02-02",cliente:"Studi Dentistici dott. Nicola Paoleschi S.r.l.",sede:"Pistoia",nc:"SI",tipo:"",lavoro:"CAMPIONAMENTO LEGIONELLA IN ACS",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"2026-01-21",cBy:"admin",uBy:"",uAt:""},
{id:68,data:"2026-02-04",cliente:"BV CA ZAMPA Clinica veterinaria San Geminiano srl",sede:"Modena",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:69,data:"2026-02-04",cliente:"BV CA ZMPA Neurotecnologie veterinarie srl",sede:"Legnano",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:70,data:"2026-02-04",cliente:"BV CA ZAMPA S.Alessandro Srl",sede:"Roncadelle",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:71,data:"2026-02-04",cliente:"BV CA ZAMPA Sambuco clinica veterinaria srl",sede:"Milano",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:72,data:"2026-02-04",cliente:"BV CA ZAMPA Clinica veterinaria centrale srl",sede:"Milano",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:73,data:"2026-02-04",cliente:"BV CA ZAMPA Ospedale Veterinario San Michele srl",sede:"Tavazzano con Villavesco",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:74,data:"2026-02-04",cliente:"BV CA ZAMPA Vetsansilvestro srl",sede:"Castiglion Fiorentino",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:75,data:"2026-02-04",cliente:"BV CA ZAMPA Clinica Veterinaria Carvico srl",sede:"Carvico",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:76,data:"2026-02-04",cliente:"BV CA ZAMPA Centro Veterinario Bolognese srl  CLINICA",sede:"Bologna",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:77,data:"2026-02-04",cliente:"BV CA ZAMPA Centro Veterinario Bolognese srl  AMBULATORIO",sede:"Bologna",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"X",note:"NOMINA RSPP-allegati dvr-dvr-pem-planimetrie - NOMINA MC",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:78,data:"2026-02-04",cliente:"BV CA ZAMPA Clinica veterinaria Lainate srl CLINICA",sede:"Lainate",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"",note:"NOMINA RSPP",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:79,data:"2026-02-04",cliente:"BV CA ZAMPA Clinica veterinaria Lainate srl AMBULATORIO",sede:"Lainate",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"",note:"NOMINA RSPP",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:80,data:"2026-02-04",cliente:"BV CA ZAMPA Anubi srl OSPEDALE",sede:"Moncalieri",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"",note:"NOMINA RSPP",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:81,data:"2026-02-04",cliente:"BV CA ZAMPA Anubi srl AMBULATORIO",sede:"Moncalieri",nc:"SI",tipo:"",lavoro:"SICUREZZA E ATTIVARE SORVEGLIANZA SANITARIA",resp:"SILVIA",dc:"",fatt:"",note:"NOMINA RSPP",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:82,data:"2026-02-04",cliente:"TESTORI",sede:"",nc:"",tipo:"",lavoro:"USCITA MEDICO IN SEDE € 350,00 USCITA INFERMIERE €100",resp:"MASSIMO",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:83,data:"2026-02-05",cliente:"LONGEVITY MEDICAL SRL",sede:"COMO",nc:"NO",tipo:"",lavoro:"NUOVO DVR COME POLIAMB, ALLEGATI AL DVR,DUVRI,PEM E PLANIMETIRE",resp:"NICOLE",dc:"",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:84,data:"2026-02-06",cliente:"CA ZAMPA - BRUGNATO - LA SPEZIA BONATI CHIOCCA",sede:"brugnato",nc:"NO",tipo:"",lavoro:"aggiornamento del DVR, l’elaborazione delle nomine, il verbale di elezione del RLS e il verbale di consegna DPI e con l’attivazione della sorveglianza sanitaria.",resp:"NICOLE",dc:"",fatt:"X",note:"nuovo dvr in quanto da collaboratori ora vi sono dipendenti",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:85,data:"2026-02-06",cliente:"Ca' Zampa S.r.l.",sede:"Gaggiolo",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:86,data:"2026-02-06",cliente:"Clinica Veterinaria Campo Marzio S.r.l.",sede:"Trieste",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:87,data:"2026-02-06",cliente:"Istituto Diagnostico Veterinario S.r.l.",sede:"IDV C.so C. Colombo",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:88,data:"2026-02-06",cliente:"OSPEDALE VETERINARIO AMICI DEGLI ANIMALI SRL",sede:"Latina",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:89,data:"2026-02-06",cliente:"CLINICA VETERINARIA EMILVETSERVICES PET&CARE SRL",sede:"Ozzano",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:90,data:"2026-02-06",cliente:"SALUS VET 22 S.R.L.",sede:"Zagarolo",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:91,data:"2026-02-06",cliente:"CLINICA VETERINARIA PINETA SRL",sede:"Pineta Appiano Gentile",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:92,data:"2026-02-06",cliente:"CLINICA VETERINARIA SAN MARTINO SRL",sede:"San Martino Novara",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:93,data:"2026-02-06",cliente:"Locovet srl",sede:"Locovet Locorotondo (BA)",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:94,data:"2026-02-06",cliente:"CA' Zampa S.r.l.",sede:"Clinica Veterinaria Dott.Giardinelli Treviglio",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:95,data:"2026-02-06",cliente:"CA' Zampa S.r.l.",sede:"Milano Montenero",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:96,data:"2026-02-06",cliente:"Ca' Zampa S.r.l.",sede:"Cremona",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:97,data:"2026-02-06",cliente:"CA' Zampa S.r.l.",sede:"Arese",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:98,data:"2026-02-06",cliente:"CA' Zampa S.r.l.",sede:"Milano Portello",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:99,data:"2026-02-06",cliente:"Clinica Veterinaria Orvieto S.r.l.",sede:"Clinica Veterinaria Orvieto",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl  e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:100,data:"2026-02-06",cliente:"Clinica Veterinaria Orvieto S.r.l.",sede:"Centro Diagnostico Orvieto",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl  e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:101,data:"2026-02-06",cliente:"Cliniche Veterinarie Pinerolesi S.r.l.",sede:"CVP",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:102,data:"2026-02-06",cliente:"Centro Chirurgico Veterinario Campanale S.r.l.",sede:"Centro Chirurgico Veterinario Andria",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:103,data:"2026-02-06",cliente:"Clinica Veterinaria Vigna Clara S.r.l.",sede:"Clinica Veterinaria Vigna Clara",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:104,data:"2026-02-06",cliente:"A.A. Pet srl",sede:"Roma Prenestina",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:105,data:"2026-02-06",cliente:"Diagnostica Veterinaria srl",sede:"Diagnostica Roma Nord",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:106,data:"2026-02-06",cliente:"Animal Hospital srl",sede:"Velletri",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:107,data:"2026-02-06",cliente:"Ospedale Giardini Margherita Srl",sede:"Ospedale Veterinario Giardini Margherita",nc:"NO",tipo:"",lavoro:"aggiornamento dvr per rischio stess lavoro correlato -",resp:"NICOLE",dc:"",fatt:"X",note:"aggiornamento rischio stress lavoro correlato - nuovo dl - nuovo medico competente e inserimento valutazione laser classe 4 se presente",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:108,data:"2026-02-06",cliente:"LONGEVITY MEDICAL",sede:"COMO",nc:"NO",tipo:"",lavoro:"PIANO DI AUTOCONTROLLO HACCP",resp:"NICOLE",dc:"",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:109,data:"2026-02-09",cliente:"centro medico grugliasco",sede:"",nc:"NO",tipo:"",lavoro:"3 CORSI DI RADIOPROTEZIONE",resp:"NICOLE",dc:"",fatt:"X",note:"VENDUTI A 50+IVA cad",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:110,data:"2026-02-09",cliente:"CIEMME",sede:"",nc:"NO",tipo:"",lavoro:"corso rls online",resp:"NICOLE",dc:"",fatt:"X",note:"fatto su piattafirma fornito da Giuseppe (50euro a lui)",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:111,data:"2026-02-10",cliente:"LONGEVITY COMO",sede:"COMO",nc:"SI",tipo:"",lavoro:"SUPPORTO SCIA DI STEFANO VELTRI",resp:"CINZIA",dc:"2026-02-10",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:112,data:"2026-02-10",cliente:"HDENTAL 1",sede:"PERGINE VALSUGANA",nc:"NO",tipo:"",lavoro:"SOSTITUZIONE RX",resp:"CINZIA",dc:"2026-02-10",fatt:"X",note:"INVIATA PRATICA PREVENTIVA POI BALDASSARRE FARà IL SOPRALLUOGO",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:113,data:"2026-02-10",cliente:"CIEMME",sede:"",nc:"NO",tipo:"",lavoro:"CORSO ONLINE STAMPATORE",resp:"NICOLE",dc:"2026-02-17",fatt:"X",note:"GIUSEPPE FA VIDEOCALL DI DUE ORE CON LAVORATORE (CHIESI DA GIUSEPPE 120EURO)",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:114,data:"2026-01-21",cliente:"903 GM Odontotecnica",sede:"Via Risorgimento, 459 - 22070 Cassina Rizzardi CO",nc:"SI",tipo:"",lavoro:"DOCUMENTAZIONE SICUREZZA",resp:"DE SENA",dc:"2026-02-11",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:115,data:"2026-01-21",cliente:"904 Trace Dental",sede:"Via Bard 64/A Torino TO",nc:"SI",tipo:"",lavoro:"DOCUMENTAZIONE SICUREZZA",resp:"DE SENA",dc:"2026-02-11",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:116,data:"2026-01-21",cliente:"905 Spring Laboratory",sede:"Via Ionica, 6 – 96100 Siracusa SR",nc:"SI",tipo:"",lavoro:"DOCUMENTAZIONE SICUREZZA",resp:"DE SENA",dc:"2026-02-11",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:117,data:"2026-01-21",cliente:"906 Dental Team",sede:"Viale delle Rimembranze, 45 – 20045 Lainate (MI)",nc:"SI",tipo:"",lavoro:"DOCUMENTAZIONE SICUREZZA",resp:"DE SENA",dc:"2026-02-11",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:118,data:"2026-01-21",cliente:"907 Cacici",sede:"Via Savoca, 30 - 00132 Roma RM",nc:"SI",tipo:"",lavoro:"DOCUMENTAZIONE SICUREZZA",resp:"DE SENA",dc:"2026-02-11",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:119,data:"2026-02-16",cliente:"Clinica Età Evolutiva",sede:"Milano Foro Buonaparte",nc:"SI",tipo:"",lavoro:"REQUISITI SANITARI E SCIA APERTURA",resp:"CINZIA",dc:"2026-02-16",fatt:"",note:"",dfa:"2026-02-16",df:"",cBy:"admin",uBy:"",uAt:""},
{id:120,data:"2026-02-17",cliente:"IN THERAPY",sede:"Milano Foro Buonaparte",nc:"SI",tipo:"",lavoro:"REQUISITI SANITARI E SCIA APERTURA",resp:"CINZIA",dc:"",fatt:"",note:"",dfa:"2026-02-16",df:"",cBy:"admin",uBy:"",uAt:""},
{id:121,data:"2026-02-17",cliente:"109 SAN MARTINO SICCOMARIO",sede:"DP DENT SRL",nc:"NO",tipo:"",lavoro:"RELAZIONE LASER + NOMINA ADDETTO SICUREZZA LASER",resp:"CINZIA",dc:"2026-02-17",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:122,data:"2026-02-17",cliente:"STUDIO DENTISTICO PAOLESCHI VIAREGGIO",sede:"",nc:"",tipo:"",lavoro:"",resp:"",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:123,data:"2026-02-17",cliente:"DP ZERO",sede:"",nc:"",tipo:"",lavoro:"extra medicina oltre 17 dipendenti gestione",resp:"",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
{id:124,data:"2026-02-18",cliente:"DES- AFFIDEA LODI SUD",sede:"LODI",nc:"SI",tipo:"",lavoro:"DVR PROCEDURE NOMINA MC E ATTIVAZIONE SS E RADIOPROTEZIONE",resp:"NICOLE",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""}
];

function getStato(r) {
  if (!r.data) return "";
  if (r.df) return "FATTURATO";
  if (r.fatt === "X") return "DA FATTURARE";
  return "IN ATTESA";
}

function getAlert(r) {
  if (!r.data || r.df) return "";
  if (r.dc && !r.df) return "SALDO";
  if (r.nc === "SI" && !r.dfa) return "ANTICIPO";
  return "";
}

function getProg(r) {
  if (!r.data) return { n: 0, colors: [] };
  if (r.df) return { n: 4, colors: ["#2E7D32","#2E7D32","#2E7D32","#2E7D32"], label: "Fatturato" };
  if (r.dc) return { n: 3, colors: ["#EF6C00","#EF6C00","#EF6C00"], label: "Completo - pronto saldo" };
  if (r.nc === "SI" && r.dfa) return { n: 2, colors: ["#EF6C00","#EF6C00"], label: "Anticipo fatturato" };
  if (r.nc === "SI") return { n: 2, colors: ["#C62828","#C62828"], label: "Anticipo da fare" };
  return { n: 1, colors: ["#C62828"], label: "Inserito" };
}

function fDate(d) {
  if (!d) return "";
  try { var dt = new Date(d); if (isNaN(dt.getTime())) return d; return String(dt.getDate()).padStart(2,"0") + "/" + String(dt.getMonth()+1).padStart(2,"0") + "/" + dt.getFullYear(); }
  catch(e) { return d; }
}

function timeNow() { return new Date().toISOString().slice(0,16).replace("T"," "); }
function todayStr() { return new Date().toISOString().split("T")[0]; }

/* === SVG ICONS === */
function IconEdit() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
function IconMail() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}
function IconTrash() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
}
function IconSearch() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
}

/* === UI COMPONENTS === */
function Stars({ prog }) {
  var empty = "#E5E7EB";
  return (
    <div style={{display:"flex",gap:3,alignItems:"center"}} title={prog ? prog.label : ""}>
      {[0,1,2,3].map(function(i) {
        var active = prog && i < prog.n;
        var col = active ? (prog.colors[i] || prog.colors[prog.colors.length-1]) : empty;
        return <div key={i} style={{width:14,height:14,borderRadius:3,background:col,boxShadow:active?"0 1px 2px rgba(0,0,0,0.2)":"none"}}/>;
      })}
    </div>
  );
}

function StatoTag({ s }) {
  if (!s) return null;
  var m = {"FATTURATO":{bg:"#C8E6C9",c:"#2E7D32"},"DA FATTURARE":{bg:"#FFCDD2",c:"#C62828"},"IN ATTESA":{bg:"#FFE0B2",c:"#E65100"}};
  var st = m[s] || {bg:"#eee",c:"#666"};
  return <span style={{background:st.bg,color:st.c,padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:700,whiteSpace:"nowrap",display:"inline-block"}}>{s}</span>;
}

function AlertTag({ a }) {
  if (!a) return null;
  return <span style={{background:"#C62828",color:"#fff",padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:700,whiteSpace:"nowrap",display:"inline-block"}}>{a}</span>;
}

function Pie({ data }) {
  var total = data.reduce(function(s,d){ return s+d.v; },0);
  if (!total) return null;
  var cum = 0, sz = 180, cx = 90, cy = 90, r = 75;
  function mp(sa,ea) {
    var s1=(sa-90)*Math.PI/180, e1=(ea-90)*Math.PI/180, la=ea-sa>180?1:0;
    return "M"+cx+" "+cy+"L"+(cx+r*Math.cos(s1))+" "+(cy+r*Math.sin(s1))+"A"+r+" "+r+" 0 "+la+" 1 "+(cx+r*Math.cos(e1))+" "+(cy+r*Math.sin(e1))+"Z";
  }
  return (
    <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
      <svg width={sz} height={sz}>
        {data.map(function(d,i){var a=(d.v/total)*360,sa=cum;cum+=a;if(a<0.5)return null;return <path key={i} d={mp(sa,sa+a-0.5)} fill={d.col}/>;})}
        <circle cx={cx} cy={cy} r={36} fill="white"/>
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" style={{fontSize:20,fontWeight:800,fill:"#1F4E79"}}>{total}</text>
      </svg>
      <div>{data.map(function(d,i){
        return <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,marginBottom:6}}>
          <div style={{width:10,height:10,borderRadius:2,background:d.col}}/><span>{d.label}</span>
          <b style={{color:d.col}}>{d.v}</b><span style={{color:"#999",fontSize:11}}>({Math.round(d.v/total*100)}%)</span>
        </div>;
      })}</div>
    </div>
  );
}

function Modal({ children, onClose, wide }) {
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
      <div onClick={function(e){e.stopPropagation();}} style={{background:"white",borderRadius:16,padding:28,width:wide?750:560,maxHeight:"88vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>{children}</div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel}>
      <h3 style={{margin:"0 0 16px",color:"#1F4E79",fontWeight:800}}>Conferma</h3>
      <p style={{fontSize:14,color:"#374151",margin:"0 0 20px"}}>{message}</p>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
        <button onClick={onCancel} style={{padding:"10px 24px",background:"#F3F4F6",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600}}>Annulla</button>
        <button onClick={onConfirm} style={{padding:"10px 24px",background:"#C62828",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700}}>Elimina</button>
      </div>
    </Modal>
  );
}

function EditForm({ row, onSave, onClose, isAdmin, users }) {
  var _r = Object.assign({}, row);
  if (!_r.tipo) _r.tipo = "";
  var [f, setF] = useState(_r);
  function set(k,v) { setF(function(p){ return Object.assign({},p,{[k]:v}); }); }
  var inp = {padding:"10px 12px",border:"1.5px solid #D1D5DB",borderRadius:8,fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"};
  var lbl = {fontSize:10,fontWeight:700,color:"#6B7280",marginBottom:3,display:"block",textTransform:"uppercase"};
  var resps = [];
  Object.values(users).forEach(function(u){if(u.ruolo==="dipendente"&&resps.indexOf(u.nome)===-1)resps.push(u.nome);});
  return (
    <Modal onClose={onClose}>
      <h2 style={{margin:"0 0 20px",fontSize:18,fontWeight:800,color:"#1F4E79"}}>{row.id?"Modifica":"Nuova Attivita"}</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><label style={lbl}>Data inserimento</label><input type="date" value={f.data} onChange={function(e){set("data",e.target.value);}} style={inp}/></div>
        <div><label style={lbl}>Nuovo contratto</label><select value={f.nc} onChange={function(e){set("nc",e.target.value);}} style={inp}><option value="">--</option><option>SI</option><option>NO</option></select></div>
        <div style={{gridColumn:"1/-1"}}><label style={lbl}>Ragione Sociale completa</label><input value={f.cliente} onChange={function(e){set("cliente",e.target.value);}} placeholder="Nome cliente..." style={inp}/></div>
        <div><label style={lbl}>Sede</label><input value={f.sede} onChange={function(e){set("sede",e.target.value);}} style={inp}/></div>
        <div><label style={lbl}>Tipologia Attivita</label><select value={f.tipo||""} onChange={function(e){set("tipo",e.target.value);}} style={inp}><option value="">-- Seleziona --</option>{TIPOLOGIE.map(function(t){return <option key={t} value={t}>{t}</option>;})}</select></div>
        <div><label style={lbl}>Responsabile</label><select value={f.resp} onChange={function(e){set("resp",e.target.value);}} style={inp}><option value="">--</option>{resps.map(function(r){return <option key={r}>{r}</option>;})}</select></div>
        <div><label style={lbl}>Fatturabile?</label><select value={f.fatt} onChange={function(e){set("fatt",e.target.value);}} style={inp}><option value="">No</option><option value="X">Si (X)</option></select></div>
        <div style={{gridColumn:"1/-1"}}><label style={lbl}>Lavoro da svolgere</label><textarea value={f.lavoro} onChange={function(e){set("lavoro",e.target.value);}} rows={2} style={Object.assign({},inp,{resize:"vertical"})}/></div>
        <div><label style={lbl}>Data completamento</label><input type="date" value={f.dc} onChange={function(e){set("dc",e.target.value);}} style={inp}/></div>
        <div style={{gridColumn:"1/-1"}}><label style={lbl}>Note</label><textarea value={f.note} onChange={function(e){set("note",e.target.value);}} rows={2} style={Object.assign({},inp,{resize:"vertical"})}/></div>
        {isAdmin && <div><label style={lbl}>Data fatt. anticipo</label><input type="date" value={f.dfa} onChange={function(e){set("dfa",e.target.value);}} style={inp}/></div>}
        {isAdmin && <div><label style={lbl}>Data fattura saldo</label><input type="date" value={f.df} onChange={function(e){set("df",e.target.value);}} style={inp}/></div>}
      </div>
      <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
        <button onClick={onClose} style={{padding:"10px 24px",background:"#F3F4F6",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600}}>Annulla</button>
        <button onClick={function(){if(!f.data||!f.cliente){return;}onSave(f);}} style={{padding:"10px 24px",background:"#1F4E79",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,opacity:(!f.data||!f.cliente)?0.5:1}}>Salva</button>
      </div>
    </Modal>
  );
}

function AdminSettings({ users, onSaveUsers, logs, onClose }) {
  var [tab, setTab] = useState("utenti");
  var [uList, setUList] = useState(Object.entries(users).map(function(e){return Object.assign({username:e[0]},e[1]);}));
  var [nu, setNu] = useState({username:"",password:"",nome:"",ruolo:"dipendente"});
  var inp = {padding:"8px 10px",border:"1px solid #D1D5DB",borderRadius:6,fontSize:12,outline:"none",boxSizing:"border-box"};

  function saveAll(){var obj={};uList.forEach(function(u){obj[u.username]={password:u.password,nome:u.nome,ruolo:u.ruolo};});onSaveUsers(obj);}
  function addUser(){
    if(!nu.username||!nu.password||!nu.nome){return;}
    if(uList.find(function(u){return u.username===nu.username.toLowerCase();})){return;}
    setUList(uList.concat([Object.assign({},nu,{username:nu.username.toLowerCase()})]));
    setNu({username:"",password:"",nome:"",ruolo:"dipendente"});
  }

  return (
    <Modal onClose={onClose} wide>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:800,color:"#1F4E79"}}>Impostazioni Admin</h2>
        <button onClick={onClose} style={{background:"#F3F4F6",border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16}}>X</button>
      </div>
      <div style={{display:"flex",marginBottom:20,background:"#F3F4F6",borderRadius:8,overflow:"hidden"}}>
        {["utenti","log","info"].map(function(k){return <button key={k} onClick={function(){setTab(k);}} style={{padding:"10px 18px",background:tab===k?"#1F4E79":"transparent",color:tab===k?"white":"#6B7280",border:"none",fontSize:12,fontWeight:600,cursor:"pointer",flex:1,textTransform:"capitalize"}}>{k}</button>;})}
      </div>

      {tab==="utenti" && <div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:16}}>
          <thead><tr style={{borderBottom:"2px solid #E5E7EB"}}>
            {["Username","Password","Nome","Ruolo",""].map(function(h){return <th key={h} style={{padding:"8px",textAlign:"left",fontWeight:700,color:"#6B7280",fontSize:10,textTransform:"uppercase"}}>{h}</th>;})}
          </tr></thead>
          <tbody>{uList.map(function(u){return <tr key={u.username} style={{borderBottom:"1px solid #F3F4F6"}}>
            <td style={{padding:"6px 8px"}}><b style={{color:"#1F4E79"}}>{u.username}</b></td>
            <td style={{padding:"6px 8px"}}><input value={u.password} onChange={function(e){setUList(uList.map(function(x){return x.username===u.username?Object.assign({},x,{password:e.target.value}):x;}));}} style={Object.assign({},inp,{width:120})}/></td>
            <td style={{padding:"6px 8px"}}><input value={u.nome} onChange={function(e){setUList(uList.map(function(x){return x.username===u.username?Object.assign({},x,{nome:e.target.value.toUpperCase()}):x;}));}} style={Object.assign({},inp,{width:120})}/></td>
            <td style={{padding:"6px 8px"}}><select value={u.ruolo} onChange={function(e){setUList(uList.map(function(x){return x.username===u.username?Object.assign({},x,{ruolo:e.target.value}):x;}));}} style={Object.assign({},inp,{width:100})}><option>dipendente</option><option>admin</option></select></td>
            <td style={{padding:"6px 8px"}}>{u.username!=="admin"&&<button onClick={function(){setUList(uList.filter(function(x){return x.username!==u.username;}));}} style={{background:"#FEE2E2",color:"#C62828",border:"none",borderRadius:4,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Elimina</button>}</td>
          </tr>;})}</tbody>
        </table>
        <div style={{padding:14,background:"#F8FAFC",borderRadius:8,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#1F4E79",marginBottom:8}}>NUOVO UTENTE</div>
          <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap"}}>
            <div><label style={{fontSize:9,color:"#6B7280"}}>Username</label><input value={nu.username} onChange={function(e){setNu(Object.assign({},nu,{username:e.target.value}));}} style={Object.assign({},inp,{width:100})}/></div>
            <div><label style={{fontSize:9,color:"#6B7280"}}>Password</label><input value={nu.password} onChange={function(e){setNu(Object.assign({},nu,{password:e.target.value}));}} style={Object.assign({},inp,{width:100})}/></div>
            <div><label style={{fontSize:9,color:"#6B7280"}}>Nome</label><input value={nu.nome} onChange={function(e){setNu(Object.assign({},nu,{nome:e.target.value.toUpperCase()}));}} style={Object.assign({},inp,{width:100})}/></div>
            <button onClick={addUser} style={{padding:"8px 16px",background:"#2E75B6",color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",height:34}}>+ Aggiungi</button>
          </div>
        </div>
        <button onClick={saveAll} style={{padding:"10px 24px",background:"#1F4E79",color:"white",border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer"}}>Salva Utenti</button>
      </div>}

      {tab==="log" && <div style={{maxHeight:400,overflow:"auto"}}>
        {logs.length>0 ? logs.slice().reverse().map(function(l,i){
          return <div key={i} style={{padding:"8px 12px",borderBottom:"1px solid #F3F4F6",fontSize:11,display:"flex",gap:10}}>
            <span style={{color:"#9CA3AF",whiteSpace:"nowrap",minWidth:120}}>{l.when}</span>
            <span style={{fontWeight:700,color:"#1F4E79",minWidth:80}}>{l.who}</span>
            <span style={{color:l.action==="CREATO"?"#2E7D32":l.action==="ELIMINATO"?"#C62828":"#E65100",fontWeight:600,minWidth:70}}>{l.action}</span>
            <span style={{color:"#374151"}}>{l.detail}</span>
          </div>;
        }) : <div style={{padding:30,textAlign:"center",color:"#9CA3AF"}}>Nessun log</div>}
      </div>}

      {tab==="info" && <div style={{fontSize:13,color:"#374151",lineHeight:1.8}}>
        <h3 style={{color:"#1F4E79"}}>AQS Italia - Gestione Commesse v3.0</h3>
        <p>Login multi-utente con ruoli admin e dipendente</p>
        <p>Dashboard statistiche in tempo reale</p>
        <p>Progressi con indicatori colorati CSS</p>
        <p>Alert automatici anticipo e fatturazione</p>
        <p>Checkbox visto anticipo e saldo (solo admin)</p>
        <p>Tipologia attivita con menu a scelta rapida</p>
        <p>Colonna Note visibile in tabella</p>
        <p>Ordinamento colonne e ricerca avanzata</p>
        <p>Log completo modifiche per utente</p>
        <p>Esportazione CSV e invio email</p>
        <p>Gestione utenti (solo admin)</p>
      </div>}
    </Modal>
  );
}

function LegendaModal({ onClose }) {
  var items = [
    {colors:["#C62828","#E5E7EB","#E5E7EB","#E5E7EB"],label:"Lavoro inserito"},
    {colors:["#C62828","#C62828","#E5E7EB","#E5E7EB"],label:"Nuovo contratto - anticipo da fare"},
    {colors:["#C62828","#F57C00","#E5E7EB","#E5E7EB"],label:"Anticipo fatturato"},
    {colors:["#EF6C00","#EF6C00","#EF6C00","#E5E7EB"],label:"Completo e fatturabile"},
    {colors:["#2E7D32","#2E7D32","#2E7D32","#2E7D32"],label:"Fatturato"},
  ];
  return (
    <Modal onClose={onClose}>
      <h3 style={{margin:"0 0 16px",color:"#1F4E79",fontWeight:800}}>Legenda Progressi</h3>
      {items.map(function(it,idx){
        return <div key={idx} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:idx<4?"1px solid #F3F4F6":"none"}}>
          <div style={{display:"flex",gap:3}}>
            {it.colors.map(function(c,j){return <div key={j} style={{width:16,height:16,borderRadius:3,background:c}}/>;
            })}
          </div>
          <span style={{fontSize:13,color:"#374151"}}>{it.label}</span>
        </div>;
      })}
    </Modal>
  );
}

function CheckboxVisto({ checked, date, disabled, onToggle, color }) {
  var bg = disabled ? "#F3F4F6" : checked ? "#C8E6C9" : (color === "red" ? "#FFCDD2" : color === "blue" ? "#E3F2FD" : "#FFF8E1");
  var border = disabled ? "#D1D5DB" : checked ? "#2E7D32" : (color === "red" ? "#C62828" : color === "blue" ? "#1565C0" : "#E65100");
  return (
    <div style={{display:"flex",alignItems:"center",gap:4}}>
      <div onClick={disabled ? undefined : onToggle} style={{
        width:18,height:18,borderRadius:4,border:"2px solid "+border,background:bg,
        cursor:disabled?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",
        opacity:disabled?0.4:1
      }}>
        {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
      </div>
      {checked && date && <span style={{fontSize:8,color:"#6B7280",whiteSpace:"nowrap"}}>{fDate(date)}</span>}
    </div>
  );
}

export default function App() {
  var [user, setUser] = useState(null);
  var [rows, setRows] = useState(IMPORTED);
  var [users, setUsers] = useState(DEFAULT_USERS);
  var [logs, setLogs] = useState([]);
  var [view, setView] = useState("dashboard");
  var [editing, setEditing] = useState(null);
  var [filter, setFilter] = useState("TUTTI");
  var [search, setSearch] = useState("");
  var [showSettings, setShowSettings] = useState(false);
  var [showLegenda, setShowLegenda] = useState(false);
  var [confirmDel, setConfirmDel] = useState(null);
  var [sortCol, setSortCol] = useState("data");
  var [sortDir, setSortDir] = useState("desc");

  useEffect(function(){
    try {
      var rd = localStorage.getItem("aq7-rows"); if(rd) setRows(JSON.parse(rd));
      var ud = localStorage.getItem("aq7-users"); if(ud) setUsers(JSON.parse(ud));
      var ld = localStorage.getItem("aq7-logs"); if(ld) setLogs(JSON.parse(ld));
    } catch(e){console.log("init",e);}
  },[]);

  var persist = useCallback(function(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}},[]);
  function saveRows(nr){setRows(nr);persist("aq7-rows",nr);}
  function saveUsers(nu){setUsers(nu);persist("aq7-users",nu);}
  function addLog(who,action,detail){setLogs(function(prev){var nl=prev.concat([{when:timeNow(),who:who,action:action,detail:detail}]);persist("aq7-logs",nl);return nl;});}

  var stats = useMemo(function(){
    var f=rows.filter(function(r){return r.data;});
    var fat=f.filter(function(r){return getStato(r)==="FATTURATO";}).length;
    var df=f.filter(function(r){return getStato(r)==="DA FATTURARE";}).length;
    var att=f.filter(function(r){return getStato(r)==="IN ATTESA";}).length;
    var tot=f.length,pct=tot?Math.round(fat/tot*100):0;
    var byR={};f.forEach(function(r){var k=r.resp||"N/A";if(!byR[k])byR[k]={t:0,f:0,d:0,a:0};byR[k].t++;var s=getStato(r);if(s==="FATTURATO")byR[k].f++;else if(s==="DA FATTURARE")byR[k].d++;else byR[k].a++;});
    var alc=f.filter(function(r){return getAlert(r);}).length;
    return {tot:tot,fat:fat,df:df,att:att,nv:f.filter(function(r){return r.nc==="SI";}).length,pct:pct,byR:byR,alc:alc};
  },[rows]);

  var filtered = useMemo(function(){
    var r=rows.filter(function(x){return x.data;});
    if(user&&user.ruolo==="dipendente") r=r.filter(function(x){return x.resp===user.nome;});
    if(filter==="DA FATTURARE") r=r.filter(function(x){return getStato(x)==="DA FATTURARE";});
    else if(filter==="IN ATTESA") r=r.filter(function(x){return getStato(x)==="IN ATTESA";});
    else if(filter==="FATTURATO") r=r.filter(function(x){return getStato(x)==="FATTURATO";});
    else if(filter==="ALERT") r=r.filter(function(x){return getAlert(x);});
    if(search){var s=search.toLowerCase();r=r.filter(function(x){return [x.cliente,x.lavoro,x.sede,x.resp,x.note,x.tipo||""].some(function(v){return (v||"").toLowerCase().indexOf(s)>=0;});});}
    r.sort(function(a,b){
      var va,vb;
      if(sortCol==="cliente"){va=(a.cliente||"").toLowerCase();vb=(b.cliente||"").toLowerCase();}
      else if(sortCol==="tipo"){va=(a.tipo||"").toLowerCase();vb=(b.tipo||"").toLowerCase();}
      else if(sortCol==="resp"){va=(a.resp||"").toLowerCase();vb=(b.resp||"").toLowerCase();}
      else if(sortCol==="stato"){va=getStato(a);vb=getStato(b);}
      else{va=a.data||"";vb=b.data||"";}
      if(va<vb) return sortDir==="asc"?-1:1;
      if(va>vb) return sortDir==="asc"?1:-1;
      return 0;
    });
    return r;
  },[rows,user,filter,search,sortCol,sortDir]);

  function toggleSort(col){
    if(sortCol===col){setSortDir(sortDir==="asc"?"desc":"asc");}
    else{setSortCol(col);setSortDir("asc");}
  }

  function doSave(form){
    if(form.id){form.uBy=user.nome;form.uAt=timeNow();saveRows(rows.map(function(r){return r.id===form.id?form:r;}));addLog(user.nome,"MODIFICATO",form.cliente);}
    else{form.id=Date.now();form.cBy=user.nome;saveRows(rows.concat([form]));addLog(user.nome,"CREATO",form.cliente);}
    setEditing(null);
  }
  function doDelete(id){
    var r=rows.find(function(x){return x.id===id;});
    if(!r) return;
    setConfirmDel(r);
  }
  function confirmDelete(){
    if(!confirmDel) return;
    var newRows=rows.filter(function(x){return x.id!==confirmDel.id;});
    saveRows(newRows);
    addLog(user.nome,"ELIMINATO",confirmDel.cliente);
    setConfirmDel(null);
  }
  function toggleAnticipo(r){
    var newVal=r.dfa?"":todayStr();
    var updated=Object.assign({},r,{dfa:newVal,uBy:user.nome,uAt:timeNow()});
    saveRows(rows.map(function(x){return x.id===r.id?updated:x;}));
    addLog(user.nome,newVal?"VISTO ANTICIPO":"RIMOSSO ANTICIPO",r.cliente);
  }
  function toggleSaldo(r){
    var newVal=r.df?"":todayStr();
    var updated=Object.assign({},r,{df:newVal,uBy:user.nome,uAt:timeNow()});
    saveRows(rows.map(function(x){return x.id===r.id?updated:x;}));
    addLog(user.nome,newVal?"VISTO SALDO":"RIMOSSO SALDO",r.cliente);
  }
  function toggleCompleto(r){
    var newVal=r.dc?"":todayStr();
    var updated=Object.assign({},r,{dc:newVal,uBy:user.nome,uAt:timeNow()});
    saveRows(rows.map(function(x){return x.id===r.id?updated:x;}));
    addLog(user.nome,newVal?"COMPLETATO":"RIMOSSO COMPLETAMENTO",r.cliente);
  }
  function sendEmail(row){var stato=getStato(row);var subj=encodeURIComponent("[FATT] "+stato+" - "+row.cliente);var body="Cliente: "+row.cliente+"\nSede: "+row.sede+"\nLavoro: "+row.lavoro+"\nResp: "+row.resp+"\nStato: "+stato+(row.note?"\nNote: "+row.note:"")+"\n\nCordiali saluti";window.open("mailto:amministrazione@aqsitalia.it?subject="+subj+"&body="+encodeURIComponent(body));}
  function exportCSV(){var h=["Data","Cliente","Sede","Contratto","Tipologia","Lavoro","Resp","Completamento","Fatturabile","Note","Anticipo","Fattura","Stato","Creato","Modificato"];var csv=[h.join(";")];filtered.forEach(function(r){csv.push([fDate(r.data),r.cliente,r.sede,r.nc,r.tipo||"",(r.lavoro||"").replace(/;/g,","),r.resp,fDate(r.dc),r.fatt,(r.note||"").replace(/;/g,","),fDate(r.dfa),fDate(r.df),getStato(r),r.cBy||"",r.uBy||""].join(";"));});var blob=new Blob(["\ufeff"+csv.join("\n")],{type:"text/csv;charset=utf-8"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download="commesse_aqs.csv";a.click();}

  if(!user) return <LoginPage users={users} onLogin={function(u){setUser(u);addLog(u.nome,"LOGIN","Accesso");}}/>;

  var isAdmin = user.ruolo==="admin";

  var sortArrow = function(col){
    if(sortCol!==col) return <span style={{opacity:0.3,fontSize:8,marginLeft:2}}>^</span>;
    return <span style={{fontSize:8,marginLeft:2}}>{sortDir==="asc"?"^":"v"}</span>;
  };

  return (
    <div style={{minHeight:"100vh",background:"#F0F4F8",fontFamily:"system-ui,sans-serif"}}>
    <div style={{background:"linear-gradient(135deg,#0A1628,#1F4E79)",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:36,height:36,background:"rgba(255,255,255,0.12)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:12}}>AQS</div>
        <div><div style={{color:"white",fontSize:15,fontWeight:700}}>Gestione Commesse</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:10}}>{new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div></div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",background:"rgba(255,255,255,0.08)",borderRadius:8,overflow:"hidden"}}>
          {["dashboard","lista","riepilogo"].map(function(v){return <button key={v} onClick={function(){setView(v);}} style={{padding:"7px 14px",background:view===v?"rgba(255,255,255,0.18)":"transparent",color:"white",border:"none",fontSize:11,fontWeight:view===v?700:400,cursor:"pointer",textTransform:"capitalize"}}>{v}</button>;})}
        </div>
        {stats.alc>0&&<div onClick={function(){setView("lista");setFilter("ALERT");}} style={{background:"#C62828",color:"white",borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,cursor:"pointer",minWidth:20,textAlign:"center"}}>{stats.alc}</div>}
        {isAdmin&&<button onClick={function(){setShowSettings(true);}} style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:"white",display:"flex",alignItems:"center"}} title="Impostazioni"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>}
        <div style={{color:"white",fontSize:11,padding:"5px 10px",background:"rgba(255,255,255,0.08)",borderRadius:6}}><b>{user.nome}</b></div>
        <button onClick={function(){addLog(user.nome,"LOGOUT","");setUser(null);}} style={{padding:"6px 12px",background:"transparent",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,fontSize:10,cursor:"pointer"}}>Esci</button>
      </div>
    </div>

    <div style={{padding:"20px 24px",maxWidth:1600,margin:"0 auto"}}>

    {view==="dashboard"&&<div>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        {[["Totale",stats.tot,"#1F4E79"],["Da fatturare",stats.df,"#C62828"],["In attesa",stats.att,"#E65100"],["Fatturato",stats.fat,"#2E7D32"],["% Fatturato",stats.pct+"%","#1F4E79"],["Nuovi contratti",stats.nv,"#2E75B6"]].map(function(item){
          return <div key={item[0]} style={{background:"white",borderRadius:12,padding:"16px 20px",flex:1,minWidth:120,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase"}}>{item[0]}</div>
            <div style={{fontSize:28,fontWeight:800,color:item[2],marginTop:4}}>{item[1]}</div>
          </div>;
        })}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        <div style={{background:"white",borderRadius:14,padding:22}}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#1F4E79"}}>Stato</h3><Pie data={[{label:"Da fatturare",v:stats.df,col:"#E57373"},{label:"In attesa",v:stats.att,col:"#FFB74D"},{label:"Fatturato",v:stats.fat,col:"#81C784"}]}/></div>
        <div style={{background:"white",borderRadius:14,padding:22}}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#1F4E79"}}>Per Responsabile</h3>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"2px solid #E5E7EB"}}>{["Nome","Tot","Da f.","Att.","Fatt","%"].map(function(h){return <th key={h} style={{padding:"6px",textAlign:"left",color:"#9CA3AF",fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{h}</th>;})}</tr></thead>
          <tbody>{Object.entries(stats.byR).sort(function(a,b){return b[1].t-a[1].t;}).map(function(entry){var n=entry[0],s=entry[1];return <tr key={n} style={{borderBottom:"1px solid #F3F4F6"}}><td style={{padding:"6px",fontWeight:700,color:"#1F4E79"}}>{n}</td><td style={{padding:"6px",fontWeight:700}}>{s.t}</td><td style={{padding:"6px",color:"#C62828"}}>{s.d}</td><td style={{padding:"6px",color:"#E65100"}}>{s.a}</td><td style={{padding:"6px",color:"#2E7D32"}}>{s.f}</td><td style={{padding:"6px",fontWeight:700}}>{s.t?Math.round(s.f/s.t*100):0}%</td></tr>;})}</tbody>
        </table></div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={function(){setView("lista");setFilter("DA FATTURARE");}} style={{padding:"8px 14px",background:"#FFCDD2",color:"#C62828",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>Da Fatturare ({stats.df})</button>
        <button onClick={function(){setView("lista");setFilter("ALERT");}} style={{padding:"8px 14px",background:"#FFF3E0",color:"#E65100",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>Alert ({stats.alc})</button>
        <button onClick={function(){setShowLegenda(true);}} style={{padding:"8px 14px",background:"#F3F4F6",color:"#374151",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>Legenda</button>
      </div>
    </div>}

    {view==="riepilogo"&&<div>
      <h2 style={{fontSize:18,fontWeight:800,color:"#1F4E79",marginBottom:16}}>Riepilogo</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
        {Object.entries(stats.byR).sort(function(a,b){return b[1].t-a[1].t;}).map(function(entry){var n=entry[0],s=entry[1],p=s.t?Math.round(s.f/s.t*100):0;return <div key={n} style={{background:"white",borderRadius:12,padding:18}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><b style={{color:"#1F4E79",fontSize:15}}>{n}</b><span style={{fontSize:22,fontWeight:800,color:p>=60?"#2E7D32":p>=30?"#E65100":"#C62828"}}>{p}%</span></div>
          <div style={{background:"#F3F4F6",borderRadius:4,height:6,marginBottom:12}}><div style={{height:"100%",borderRadius:4,background:p>=60?"#81C784":p>=30?"#FFB74D":"#E57373",width:p+"%"}}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,fontSize:11,textAlign:"center"}}><div style={{padding:6,background:"#FFEBEE",borderRadius:6}}><div style={{fontWeight:800,fontSize:16,color:"#C62828"}}>{s.d}</div>Da fatt.</div><div style={{padding:6,background:"#FFF8E1",borderRadius:6}}><div style={{fontWeight:800,fontSize:16,color:"#E65100"}}>{s.a}</div>Attesa</div><div style={{padding:6,background:"#E8F5E9",borderRadius:6}}><div style={{fontWeight:800,fontSize:16,color:"#2E7D32"}}>{s.f}</div>Fatt.</div></div>
        </div>;})}
      </div>
    </div>}

    {view==="lista"&&<div>
      <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9CA3AF"}}><IconSearch/></span>
          <input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Cerca cliente, sede, lavoro, note..." style={{padding:"9px 14px 9px 30px",border:"1.5px solid #D1D5DB",borderRadius:8,fontSize:13,outline:"none",width:280,background:"white"}}/>
        </div>
        <div style={{display:"flex",background:"white",borderRadius:8,overflow:"hidden",border:"1.5px solid #D1D5DB"}}>
          {["TUTTI","DA FATTURARE","IN ATTESA","FATTURATO","ALERT"].map(function(f){
            var cnt=f==="ALERT"?stats.alc:f==="DA FATTURARE"?stats.df:f==="IN ATTESA"?stats.att:f==="FATTURATO"?stats.fat:stats.tot;
            return <button key={f} onClick={function(){setFilter(f);}} style={{padding:"7px 10px",background:filter===f?"#1F4E79":"transparent",color:filter===f?"white":"#6B7280",border:"none",fontSize:10,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{f} ({cnt})</button>;
          })}
        </div>
        <div style={{flex:1}}/>
        <button onClick={function(){setShowLegenda(true);}} style={{padding:"8px 14px",background:"#F3F4F6",color:"#374151",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>Legenda</button>
        <button onClick={exportCSV} style={{padding:"8px 14px",background:"white",color:"#374151",border:"1.5px solid #D1D5DB",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>CSV</button>
        <button onClick={function(){setEditing({data:todayStr(),cliente:"",sede:"",nc:"",tipo:"",lavoro:"",resp:user.ruolo==="dipendente"?user.nome:"",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:user.nome,uBy:"",uAt:""});}} style={{padding:"8px 14px",background:"#1F4E79",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Nuova</button>
      </div>
      <div style={{background:"white",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
        <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,tableLayout:"fixed",minWidth:isAdmin?1650:1350}}>
          <colgroup>
            <col style={{width:"72px"}}/>
            <col style={{width:"160px"}}/>
            <col style={{width:"80px"}}/>
            <col style={{width:"34px"}}/>
            <col style={{width:"95px"}}/>
            <col style={{width:"145px"}}/>
            <col style={{width:"56px"}}/>
            <col style={{width:"34px"}}/>
            <col style={{width:"52px"}}/>
            <col style={{width:"90px"}}/>
            {isAdmin&&<col style={{width:"70px"}}/>}
            {isAdmin&&<col style={{width:"70px"}}/>}
            <col style={{width:"88px"}}/>
            <col style={{width:"66px"}}/>
            <col style={{width:"72px"}}/>
            <col style={{width:"80px"}}/>
            <col style={{width:"88px"}}/>
          </colgroup>
          <thead><tr style={{background:"#1F4E79"}}>
            {[
              {k:"data",l:"Data"},
              {k:"cliente",l:"Cliente"},
              {k:"sede",l:"Sede"},
              {k:"nc",l:"NC"},
              {k:"tipo",l:"Tipologia"},
              {k:"lavoro",l:"Lavoro"},
              {k:"resp",l:"Resp."},
              {k:"fatt",l:"Fatt."},
              {k:"compl",l:"Compl."},
              {k:"note",l:"Note"},
            ].concat(isAdmin?[{k:"dfa",l:"V.Anticipo"},{k:"dfs",l:"V.Saldo"}]:[]).concat([
              {k:"stato",l:"Stato"},
              {k:"prog",l:"Progr."},
              {k:"alert",l:"Alert"},
              {k:"mod",l:"Modif."},
              {k:"azioni",l:"Azioni"}
            ]).map(function(h){
              var sortable=["data","cliente","tipo","resp","stato"].indexOf(h.k)>=0;
              return <th key={h.k} onClick={sortable?function(){toggleSort(h.k);}:undefined} style={{padding:"10px 6px",textAlign:"left",color:"white",fontWeight:700,fontSize:9,textTransform:"uppercase",whiteSpace:"nowrap",cursor:sortable?"pointer":"default",userSelect:"none"}}>{h.l}{sortable?sortArrow(h.k):null}</th>;
            })}
          </tr></thead>
          <tbody>{filtered.map(function(r,i){var stato=getStato(r);var alrt=getAlert(r);var prog=getProg(r);
            var anticDisabled = r.nc !== "SI" || !!r.df;
            var saldoDisabled = !r.dc;
            return <tr key={r.id} style={{background:i%2===0?"white":"#EDF4FC",borderBottom:"1px solid #E5E7EB"}}>
              <td style={{padding:"8px 6px",whiteSpace:"nowrap",fontSize:10}}>{fDate(r.data)}</td>
              <td style={{padding:"8px 6px",fontWeight:600,color:"#1F4E79",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={r.cliente}>{r.cliente}</td>
              <td style={{padding:"8px 6px",color:"#6B7280",fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={r.sede}>{r.sede}</td>
              <td style={{padding:"8px 6px",fontSize:10,fontWeight:600,color:r.nc==="SI"?"#2E75B6":"#9CA3AF",textAlign:"center"}}>{r.nc}</td>
              <td style={{padding:"8px 6px",fontSize:9,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#6B7280"}} title={r.tipo}>{r.tipo||""}</td>
              <td style={{padding:"8px 6px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:10}} title={r.lavoro}>{r.lavoro}</td>
              <td style={{padding:"8px 6px",fontWeight:600,color:"#2E75B6",fontSize:10}}>{r.resp}</td>
              <td style={{padding:"8px 6px",textAlign:"center",fontWeight:700,color:r.fatt==="X"?"#2E7D32":"#D1D5DB"}}>{r.fatt==="X"?"X":"-"}</td>
              <td style={{padding:"8px 6px"}}><CheckboxVisto checked={!!r.dc} date={r.dc} disabled={false} onToggle={function(){toggleCompleto(r);}} color="blue"/></td>
              <td style={{padding:"8px 6px",fontSize:9,color:"#6B7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={r.note}>{r.note}</td>
              {isAdmin&&<td style={{padding:"8px 6px"}}><CheckboxVisto checked={!!r.dfa} date={r.dfa} disabled={anticDisabled} onToggle={function(){toggleAnticipo(r);}} color="red"/></td>}
              {isAdmin&&<td style={{padding:"8px 6px"}}><CheckboxVisto checked={!!r.df} date={r.df} disabled={saldoDisabled} onToggle={function(){toggleSaldo(r);}} color="orange"/></td>}
              <td style={{padding:"8px 6px"}}><StatoTag s={stato}/></td>
              <td style={{padding:"8px 6px"}}><Stars prog={prog}/></td>
              <td style={{padding:"8px 6px"}}><AlertTag a={alrt}/></td>
              <td style={{padding:"8px 6px",fontSize:9,color:"#9CA3AF",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.uBy||r.cBy||""}</td>
              <td style={{padding:"8px 6px",whiteSpace:"nowrap"}}>
                <div style={{display:"flex",gap:3}}>
                  <button onClick={function(){setEditing(Object.assign({},r));}} style={{background:"#F3F4F6",border:"none",borderRadius:5,padding:"5px 6px",cursor:"pointer",display:"flex",alignItems:"center",color:"#374151"}} title="Modifica"><IconEdit/></button>
                  <button onClick={function(){sendEmail(r);}} style={{background:"#EDE9FE",border:"none",borderRadius:5,padding:"5px 6px",cursor:"pointer",display:"flex",alignItems:"center",color:"#6D28D9"}} title="Invia email"><IconMail/></button>
                  {isAdmin&&<button onClick={function(e){e.stopPropagation();doDelete(r.id);}} style={{background:"#FEE2E2",border:"none",borderRadius:5,padding:"5px 6px",cursor:"pointer",display:"flex",alignItems:"center",color:"#C62828"}} title="Elimina"><IconTrash/></button>}
                </div>
              </td>
            </tr>;})}
            {filtered.length===0&&<tr><td colSpan={isAdmin?17:15} style={{padding:30,textAlign:"center",color:"#9CA3AF"}}>Nessuna attivita trovata</td></tr>}
          </tbody>
        </table></div>
        <div style={{padding:"8px 14px",borderTop:"1px solid #E5E7EB",color:"#9CA3AF",fontSize:11}}>{filtered.length} attivita - {user.nome}</div>
      </div>
    </div>}

    </div>
    {editing&&<EditForm row={editing} onSave={doSave} onClose={function(){setEditing(null);}} isAdmin={isAdmin} users={users}/>}
    {showSettings&&<AdminSettings users={users} onSaveUsers={saveUsers} logs={logs} onClose={function(){setShowSettings(false);}}/>}
    {showLegenda&&<LegendaModal onClose={function(){setShowLegenda(false);}}/>}
    {confirmDel&&<ConfirmModal message={"Eliminare l'attivita per "+confirmDel.cliente+"?"} onConfirm={confirmDelete} onCancel={function(){setConfirmDel(null);}}/>}
    </div>
  );
}

function LoginPage({ users, onLogin }) {
  var [u,setU] = useState("");
  var [p,setP] = useState("");
  var [err,setErr] = useState("");
  function go(){var usr=users[u.toLowerCase().trim()];if(usr&&usr.password===p){onLogin(Object.assign({username:u.toLowerCase().trim()},usr));}else{setErr("Credenziali non valide");}}
  var inp = {padding:"12px 14px",border:"1.5px solid #D1D5DB",borderRadius:8,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"};
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0A1628,#1F4E79,#2E75B6)",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"white",borderRadius:18,padding:"44px 36px",width:370,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{textAlign:"center",marginBottom:30}}>
          <div style={{width:64,height:64,background:"linear-gradient(135deg,#1F4E79,#2E75B6)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </div>
          <h1 style={{fontSize:22,fontWeight:800,color:"#1F4E79",margin:0}}>AQS Italia</h1>
          <p style={{color:"#9CA3AF",fontSize:13,marginTop:4}}>Gestione Commesse e Fatturazione</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input value={u} onChange={function(e){setU(e.target.value);setErr("");}} placeholder="Username" onKeyDown={function(e){if(e.key==="Enter")go();}} style={inp}/>
          <input value={p} onChange={function(e){setP(e.target.value);setErr("");}} placeholder="Password" type="password" onKeyDown={function(e){if(e.key==="Enter")go();}} style={inp}/>
          {err&&<div style={{color:"#C62828",fontSize:12,textAlign:"center"}}>{err}</div>}
          <button onClick={go} style={{padding:"13px",background:"linear-gradient(135deg,#1F4E79,#2E75B6)",color:"white",border:"none",borderRadius:8,fontSize:15,fontWeight:700,cursor:"pointer",marginTop:4}}>Accedi</button>
        </div>
      </div>
      <div style={{marginTop:28,textAlign:"center",color:"rgba(255,255,255,0.35)",fontSize:11}}>AQS Italia srl - 2026 tutti i diritti riservati</div>
    </div>
  );
}

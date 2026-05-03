res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') {
  res.status(200).end();
  return;
}
// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const CASES = {
  10001: "Under Review — Your case has been received and assigned to an officer.",
  10002: "In Progress — Investigation is ongoing. You will be contacted soon.",
  10003: "Resolved — Your case was resolved on 14 Apr 2025. Contact us for details.",
  10004: "Pending Documentation — Please submit additional documents to proceed.",
  10005: "Escalated — Your case has been escalated to the legal team.",
};

const HOTLINE = "0800-CHRAN-01";

// ─────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────
const T = {
  en: {
    welcome: "Welcome to CHRAN\nCenter for Human Rights Accountability Network\n\nSelect Language:\n1. English\n2. Yoruba\n3. Igbo\n4. Hausa",
    mainMenu: "CHRAN Main Menu\n1. Report a Violation\n2. Submit a Complaint\n3. Check Case Status\n4. Request Legal Aid\n5. Emergency Contacts\n0. Exit",
    violationMenu: "Select Violation Type:\n1. Police Brutality\n2. Unlawful Detention\n3. Land Rights Dispute\n4. Discrimination\n5. Freedom of Speech\n6. Other\n0. Back",
    violationConfirm: (type) => `You selected: ${type}\n\nYour report has been received. A CHRAN officer will follow up within 48 hours.\n\nReference: CHR-${Date.now().toString().slice(-5)}\n\nThank you.`,
    complaintMenu: "Submit a Complaint\n\nPlease describe your complaint briefly.\n\nType your complaint and press Send:",
    complaintConfirm: (text) => `Complaint received:\n"${text.slice(0, 60)}"\n\nComplaint ID: CMP-${Date.now().toString().slice(-5)}\nWe will respond within 72 hours.\n\nThank you.`,
    casePrompt: "Check Case Status\n\nEnter your 5-digit case number:",
    caseNotFound: "Case not found. Please check the number and try again.\n\n0. Back to Menu",
    legalName: "Request Legal Aid\n\nStep 1 of 2\nEnter your full name:",
    legalLocation: (name) => `Hello ${name}\n\nStep 2 of 2\nEnter your LGA or city:`,
    legalConfirm: (name, location) => `Legal Aid Request Submitted\n\nName: ${name}\nLocation: ${location}\n\nRef: LAW-${Date.now().toString().slice(-5)}\nA lawyer will contact you within 24 hours.\n\nThank you.`,
    emergency: `CHRAN Emergency Contacts\n\nHotline: ${HOTLINE}\nEmail: info@chran.org\nWebsite: chran.org\n\nAvailable 24/7 for urgent cases.\n\n0. Back`,
    exit: "Thank you for using CHRAN USSD.\n\nTogether we stand for human rights.\n\nGoodbye.",
    invalidOption: "Invalid option. Please try again.\n\n0. Back to Menu",
  },
  yo: {
    mainMenu: "Akojọ Akọkọ CHRAN\n1. Ròyin Ìrúfin\n2. Fọwọ́ silẹ̀ Ẹ̀bẹ̀\n3. Ṣayẹwo Ipò Ẹjọ́\n4. Beere Iranlọwọ Ofin\n5. Àwọn Nọ́mbà Pajawiri\n0. Jáde",
    violationMenu: "Yan Irú Ìrúfin:\n1. Iwa Ika Ọlọ́pàá\n2. Àtìmọ́lé Àdífọ̀\n3. Ìjiyàn Ilẹ̀\n4. Ìyatọ̀\n5. Òmìnira Ọ̀rọ̀\n6. Mìíràn\n0. Padà",
    violationConfirm: (type) => `Ẹ ti yan: ${type}\n\nÌròyìn rẹ ti gba. Oṣiṣẹ CHRAN yoo kan sí ẹ láàárọ̀ 48.\n\nRef: CHR-${Date.now().toString().slice(-5)}\n\nẸ ṣeun.`,
    complaintMenu: "Fọwọ́ silẹ̀ Ẹ̀bẹ̀\n\nJọwọ ṣapejuwe ẹ̀bẹ̀ rẹ:\n",
    complaintConfirm: (text) => `Ẹ̀bẹ̀ ti gba.\n\nID: CMP-${Date.now().toString().slice(-5)}\nA o dáhùn láàárọ̀ 72.\n\nẸ ṣeun.`,
    casePrompt: "Ṣayẹwo Ipò Ẹjọ́\n\nTẹ nọ́mbà ẹjọ́ oníjọ̀ marun rẹ:",
    caseNotFound: "Ẹjọ́ kò rí. Jọwọ tún gbiyanju.\n\n0. Padà sí Akojọ",
    legalName: "Beere Iranlọwọ Ofin\n\nTẹ orukọ rẹ ni kikun:",
    legalLocation: (name) => `Bawo ${name}\n\nTẹ ìpò rẹ tàbí ìlú rẹ:`,
    legalConfirm: (name, location) => `Ibeere Iranlọwọ Ofin ti fi silẹ̀\n\nOrukọ: ${name}\nÌpò: ${location}\n\nRef: LAW-${Date.now().toString().slice(-5)}\nAgbẹjọ́rò yoo kan sí ẹ láàárọ̀ 24.\n\nẸ ṣeun.`,
    emergency: `Àwọn Nọ́mbà Pajawiri CHRAN\n\nHotline: ${HOTLINE}\nEmail: info@chran.org\n\n0. Padà`,
    exit: "Ẹ ṣeun fún lílo CHRAN USSD.\n\nÀárọ̀ tó máa ń gbádùn àwọn ẹ̀tọ́ ènìyàn.\n\nÒdàbò.",
    invalidOption: "Àṣàyàn tí kò tọ́. Jọwọ tún gbiyanju.\n\n0. Padà sí Akojọ",
  },
  ig: {
    mainMenu: "Isi Nchọta CHRAN\n1. Kọọ Mmegbu\n2. Nyefee Nnabata\n3. Lelee Ọnọdụ Ikpe\n4. Arịọ Enyemaka Iwu\n5. Nọmba Ihe Mberede\n0. Pụọ",
    violationMenu: "Họrọ Ụdị Mmegbu:\n1. Ihe Ike Ndị Uwe Ojii\n2. Mkpọchi Enweghị Ikpe\n3. Esemokwu Ala\n4. Ịkpa Ókè\n5. Onwe Okwu\n6. Ndị Ọzọ\n0. Laghachi",
    violationConfirm: (type) => `Họrọla: ${type}\n\nOderekọ gị natara. Onye ọrụ CHRAN ga-akpọtụrụ gị n'ime awa 48.\n\nRef: CHR-${Date.now().toString().slice(-5)}\n\nDaalụ.`,
    complaintMenu: "Nyefee Nnabata\n\nDeere nnabata gị ozugbo:\n",
    complaintConfirm: (text) => `Nnabata natara.\n\nID: CMP-${Date.now().toString().slice(-5)}\nAnaghị azaghachi n'ime awa 72.\n\nDaalụ.`,
    casePrompt: "Lelee Ọnọdụ Ikpe\n\nTinye nọmba ikpe digit ise gị:",
    caseNotFound: "Ahụghị ikpe. Biko nwalee ọzọ.\n\n0. Laghachi na Isi",
    legalName: "Arịọ Enyemaka Iwu\n\nTinye aha gị zuru oke:",
    legalLocation: (name) => `Ndewo ${name}\n\nTinye mpaghara gị ma ọ bụ obodo gị:`,
    legalConfirm: (name, location) => `Arịọ Enyemaka Iwu Ezigara\n\nAha: ${name}\nMpaghara: ${location}\n\nRef: LAW-${Date.now().toString().slice(-5)}\nOdeala ga-akpọtụrụ gị n'ime awa 24.\n\nDaalụ.`,
    emergency: `Nọmba Ihe Mberede CHRAN\n\nHotline: ${HOTLINE}\nEmail: info@chran.org\n\n0. Laghachi`,
    exit: "Daalụ maka iji CHRAN USSD.\n\nObiọma maka ikike mmadụ.\n\nKa ọ dị.",
    invalidOption: "Nhọrọ ezighi ezi. Biko nwalee ọzọ.\n\n0. Laghachi na Isi",
  },
  ha: {
    mainMenu: "Babban Menu CHRAN\n1. Rarraba Take Haƙƙi\n2. Shigar da Korafi\n3. Duba Matsayin Shari'a\n4. Nemi Taimakon Doka\n5. Lambobin Gaggawa\n0. Fita",
    violationMenu: "Zaɓi Nau'in Take Haƙƙi:\n1. Ta'addancin 'Yan Sanda\n2. Tsarewa Ba Bisa Ƙa'ida\n3. Rigimar Ƙasa\n4. Nuna Wariya\n5. 'Yancin Faɗar Albarkacin Baki\n6. Sauran\n0. Koma",
    violationConfirm: (type) => `Ka zaɓi: ${type}\n\nRahotonka an karɓa. Jami'in CHRAN zai tuntube ka cikin awa 48.\n\nRef: CHR-${Date.now().toString().slice(-5)}\n\nNa gode.`,
    complaintMenu: "Shigar da Korafi\n\nDa fatan za ka bayyana korafinku:\n",
    complaintConfirm: (text) => `An karɓi korafi.\n\nID: CMP-${Date.now().toString().slice(-5)}\nZa mu amsa cikin awa 72.\n\nNa gode.`,
    casePrompt: "Duba Matsayin Shari'a\n\nSaka lambar shari'arka mai lamba 5:",
    caseNotFound: "Ba a sami shari'a ba. Da fatan za a sake gwadawa.\n\n0. Koma Menu",
    legalName: "Nemi Taimakon Doka\n\nSaka cikakken sunanka:",
    legalLocation: (name) => `Sannu ${name}\n\nSaka unguwarku ko garinku:`,
    legalConfirm: (name, location) => `An Shigar da Neman Taimakon Doka\n\nSuna: ${name}\nWuri: ${location}\n\nRef: LAW-${Date.now().toString().slice(-5)}\nLauya zai tuntube ka cikin awa 24.\n\nNa gode.`,
    emergency: `Lambobin Gaggawa CHRAN\n\nHotline: ${HOTLINE}\nEmail: info@chran.org\n\n0. Koma`,
    exit: "Na gode da amfani da CHRAN USSD.\n\nMuna tsaye don haƙƙin ɗan adam.\n\nSai anjima.",
    invalidOption: "Zaɓi mara inganci. Da fatan za a sake gwadawa.\n\n0. Koma Menu",
  },
};

const VIOLATION_TYPES = {
  en: ["Police Brutality", "Unlawful Detention", "Land Rights Dispute", "Discrimination", "Freedom of Speech Violation", "Other"],
  yo: ["Iwa Ika Ọlọ́pàá", "Àtìmọ́lé Àdífọ̀", "Ìjiyàn Ilẹ̀", "Ìyatọ̀", "Òmìnira Ọ̀rọ̀", "Mìíràn"],
  ig: ["Ihe Ike Ndị Uwe Ojii", "Mkpọchi Enweghị Ikpe", "Esemokwu Ala", "Ịkpa Ókè", "Onwe Okwu", "Ndị Ọzọ"],
  ha: ["Ta'addancin 'Yan Sanda", "Tsarewa Ba Bisa Ƙa'ida", "Rigimar Ƙasa", "Nuna Wariya", "Faɗar Albarkacin Baki", "Sauran"],
};

// ─────────────────────────────────────────────
// SESSION STATE
// NOTE: Vercel is stateless — sessions live only per request.
// Africa's Talking sends the full input chain in `text` (e.g. "1*3*10002")
// so we derive all state from `text` alone. No server-side session needed.
// ─────────────────────────────────────────────

function getLang(steps) {
  const langMap = { "1": "en", "2": "yo", "3": "ig", "4": "ha" };
  return langMap[steps[0]] || "en";
}

function getMenu(steps) {
  return steps[1] || null;
}

// ─────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────
export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { text } = req.body;
  const steps = text && text.length > 0 ? text.split("*") : [];
  const currentStep = steps.length;
  const lastInput = steps[steps.length - 1] || "";

  let response = "";

  // STEP 0: First dial
  if (!text || text === "") {
    response = `CON ${T.en.welcome}`;

  // STEP 1: Language selected → show main menu
  } else if (currentStep === 1) {
    const langMap = { "1": "en", "2": "yo", "3": "ig", "4": "ha" };
    const lang = langMap[lastInput];
    if (!lang) {
      response = `CON ${T.en.welcome}\n\nInvalid choice. Try again.`;
    } else {
      response = `CON ${T[lang].mainMenu}`;
    }

  // STEP 2: Main menu option selected
  } else if (currentStep === 2) {
    const lang = getLang(steps);
    switch (lastInput) {
      case "1": response = `CON ${T[lang].violationMenu}`; break;
      case "2": response = `CON ${T[lang].complaintMenu}`; break;
      case "3": response = `CON ${T[lang].casePrompt}`; break;
      case "4": response = `CON ${T[lang].legalName}`; break;
      case "5": response = `CON ${T[lang].emergency}`; break;
      case "0": response = `END ${T[lang].exit}`; break;
      default:  response = `CON ${T[lang].invalidOption}`; break;
    }

  // STEP 3: Sub-menu input
  } else if (currentStep === 3) {
    const lang = getLang(steps);
    const menu = getMenu(steps);

    if (menu === "1") {
      const idx = parseInt(lastInput) - 1;
      const types = VIOLATION_TYPES[lang];
      if (lastInput === "0") {
        response = `CON ${T[lang].mainMenu}`;
      } else if (idx >= 0 && idx < types.length) {
        response = `END ${T[lang].violationConfirm(types[idx])}`;
      } else {
        response = `CON ${T[lang].invalidOption}`;
      }

    } else if (menu === "2") {
      if (lastInput.trim().length < 3) {
        response = `CON ${T[lang].complaintMenu}\n\nToo short. Please describe your complaint:`;
      } else {
        response = `END ${T[lang].complaintConfirm(lastInput)}`;
      }

    } else if (menu === "3") {
      if (lastInput === "0") {
        response = `CON ${T[lang].mainMenu}`;
      } else {
        const caseNum = parseInt(lastInput);
        const status = CASES[caseNum];
        if (status) {
          response = `END Case #${caseNum}\n\n${status}\n\nFor assistance: ${HOTLINE}`;
        } else {
          response = `CON ${T[lang].caseNotFound}`;
        }
      }

    } else if (menu === "4") {
      // Got name, ask for location
      response = `CON ${T[lang].legalLocation(lastInput)}`;

    } else if (menu === "5") {
      if (lastInput === "0") {
        response = `CON ${T[lang].mainMenu}`;
      } else {
        response = `END ${T[lang].exit}`;
      }
    }

  // STEP 4: Legal aid location
  } else if (currentStep === 4) {
    const lang = getLang(steps);
    const menu = getMenu(steps);
    if (menu === "4") {
      const name = steps[2] || "User";
      const location = lastInput;
      response = `END ${T[lang].legalConfirm(name, location)}`;
    } else {
      response = `END ${T[lang].exit}`;
    }

  } else {
    const lang = getLang(steps);
    response = `END ${T[lang].exit}`;
  }

  res.setHeader("Content-Type", "text/plain");
  res.send(response);
      }
    

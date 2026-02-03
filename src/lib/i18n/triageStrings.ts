import type { LanguageCode } from "./languages";

type Dict = Record<string, string>;

const en: Dict = {
  title: "Triage",
  language: "Language",
  symptomsTitle: "Describe symptoms",
  symptomPlaceholder: "e.g., fever and headache for 2 days",
  bodyTitle: "Tap the body area",
  selectedArea: "Selected area",
  startTriage: "Start triage",
  next: "Next",
  back: "Back",
  restart: "Restart",
  result: "Result",
  emergency: "EMERGENCY",
  urgent: "URGENT",
  routine: "ROUTINE",
  summary: "Summary",

  // Decision tree
  dt_title: "Decision Tree",
  dt_q_start: "Are you having any of these right now?",
  dt_o_breathing: "Trouble breathing / severe shortness of breath",
  dt_o_chest_pain: "Chest pain / pressure",
  dt_o_bleeding: "Severe bleeding / fainting",
  dt_o_none: "None of these",
  dt_q_fever: "Do you have a fever?",
  dt_o_high_fever: "Yes, high fever (very hot, shaking chills)",
  dt_o_mild_fever: "Mild fever",
  dt_o_no: "No",
  dt_q_duration: "How long have symptoms lasted?",
  dt_o_lt_24h: "Less than 24 hours",
  dt_o_1_3d: "1–3 days",
  dt_o_gt_3d: "More than 3 days",
  dt_q_pain: "Is the pain severe or getting worse quickly?",
  dt_o_yes: "Yes",
  dt_o_no2: "No",

  // Body parts
  body_none: "None", 
  body_head: "Head", 
  body_chest: "Chest", 
  body_abdomen: "Abdomen",
  body_back: "Back", 
  body_arm_left: "Left arm", 
  body_arm_right: "Right arm", 
  body_leg_left: "Left leg", 
  body_leg_right: "Right leg",
};

const hi: Dict = {
  title: "ट्रायेज",
  language: "भाषा",
  symptomsTitle: "लक्षण बताइए",
  symptomPlaceholder: "जैसे, 2 दिनों से बुखार और सिरदर्द",
  bodyTitle: "शरीर के हिस्से पर टैप करें",
  selectedArea: "चुना हुआ हिस्सा",
  startTriage: "ट्रायेज शुरू करें",
  next: "आगे",
  back: "पीछे",
  restart: "फिर से शुरू करें",
  result: "परिणाम",
  emergency: "आपातकाल",
  urgent: "तत्काल",
  routine: "सामान्य",
  summary: "सारांश",

  // Decision tree
  dt_title: "निर्णय-वृक्ष",
  dt_q_start: "क्या अभी आपको इनमें से कोई समस्या है?",
  dt_o_breathing: "सांस लेने में कठिनाई / बहुत ज्यादा सांस फूलना",
  dt_o_chest_pain: "सीने में दर्द / दबाव",
  dt_o_bleeding: "बहुत ज्यादा खून बहना / बेहोशी",
  dt_o_none: "इनमें से कोई नहीं",
  dt_q_fever: "क्या आपको बुखार है?",
  dt_o_high_fever: "हाँ, तेज बुखार (बहुत गर्म, कंपकंपी)",
  dt_o_mild_fever: "हल्का बुखार",
  dt_o_no: "नहीं",
  dt_q_duration: "लक्षण कितने समय से हैं?",
  dt_o_lt_24h: "24 घंटे से कम",
  dt_o_1_3d: "1–3 दिन",
  dt_o_gt_3d: "3 दिन से अधिक",
  dt_q_pain: "क्या दर्द बहुत ज्यादा है या तेजी से बढ़ रहा है?",
  dt_o_yes: "हाँ",
  dt_o_no2: "नहीं",

  // Body Parts
  body_none: "कोई नहीं", 
  body_head: "सिर", 
  body_chest: "छाती", 
  body_abdomen: "पेट", 
  body_back: "पीठ",
  body_arm_left: "बायाँ हाथ", 
  body_arm_right: "दायाँ हाथ", 
  body_leg_left: "बायाँ पैर", 
  body_leg_right: "दायाँ पैर",
};

const sw: Dict = {
  title: "Uchunguzi wa Haraka",
  language: "Lugha",
  symptomsTitle: "Eleza dalili",
  symptomPlaceholder: "mfano, homa na maumivu ya kichwa kwa siku 2",
  bodyTitle: "Gusa sehemu ya mwili",
  selectedArea: "Sehemu iliyochaguliwa",
  startTriage: "Anza uchunguzi",
  next: "Endelea",
  back: "Rudi",
  restart: "Anza upya",
  result: "Matokeo",
  emergency: "DHARURA",
  urgent: "HARAKA",
  routine: "KAWAIDA",
  summary: "Muhtasari",

  // Decision tree
  dt_title: "Mti wa Maamuzi",
  dt_q_start: "Je, una mojawapo ya haya hivi sasa?",
  dt_o_breathing: "Shida ya kupumua / upungufu mkali wa pumzi",
  dt_o_chest_pain: "Maumivu / shinikizo kifuani",
  dt_o_bleeding: "Kutokwa damu sana / kuzimia",
  dt_o_none: "Hakuna kati ya hayo",
  dt_q_fever: "Je, una homa?",
  dt_o_high_fever: "Ndiyo, homa kali (mwili moto sana, kutetemeka)",
  dt_o_mild_fever: "Homa ya kawaida",
  dt_o_no: "Hapana",
  dt_q_duration: "Dalili zimechukua muda gani?",
  dt_o_lt_24h: "Chini ya saa 24",
  dt_o_1_3d: "Siku 1–3",
  dt_o_gt_3d: "Zaidi ya siku 3",
  dt_q_pain: "Je, maumivu ni makali au yanaongezeka haraka?",
  dt_o_yes: "Ndiyo",
  dt_o_no2: "Hapana",

  // Body Parts
  body_none: "Hakuna", 
  body_head: "Kichwa", 
  body_chest: "Kifua", 
  body_abdomen: "Tumbo", 
  body_back: "Mgongo",
  body_arm_left: "Mkono wa kushoto", 
  body_arm_right: "Mkono wa kulia", 
  body_leg_left: "Mguu wa kushoto", 
  body_leg_right: "Mguu wa kulia",
};

export function t(lang: LanguageCode, key: string) {
  const tables: Record<LanguageCode, Dict> = { en, hi, sw };
  return tables[lang]?.[key] ?? en[key] ?? key; // never blank
}


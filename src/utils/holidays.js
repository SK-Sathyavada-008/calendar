// All holidays keyed as "MM-DD" so they work across any year
export const HOLIDAYS = {
  "01-14": { name: "Makar Sankranti", type: "festival" },
  "01-29": { name: "Putrada Ekadashi", type: "ekadashi" },
  "02-13": { name: "Jaya Ekadashi", type: "ekadashi" },
  "02-15": { name: "Maha Shivaratri", type: "festival" },
  "02-27": { name: "Amalaki Ekadashi", type: "ekadashi" },
  "03-15": { name: "Papamochani Ekadashi", type: "ekadashi" },
  "03-19": { name: "Ugadi / Gudi Padwa", type: "festival" },
  "03-26": { name: "Ram Navami", type: "festival" },
  "03-30": { name: "Kamada Ekadashi", type: "ekadashi" },
  "04-02": { name: "Hanuman Jayanti", type: "festival" },
  "04-14": { name: "Varuthini Ekadashi", type: "ekadashi" },
  "04-29": { name: "Mohini Ekadashi", type: "ekadashi" },
  "05-13": { name: "Apara Ekadashi", type: "ekadashi" },
  "05-28": { name: "Nirjala Ekadashi", type: "ekadashi" },
  "06-11": { name: "Yogini Ekadashi", type: "ekadashi" },
  "06-26": { name: "Devshayani Ekadashi", type: "ekadashi" },
  "07-10": { name: "Kamika Ekadashi", type: "ekadashi" },
  "07-16": { name: "Ratha Yatra", type: "festival" },
  "07-25": { name: "Putrada Ekadashi (Shravana)", type: "ekadashi" },
  "08-08": { name: "Aja Ekadashi", type: "ekadashi" },
  "08-23": { name: "Parivartini Ekadashi", type: "ekadashi" },
  "08-28": { name: "Raksha Bandhan", type: "festival" },
  "09-04": { name: "Janmashtami", type: "festival" },
  "09-07": { name: "Indira Ekadashi", type: "ekadashi" },
  "09-11": { name: "Radhashtami", type: "festival" },
  "09-15": { name: "Ganesh Chaturthi", type: "festival" },
  "09-21": { name: "Papankusha Ekadashi", type: "ekadashi" },
  "10-06": { name: "Rama Ekadashi", type: "ekadashi" },
  "10-20": { name: "Dussehra", type: "festival" },
  "11-08": { name: "Diwali", type: "festival" },
  "11-10": { name: "Govardhan Puja", type: "festival" },
  "11-20": { name: "Devutthana / Prabodhini Ekadashi", type: "ekadashi" },
  "11-24": { name: "Guru Nanak Jayanti", type: "festival" },
  "12-05": { name: "Utpanna Ekadashi", type: "ekadashi" },
  "12-20": { name: "Mokshada Ekadashi / Gita Jayanti", type: "ekadashi" },
  "12-25": { name: "Christmas", type: "festival" },
}

// Returns the holiday for a given month+day, or null
// e.g. getHoliday(5, 28) → { name: "Nirjala Ekadashi", type: "ekadashi" }
export function getHoliday(month, day) {
  const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  return HOLIDAYS[key] || null
}

// Returns all holidays in a given month as an array
// e.g. getHolidaysForMonth(9) → [ { day: 4, name: "Janmashtami", type: "festival" }, ... ]
export function getHolidaysForMonth(month) {
  return Object.entries(HOLIDAYS)
    .filter(([key]) => key.startsWith(String(month).padStart(2, "0")))
    .map(([key, val]) => ({
      day: parseInt(key.split("-")[1]),
      ...val,
    }))
    .sort((a, b) => a.day - b.day)
}
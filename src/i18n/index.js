import { createI18n } from "vue-i18n";

function loadLocaleMessages() {
  const messages = { en: {}, ar: {} };

  // Load Arabic files
  const arabicLocales = import.meta.glob("./locales/ar/*.json", {
    eager: true,
  });
  for (const path in arabicLocales) {
    const matched = path.match(/([A-Za-z0-9-_]+)\.json$/i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages["ar"][locale] = arabicLocales[path];
    }
  }

  // Load English files
  const englishLocales = import.meta.glob("./locales/en/*.json", {
    eager: true,
  });
  for (const path in englishLocales) {
    const matched = path.match(/([A-Za-z0-9-_]+)\.json$/i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages["en"][locale] = englishLocales[path];
    }
  }

  return messages;
}

const messages = loadLocaleMessages();

export const i18n = createI18n({
  locale: localStorage.getItem("current_language") || "en", // default locale
  fallbackLocale: "en", // fallback locale
  messages, // dynamically loaded messages
});

import React, { createContext, useContext, useState } from 'react';
import en from './en.json';
import ru from './ru.json';
import {
  Locale,
  Messages,
  LocalizationContextProps,
  LocalizationProviderProps,
} from '../../models/localization';

const LocalizationContext = createContext<LocalizationContextProps>({
  locale: 'en',
  messages: { en: {}, ru: {} },
  changeLocale: () => {},
});

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
}) => {
  const [locale, setLocale] = useState<Locale>('en');
  const messages: Record<Locale, Messages> = { en, ru };

  const changeLocale = (newLocale: Locale): void => {
    setLocale(newLocale);
  };

  return (
    <LocalizationContext.Provider value={{ locale, messages, changeLocale }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextProps => {
  return useContext(LocalizationContext);
};

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { defaultBaskets, mergeBasketCatalog } from '../data/baskets';

const STORAGE_USER = 'an_basket_user';
const STORAGE_UNLOCKED = 'an_basket_unlocked';
const STORAGE_PREMIUM = 'an_basket_premium';
const STORAGE_GOALS = 'an_basket_goals';
const STORAGE_RISK = 'an_basket_risk_profile';
const STORAGE_ADMIN = 'an_basket_admin_catalog';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const BasketUserContext = createContext(null);

export function BasketUserProvider({ children }) {
  const [user, setUser] = useState(() => readJson(STORAGE_USER, null));
  const [unlockedIds, setUnlockedIds] = useState(() => readJson(STORAGE_UNLOCKED, []));
  const [premium, setPremium] = useState(() => localStorage.getItem(STORAGE_PREMIUM) === '1');
  const [goals, setGoals] = useState(() => readJson(STORAGE_GOALS, []));
  const [riskProfile, setRiskProfile] = useState(() => readJson(STORAGE_RISK, null));
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('an_basket_theme') === 'dark');
  const [adminOverrides, setAdminOverrides] = useState(() => readJson(STORAGE_ADMIN, []));

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_USER);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_UNLOCKED, JSON.stringify(unlockedIds));
  }, [unlockedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREMIUM, premium ? '1' : '0');
  }, [premium]);

  useEffect(() => {
    localStorage.setItem(STORAGE_GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (riskProfile) localStorage.setItem(STORAGE_RISK, JSON.stringify(riskProfile));
    else localStorage.removeItem(STORAGE_RISK);
  }, [riskProfile]);

  useEffect(() => {
    localStorage.setItem('an_basket_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ADMIN, JSON.stringify(adminOverrides));
  }, [adminOverrides]);

  const catalog = useMemo(
    () => mergeBasketCatalog(defaultBaskets, adminOverrides),
    [adminOverrides]
  );

  const hasAccess = useCallback(
    (basketId) => premium || unlockedIds.includes(basketId),
    [premium, unlockedIds]
  );

  const unlockBasket = useCallback((basketId) => {
    setUnlockedIds((prev) => (prev.includes(basketId) ? prev : [...prev, basketId]));
  }, []);

  const setAdminCatalogPatch = useCallback((patches) => {
    setAdminOverrides(Array.isArray(patches) ? patches : []);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      unlockedIds,
      premium,
      setPremium,
      unlockBasket,
      hasAccess,
      goals,
      setGoals,
      riskProfile,
      setRiskProfile,
      darkMode,
      setDarkMode,
      catalog,
      adminOverrides,
      setAdminCatalogPatch,
    }),
    [
      user,
      unlockedIds,
      premium,
      unlockBasket,
      hasAccess,
      goals,
      riskProfile,
      darkMode,
      catalog,
      adminOverrides,
      setAdminCatalogPatch,
    ]
  );

  return (
    <BasketUserContext.Provider value={value}>{children}</BasketUserContext.Provider>
  );
}

export function useBasketUser() {
  const ctx = useContext(BasketUserContext);
  if (!ctx) throw new Error('useBasketUser must be used within BasketUserProvider');
  return ctx;
}

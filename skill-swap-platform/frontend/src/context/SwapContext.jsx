import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchSkillsRequest, createSkillRequest } from '../api/skillsAPI';
import { fetchSwapsRequest, createSwapRequest, updateSwapStatusRequest } from '../api/swapsAPI';

const SwapContext = createContext(null);

export const SwapProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [swaps, setSwaps] = useState([]);

  const loadSkills = useCallback(async () => {
    try {
      const res = await fetchSkillsRequest({
        search: searchQuery || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      });
      setSkills(res.data.skills);
    } catch (err) {
      console.error('فشل تحميل المهارات:', err.message);
    }
  }, [searchQuery, selectedCategory]);

  const loadSwaps = useCallback(async () => {
    if (!isAuthenticated) {
      setSwaps([]);
      return;
    }
    try {
      const res = await fetchSwapsRequest();
      setSwaps(res.data.swaps);
    } catch (err) {
      console.error('فشل تحميل طلبات التبادل:', err.message);
    }
  }, [isAuthenticated]);

  // Skills are public: load on mount and whenever search/filter changes.
  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  // Swaps require auth: (re)load whenever login state changes.
  useEffect(() => {
    loadSwaps();
  }, [loadSwaps]);

  const addSkill = async (skillData) => {
    try {
      const res = await createSkillRequest(skillData);
      setSkills((prev) => [res.data.skill, ...prev]);
      return { success: true };
    } catch (err) {
      console.error('فشل إضافة المهارة:', err.message);
      return { success: false, message: err.message };
    }
  };

  // Kept for compatibility with SwapModal, which proposes a swap against a target skill.
  const requestSwap = async ({ skillId, offeredSkill, requestedSkill }) => {
    try {
      const res = await createSwapRequest({ skillId, offeredSkill, requestedSkill });
      setSwaps((prev) => [res.data.swap, ...prev]);
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateSwapStatus = async (id, status) => {
    try {
      const res = await updateSwapStatusRequest(id, status);
      setSwaps((prev) => prev.map((s) => (s.id === id || s._id === id ? res.data.swap : s)));
      return { success: true };
    } catch (err) {
      console.error('فشل تحديث حالة الطلب:', err.message);
      return { success: false, message: err.message };
    }
  };

  return (
    <SwapContext.Provider
      value={{
        skills,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addSkill,
        swaps,
        requestSwap,
        updateSwapStatus
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};

export const useSwap = () => {
  const ctx = useContext(SwapContext);
  if (!ctx) throw new Error('useSwap must be used within a SwapProvider');
  return ctx;
};

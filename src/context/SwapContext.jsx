import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const SwapContext = createContext();

export const SwapProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [skills, setSkills] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingSwaps, setLoadingSwaps] = useState(false);

  // Fetch skills from API based on search and category filters
  const fetchSkills = useCallback(async () => {
    setLoadingSkills(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;

      const { data } = await api.get('/skills', { params });
      if (data.success) {
        setSkills(data.skills || []);
      }
    } catch (err) {
      console.error('Fetch skills error:', err);
    } finally {
      setLoadingSkills(false);
    }
  }, [searchQuery, selectedCategory]);

  // Fetch swaps from API for current authenticated user
  const fetchSwaps = useCallback(async () => {
    if (!isLoggedIn) {
      setSwaps([]);
      return;
    }
    setLoadingSwaps(true);
    try {
      const { data } = await api.get('/swaps');
      if (data.success) {
        setSwaps(data.swaps || []);
      }
    } catch (err) {
      console.error('Fetch swaps error:', err);
    } finally {
      setLoadingSwaps(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSwaps();
    }
  }, [isLoggedIn, fetchSwaps]);

  const addSkill = async (skillData) => {
    try {
      const payload = {
        title: skillData.title,
        category: skillData.category || 'tech',
        wants: skillData.wants,
        icon: skillData.icon || '💡'
      };

      const { data } = await api.post('/skills', payload);
      if (data.success) {
        await fetchSkills();
        return { success: true, message: data.message || 'تمت إضافة المهارة بنجاح' };
      }
      return { success: false, message: data.message || 'فشل إضافة المهارة' };
    } catch (err) {
      const message = err.response?.data?.message || 'تعذر إضافة المهارة';
      return { success: false, message };
    }
  };

  const proposeSwap = async (targetSkill, offeredSkillTitle) => {
    try {
      const skillId = targetSkill._id || targetSkill.id;
      const requestedSkill = targetSkill.title;

      const { data } = await api.post('/swaps', {
        skillId,
        offeredSkill: offeredSkillTitle,
        requestedSkill
      });

      if (data.success) {
        await fetchSwaps();
        return {
          success: true,
          message: data.message || `تم إرسال طلب التبادل بنجاح!`
        };
      }
      return { success: false, message: data.message || 'فشل إرسال طلب التبادل' };
    } catch (err) {
      const message = err.response?.data?.message || 'تعذر إرسال طلب التبادل';
      return { success: false, message };
    }
  };

  const updateSwapStatus = async (swapId, newStatus) => {
    try {
      const { data } = await api.patch(`/swaps/${swapId}`, { status: newStatus });
      if (data.success) {
        await fetchSwaps();
        return { success: true, message: data.message || 'تم تحديث حالة الطلب' };
      }
      return { success: false, message: data.message || 'فشل تحديث الحالة' };
    } catch (err) {
      const message = err.response?.data?.message || 'تعذر تحديث حالة الطلب';
      return { success: false, message };
    }
  };

  return (
    <SwapContext.Provider
      value={{
        skills,
        swaps,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        loadingSkills,
        loadingSwaps,
        fetchSkills,
        fetchSwaps,
        addSkill,
        proposeSwap,
        updateSwapStatus
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};

export const useSwap = () => useContext(SwapContext);

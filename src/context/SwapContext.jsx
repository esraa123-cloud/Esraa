import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_SKILLS, INITIAL_SWAPS } from '../data/initialData';
import { useAuth } from './AuthContext';

const SwapContext = createContext();

export const SwapProvider = ({ children }) => {
  const { currentUser, isLoggedIn } = useAuth();

  const [allSkills, setAllSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('mahara_skills');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved skills:', e);
    }
    return INITIAL_SKILLS;
  });

  const [swaps, setSwaps] = useState(() => {
    try {
      const saved = localStorage.getItem('mahara_swaps');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved swaps:', e);
    }
    return INITIAL_SWAPS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingSwaps, setLoadingSwaps] = useState(false);

  useEffect(() => {
    localStorage.setItem('mahara_skills', JSON.stringify(allSkills));
  }, [allSkills]);

  useEffect(() => {
    localStorage.setItem('mahara_swaps', JSON.stringify(swaps));
  }, [swaps]);

  // Filter skills based on search query and category
  const skills = allSkills.filter(skill => {
    const matchesSearch = !searchQuery.trim() ||
      skill.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (skill.wants && skill.wants.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
      (skill.owner && skill.owner.toLowerCase().includes(searchQuery.toLowerCase().trim()));

    const matchesCategory = !selectedCategory || selectedCategory === 'all' || skill.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const fetchSkills = useCallback(async () => {
    // Client-side instant sync
  }, []);

  const fetchSwaps = useCallback(async () => {
    // Client-side instant sync
  }, []);

  const addSkill = async (skillData) => {
    const ownerName = currentUser ? currentUser.name : 'نور صلاح';
    const newSkill = {
      id: 'skill_' + Date.now(),
      _id: 'skill_' + Date.now(),
      title: skillData.title,
      category: skillData.category || 'tech',
      icon: skillData.icon || '💡',
      owner: ownerName,
      location: currentUser?.location || 'مصر',
      wants: skillData.wants || 'تبادل خبرات',
      rating: 5.0,
      bg: 'linear-gradient(135deg, #1a2540, #0f1a30)'
    };

    setAllSkills(prev => [newSkill, ...prev]);
    return { success: true, message: 'تمت إضافة المهارة بنجاح' };
  };

  const proposeSwap = async (targetSkill, offeredSkillTitle) => {
    const proposerName = currentUser ? currentUser.name : 'نور صلاح';
    const receiverName = targetSkill.owner || 'إسراء صلاح';

    const newSwap = {
      id: 'swap_' + Date.now(),
      _id: 'swap_' + Date.now(),
      proposer: proposerName,
      receiver: receiverName,
      offeredSkill: offeredSkillTitle,
      requestedSkill: targetSkill.title,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    setSwaps(prev => [newSwap, ...prev]);
    return { success: true, message: 'تم إرسال طلب التبادل بنجاح!' };
  };

  const updateSwapStatus = async (swapId, newStatus) => {
    setSwaps(prev => prev.map(s => (s.id === swapId || s._id === swapId) ? { ...s, status: newStatus } : s));
    return { success: true, message: 'تم تحديث حالة الطلب' };
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

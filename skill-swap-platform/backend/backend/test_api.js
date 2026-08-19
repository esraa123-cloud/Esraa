const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testBackend() {
  console.log('--- STARTING BACKEND INTEGRATION TEST SUITE ---');

  try {
    // 1. Health check
    console.log('Testing /api/health...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✓ Health Check OK:', health.data);

    // 2. Register new user
    const testUser = {
      fname: 'اختبار',
      lname: 'مستخدم',
      username: 'test_user_' + Date.now(),
      email: `test_${Date.now()}@mahara.io`,
      password: 'Password123!',
      cpassword: 'Password123!',
      job: 'مطور برمجيات',
      country: 'مصر',
      skillsTeach: ['تطوير Node.js'],
      skillsLearn: ['تصميم الجرافيك']
    };

    console.log('Testing /api/auth/register...');
    const regRes = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('✓ Register OK:', regRes.data.message, 'User ID:', regRes.data.user.id);
    const token = regRes.data.token;

    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 3. Login
    console.log('Testing /api/auth/login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✓ Login OK:', loginRes.data.message);

    // 4. Authenticated profile check
    console.log('Testing /api/auth/me...');
    const meRes = await axios.get(`${API_URL}/auth/me`, authHeaders);
    console.log('✓ Get Me OK:', meRes.data.user.name);

    // 5. Update Profile
    console.log('Testing /api/users/profile update...');
    const updateRes = await axios.put(`${API_URL}/users/profile`, { bio: 'نبذة شخصية محدثة للاختبار' }, authHeaders);
    console.log('✓ Profile Update OK:', updateRes.data.user.bio);

    // 6. Skills listing
    console.log('Testing /api/skills...');
    const skillsRes = await axios.get(`${API_URL}/skills`);
    console.log(`✓ Skills List OK: Found ${skillsRes.data.count} skills`);

    // 7. Add new skill
    console.log('Testing /api/skills creation...');
    const addSkillRes = await axios.post(`${API_URL}/skills`, {
      title: 'تطوير تطبيقات Express.js',
      category: 'tech',
      wants: 'تعلم تسويق المحتوى',
      icon: '💻'
    }, authHeaders);
    console.log('✓ Add Skill OK:', addSkillRes.data.skill.title);

    // 8. Swap request creation
    if (skillsRes.data.skills.length > 0) {
      const targetSkill = skillsRes.data.skills[0];
      console.log('Testing /api/swaps creation...');
      const swapRes = await axios.post(`${API_URL}/swaps`, {
        skillId: targetSkill.id || targetSkill._id,
        offeredSkill: 'تطوير Node.js',
        requestedSkill: targetSkill.title
      }, authHeaders);
      console.log('✓ Create Swap Request OK:', swapRes.data.message);

      const swapId = swapRes.data.swap.id || swapRes.data.swap._id;

      // 9. Get my swaps
      console.log('Testing /api/swaps list...');
      const mySwapsRes = await axios.get(`${API_URL}/swaps`, authHeaders);
      console.log(`✓ My Swaps OK: ${mySwapsRes.data.count} swaps found`);
    }

    // 10. Start Chat
    console.log('Testing /api/chats/start...');
    const startChatRes = await axios.post(`${API_URL}/chats/start`, {
      peerName: 'أحمد رضا'
    }, authHeaders);
    console.log('✓ Start Chat OK:', startChatRes.data.chat.peerName);

    const chatId = startChatRes.data.chat.id || startChatRes.data.chat._id;

    // 11. Send Message
    console.log('Testing /api/chats/:id/messages...');
    const sendMsgRes = await axios.post(`${API_URL}/chats/${chatId}/messages`, {
      text: 'مرحباً، هذه رسالة تجريبية لاختبار الشات'
    }, authHeaders);
    console.log('✓ Send Message OK:', sendMsgRes.data.chat.messages.length, 'messages in chat');

    // 12. Logout
    console.log('Testing /api/auth/logout...');
    const logoutRes = await axios.post(`${API_URL}/auth/logout`, {}, authHeaders);
    console.log('✓ Logout OK:', logoutRes.data.message);

    console.log('=== ALL BACKEND API TESTS PASSED SUCCESSFULLY! 🎉 ===');
  } catch (err) {
    console.error('❌ BACKEND TEST ERROR:', err.response?.data || err.message);
  }
}

testBackend();

export const TEAM_MEMBERS = [
  
];

export const INITIAL_SKILLS = [
  { id: '1', title: 'تطوير مواقع ويب – React', category: 'tech', icon: '💻', owner: 'أحمد رضا', location: 'القاهرة', wants: 'تصميم UI', rating: 5, bg: 'linear-gradient(135deg, #1a2540, #0f1a30)' },
  { id: '2', title: 'تصميم جرافيك احترافي', category: 'design', icon: '🎨', owner: 'سارة منصور', location: 'الرياض', wants: 'محاسبة', rating: 4.8, bg: 'linear-gradient(135deg, #1a1f30, #121830)' },
  { id: '3', title: 'اللغة الإسبانية – محادثة', category: 'languages', icon: '🌍', owner: 'محمد العتيبي', location: 'دبي', wants: 'تطوير بايثون', rating: 5, bg: 'linear-gradient(135deg, #241e12, #18140c)' },
  { id: '4', title: 'تصوير المنتجات والفيديو', category: 'photo', icon: '📸', owner: 'مريم السيد', location: 'الإسكندرية', wants: 'تسويق رقمي', rating: 4.9, bg: 'linear-gradient(135deg, #102420, #0c1815)' },
  { id: '5', title: 'إدارة الحملات الإعلانية', category: 'business', icon: '📊', owner: 'عمر خالد', location: 'عمان', wants: 'تصميم هوية', rating: 4.7, bg: 'linear-gradient(135deg, #241420, #180d16)' },
  { id: '6', title: 'العزف على البيانو للمبتدئين', category: 'music', icon: '🎵', owner: 'نور الدين', location: 'تونس', wants: 'لغة إنجليزية', rating: 5, bg: 'linear-gradient(135deg, #1b202e, #11141e)' }
];

export const INITIAL_USERS = [
  {
    id: 'u1',
    name: 'أحمد رضا',
    username: 'ahmed_react',
    title: 'مطور ويب متخصص React',
    location: 'مصر - القاهرة',
    avatar: 'أ ر',
    bio: 'شغوف بتطوير واجهات المستخدم التفاعلية وصناعة تجارب رقمية ممتازة.',
    skillsTeach: ['تطوير React', 'JavaScript', 'HTML/CSS'],
    skillsLearn: ['تصميم UI/UX', 'Figma', 'إدارة المشاريع'],
    rating: 4.9,
    swapsCompleted: 12
  },
  {
    id: 'u2',
    name: 'إسراء صلاح',
    username: 'esraa_nova',
    title: 'مهندسة برمجيات وواجهات',
    location: 'مصر - الجيزة',
    avatar: 'إ ص',
    bio: 'عضو فريق Codex_Nova المطور لمنصة مهارة. أحب البرمجة وتبادل الخبرات المعرفية.',
    skillsTeach: ['تطوير الويب', 'تصميم واجهات', 'حل المشكلات'],
    skillsLearn: ['ذكاء اصطناعي', 'تطوير تطبيقات الجوال'],
    rating: 5.0,
    swapsCompleted: 18
  },
  {
    id: 'u3',
    name: 'سارة منصور',
    username: 'sara_design',
    title: 'مصممة جرافيك وهويات بصرية',
    location: 'السعودية - الرياض',
    avatar: 'س م',
    bio: 'خبرة 5 سنوات في تصميم الشعارات وتصميم الهويات البصرية للشركات الناشئة.',
    skillsTeach: ['تصميم جرافيك', 'Photoshop', 'Illustrator'],
    skillsLearn: ['محاسبة', 'إدارة الأعمال'],
    rating: 4.8,
    swapsCompleted: 9
  }
];

export const INITIAL_CHATS = [
  {
    id: 'c1',
    peerId: 'u2',
    peerName: 'إسراء صلاح',
    peerAvatar: 'إ ص',
    active: true,
    messages: [
      { id: 'm1', sender: 'peer', text: 'أهلاً بك! شاهدت مهاراتك في تطوير الويب، يسعدني التبادل معك.', time: '10:15 م' },
      { id: 'm2', sender: 'me', text: 'السلام عليكم إسراء، يسعدني جداً ذلك! ما هي المهارات التي تودين تعلمها؟', time: '10:20 م' },
      { id: 'm3', sender: 'peer', text: 'أريد تعميق معرفتي بـ React hooks وState Management، مقابل تعليمك أساسيات تصميم UI.', time: '10:25 م' }
    ]
  },
  {
    id: 'c2',
    peerId: 'u3',
    peerName: 'سارة منصور',
    peerAvatar: 'س م',
    active: false,
    messages: [
      { id: 'm1', sender: 'peer', text: 'مرحباً! هل أنت متاح لتبادل مهارات التصميم مع المحاسبة؟', time: 'أمس' }
    ]
  }
];

export const INITIAL_SWAPS = [
  {
    id: 's1',
    proposer: 'أحمد رضا',
    receiver: 'إسراء صلاح',
    offeredSkill: 'تطوير React',
    requestedSkill: 'تصميم UI/UX',
    status: 'accepted',
    date: '2026-08-14'
  },
  {
    id: 's2',
    proposer: 'سارة منصور',
    receiver: 'أحمد رضا',
    offeredSkill: 'تصميم جرافيك',
    requestedSkill: 'تطوير HTML/CSS',
    status: 'pending',
    date: '2026-08-16'
  }
];

export interface StudyMaterial {
  date: string;
  videoSrc: string;
  videoPoster: string;
  audioSrc: string;
  title: string;
  originalText: string;
  translatedText: string;
}

// 9个音频材料，按日期分配（Day 1-9）
const MATERIALS: StudyMaterial[] = [
  {
    date: 'day1',
    videoSrc: '',
    videoPoster: '/jungle-bg-layer-2.jpg',
    audioSrc: 'http://tepu24pni.hn-bkt.clouddn.com/11_%E8%B0%83%E8%A7%A3%E5%85%B3%E7%B3%BB_1m00s_to_2m40s.mp3',
    title: '调解关系',
    originalText: `When two people have a disagreement, finding a middle ground is essential. A good mediator listens to both sides without taking sides. They help each person understand the other's perspective. Today we explore how to mediate conflicts in relationships and reach a peaceful resolution.`,
    translatedText: '当两个人有分歧时，找到中间立场至关重要。一个好的调解员倾听双方而不偏袒。他们帮助每个人理解对方的观点。今天我们探讨如何在关系中调解冲突并达成和平解决方案。',
  },
  {
    date: 'day2',
    videoSrc: '',
    videoPoster: '/jungle-bg-layer-2.jpg',
    audioSrc: 'http://tepu24pni.hn-bkt.clouddn.com/13_%E5%9B%9E%E5%BF%86%E5%90%8C%E5%AD%A6_35s_to_2m40s.mp3',
    title: '回忆同学',
    originalText: `Looking back at our school days brings so many memories. The classmates we sat beside, the teachers we admired, and the moments we shared. Some friendships last a lifetime, while others fade with time. Today we reflect on those precious school memories.`,
    translatedText: '回顾我们的学生时代带来了许多回忆。坐在旁边的同学、敬佩的老师、分享的时刻。有些友谊持续一生，有些则随时间淡去。今天我们反思那些珍贵的校园回忆。',
  },
  {
    date: 'day3',
    videoSrc: '',
    videoPoster: '/jungle-bg-layer-2.jpg',
    audioSrc: 'http://tepu24pni.hn-bkt.clouddn.com/15_%E5%90%8C%E5%AD%A6%E7%9B%B8%E8%81%9A_35s_to_2m04s.mp3',
    title: '同学相聚',
    originalText: `Class reunions are always special occasions. Old friends gather to catch up on each other's lives. We laugh about the past and share our current journeys. It's amazing how time changes us, yet the bond remains strong. Today we talk about reuniting with old classmates.`,
    translatedText: '同学聚会总是特别的场合。老朋友聚在一起互相了解近况。我们笑谈过去，分享当下的旅程。时间如何改变我们令人惊讶，但纽带依然牢固。今天我们谈论与老同学重聚。',
  },
  {
    date: 'day4',
    videoSrc: '',
    videoPoster: '/jungle-bg-layer-2.jpg',
    audioSrc: 'http://tepu24pni.hn-bkt.clouddn.com/19_%E5%8F%98%E5%B0%8F%E8%81%AA%E6%98%8E_57s_to_2m10s.mp3',
    title: '变小聪明',
    originalText: `Being clever doesn't always mean being honest. Sometimes people use their wit to manipulate situations to their advantage. Today we discuss the difference between genuine intelligence and being a little too clever for your own good.`,
    translatedText: '聪明并不总是意味着诚实。有时人们用机智来操纵局面以谋取私利。今天我们讨论真正的智慧与过于小聪明之间的区别。',
  },
  {
    date: 'day5',
    videoSrc: '',
    videoPoster: '/jungle-bg-layer-2.jpg',
    audioSrc: 'http://tepu24pni.hn-bkt.clouddn.com/21_%E8%8D%B7%E5%B0%94%E8%92%99%E4%B9%B1%E6%92%9E_25s_to_1m42s.mp3',
    title: '荷尔蒙乱撞',
    originalText: `Hormones can make us do crazy things. When attraction hits, logic often goes out the window. Our hearts race, palms get sweaty, and we find ourselves acting out of character. Today we explore the chemistry of attraction and how hormones affect our behavior.`,
    translatedText: '荷尔蒙会让我们做疯狂的事。当吸引力来袭时，逻辑常常消失。心跳加速，手心出汗，我们发现自己行为失常。今天我们探索吸引力的化学反应以及荷尔蒙如何影响我们的行为。',
  },
  {
    date: 'day6',
    videoSrc: '',
    videoPoster: '/jungle-bg-layer-2.jpg',
    audioSrc: 'http://tepu24pni.hn-bkt.clouddn.com/23_%E6%81%8B%E7%88%B1%E7%9A%84%E4%B8%8D%E5%90%8C%E9%98%B6%E6%AE%B5_25s_to_1m28s.mp3',
    title: '恋爱的不同阶段',
    originalText: `Every relationship goes through stages. The initial excitement, the comfortable routine, and the deep commitment. Each phase has its own challenges and rewards. Understanding these stages helps us navigate love more wisely. Today we talk about the different stages of romance.`,
    translatedText: '每段关系都经历阶段。最初的兴奋、舒适的日常、深刻的承诺。每个阶段都有自己的挑战和回报。理解这些阶段帮助我们更明智地驾驭爱情。今天我们谈论浪漫的不同阶段。',
  },
  {
    date: 'day7',
    videoSrc: '',
    videoPoster: '/jungle-bg-layer-2.jpg',
    audioSrc: 'http://tepu24pni.hn-bkt.clouddn.com/25_%E6%B5%AA%E6%BC%AB%E6%99%9A%E9%A4%90_49s_to_2m18s.mp3',
    title: '浪漫晚餐',
    originalText: `A romantic dinner sets the perfect mood for connection. Good food, soft lighting, and meaningful conversation create an intimate atmosphere. It's not about the expensive restaurant, but the quality time spent together. Today we discuss what makes a dinner truly romantic.`,
    translatedText: '浪漫晚餐为连接营造了完美的氛围。美食、柔和的灯光和有意义的对话创造了亲密的氛围。关键不在于昂贵的餐厅，而在于共度的优质时光。今天我们讨论什么让一顿晚餐真正浪漫。',
  },
  {
    date: 'day8',
    videoSrc: '',
    videoPoster: '/jungle-bg-layer-2.jpg',
    audioSrc: 'http://tepu24pni.hn-bkt.clouddn.com/27_%E4%BA%89%E5%90%B5%E4%B8%8D%E5%88%86%E5%9C%B0%E6%96%B9_24s_to_2m05s.mp3',
    title: '争吵不分地方',
    originalText: `Arguments can happen anywhere, not just at home. In public, at work, or even on vacation, emotions can escalate quickly. Learning to control our temper in any setting is a valuable skill. Today we explore how to handle disagreements gracefully, no matter where we are.`,
    translatedText: '争吵可能发生在任何地方，不仅限于家里。在公共场合、工作中，甚至度假时，情绪都可能迅速升级。学会在任何环境中控制脾气是一项宝贵的技能。今天我们探索如何在任何地方优雅地处理分歧。',
  },
  {
    date: 'day9',
    videoSrc: '',
    videoPoster: '/jungle-bg-layer-2.jpg',
    audioSrc: 'http://tepu24pni.hn-bkt.clouddn.com/29_%E5%80%9F%E9%A2%98%E5%8F%91%E6%8C%A5_43s_to_2m10s.mp3',
    title: '借题发挥',
    originalText: `Sometimes in conversations, people bring up unrelated topics to make their point. It's a skill to steer the discussion while staying relevant. Today we explore how speakers use this technique naturally. Notice how they connect personal stories to broader themes.`,
    translatedText: '有时在对话中，人们会引入不相关的话题来表达观点。这是一种在保持相关性的同时引导讨论的技巧。今天我们探讨演讲者如何自然地使用这种技巧。注意他们如何将个人故事与更广泛的主题联系起来。',
  },
];

// 根据日期获取材料（9个材料循环）
// 每天对应不同材料，循环往复
export function getMaterialForDate(dateStr: string): StudyMaterial {
  const date = new Date(dateStr + 'T00:00:00');
  // 用时间戳对9取模，保证同一天永远拿到同一材料
  const dayTimestamp = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const index = dayTimestamp % 9;
  return MATERIALS[index];
}

// 获取所有材料
export function getAllMaterials(): StudyMaterial[] {
  return MATERIALS;
}

// 根据索引获取材料
export function getMaterialByIndex(index: number): StudyMaterial {
  return MATERIALS[index % 9];
}

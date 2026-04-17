require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const User = require('./models/User')
const Webmix = require('./models/Webmix')

const publicWebmixes = [
  {
    name: 'Business Tools',
    icon: '💼',
    color: '#3F8ECF',
    description: 'Essential business tools for productivity, communication, and project management.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
    tags: ['Business', 'Productivity', 'Tools'],
    tiles: [],
  },
  {
    name: 'Artificial Intelligence Tools',
    icon: '🤖',
    color: '#7B5EA7',
    description: 'Top AI tools including ChatGPT, Midjourney, Claude, and more for creative and productive work.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80',
    tags: ['AI', 'Technology', 'Tools'],
    tiles: [],
  },
  {
    name: 'World News',
    icon: '🌍',
    color: '#1a1a2e',
    description: 'Stay informed with top news sources from around the globe.',
    coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168d8c?w=400&q=80',
    tags: ['News', 'World', 'Current Events'],
    tiles: [],
  },
  {
    name: 'Education',
    icon: '📚',
    color: '#E8842A',
    description: 'The best online learning tools including resources for Math, ELA, Science, Social Studies, Coding and more.',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
    tags: ['Education', 'Learning', 'School'],
    tiles: [],
  },
  {
    name: 'Discovery Zone',
    icon: '🔍',
    color: '#4CAF50',
    description: 'Discover fun animals through fun webmixes containing fun information, images and videos for kids.',
    coverImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80',
    tags: ['Kids', 'Discovery', 'Fun'],
    tiles: [],
  },
  {
    name: 'Social Media Hub',
    icon: '📱',
    color: '#FF6B6B',
    description: 'All your social media platforms in one place — Facebook, Twitter, Instagram, TikTok, and more.',
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80',
    tags: ['Social', 'Media', 'Communication'],
    tiles: [],
  },
  {
    name: 'Coding & Development',
    icon: '💻',
    color: '#28C76F',
    description: 'Essential development tools, documentation, and resources for programmers.',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
    tags: ['Coding', 'Development', 'Programming'],
    tiles: [],
  },
  {
    name: 'Health & Fitness',
    icon: '💪',
    color: '#FF9F43',
    description: 'Track your health, find workouts, nutrition plans, and wellness resources.',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    tags: ['Health', 'Fitness', 'Wellness'],
    tiles: [],
  },
  {
    name: 'Periodic Tables of History',
    icon: '📜',
    color: '#A0522D',
    description: 'Use this Webmix as a reference for Special History Months throughout the year.',
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400&q=80',
    tags: ['History', 'Reference', 'Education'],
    tiles: [],
  },
  {
    name: 'Streaming & Entertainment',
    icon: '🎬',
    color: '#EA5455',
    description: 'Netflix, YouTube, Spotify, Disney+, and all your streaming services in one place.',
    coverImage: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&q=80',
    tags: ['Entertainment', 'Streaming', 'Movies'],
    tiles: [],
  },
  {
    name: 'Finance & Investing',
    icon: '📈',
    color: '#00CFE8',
    description: 'Stock market tools, crypto exchanges, banking apps, and financial news.',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
    tags: ['Finance', 'Investing', 'Stocks'],
    tiles: [],
  },
  {
    name: 'Travel Planning',
    icon: '✈️',
    color: '#45B7D1',
    description: 'Plan your trips with flights, hotels, maps, reviews, and travel guides.',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80',
    tags: ['Travel', 'Planning', 'Vacation'],
    tiles: [],
  },
]

const seed = async () => {
  try {
    await connectDB()

    // Create or find a system user for public webmixes
    let systemUser = await User.findOne({ username: 'right360-system' })
    if (!systemUser) {
      systemUser = await User.create({
        username: 'right360-system',
        email: 'system@right360.com',
        passwordHash: 'system-' + Date.now(),
        role: 'admin',
      })
      console.log('📌 Created system user')
    }

    // Clear existing public webmixes
    await Webmix.deleteMany({ userId: systemUser._id })

    for (let i = 0; i < publicWebmixes.length; i++) {
      const wm = publicWebmixes[i]
      await Webmix.create({
        userId: systemUser._id,
        name: wm.name,
        slug: wm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: wm.icon,
        color: wm.color,
        description: wm.description,
        coverImage: wm.coverImage,
        tags: wm.tags,
        tiles: wm.tiles,
        isPublic: true,
        order: i,
      })
      console.log(`✅ Created: ${wm.name}`)
    }

    console.log(`\n🎉 Seeded ${publicWebmixes.length} public webmixes`)
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seed()

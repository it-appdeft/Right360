require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const Category = require('./models/Category')
const Tile = require('./models/Tile')

const categories = [
  { name: 'News', slug: 'news', icon: 'FaNewspaper', order: 0 },
  { name: 'Technology', slug: 'technology', icon: 'FaLaptop', order: 1 },
  { name: 'Sports', slug: 'sports', icon: 'FaFootballBall', order: 2 },
  { name: 'Entertainment', slug: 'entertainment', icon: 'FaFilm', order: 3 },
  { name: 'Finance', slug: 'finance', icon: 'FaChartLine', order: 4 },
  { name: 'Shopping', slug: 'shopping', icon: 'FaShoppingCart', order: 5 },
  { name: 'Social Media', slug: 'social-media', icon: 'FaHashtag', order: 6 },
  { name: 'Education', slug: 'education', icon: 'FaGraduationCap', order: 7 },
  { name: 'Health', slug: 'health', icon: 'FaHeartbeat', order: 8 },
  { name: 'Travel', slug: 'travel', icon: 'FaPlane', order: 9 },
]

const subcategories = {
  news: [
    { name: 'US News', slug: 'us-news', icon: 'FaFlag' },
    { name: 'World News', slug: 'world-news', icon: 'FaGlobe' },
    { name: 'Politics', slug: 'politics', icon: 'FaLandmark' },
  ],
  technology: [
    { name: 'Software', slug: 'software', icon: 'FaCode' },
    { name: 'Hardware', slug: 'hardware', icon: 'FaMicrochip' },
    { name: 'AI', slug: 'ai', icon: 'FaRobot' },
  ],
  sports: [
    { name: 'NFL', slug: 'nfl', icon: 'FaFootballBall' },
    { name: 'NBA', slug: 'nba', icon: 'FaBasketballBall' },
    { name: 'Soccer', slug: 'soccer', icon: 'FaFutbol' },
  ],
  entertainment: [
    { name: 'Movies', slug: 'movies', icon: 'FaVideo' },
    { name: 'Music', slug: 'music', icon: 'FaMusic' },
    { name: 'TV', slug: 'tv', icon: 'FaTv' },
  ],
  finance: [
    { name: 'Stocks', slug: 'stocks', icon: 'FaChartBar' },
    { name: 'Crypto', slug: 'crypto', icon: 'FaBitcoin' },
    { name: 'Banking', slug: 'banking', icon: 'FaUniversity' },
  ],
}

const tilesData = {
  news: [
    { title: 'CNN', url: 'https://www.cnn.com', logo: 'https://www.google.com/s2/favicons?domain=cnn.com&sz=64', subtitle: 'Breaking News', position: 0 },
    { title: 'Fox News', url: 'https://www.foxnews.com', logo: 'https://www.google.com/s2/favicons?domain=foxnews.com&sz=64', subtitle: 'US News', position: 1 },
    { title: 'BBC', url: 'https://www.bbc.com', logo: 'https://www.google.com/s2/favicons?domain=bbc.com&sz=64', subtitle: 'World News', position: 2 },
    { title: 'Reuters', url: 'https://www.reuters.com', logo: 'https://www.google.com/s2/favicons?domain=reuters.com&sz=64', subtitle: 'Global News Agency', position: 3 },
    { title: 'AP News', url: 'https://apnews.com', logo: 'https://www.google.com/s2/favicons?domain=apnews.com&sz=64', subtitle: 'Associated Press', position: 4 },
    { title: 'NBC News', url: 'https://www.nbcnews.com', logo: 'https://www.google.com/s2/favicons?domain=nbcnews.com&sz=64', subtitle: 'News & Video', position: 5 },
    { title: 'NPR', url: 'https://www.npr.org', logo: 'https://www.google.com/s2/favicons?domain=npr.org&sz=64', subtitle: 'Public Radio', position: 6 },
    { title: 'The Hill', url: 'https://thehill.com', logo: 'https://www.google.com/s2/favicons?domain=thehill.com&sz=64', subtitle: 'Political News', position: 7 },
    { title: 'New York Post', url: 'https://nypost.com', logo: 'https://www.google.com/s2/favicons?domain=nypost.com&sz=64', subtitle: 'Breaking News', position: 8 },
    { title: 'USA Today', url: 'https://www.usatoday.com', logo: 'https://www.google.com/s2/favicons?domain=usatoday.com&sz=64', subtitle: 'National News', position: 9 },
    { title: 'Newsmax', url: 'https://www.newsmax.com', logo: 'https://www.google.com/s2/favicons?domain=newsmax.com&sz=64', subtitle: 'Independent News', position: 10 },
    { title: 'Daily Wire', url: 'https://www.dailywire.com', logo: 'https://www.google.com/s2/favicons?domain=dailywire.com&sz=64', subtitle: 'Conservative News', position: 11 },
  ],
  technology: [
    { title: 'TechCrunch', url: 'https://techcrunch.com', logo: 'https://www.google.com/s2/favicons?domain=techcrunch.com&sz=64', subtitle: 'Startup News', position: 0 },
    { title: 'The Verge', url: 'https://www.theverge.com', logo: 'https://www.google.com/s2/favicons?domain=theverge.com&sz=64', subtitle: 'Tech & Science', position: 1 },
    { title: 'Wired', url: 'https://www.wired.com', logo: 'https://www.google.com/s2/favicons?domain=wired.com&sz=64', subtitle: 'Tech Culture', position: 2 },
    { title: 'Ars Technica', url: 'https://arstechnica.com', logo: 'https://www.google.com/s2/favicons?domain=arstechnica.com&sz=64', subtitle: 'Tech Analysis', position: 3 },
    { title: 'GitHub', url: 'https://github.com', logo: 'https://www.google.com/s2/favicons?domain=github.com&sz=64', subtitle: 'Code Platform', position: 4 },
    { title: 'Stack Overflow', url: 'https://stackoverflow.com', logo: 'https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=64', subtitle: 'Developer Q&A', position: 5 },
    { title: 'Hacker News', url: 'https://news.ycombinator.com', logo: 'https://www.google.com/s2/favicons?domain=news.ycombinator.com&sz=64', subtitle: 'Tech Forum', position: 6 },
    { title: 'CNET', url: 'https://www.cnet.com', logo: 'https://www.google.com/s2/favicons?domain=cnet.com&sz=64', subtitle: 'Tech Reviews', position: 7 },
    { title: 'Tom\'s Hardware', url: 'https://www.tomshardware.com', logo: 'https://www.google.com/s2/favicons?domain=tomshardware.com&sz=64', subtitle: 'Hardware Reviews', position: 8 },
    { title: 'Android Authority', url: 'https://www.androidauthority.com', logo: 'https://www.google.com/s2/favicons?domain=androidauthority.com&sz=64', subtitle: 'Android News', position: 9 },
    { title: 'Apple', url: 'https://www.apple.com', logo: 'https://www.google.com/s2/favicons?domain=apple.com&sz=64', subtitle: 'Apple Inc.', position: 10 },
    { title: 'Microsoft', url: 'https://www.microsoft.com', logo: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=64', subtitle: 'Software & Cloud', position: 11 },
  ],
  sports: [
    { title: 'ESPN', url: 'https://www.espn.com', logo: 'https://www.google.com/s2/favicons?domain=espn.com&sz=64', subtitle: 'Sports Network', position: 0 },
    { title: 'NFL', url: 'https://www.nfl.com', logo: 'https://www.google.com/s2/favicons?domain=nfl.com&sz=64', subtitle: 'Football', position: 1 },
    { title: 'NBA', url: 'https://www.nba.com', logo: 'https://www.google.com/s2/favicons?domain=nba.com&sz=64', subtitle: 'Basketball', position: 2 },
    { title: 'MLB', url: 'https://www.mlb.com', logo: 'https://www.google.com/s2/favicons?domain=mlb.com&sz=64', subtitle: 'Baseball', position: 3 },
    { title: 'FIFA', url: 'https://www.fifa.com', logo: 'https://www.google.com/s2/favicons?domain=fifa.com&sz=64', subtitle: 'World Football', position: 4 },
    { title: 'Yahoo Sports', url: 'https://sports.yahoo.com', logo: 'https://www.google.com/s2/favicons?domain=sports.yahoo.com&sz=64', subtitle: 'Scores & News', position: 5 },
    { title: 'Bleacher Report', url: 'https://bleacherreport.com', logo: 'https://www.google.com/s2/favicons?domain=bleacherreport.com&sz=64', subtitle: 'Sports Media', position: 6 },
    { title: 'CBS Sports', url: 'https://www.cbssports.com', logo: 'https://www.google.com/s2/favicons?domain=cbssports.com&sz=64', subtitle: 'Live Scores', position: 7 },
  ],
  entertainment: [
    { title: 'YouTube', url: 'https://www.youtube.com', logo: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64', subtitle: 'Video Platform', position: 0 },
    { title: 'Netflix', url: 'https://www.netflix.com', logo: 'https://www.google.com/s2/favicons?domain=netflix.com&sz=64', subtitle: 'Streaming', position: 1 },
    { title: 'Spotify', url: 'https://www.spotify.com', logo: 'https://www.google.com/s2/favicons?domain=spotify.com&sz=64', subtitle: 'Music Streaming', position: 2 },
    { title: 'Disney+', url: 'https://www.disneyplus.com', logo: 'https://www.google.com/s2/favicons?domain=disneyplus.com&sz=64', subtitle: 'Streaming', position: 3 },
    { title: 'IMDb', url: 'https://www.imdb.com', logo: 'https://www.google.com/s2/favicons?domain=imdb.com&sz=64', subtitle: 'Movie Database', position: 4 },
    { title: 'Twitch', url: 'https://www.twitch.tv', logo: 'https://www.google.com/s2/favicons?domain=twitch.tv&sz=64', subtitle: 'Live Streaming', position: 5 },
    { title: 'Rotten Tomatoes', url: 'https://www.rottentomatoes.com', logo: 'https://www.google.com/s2/favicons?domain=rottentomatoes.com&sz=64', subtitle: 'Movie Reviews', position: 6 },
    { title: 'SoundCloud', url: 'https://soundcloud.com', logo: 'https://www.google.com/s2/favicons?domain=soundcloud.com&sz=64', subtitle: 'Music Platform', position: 7 },
  ],
  finance: [
    { title: 'Yahoo Finance', url: 'https://finance.yahoo.com', logo: 'https://www.google.com/s2/favicons?domain=finance.yahoo.com&sz=64', subtitle: 'Stock Market', position: 0 },
    { title: 'Bloomberg', url: 'https://www.bloomberg.com', logo: 'https://www.google.com/s2/favicons?domain=bloomberg.com&sz=64', subtitle: 'Financial News', position: 1 },
    { title: 'CNBC', url: 'https://www.cnbc.com', logo: 'https://www.google.com/s2/favicons?domain=cnbc.com&sz=64', subtitle: 'Business News', position: 2 },
    { title: 'MarketWatch', url: 'https://www.marketwatch.com', logo: 'https://www.google.com/s2/favicons?domain=marketwatch.com&sz=64', subtitle: 'Market Data', position: 3 },
    { title: 'Coinbase', url: 'https://www.coinbase.com', logo: 'https://www.google.com/s2/favicons?domain=coinbase.com&sz=64', subtitle: 'Crypto Exchange', position: 4 },
    { title: 'Investopedia', url: 'https://www.investopedia.com', logo: 'https://www.google.com/s2/favicons?domain=investopedia.com&sz=64', subtitle: 'Financial Education', position: 5 },
    { title: 'Forbes', url: 'https://www.forbes.com', logo: 'https://www.google.com/s2/favicons?domain=forbes.com&sz=64', subtitle: 'Business Magazine', position: 6 },
    { title: 'Wall Street Journal', url: 'https://www.wsj.com', logo: 'https://www.google.com/s2/favicons?domain=wsj.com&sz=64', subtitle: 'Financial News', position: 7 },
  ],
  shopping: [
    { title: 'Amazon', url: 'https://www.amazon.com', logo: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=64', subtitle: 'Online Shopping', position: 0 },
    { title: 'eBay', url: 'https://www.ebay.com', logo: 'https://www.google.com/s2/favicons?domain=ebay.com&sz=64', subtitle: 'Auction & Buy', position: 1 },
    { title: 'Walmart', url: 'https://www.walmart.com', logo: 'https://www.google.com/s2/favicons?domain=walmart.com&sz=64', subtitle: 'Retail', position: 2 },
    { title: 'Target', url: 'https://www.target.com', logo: 'https://www.google.com/s2/favicons?domain=target.com&sz=64', subtitle: 'Retail', position: 3 },
    { title: 'Best Buy', url: 'https://www.bestbuy.com', logo: 'https://www.google.com/s2/favicons?domain=bestbuy.com&sz=64', subtitle: 'Electronics', position: 4 },
    { title: 'Etsy', url: 'https://www.etsy.com', logo: 'https://www.google.com/s2/favicons?domain=etsy.com&sz=64', subtitle: 'Handmade & Vintage', position: 5 },
    { title: 'AliExpress', url: 'https://www.aliexpress.com', logo: 'https://www.google.com/s2/favicons?domain=aliexpress.com&sz=64', subtitle: 'Global Shopping', position: 6 },
    { title: 'Costco', url: 'https://www.costco.com', logo: 'https://www.google.com/s2/favicons?domain=costco.com&sz=64', subtitle: 'Wholesale', position: 7 },
  ],
  'social-media': [
    { title: 'Facebook', url: 'https://www.facebook.com', logo: 'https://www.google.com/s2/favicons?domain=facebook.com&sz=64', subtitle: 'Social Network', position: 0 },
    { title: 'X (Twitter)', url: 'https://twitter.com', logo: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=64', subtitle: 'Microblogging', position: 1 },
    { title: 'Instagram', url: 'https://www.instagram.com', logo: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=64', subtitle: 'Photo Sharing', position: 2 },
    { title: 'TikTok', url: 'https://www.tiktok.com', logo: 'https://www.google.com/s2/favicons?domain=tiktok.com&sz=64', subtitle: 'Short Videos', position: 3 },
    { title: 'Reddit', url: 'https://www.reddit.com', logo: 'https://www.google.com/s2/favicons?domain=reddit.com&sz=64', subtitle: 'Forum Platform', position: 4 },
    { title: 'LinkedIn', url: 'https://www.linkedin.com', logo: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=64', subtitle: 'Professional Network', position: 5 },
    { title: 'Pinterest', url: 'https://www.pinterest.com', logo: 'https://www.google.com/s2/favicons?domain=pinterest.com&sz=64', subtitle: 'Visual Discovery', position: 6 },
    { title: 'Snapchat', url: 'https://www.snapchat.com', logo: 'https://www.google.com/s2/favicons?domain=snapchat.com&sz=64', subtitle: 'Messaging', position: 7 },
  ],
  education: [
    { title: 'Khan Academy', url: 'https://www.khanacademy.org', logo: 'https://www.google.com/s2/favicons?domain=khanacademy.org&sz=64', subtitle: 'Free Learning', position: 0 },
    { title: 'Coursera', url: 'https://www.coursera.org', logo: 'https://www.google.com/s2/favicons?domain=coursera.org&sz=64', subtitle: 'Online Courses', position: 1 },
    { title: 'Udemy', url: 'https://www.udemy.com', logo: 'https://www.google.com/s2/favicons?domain=udemy.com&sz=64', subtitle: 'Course Platform', position: 2 },
    { title: 'Wikipedia', url: 'https://www.wikipedia.org', logo: 'https://www.google.com/s2/favicons?domain=wikipedia.org&sz=64', subtitle: 'Encyclopedia', position: 3 },
    { title: 'MIT OCW', url: 'https://ocw.mit.edu', logo: 'https://www.google.com/s2/favicons?domain=ocw.mit.edu&sz=64', subtitle: 'Open Courseware', position: 4 },
    { title: 'Duolingo', url: 'https://www.duolingo.com', logo: 'https://www.google.com/s2/favicons?domain=duolingo.com&sz=64', subtitle: 'Language Learning', position: 5 },
    { title: 'edX', url: 'https://www.edx.org', logo: 'https://www.google.com/s2/favicons?domain=edx.org&sz=64', subtitle: 'University Courses', position: 6 },
    { title: 'Google Scholar', url: 'https://scholar.google.com', logo: 'https://www.google.com/s2/favicons?domain=scholar.google.com&sz=64', subtitle: 'Academic Search', position: 7 },
  ],
  health: [
    { title: 'WebMD', url: 'https://www.webmd.com', logo: 'https://www.google.com/s2/favicons?domain=webmd.com&sz=64', subtitle: 'Health Info', position: 0 },
    { title: 'Mayo Clinic', url: 'https://www.mayoclinic.org', logo: 'https://www.google.com/s2/favicons?domain=mayoclinic.org&sz=64', subtitle: 'Medical Reference', position: 1 },
    { title: 'Healthline', url: 'https://www.healthline.com', logo: 'https://www.google.com/s2/favicons?domain=healthline.com&sz=64', subtitle: 'Health & Wellness', position: 2 },
    { title: 'NIH', url: 'https://www.nih.gov', logo: 'https://www.google.com/s2/favicons?domain=nih.gov&sz=64', subtitle: 'Medical Research', position: 3 },
    { title: 'MyFitnessPal', url: 'https://www.myfitnesspal.com', logo: 'https://www.google.com/s2/favicons?domain=myfitnesspal.com&sz=64', subtitle: 'Nutrition Tracker', position: 4 },
    { title: 'CDC', url: 'https://www.cdc.gov', logo: 'https://www.google.com/s2/favicons?domain=cdc.gov&sz=64', subtitle: 'Disease Control', position: 5 },
  ],
  travel: [
    { title: 'Google Flights', url: 'https://www.google.com/flights', logo: 'https://www.google.com/s2/favicons?domain=google.com&sz=64', subtitle: 'Flight Search', position: 0 },
    { title: 'Booking.com', url: 'https://www.booking.com', logo: 'https://www.google.com/s2/favicons?domain=booking.com&sz=64', subtitle: 'Hotel Booking', position: 1 },
    { title: 'Airbnb', url: 'https://www.airbnb.com', logo: 'https://www.google.com/s2/favicons?domain=airbnb.com&sz=64', subtitle: 'Vacation Rentals', position: 2 },
    { title: 'Expedia', url: 'https://www.expedia.com', logo: 'https://www.google.com/s2/favicons?domain=expedia.com&sz=64', subtitle: 'Travel Deals', position: 3 },
    { title: 'TripAdvisor', url: 'https://www.tripadvisor.com', logo: 'https://www.google.com/s2/favicons?domain=tripadvisor.com&sz=64', subtitle: 'Travel Reviews', position: 4 },
    { title: 'Google Maps', url: 'https://maps.google.com', logo: 'https://www.google.com/s2/favicons?domain=maps.google.com&sz=64', subtitle: 'Maps & Directions', position: 5 },
  ],
}

const seed = async () => {
  try {
    await connectDB()

    // Clear existing data
    await Category.deleteMany({})
    await Tile.deleteMany({})
    console.log('🗑  Cleared existing categories and tiles')

    // Create top-level categories
    const createdCategories = {}
    for (const cat of categories) {
      const created = await Category.create(cat)
      createdCategories[cat.slug] = created
      console.log(`📁 Created category: ${cat.name}`)
    }

    // Create subcategories
    for (const [parentSlug, subs] of Object.entries(subcategories)) {
      const parent = createdCategories[parentSlug]
      for (const sub of subs) {
        await Category.create({ ...sub, parentId: parent._id, order: subs.indexOf(sub) })
      }
      console.log(`  └─ Added ${subs.length} subcategories to ${parent.name}`)
    }

    // Create tiles
    let totalTiles = 0
    for (const [catSlug, tiles] of Object.entries(tilesData)) {
      const category = createdCategories[catSlug]
      for (const tile of tiles) {
        await Tile.create({ ...tile, categoryId: category._id })
      }
      totalTiles += tiles.length
      console.log(`🔲 Added ${tiles.length} tiles to ${category.name}`)
    }

    console.log(`\n✅ Seed complete: ${categories.length} categories, ${Object.values(subcategories).flat().length} subcategories, ${totalTiles} tiles`)

    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seed()

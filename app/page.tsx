'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Trophy, Shield, Zap, Target, Code, Network, Lock } from 'lucide-react'
import AdventureCard from './components/AdventureCard'
import BlogCard from './components/BlogCard'

const featuredAdventures = [
  {
    id: '1',
    title: 'Nairobi Nightfall: CEO Spoof',
    description: 'An after-hours spear-phish tries to hijack payroll just before Mpesa disbursements.',
    difficulty: 'Easy' as const,
  },
  {
    id: '4',
    title: 'Ngong Road WiFi Gauntlet',
    description: 'Ship sensitive files while dodging rogue café networks during a client sprint.',
    difficulty: 'Medium' as const,
  },
  {
    id: '8',
    title: 'Cloud Kiondo Wide Open',
    description: 'Contain a public bucket leak packed with Kenyan ID scans before threat intel does.',
    difficulty: 'Hard' as const,
  },
]

const recentBlogs = [
  {
    id: '1',
    title: 'Kenya Ranks #3 in African Cybersecurity Threats',
    excerpt: 'Recent data shows Kenya has experienced a 201% surge in cyber threats in 2024...',
    category: 'News',
    date: '2024-01-15',
    readTime: '5 min',
  },
  {
    id: '2',
    title: 'How to Protect Your Startup from Ransomware',
    excerpt: 'Practical steps Kenyan businesses can take to avoid falling victim to ransomware attacks...',
    category: 'Tutorial',
    date: '2024-01-12',
    readTime: '8 min',
  },
  {
    id: '3',
    title: 'Security Adventure Writeup: Kenyan Banking System Penetration Test',
    excerpt: 'Deep dive into how we identified and exploited vulnerabilities in a local banking system...',
    category: 'Security Writeup',
    date: '2024-01-10',
    readTime: '12 min',
  },
]

export default function Home() {
  const features = [
    { icon: Target, title: 'Security Adventures', description: 'Interactive stories teaching cybersecurity through real-world dilemmas' },
    { icon: Shield, title: 'Security News', description: 'Latest cybersecurity updates from Kenya and beyond' },
    { icon: Network, title: 'Community', description: 'Connect with Kenyan cybersecurity professionals' },
    { icon: Zap, title: 'Real-time Updates', description: 'Stay ahead with instant threat intelligence' },
  ]

  const stats = [
    { label: 'Active Members', value: '100+' },
    { label: 'Security Adventures', value: '8+' },
    { label: 'Articles Published', value: '10+' },
    { label: 'Events Organized', value: '3' },
  ]

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16 sm:pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-block mb-6">
            <motion.div
              className="px-4 py-2 bg-cyber-green/10 border border-cyber-green/30 rounded-full text-cyber-green"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
             Explore Cutting-Edge Intel & Tech Buzz
            </motion.div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 pb-2 leading-tight md:leading-[1.15] bg-gradient-to-r from-cyber-green via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
            Empowering Kenya's Digital Frontier.  
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join Kenya's largest community of ethical hackers, complete security adventures, 
            and stay updated with the latest cybersecurity news from across the continent.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/adventures" className="cyber-button">
              Start Adventure <ArrowRight className="inline ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/blog"
              className="px-6 py-3 border-2 border-cyber-green text-cyber-green font-bold rounded-lg hover:bg-cyber-green/10 transition-all"
            >
              Read Articles
            </Link>
          </div>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-cyber-blue/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyber-green/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="cyber-card text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-cyber-green mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why Join <span className="text-cyber-green">CyberPulse KE</span>?
          </h2>
          <p className="text-lg sm:text-xl text-gray-400">Everything you need to excel in cybersecurity</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="cyber-card group"
            >
              <feature.icon className="h-12 w-12 text-cyber-green mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Security Adventures */}
      <section className="py-12 sm:py-20 bg-cyber-darker/50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                Featured <span className="text-cyber-green">Security Adventures</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">Learn through interactive storytelling and real choices</p>
            </div>
            <Link href="/adventures" className="hidden md:flex items-center text-cyber-green hover:underline whitespace-nowrap">
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {featuredAdventures.map((adventure, index) => (
              <AdventureCard key={adventure.id} {...adventure} index={index} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/adventures" className="cyber-button">
              View All Adventures <ArrowRight className="inline ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              Latest <span className="text-cyber-blue">Articles</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">Stay informed with the latest cybersecurity news</p>
          </div>
          <Link href="/blog" className="hidden md:flex items-center text-cyber-blue hover:underline whitespace-nowrap">
            View All <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {recentBlogs.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/blog" className="cyber-button">
            View All Articles <ArrowRight className="inline ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="cyber-card max-w-4xl mx-auto text-center glow-effect p-6 sm:p-8 md:p-12"
        >
          <Lock className="h-12 w-12 sm:h-16 sm:w-16 text-cyber-green mx-auto mb-4 sm:mb-6" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Ready to Level Up Your Skills?
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of Kenyan cybersecurity enthusiasts. Learn through interactive adventures, earn achievements, and grow together.
          </p>
          <Link href="/adventures" className="cyber-button inline-block">
            Start Your First Adventure <ArrowRight className="inline ml-2 h-5 w-5 sm:h-6 sm:w-6" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}


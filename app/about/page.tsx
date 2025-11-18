'use client'

import { motion } from 'framer-motion'
import { Shield, Target, Users, Trophy, Code, Network } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: Users, value: '100+', label: 'Active Members' },
    { icon: Target, value: '8+', label: 'Security Adventures' },
    { icon: Code, value: '10+', label: 'Articles Published' },
    { icon: Trophy, value: '3', label: 'Events Organized' },
  ]

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'We prioritize ethical hacking and responsible disclosure. All challenges are designed for educational purposes.',
    },
    {
      icon: Network,
      title: 'Community Driven',
      description: 'Built by and for the Kenyan cybersecurity community. We grow together and support each other.',
    },
    {
      icon: Target,
      title: 'Real-World Focus',
      description:
        'Every challenge mirrors active investigations across Kenyan banks, ISPs, and public infrastructure, keeping practice field-ready.',
    },
    {
      icon: Code,
      title: 'Continuous Learning',
      description: 'We provide the latest cybersecurity news, blog articles, and expert insights to keep you ahead.',
    },
  ]

  const milestones = [
    { year: '2024', event: 'Launches with 10 interactive security adventures and accompanying blog articles tailored to Kenya.' },
    { year: '2025', event: 'Community thrives with 100+ active members running CTF drills and sharing threat intel weekly.' },
  ]

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16 sm:pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyber-green to-cyber-blue bg-clip-text text-transparent">
            About CyberPulse KE
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            Empowering Kenya's cybersecurity community through education, challenges, and collaboration
          </p>
        </motion.div>
      </section>

      {/* Stats */}
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
              <stat.icon className="h-8 w-8 text-cyber-green mx-auto mb-2" />
              <div className="text-3xl font-bold text-cyber-green">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="cyber-card p-6 sm:p-8 md:p-12 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Our Mission</h2>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4 sm:mb-6">
            CyberPulse KE was born from a simple vision: to create a platform where cybersecurity enthusiasts, 
            students, and professionals can come together to learn, practice, and grow their skills. In a country 
            experiencing rapid digital transformation and an exponential increase in cyber threats, we recognized 
            the need for a dedicated space that combines hands-on learning with local context.
          </p>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            We believe that practical, context-aware learning is the most effective way to build a strong cybersecurity
            workforce for Kenya&apos;s future.
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="cyber-card"
            >
              <value.icon className="h-12 w-12 text-cyber-green mb-4" />
              <h3 className="text-2xl font-bold mb-2">{value.title}</h3>
              <p className="text-gray-400">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-8 sm:py-12 bg-cyber-darker/50">
        <div className="container mx-auto px-3 sm:px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mb-6 sm:mb-8"
              >
                <div className="flex-shrink-0 w-full sm:w-24 text-left sm:text-right order-2 sm:order-1">
                  <div className="font-bold text-cyber-green text-lg sm:text-2xl">{milestone.year}</div>
                </div>
                <div className="flex-grow order-1 sm:order-2">
                  <div className="cyber-card p-3 sm:p-4">
                    <p className="text-gray-300 text-sm sm:text-base">{milestone.event}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="cyber-card max-w-3xl mx-auto text-center glow-effect p-6 sm:p-8 md:p-12"
        >
          <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-cyber-green mx-auto mb-4 sm:mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8">
            Ready to level up your cybersecurity skills? Join thousands of Kenyan hackers and start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <a href="/adventures" className="cyber-button text-center px-4 sm:px-6 py-2 sm:py-3">
              Start Adventure
            </a>
            <a href="/blog" className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-cyber-green text-cyber-green font-bold rounded-lg hover:bg-cyber-green/10 transition-all text-center">
              Read Articles
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}


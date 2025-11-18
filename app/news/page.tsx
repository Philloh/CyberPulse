'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Newspaper, TrendingUp, Filter, Search, ExternalLink, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

export default function TechNewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Tech news articles with REAL, SPECIFIC articles from verified sources
  const newsArticles = [
    {
      id: '1',
      title: 'Case Study: University of West England uses Sophos solutions to protect thousands of students across multiple campuses',
      category: 'Incident',
      date: 'November 13, 2025',
      source: 'Sophos News',
      excerpt: 'As higher education institutions come under fire from threat actors, 24/7 vigilance is key.',
      link: 'https://news.sophos.com/en-us/2025/11/13/uwe-case-study-fighting-ransomware-in-higher-education/'
    },
    {
      id: '2',
      title: '5 ways to strengthen your firewall and endpoint\'s defenses against ransomware',
      category: 'Threat',
      date: 'November 5, 2025',
      source: 'Sophos News',
      excerpt: 'Sophos Firewall uses intelligent TLS inspection and AI-powered analysts to reveal hidden threats.',
      link: 'https://news.sophos.com/en-us/2025/11/05/5-ways-to-harden-firewalls-endpoint-against-ransomware/'
    },
    {
      id: '3',
      title: 'Infostealers: The silent doorway to identity attacks — and why proactive defense matters',
      category: 'Vulnerability',
      date: 'November 14, 2025',
      source: 'Sophos News',
      excerpt: 'Understanding infostealer threats and how to defend against them.',
      link: 'https://news.sophos.com/en-us/2025/11/14/infostealers-and-follow-on-attacks/'
    },
    {
      id: '4',
      title: 'CISA and Partners Release Advisory Update on Akira Ransomware',
      category: 'Incident',
      date: 'November 12, 2025',
      source: 'CISA - US Cybersecurity',
      excerpt: 'Official security advisory on Akira Ransomware threats and mitigation strategies.',
      link: 'https://www.cisa.gov/news-events/alerts/2025/11/13/cisa-and-partners-release-advisory-update-akira-ransomware'
    },
    {
      id: '5',
      title: 'Fortinet Releases Security Advisory for Relative Path Traversal Vulnerability Affecting FortiWeb Products',
      category: 'Vulnerability',
      date: 'November 14, 2025',
      source: 'CISA - US Cybersecurity',
      excerpt: 'Critical vulnerability advisory for Fortinet FortiWeb products.',
      link: 'https://www.cisa.gov/news-events/alerts/2025/11/14/fortinet-releases-security-advisory-relative-path-traversal-vulnerability-affecting-fortiweb'
    },
    {
      id: '6',
      title: 'Iranian Hackers Target Defense and Government Officials in Ongoing Campaign',
      category: 'Threat',
      date: 'November 17, 2025',
      source: 'SecurityWeek',
      excerpt: 'State-sponsored APT targeting victims\' family members to increase pressure on their targets.',
      link: 'https://www.securityweek.com/iranian-hackers-target-defense-and-government-officials-in-ongoing-campaign/'
    },
    {
      id: '7',
      title: 'DoorDash Says Personal Information Stolen in Data Breach',
      category: 'Incident',
      date: 'November 17, 2025',
      source: 'SecurityWeek',
      excerpt: 'Names, addresses, email addresses, and phone numbers were compromised after an employee fell for a social engineering attack.',
      link: 'https://www.securityweek.com/doordash-says-personal-information-stolen-in-data-breach/'
    },
    {
      id: '8',
      title: 'JKUAT Hosts 2025 Inter-University Hackathon, Bags Runner-Up Spots in Two Categories',
      category: 'Education',
      date: 'November 17, 2025',
      source: 'JKUAT News',
      excerpt: 'Jomo Kenyatta University reaffirmed its position as a regional innovation powerhouse.',
      link: 'https://www.jkuat.ac.ke/jkuat-hosts-2025-inter-university-hackathon-bags-runner-up-spots-in-two-categories/'
    },
    {
      id: '9',
      title: 'JKUAT and VUB Strengthen Multidisciplinary Research Partnership',
      category: 'Innovation',
      date: 'November 17, 2025',
      source: 'JKUAT News',
      excerpt: 'JKUAT and Belgium\'s Vrije Universiteit Brussel reaffirm their commitment to expand collaboration.',
      link: 'https://www.jkuat.ac.ke/jkuat-and-vub-strengthen-multidisciplinary-research-partnership/'
    },
    {
      id: '10',
      title: 'The Role of Universities in Shaping Kenya\'s National AI Strategy',
      category: 'Policy',
      date: 'November 13, 2025',
      source: 'Strathmore University',
      excerpt: 'Dean\'s Roundtable discussing the role of universities in Kenya\'s AI development.',
      link: 'https://strathmore.edu/news-articles/the-role-of-universities-in-shaping-kenyas-national-ai-strategy/'
    },
    {
      id: '11',
      title: 'Strathmore University Awarded at the 2025 FKE Employer of the Year Awards',
      category: 'Community',
      date: 'November 12, 2025',
      source: 'Strathmore University',
      excerpt: 'Strathmore awarded 1st Runner-Up in the Learning and Development Category at FKE awards.',
      link: 'https://strathmore.edu/news-articles/strathmore-university-awarded-at-the-2025-fke-employer-of-the-year-awards/'
    },
    {
      id: '12',
      title: 'Akira Ransomware Group Made $244 Million in Ransom Proceeds',
      category: 'Threat',
      date: 'November 14, 2025',
      source: 'SecurityWeek',
      excerpt: 'Akira was seen exploiting SonicWall vulnerabilities and encrypting Nutanix Acropolis Hypervisor (AHV) VM disk files this year.',
      link: 'https://www.securityweek.com/akira-ransomware-group-made-244-million-in-ransom-proceeds/'
    },
  ]

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(newsArticles.map(a => a.category))).sort()]

  // Filter articles
  const filteredArticles = useMemo(() => {
    return newsArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Vulnerability': 'bg-red-500/10 border-red-500/30 text-red-400',
      'Incident': 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      'Threat': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      'Policy': 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      'Community': 'bg-green-500/10 border-green-500/30 text-green-400',
      'Education': 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      'Innovation': 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      'Research': 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    }
    return colors[category] || 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green'
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      'Vulnerability': '🔐',
      'Incident': '🚨',
      'Threat': '⚠️',
      'Policy': '📋',
      'Community': '👥',
      'Education': '🎓',
      'Innovation': '💡',
      'Research': '🔬',
    }
    return emojis[category] || '📰'
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16 sm:pb-20">
      <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Newspaper className="h-10 w-10 sm:h-12 sm:w-12 text-cyber-green" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-cyber-green to-cyber-blue bg-clip-text text-transparent">
            Tech News
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-2">
            Latest cybersecurity and technology news from Kenya and East Africa
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Stay updated with the most important stories shaping the African tech landscape
          </p>
        </motion.div>
      </section>

      {/* Filters Section */}
      <section className="container mx-auto px-3 sm:px-4 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="cyber-card p-4 sm:p-6">
            {/* Search */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green" />
                Search News
              </label>
              <input
                type="text"
                placeholder="Search by title, keyword, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-cyber w-full text-sm"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green" />
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border transition-all text-xs sm:text-sm font-medium ${
                      selectedCategory === category
                        ? 'border-cyber-green bg-cyber-green/20 text-cyber-green'
                        : 'border-cyber-green/30 text-gray-400 hover:border-cyber-green/60'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Counter */}
            <div className="mt-4 pt-4 border-t border-cyber-green/20">
              <p className="text-xs sm:text-sm text-gray-400">
                Found <span className="text-cyber-green font-semibold">{filteredArticles.length}</span> article{filteredArticles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* News Articles */}
      <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          {filteredArticles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="cyber-card p-4 sm:p-6 hover:border-cyber-green/60 transition-all group"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Category Badge */}
                <div className="flex-shrink-0">
                  <div className="text-3xl sm:text-4xl w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-cyber-green/10 border border-cyber-green/20 flex items-center justify-center">
                    {getCategoryEmoji(article.category)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-100 group-hover:text-cyber-green transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-block px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold border ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500 mb-4 sm:mb-0">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>{article.date}</span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600"></div>
                    <div className="flex items-center gap-1">
                      <Newspaper className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>{article.source}</span>
                    </div>
                  </div>

                  {/* Read More Link */}
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyber-green hover:text-cyber-green/80 text-xs sm:text-sm font-semibold transition-colors"
                  >
                    Read Full Article
                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12 sm:py-16 text-gray-400 text-sm sm:text-base">
            <Newspaper className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
            <p>No articles found matching your search.</p>
            <p className="text-xs sm:text-sm mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-3 sm:px-4">
        <div className="cyber-card p-4 sm:p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <TrendingUp className="h-6 w-6 text-cyber-green" />
            <h2 className="text-xl sm:text-2xl font-bold text-cyber-green">Stay Updated</h2>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">
            Get the latest cybersecurity and tech news from Kenya and East Africa delivered to your inbox. Subscribe to our newsletter for weekly curated stories, vulnerability alerts, and community announcements.
          </p>
          <form onSubmit={(e) => { e.preventDefault() }} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 sm:py-3 bg-cyber-dark border border-cyber-green/20 rounded-lg text-gray-100 placeholder-gray-500 text-sm"
            />
            <button className="cyber-button px-4 sm:px-6 py-2.5 sm:py-3 whitespace-nowrap text-sm sm:text-base">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Navigation to Blog */}
      <section className="container mx-auto px-3 sm:px-4 text-center mt-8">
        <Link href="/blog" className="inline-block px-6 py-3 border border-cyber-blue/40 rounded-lg text-cyber-blue hover:bg-cyber-blue/10 transition-colors font-semibold">
          ← Back to Blog Articles
        </Link>
      </section>
    </div>
  )
}

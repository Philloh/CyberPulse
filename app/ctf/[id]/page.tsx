'use client'

import { motion } from 'framer-motion'
import { Trophy, Users, Clock } from 'lucide-react'
import CTFChallenge from '../components/CTFChallenge'

type Diff = 'Easy' | 'Medium' | 'Hard' | 'Expert'

const CHALLENGES: Record<string, {
  id: string
  title: string
  difficulty: Diff
  category: string
  points: number
  solved: number
  description: string
  hints: string[]
  files: { name: string; size: string; href?: string }[]
  roomIp?: string
  externalRoom?: {
    platform: 'TryHackMe' | 'HackTheBox'
    roomId: string
    roomUrl: string
    note: string
  }
  flags?: { id: string; description: string; format: string }[]
}> = {
  '1': {
    id: '1',
    title: 'Web Login Bypass Fundamentals',
    difficulty: 'Easy',
    category: 'Web Security',
    points: 100,
    solved: 45,
    description: 'Analyze a simple login to bypass auth using fundamentals (parameter tampering, logic flaws). Practice alongside a real room covering OWASP Top 10/SQLi basics.',
    hints: ['Inspect requests and responses', 'Client vs server validation', 'Try SQLi payloads on login/search'],
    files: [],
    externalRoom: {
      platform: 'TryHackMe',
      roomId: 'owasp-top-10',
      roomUrl: 'https://tryhackme.com/room/owasptop10',
      note: 'Work through OWASP Top 10 sections on auth and injection.',
    },
    flags: [
      { id: 'user', description: 'User flag (after SQLi/login bypass)', format: 'THM{...}' },
      { id: 'root', description: 'Root flag (after privilege escalation)', format: 'THM{...}' }
    ]
  },
  '2': {
    id: '2',
    title: 'Webhook Exploitation & SSRF',
    difficulty: 'Medium',
    category: 'Web Security',
    points: 200,
    solved: 32,
    description: 'Abuse webhook receivers to pivot (SSRF, command injection, token leakage).',
    hints: ['Control callback URLs', 'Probe metadata services', 'Check signature verification'],
    files: [],
    externalRoom: {
      platform: 'TryHackMe',
      roomId: 'webhook-exploitation',
      roomUrl: 'https://tryhackme.com/room/webhookexploitation',
      note: 'Focus on SSRF and webhook verification pitfalls.',
    },
    flags: [
      { id: 'user', description: 'User flag (found after webhook exploitation)', format: 'THM{...}' },
      { id: 'root', description: 'Root flag (found after privilege escalation)', format: 'THM{...}' }
    ]
  },
  '3': {
    id: '3',
    title: 'API Security: Broken Auth & JWT',
    difficulty: 'Medium',
    category: 'API Security',
    points: 250,
    solved: 28,
    description: 'Target common API auth flaws: missing auth, weak JWTs, and parameter confusion.',
    hints: ['JWT alg=none confusion', 'Leaky endpoints unauthenticated', 'Privilege escalation via IDs'],
    files: [],
    externalRoom: {
      platform: 'TryHackMe',
      roomId: 'api-security',
      roomUrl: 'https://tryhackme.com/room/apisecurity',
      note: 'Practice JWT, authz, and input validation issues.',
    },
    flags: [
      { id: 'user', description: 'User flag (found after JWT bypass)', format: 'THM{...}' },
      { id: 'admin', description: 'Admin flag (found after privilege escalation)', format: 'THM{...}' }
    ]
  },
  '4': {
    id: '4',
    title: 'Network Packet Analysis',
    difficulty: 'Hard',
    category: 'Network Security',
    points: 300,
    solved: 18,
    description: 'Use Wireshark/tshark to extract credentials, files, and covert channels.',
    hints: ['Filter by protocols', 'Reassemble streams', 'Inspect DNS/HTTP payloads'],
    files: [],
    externalRoom: {
      platform: 'TryHackMe',
      roomId: 'wireshark-101',
      roomUrl: 'https://tryhackme.com/room/wireshark',
      note: 'Start with Wireshark fundamentals; apply filters and extraction.',
    },
    flags: [
      { id: 'user', description: 'User flag (found in packet analysis)', format: 'THM{...}' },
      { id: 'root', description: 'Root flag (found after network exploitation)', format: 'THM{...}' }
    ]
  },
  '5': {
    id: '5',
    title: 'Android APK Reverse Engineering',
    difficulty: 'Hard',
    category: 'Mobile Security',
    points: 350,
    solved: 15,
    description: 'Decompile an Android app, locate secrets, and simulate bypasses.',
    hints: ['APKTool/JADX', 'Check strings and resources', 'Look for crypto misuse'],
    files: [],
    externalRoom: {
      platform: 'TryHackMe',
      roomId: 'androidhacking101',
      roomUrl: 'https://tryhackme.com/room/androidhacking101',
      note: 'Learn basics of Android reversing and analysis.',
    },
    flags: [
      { id: 'user', description: 'User flag (found in APK analysis)', format: 'THM{...}' },
      { id: 'root', description: 'Root flag (found after exploitation)', format: 'THM{...}' }
    ]
  },
  '6': {
    id: '6',
    title: 'Cross-Site Scripting (XSS) to Impact',
    difficulty: 'Expert',
    category: 'Web Security',
    points: 400,
    solved: 8,
    description: 'Find XSS variants (reflected, stored, DOM) and escalate impact (cookies, CSRF).',
    hints: ['Context matters (attr/script/style)', 'Payload encode/escape', 'CSP weaknesses'],
    files: [],
    externalRoom: {
      platform: 'TryHackMe',
      roomId: 'xss',
      roomUrl: 'https://tryhackme.com/room/xss',
      note: 'Practice with XSS payloads and contexts.',
    },
    flags: [
      { id: 'user', description: 'User flag (found after XSS exploitation)', format: 'THM{...}' },
      { id: 'root', description: 'Root flag (found after RCE)', format: 'THM{...}' }
    ]
  },
  '7': {
    id: '7',
    title: 'CSRF Attack Lab',
    difficulty: 'Medium',
    category: 'Web Security',
    points: 200,
    solved: 25,
    description: 'Exploit state-changing requests across origins; learn defenses with tokens and samesite.',
    hints: ['Find POST/PUT actions', 'Missing/weak tokens', 'samesite cookie issues'],
    files: [],
    externalRoom: {
      platform: 'TryHackMe',
      roomId: 'owasptop10',
      roomUrl: 'https://tryhackme.com/room/owasptop10',
      note: 'Review CSRF modules and mitigations.',
    },
    flags: [
      { id: 'user', description: 'User flag (found after CSRF exploitation)', format: 'THM{...}' },
      { id: 'admin', description: 'Admin flag (found after privilege escalation)', format: 'THM{...}' }
    ]
  },
  '8': {
    id: '8',
    title: 'Cryptocurrency Wallet Forensics',
    difficulty: 'Expert',
    category: 'Cryptocurrency Security',
    points: 450,
    solved: 5,
    description: 'Investigate wallet artifacts, key derivation, and transaction traces.',
    hints: ['Mnemonic/seed handling', 'Derivation paths', 'Transaction graphing'],
    files: [],
    externalRoom: {
      platform: 'TryHackMe',
      roomId: 'blockchain',
      roomUrl: 'https://tryhackme.com/room/blockchain',
      note: 'Intro to blockchain and wallet fundamentals.',
    },
    flags: [
      { id: 'user', description: 'User flag (found in wallet analysis)', format: 'THM{...}' },
      { id: 'root', description: 'Root flag (found after key recovery)', format: 'THM{...}' }
    ]
  },
  '9': {
    id: '9',
    title: 'IoT Device Exploitation Basics',
    difficulty: 'Hard',
    category: 'IoT Security',
    points: 300,
    solved: 12,
    description: 'Enumerate services, default creds, and firmware for common IoT weak points.',
    hints: ['Service enumeration', 'Default creds and open panels', 'Firmware extraction'],
    files: [],
    externalRoom: {
      platform: 'TryHackMe',
      roomId: 'iot',
      roomUrl: 'https://tryhackme.com/room/iot',
      note: 'Intro to IoT pentesting workflows.',
    },
    flags: [
      { id: 'user', description: 'User flag (found after device exploitation)', format: 'THM{...}' },
      { id: 'root', description: 'Root flag (found after privilege escalation)', format: 'THM{...}' }
    ]
  },
  '10': {
    id: '10',
    title: 'Container Escape to Host',
    difficulty: 'Expert',
    category: 'Cloud Security',
    points: 500,
    solved: 3,
    description: 'Identify insecure container settings and escalate to host access.',
    hints: ['Privileged mode and mounts', 'Docker socket exposure', 'Kernel escape CVEs'],
    files: [],
    externalRoom: {
      platform: 'TryHackMe',
      roomId: 'containerevasion',
      roomUrl: 'https://tryhackme.com/room/containerevasion',
      note: 'Explore container weaknesses and hardening.',
    },
    flags: [
      { id: 'user', description: 'User flag (found after container escape)', format: 'THM{...}' },
      { id: 'root', description: 'Root flag (found on host system)', format: 'THM{...}' }
    ]
  }
}

export default function ChallengePage({ params }: { params: { id: string } }) {
  const challenge = CHALLENGES[params.id] || CHALLENGES['1']

  return (
    <div className="pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-2 bg-green-500/20 text-green-500 border border-green-500 rounded-full text-sm font-bold">{challenge.difficulty}</span>
            <span className="px-4 py-2 bg-cyber-purple/20 text-cyber-purple border border-cyber-purple rounded-full text-sm font-bold">{challenge.category}</span>
            <div className="flex items-center text-cyber-yellow"><Trophy className="h-4 w-4 mr-1" /><span className="font-bold">{challenge.points} points</span></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{challenge.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-400">
            <div className="flex items-center"><Users className="h-5 w-5 mr-2" /><span>{challenge.solved} solved</span></div>
            <div className="flex items-center"><Clock className="h-5 w-5 mr-2" /><span>Avg. time: {challenge.difficulty === 'Easy' ? '30 min' : challenge.difficulty === 'Medium' ? '60 min' : challenge.difficulty === 'Hard' ? '90 min' : '120+ min'}</span></div>
          </div>
        </motion.div>

        <CTFChallenge challenge={challenge as any} />
      </div>
    </div>
  )
}


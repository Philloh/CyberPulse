'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Share2, Heart, Clipboard } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Poll from '@/app/components/Poll'
import Quiz from '@/app/components/Quiz'
import ThreatBarChart from '@/app/components/ThreatBarChart'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export interface Article {
  title: string
  category: string
  date: string
  readTime: string
  author: string
  image?: string
  content: string
}

export type ArticlesMap = Record<string, Article>

function estimateReadTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

type TocItem = { id: string; text: string; level: number }

function extractToc(raw: string): TocItem[] {
  const lines = raw.split('\n')
  const toc: TocItem[] = []
  lines.forEach((line, idx) => {
    const m = line.match(/^(#{2,3})\s+(.*)$/)
    if (m) {
      const level = m[1].length
      const text = m[2].trim()
      const id = `${text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}-${idx}`
      toc.push({ id, text, level })
    }
  })
  return toc
}

function renderInlineWithLinks(text: string) {
  const parts: React.ReactNode[] = []
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|((https?:\/\/)[^\s]+)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[1] && match[2]) {
      const label = match[1]
      const url = match[2]
      parts.push(
        <a key={parts.length} href={url} target="_blank" rel="noopener noreferrer" className="text-cyber-green underline hover:no-underline">{label}</a>
      )
    } else if (match[3]) {
      const url = match[3]
      parts.push(
        <a key={parts.length} href={url} target="_blank" rel="noopener noreferrer" className="text-cyber-green underline hover:no-underline">{url}</a>
      )
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts
}

function renderNarrative(raw: string) {
  const lines = raw.split('\n')
  const paragraphs: string[] = []
  let buffer: string[] = []
  const flush = () => {
    if (buffer.length) {
      const p = buffer.join(' ').replace(/\s+/g, ' ').trim()
      if (p.length) paragraphs.push(p)
      buffer = []
    }
  }
  for (const line of lines) {
    const heading = line.match(/^#{1,6}\s+(.*)$/)
    const bullet = line.match(/^\s*[-*+]\s+(.*)$/)
    const numbered = line.match(/^\s*\d+\)\s+(.*)$/)
    if (!line.trim()) { flush(); continue }
    if (heading) { flush(); buffer.push(heading[1]); continue }
    if (bullet) { buffer.push(bullet[1]); continue }
    if (numbered) { buffer.push(numbered[1]); continue }
    buffer.push(line.trim())
  }
  flush()
  // De-duplicate paragraphs (normalize case/spacing) while preserving order
  const seen = new Set<string>()
  const unique = paragraphs.filter((p) => {
    const key = p.toLowerCase().replace(/\s+/g, ' ').trim()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
  return (
    <div className="space-y-4">
      {unique.map((p, i) => (
        <p key={i} className="text-gray-300 leading-relaxed text-[0.98rem] md:text-base">{renderInlineWithLinks(p)}</p>
      ))}
    </div>
  )
}

function buildCategoryAppendix(category: string): string {
  switch (category) {
    case 'News':
      return `\n\n## Regional Context and Trends\n- East African threat telemetry shows spikes in credential stuffing and BEC.\n- Telecom and fintech ecosystems remain high-value targets due to mobile-first adoption.\n\n## Case Study: SME Email Takeover\nA Nairobi-based logistics SME lost invoice payments after a mailbox rule rerouted supplier emails. Root cause: weak MFA and no VIP monitoring. Remediation: enforce MFA, rotate tokens, and implement mailbox rule alerts.\n\n## Controls That Move the Needle\n- Phishing-resistant MFA on admins and finance.\n- DMARC enforcement with alignment; VIP impersonation rules.\n- Least privilege on cloud consoles; periodic access reviews.\n\n> “If you can’t see it, you can’t defend it.” Inventory identities, assets, and third-party access.\n\n## Further Reading\n- CISA Alerts\n- Dark Reading analysis\n- Krebs on Security investigations\n`
    case 'Tutorial':
      return `\n\n## Step-by-Step Hardening Playbook\n1) Map external attack surface (domains, ports, SaaS).\n2) Close unneeded ports; enforce SSO + MFA everywhere.\n3) Backups: immutable, tested monthly; document restore runbooks.\n4) EDR on endpoints; centralize logs with alert triage.\n5) Run quarterly tabletop exercises with decision-makers.\n\n## Tooling on a Budget\n- DNS-based filtering, basic WAF/CDN, open-source SIEM, and passwordless MFA pilots.\n\n## Common Mistakes\n- Relying on “strong passwords” without MFA.\n- Backups not tested under realistic time pressure.\n- Admin roles lingering after projects end.\n\n> “Discipline beats tooling.” Small, consistent routines prevent big incidents.\n`
    case 'CTF Writeup':
      return `\n\n## Methodology Notes\n- Recon → Threat model → Exploit validation → Impact analysis → Remediation.\n\n## Secure-by-Design Patterns\n- Parameterized queries, ownership checks, CSRF tokens, and short session lifetimes.\n- Defense in depth: WAF, rate limiting, anomaly detection.\n\n## Blue-Team Playbook\n- Detections for abnormal enumeration, SQL error patterns, and session anomalies.\n- Runbooks to quarantine sessions and rotate secrets.\n\n> "Make abuse paths expensive." Slow down attackers with guardrails and visibility.\n`
    case 'Sample Sec Writeup':
      return `\n\n## Methodology Notes\n- Recon → Threat model → Exploit validation → Impact analysis → Remediation.\n\n## Secure-by-Design Patterns\n- Parameterized queries, ownership checks, CSRF tokens, and short session lifetimes.\n- Defense in depth: WAF, rate limiting, anomaly detection.\n\n## Blue-Team Playbook\n- Detections for abnormal enumeration, SQL error patterns, and session anomalies.\n- Runbooks to quarantine sessions and rotate secrets.\n\n> "Make abuse paths expensive." Slow down attackers with guardrails and visibility.\n`
    case 'Security':
      return `\n\n## User Education That Works\n- Localized phishing examples, SIM-swap awareness, and app permission hygiene.\n\n## Integration Checklist for Teams\n- Secrets vault, signed webhooks, idempotency keys, TLS pinning where possible.\n\n## Monitoring Signals\n- Impossible travel, OTP abuse spikes, webhook signature mismatches.\n\n> “Trust, but verify.” Instrument the edges with alerts and circuit breakers.\n`
    case 'Analysis':
      return `\n\n## Threat Landscape Deep-Dive\n- LLM-aided lures increase conversion; behavioral detections mitigate impact.\n- Automated scanning compresses vuln-to-exploit windows; patch velocity matters.\n\n## Program Metrics\n- MTTD/MTTR, MFA coverage, privileged access reviews, and patch SLAs.\n\n## Pragmatic Roadmap\n- Identity first, then visibility, then response practice.\n\n> “Work the basics relentlessly; sophistication comes later.”\n`
    case 'Legal':
      return `\n\n## Practical Compliance\n- Data inventory (systems, processors), ROPA, and DPIAs for high-risk processing.\n- Breach playbooks with regulator and subject notification timelines.\n\n## Vendor Oversight\n- Contracts with security clauses, audit rights, and incident SLAs.\n\n> “Privacy by design is cheaper than privacy by rewrite.”\n`
    case 'International':
      return `\n\n## Global Signals\n- Regulatory momentum, mandatory disclosures, and maturing audit ecosystems.\n\n## Engineering Notes\n- Formal verification, chaos testing for controls, and circuit breakers.\n\n## Economics of Defense\n- Incentives and governance shape security outcomes as much as code.\n\n> “Incentives are architecture.” Align teams, budgets, and KPIs with resilient outcomes.\n`
    default:
      return `\n\n## Additional Context\n- Controls, culture, and cadence decide outcomes more than any single tool.\n`
  }
}

function ensureMinWords(content: string, min: number, category: string): string {
  let out = content.trim()
  const count = () => out.split(/\s+/).filter(Boolean).length
  // Append at most two distinct narrative blocks to avoid repetition
  if (count() < min) {
    out += `\n\n` + buildCategoryAppendix(category)
  }
  if (count() < min) {
    out += `\n\n` + buildCategoryDeepDive(category)
  }
  return out
}

function buildCategoryDeepDive(category: string): string {
  switch (category) {
    case 'Tutorial':
      return `We took a founder’s-eye view: fix what fails first. We walked login flows, broke our own backups, and timed how long it took to recover with a stopwatch and a stakeholder on the phone. That drill changed how we wrote runbooks—shorter, clearer, kinder to a future version of us who would read them at 2 a.m.`
    case 'CTF Writeup':
      return `The most striking lesson was how ordinary weaknesses chained into extraordinary impact. A permissive query here, a missing check there, and suddenly balances moved where they shouldn't. The patch wasn't a hero; it was a habit—tests that fail loudly when assumptions drift.`
    case 'Sample Sec Writeup':
      return `The most striking lesson was how ordinary weaknesses chained into extraordinary impact. A permissive query here, a missing check there, and suddenly balances moved where they shouldn't. The patch wasn't a hero; it was a habit—tests that fail loudly when assumptions drift.`
    case 'Security':
      return `We made security a habit and a story. Lunch-and-learn demos with real SMS lures. A mocked call that asked for an OTP and a room full of grins when no one gave it. The point was not fear; it was craft. People who practice get good.`
    case 'Analysis':
      return `Our dashboards grew quieter as our playbooks grew sharper. We tuned alerts to human pace, then wrapped them in checklists that any on-call could follow. It felt less like fighting fires and more like tending a garden.`
    case 'Legal':
      return `We put privacy where product starts: in discovery. Designers asked “which data makes the experience better?” and engineers asked “how do we keep the rest out?” The outcome was smaller blast radius and faster sign-off.`
    case 'International':
      return `Across markets, the winners were boring in the best way: steady patch cadences, relentless key rotation, and tabletop games that felt like team sport. They failed on paper so they could succeed in prod.`
    case 'News':
      return `Behind every headline was a cadence: inventory, MFA, restore drills, and a phone tree that worked. The firms that bounced back fastest made resilience a routine, not a project.`
    default:
      return `We learned to sweat the basics: identity first, clear logs, short runbooks, and the humility to rehearse.`
  }
}

function buildReferences(category: string): string {
  const common = [
    '[Dark Reading](https://www.darkreading.com/)',
    '[Krebs on Security](https://krebsonsecurity.com/)',
    '[The Hacker News](https://thehackernews.com/)',
    '[CISA](https://www.cisa.gov/)',
    '[NIST CSF](https://www.nist.gov/cyberframework)',
    '[OWASP](https://owasp.org/)',
  ]
  const extra: string[] = []
  if (category === 'Security') {
    extra.push('[ODPC Kenya](https://www.odpc.go.ke/)', '[Safaricom M-Pesa Security](https://www.safaricom.co.ke/personal/m-pesa/security)')
  }
  if (category === 'International') {
    extra.push('[Chainalysis Blog](https://blog.chainalysis.com/)', '[Trail of Bits](https://blog.trailofbits.com/)')
  }
  if (category === 'Analysis') {
    extra.push('[Google TAG](https://blog.google/threat-analysis-group/)')
  }
  if (category === 'Legal') {
    extra.push('[EU GDPR](https://gdpr.eu/)')
  }
  if (category === 'Tutorial' || category === 'CTF Writeup' || category === 'Sample Sec Writeup') {
    extra.push('[OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)', '[CAPEC](https://capec.mitre.org/)')
  }
  if (category === 'International') {
    extra.push('[Cloudflare PQC](https://blog.cloudflare.com/tag/post-quantum/)', '[NIST PQC](https://csrc.nist.gov/projects/post-quantum-cryptography)')
  }
  const list = [...common, ...extra]
  return `\n\n## References\n${list.map((l) => `- ${l}`).join('\n')}`
}

function getQuote(category: string): { text: string; author: string } {
  switch (category) {
    case 'Security':
      return { text: 'Security is not a product, but a process.', author: 'Bruce Schneier' }
    case 'Analysis':
      return { text: 'In God we trust; all others must bring data.', author: 'W. Edwards Deming' }
    case 'Tutorial':
      return { text: 'The only way to learn a new programming language is by writing programs in it.', author: 'Dennis Ritchie' }
    case 'CTF Writeup':
      return { text: 'The most secure system is one that does nothing.', author: 'Unknown' }
    case 'Sample Sec Writeup':
      return { text: 'The most secure system is one that does nothing.', author: 'Unknown' }
    case 'International':
      return { text: 'The future is already here — it’s just not evenly distributed.', author: 'William Gibson' }
    default:
      return { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' }
  }
}

function getQuizForArticle(id: string, category: string): { question: string; options: Array<{ id: string; label: string; correct?: boolean }> } {
  switch (id) {
    case '1':
      return { question: 'Which control best mitigates credential stuffing?', options: [
        { id: 'a', label: 'MFA with rate limiting', correct: true },
        { id: 'b', label: 'Encrypting backups' },
        { id: 'c', label: 'Weekly port scans' },
      ] }
    case '2':
      return { question: 'Which webhook defense is most effective?', options: [
        { id: 'a', label: 'Signature verification with shared secret', correct: true },
        { id: 'b', label: 'Longer URLs only' },
        { id: 'c', label: 'Disable HTTPS' },
      ] }
    case '3':
      return { question: 'Best step against token replay?', options: [
        { id: 'a', label: 'JWT rotation and short TTLs', correct: true },
        { id: 'b', label: 'Store JWTs in localStorage forever' },
        { id: 'c', label: 'Disable logs' },
      ] }
    case '4':
      return { question: 'What helps detect covert channels in PCAPs?', options: [
        { id: 'a', label: 'Protocol-aware filtering and stream reassembly', correct: true },
        { id: 'b', label: 'Random packet drops' },
        { id: 'c', label: 'Disabling DNS' },
      ] }
    case '5':
      return { question: 'Reduce APK hardcoded secret risk by…', options: [
        { id: 'a', label: 'Moving secrets server-side and using tokens', correct: true },
        { id: 'b', label: 'Base64-encoding secrets' },
        { id: 'c', label: 'Renaming variables' },
      ] }
    case '6':
      return { question: 'Most reliable XSS mitigation?', options: [
        { id: 'a', label: 'Contextual output encoding', correct: true },
        { id: 'b', label: 'Hiding inputs with CSS' },
        { id: 'c', label: 'Only using GET requests' },
      ] }
    case '7':
      return { question: 'Strongest CSRF protection?', options: [
        { id: 'a', label: 'Synchronizer tokens + SameSite cookies', correct: true },
        { id: 'b', label: 'Longer passwords' },
        { id: 'c', label: 'Disable logs' },
      ] }
    case '8':
      return { question: 'Key for wallet recovery hardening?', options: [
        { id: 'a', label: 'Secure seed handling and derivation', correct: true },
        { id: 'b', label: 'Use same seed everywhere' },
        { id: 'c', label: 'Share mnemonics with team' },
      ] }
    case '9':
      return { question: 'First step in IoT exploitation?', options: [
        { id: 'a', label: 'Enumerate services and default creds', correct: true },
        { id: 'b', label: 'Factory reset device' },
        { id: 'c', label: 'Disable network' },
      ] }
    case '10':
      return { question: 'Container escape most likely when…', options: [
        { id: 'a', label: 'Docker socket is mounted inside the container', correct: true },
        { id: 'b', label: 'Using long container names' },
        { id: 'c', label: 'Running two replicas' },
      ] }
    case '11':
      return { question: 'Reduce DeFi bridge risk by…', options: [
        { id: 'a', label: 'Formal verification and circuit breakers', correct: true },
        { id: 'b', label: 'Printing keys on paper' },
        { id: 'c', label: 'Closing bug bounty' },
      ] }
    case '12':
      return { question: 'Pragmatic PQC migration step?', options: [
        { id: 'a', label: 'Inventory crypto and prioritize long-lived secrets', correct: true },
        { id: 'b', label: 'Ignore TLS entirely' },
        { id: 'c', label: 'Double RSA key size only' },
      ] }
    case '13':
      return { question: 'Lower phishing risk most effectively?', options: [
        { id: 'a', label: 'DMARC enforcement + verification workflows', correct: true },
        { id: 'b', label: 'Disable MFA' },
        { id: 'c', label: 'Share passwords internally' },
      ] }
    default:
      return { question: 'Which control best mitigates credential stuffing?', options: [
        { id: 'a', label: 'MFA with rate limiting', correct: true },
        { id: 'b', label: 'Daily antivirus scans' },
        { id: 'c', label: 'Longer passwords only' },
      ] }
  }
}

function getPollForArticle(id: string, category: string): { question: string; options: Array<{ id: string; label: string }> } {
  switch (id) {
    case '1':
      return { question: 'Which threat worries you most this quarter?', options: [
        { id: 'ransom', label: 'Ransomware' },
        { id: 'phish', label: 'Phishing/BEC' },
        { id: 'cloud', label: 'Cloud misconfigurations' },
        { id: 'sqli', label: 'Injection attacks' },
      ] }
    case '2':
      return { question: 'Biggest webhook risk in your stack?', options: [
        { id: 'sig', label: 'Missing signature validation' },
        { id: 'ssrf', label: 'SSRF via callback URLs' },
        { id: 'cmd', label: 'Command injection' },
        { id: 'leak', label: 'Token leakage' },
      ] }
    case '3':
      return { question: 'Most likely API auth failure for you?', options: [
        { id: 'jwt', label: 'Weak JWT handling' },
        { id: 'id', label: 'Insecure direct object references' },
        { id: 'rate', label: 'Missing rate limits' },
        { id: 'noauth', label: 'Unauthenticated endpoints' },
      ] }
    case '4':
      return { question: 'Hardest network artifact to investigate?', options: [
        { id: 'dns', label: 'DNS tunneling' },
        { id: 'tls', label: 'Encrypted C2' },
        { id: 'pcap', label: 'Fragmented streams' },
        { id: 'timing', label: 'Timing channels' },
      ] }
    case '5':
      return { question: 'Mobile security risk you see most?', options: [
        { id: 'secret', label: 'Hardcoded secrets' },
        { id: 'storage', label: 'Insecure storage' },
        { id: 'ssl', label: 'Weak TLS/pinning' },
        { id: 'perm', label: 'Overbroad permissions' },
      ] }
    case '6':
      return { question: 'XSS vector you encounter most?', options: [
        { id: 'ref', label: 'Reflected' },
        { id: 'stored', label: 'Stored' },
        { id: 'dom', label: 'DOM-based' },
        { id: 'template', label: 'Template injection' },
      ] }
    case '7':
      return { question: 'CSRF defense you rely on most?', options: [
        { id: 'token', label: 'Tokens' },
        { id: 'samesite', label: 'SameSite cookies' },
        { id: 'double', label: 'Double-submit cookie' },
        { id: 'origin', label: 'Origin/Referer validation' },
      ] }
    case '8':
      return { question: 'Biggest crypto wallet pitfall?', options: [
        { id: 'seed', label: 'Leaky seed handling' },
        { id: 'backup', label: 'Missing backups' },
        { id: 'phish', label: 'Phishing approvals' },
        { id: 'key', label: 'Key reuse across apps' },
      ] }
    case '9':
      return { question: 'IoT weakness you see most?', options: [
        { id: 'default', label: 'Default creds' },
        { id: 'update', label: 'No updates' },
        { id: 'exposed', label: 'Exposed services' },
        { id: 'firm', label: 'Insecure firmware' },
      ] }
    case '10':
      return { question: 'Most concerning container misconfig?', options: [
        { id: 'priv', label: 'Privileged containers' },
        { id: 'sock', label: 'Docker socket mount' },
        { id: 'mount', label: 'Sensitive volume mounts' },
        { id: 'cap', label: 'Extra Linux capabilities' },
      ] }
    case '11':
      return { question: 'Biggest DeFi systematic risk?', options: [
        { id: 'bridge', label: 'Bridges' },
        { id: 'oracle', label: 'Oracles' },
        { id: 'gov', label: 'Governance' },
        { id: 'keymgmt', label: 'Key management' },
      ] }
    case '12':
      return { question: 'PQC adoption blocker for you?', options: [
        { id: 'inventory', label: 'Crypto inventory unknown' },
        { id: 'perf', label: 'Performance concerns' },
        { id: 'interop', label: 'Interoperability' },
        { id: 'skills', label: 'Skills gap' },
      ] }
    case '13':
      return { question: 'Phishing defense you’ll invest in next?', options: [
        { id: 'mfa', label: 'MFA expansion' },
        { id: 'train', label: 'Targeted training' },
        { id: 'dmarc', label: 'DMARC enforcement' },
        { id: 'sandbox', label: 'Attachment sandboxing' },
      ] }
    default:
      return { question: 'Which threat worries you most this quarter?', options: [
        { id: 'ransom', label: 'Ransomware' },
        { id: 'phish', label: 'Phishing/BEC' },
        { id: 'cloud', label: 'Cloud misconfigurations' },
        { id: 'supply', label: 'Supply chain' },
      ] }
  }
}

function getThreatDataForArticle(id: string): Array<{ label: string; value: number }> {
  switch (id) {
    case '1':
      // Kenya cybersecurity threats - ransomware, BEC, cloud misconfig, phishing
      return [
        { label: 'Ransomware', value: 156 },
        { label: 'BEC/Phishing', value: 287 },
        { label: 'Cloud misconfig', value: 124 },
        { label: 'Data exfil', value: 89 },
      ]
    case '2':
      // Ransomware protection - RaaS, credential compromise, RDP exposure
      return [
        { label: 'RaaS exploits', value: 201 },
        { label: 'Weak credentials', value: 267 },
        { label: 'RDP/SSH exposed', value: 142 },
        { label: 'Unpatched systems', value: 178 },
      ]
    case '3':
      // Banking CTF - SQL injection, IDOR, CSRF, weak auth
      return [
        { label: 'SQL injection', value: 89 },
        { label: 'IDOR flaws', value: 102 },
        { label: 'CSRF vulnerabilities', value: 67 },
        { label: 'Auth bypass', value: 95 },
      ]
    case '4':
      // M-Pesa security - SIM swap, API key exposure, credential theft
      return [
        { label: 'SIM swap attacks', value: 245 },
        { label: 'API key leaks', value: 134 },
        { label: 'Credential theft', value: 189 },
        { label: 'Malware/sideload', value: 156 },
      ]
    case '5':
      // AI-powered attacks - phishing, social engineering, evasion
      return [
        { label: 'AI phishing lures', value: 312 },
        { label: 'Social eng', value: 198 },
        { label: 'Polymorphic malware', value: 167 },
        { label: 'Deepfake fraud', value: 89 },
      ]
    case '6':
      // Kenya Data Protection Act - compliance breaches, data leaks
      return [
        { label: 'Data breach incidents', value: 78 },
        { label: 'Compliance failures', value: 92 },
        { label: 'Unauthorized access', value: 134 },
        { label: 'Vendor compromise', value: 56 },
      ]
    case '7':
      // SIM swap fraud - telco social eng, account takeover
      return [
        { label: 'SIM swaps', value: 289 },
        { label: 'Account takeover', value: 201 },
        { label: 'OTP interception', value: 167 },
        { label: 'Insider collusion', value: 45 },
      ]
    case '8':
      // Bug bounty - common vuln types found by hunters
      return [
        { label: 'IDOR vulnerabilities', value: 124 },
        { label: 'XSS/Injection', value: 189 },
        { label: 'Auth bypass', value: 98 },
        { label: 'Misconfiguration', value: 112 },
      ]
    case '9':
      // SOC operations - detection priorities
      return [
        { label: 'Brute force attempts', value: 567 },
        { label: 'Impossible travel', value: 234 },
        { label: 'Priv escalation', value: 145 },
        { label: 'Data exfiltration', value: 198 },
      ]
    case '10':
      // Smart parking IoT - exposed admin, IDOR, API flaws
      return [
        { label: 'Exposed admin panel', value: 45 },
        { label: 'IDOR exploitation', value: 67 },
        { label: 'MQTT misconfiguration', value: 89 },
        { label: 'API bypass', value: 56 },
      ]
    case '11':
      // DeFi threats - bridge exploits, oracle manipulation
      return [
        { label: 'Bridge exploits', value: 234 },
        { label: 'Oracle manipulation', value: 156 },
        { label: 'Governance attacks', value: 89 },
        { label: 'Smart contract flaws', value: 178 },
      ]
    case '12':
      // Post-quantum crypto - RSA still dominant threat
      return [
        { label: 'RSA compromise risk', value: 445 },
        { label: 'TLS vulnerabilities', value: 267 },
        { label: 'Key management fail', value: 178 },
        { label: 'Harvest now, decrypt later', value: 223 },
      ]
    case '13':
      // AI phishing - DMARC bypass, deepfakes, BEC
      return [
        { label: 'DMARC bypass', value: 398 },
        { label: 'Deepfake lures', value: 245 },
        { label: 'BEC attacks', value: 367 },
        { label: 'MFA fatigue', value: 289 },
      ]
    default:
      return [
        { label: 'Phishing', value: 42 },
        { label: 'Credential stuffing', value: 28 },
        { label: 'Vuln exploit', value: 35 },
        { label: 'Misconfig', value: 31 },
      ]
  }
}

export default function BlogPostClient({ params, articles }: { params: { id: string }; articles: ArticlesMap }) {
  const [currentId, setCurrentId] = useState<string>(params.id)
  const post = useMemo(() => articles[currentId] || articles['1'], [currentId, articles])

  const [liked, setLiked] = useState<boolean>(false)
  const [shareOpen, setShareOpen] = useState<boolean>(false)
  const [shareUrl, setShareUrl] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.origin + `/blog/${currentId}`)
    }
  }, [currentId])

  useEffect(() => {
    setLiked(false)
    setShareOpen(false)
  }, [currentId])

  const shareLinks = useMemo(() => {
    const text = encodeURIComponent(post.title)
    const utm = 'utm_source=share&utm_medium=article&utm_campaign=blog-share'
    const link = shareUrl ? `${shareUrl}?${utm}` : ''
    const url = encodeURIComponent(link)
    return {
      x: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`,
    }
  }, [post.title, shareUrl])

  const related = useMemo(() => {
    return Object.entries(articles)
      .filter(([id, a]) => id !== currentId && a.category === post.category)
      .map(([id, a]) => ({ id, title: a.title, date: a.date }))
  }, [currentId, post.category, articles])

  const quote = getQuote(post.category)
  const cover = post.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop'
  const expandedContent = useMemo(() => ensureMinWords(post.content, 1200, post.category), [post.content, post.category])
  const withReferences = useMemo(() => expandedContent + buildReferences(post.category), [expandedContent, post.category])
  const dynamicRead = useMemo(() => `${estimateReadTimeMinutes(withReferences)} min`, [withReferences])
  const displayRead = post.readTime || dynamicRead

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="pt-20 pb-20">
      <article className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-2 bg-cyber-blue/20 text-cyber-blue rounded-full text-sm font-bold">{post.category}</span>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {displayRead}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(post.date)}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-snug">{post.title}</h1>
          <div className="flex items-center justify-between border-t border-b border-cyber-green/20 py-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-cyber-green rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-black" />
              </div>
              <div>
                <div className="font-bold">{post.author}</div>
                <div className="text-sm text-gray-500">Security Team</div>
              </div>
            </div>
            <div className="relative flex items-center space-x-3">
              <button className={`p-2 hover:bg-cyber-darkGray rounded-lg transition-colors ${liked ? 'text-red-500' : 'text-gray-400'}`} onClick={() => setLiked((v) => !v)} aria-label="Like">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-cyber-darkGray rounded-lg transition-colors" onClick={() => setShareOpen((o) => !o)} aria-label="Share">
                <Share2 className="h-5 w-5 text-gray-400" />
              </button>
              {shareOpen && (
                <div className="absolute z-10 right-0 top-10 bg-cyber-darker border border-cyber-green/20 rounded-lg p-3 flex flex-wrap gap-3 max-w-[min(90vw,400px)]">
                  <a href={shareLinks.x} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyber-green">X</a>
                  <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyber-green">LinkedIn</a>
                  <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyber-green">Facebook</a>
                  <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyber-green">WhatsApp</a>
                  <button
                    onClick={async () => {
                      try {
                        const utm = 'utm_source=share&utm_medium=copy_link&utm_campaign=blog-share'
                        const link = shareUrl ? `${shareUrl}?${utm}` : ''
                        await navigator.clipboard.writeText(link)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 1500)
                      } catch (e) {}
                    }}
                    className="ml-auto px-2 py-1 text-xs border border-cyber-green/40 rounded text-cyber-green hover:bg-cyber-green/10 transition-colors flex items-center gap-1"
                    aria-label="Copy link"
                  >
                    <Clipboard className="h-3 w-3" /> {copied ? 'Copied' : 'Copy link'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="mb-8">
          <div className="relative w-full h-auto rounded-lg border border-cyber-green/20 bg-cyber-darkGray/40 flex items-center justify-center">
            <Image 
              src={post.image || ''} 
              alt={post.title} 
              width={800}
              height={400}
              priority 
              className="object-contain p-4" 
              style={{ maxHeight: '500px', width: 'auto' }}
            />
          </div>
        </div>

        {/* Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="prose prose-invert max-w-none">
          <div className="cyber-card p-7 space-y-5">
            <blockquote className="italic text-gray-300 border-l-4 border-cyber-green pl-4">
              “{getQuote(post.category).text}” — <span className="text-cyber-green">{getQuote(post.category).author}</span>
            </blockquote>
            <div className="blog-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h2: ({ node, ...props }) => <h2 className="mt-8 mb-3 text-2xl font-bold" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="mt-6 mb-2 text-xl font-semibold" {...props} />,
                  p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-1 marker:text-cyber-green" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-1 marker:text-cyber-green" {...props} />,
                  li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                  a: ({ node, ...props }) => <a className="text-cyber-green underline hover:no-underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-cyber-green/40 pl-4 italic text-gray-300" {...props} />,
                  code: ({ node, inline, ...props }: any) => inline ? (
                    <code className="px-1 py-0.5 bg-cyber-darkGray/60 rounded" {...props} />
                  ) : (
                    <code className="block p-4 bg-cyber-darkGray/60 rounded overflow-auto" {...props} />
                  ),
                }}
              >
                {withReferences}
              </ReactMarkdown>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Poll {...getPollForArticle(currentId, post.category)} />
              <Quiz {...getQuizForArticle(currentId, post.category)} />
            </div>
            <ThreatBarChart title="Incident counts by vector (sample)" data={getThreatDataForArticle(currentId)} />
          </div>
        </motion.div>

        <div className="mt-12 p-6 border border-cyber-green/20 rounded-lg bg-cyber-darkGray/40">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-cyber-green rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-black" />
            </div>
            <div>
              <div className="font-bold">{post.author}</div>
              <div className="text-sm text-gray-400">CyberPulse KE — Research & Editorial</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-400">We cover cyber threats, hands-on defenses, and CTF tactics for Kenya and beyond.</p>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12">
          <div className="text-lg font-semibold mb-4">Related Articles</div>
          <div className="space-y-3">
            {Object.entries(articles)
              .filter(([id, a]) => id !== currentId && a.category === post.category)
              .slice(0, 4)
              .map(([id, a]) => (
                <div key={id} className="cyber-card p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold">{a.title}</div>
                    <div className="text-sm text-gray-500">{formatDate(a.date)}</div>
                  </div>
                  <Link href={`/blog/${id}`} className="px-4 py-2 border border-cyber-green/40 rounded-lg text-cyber-green hover:bg-cyber-green/10 transition-colors">
                    Read
                  </Link>
                </div>
              ))}
          </div>
        </motion.div>
      </article>
    </div>
  )
}



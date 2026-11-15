export interface ExpertiseItem {
  id: string;
  title: string;
  summary: string;
  capabilities: string[];
}

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface ProjectVisual {
  src: string;
  title: string;
  badge: string;
  caption: string;
}

export interface ProjectPipelineStep {
  step: string;
  title: string;
  subtitle: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  shortTitle: string;
  title: string;
  image: string;
  workImage: string;
  videoUrl?: string;
  externalUrl?: string;
  category: string[];
  clientLabel: string;
  role: string;
  summary: string;
  metrics: { label: string; value: string }[];
  gallery: ProjectVisual[];
  pipelineSteps: ProjectPipelineStep[];
  overview: string[];
  problem: string;
  solution: string[];
  keyFeatures: ProjectFeature[];
  stack: string[];
  status: string;
}

export interface EmploymentItem {
  id: string;
  role: string;
  organizationLabel: string;
  location: string;
  period: string;
  current: boolean;
  summary: string;
  contributions: string[];
  technologyTags: string[];
}

export const PORTFOLIO_PROFILE = {
  name: 'Shoaib Tashrif',
  title: 'Full Stack AI Software Engineer',
  basedIn: 'Pakistan · Remote International',
  email: 'shoaib.tashrif@gmail.com',
  calendlyUrl: 'https://calendly.com/shoaib-tashrif/30min',
  links: {
    github: 'https://github.com/shoaibtashrif',
    linkedin: 'https://www.linkedin.com/in/shoaibtashrif',
    portfolio: 'https://shoaibtashrif.vercel.app',
  },
  oneLine:
    'Full Stack AI Software Engineer building production AI agents, real-time voice systems, medical & cybersecurity AI, business automations and full-stack software.',
  shortSummary:
    'Full Stack AI Software Engineer specializing in voice and chat agents, agentic workflows, DICOM medical imaging & prediction AI, cybersecurity telemetry, RAG, backend systems and business automation.',
  detailedSummary:
    'I am a Full Stack AI Software Engineer with 4+ years of professional experience across software engineering and AI. My work spans real-time conversational AI, speech-to-text and text-to-speech pipelines, DICOM ultrasound & diagnostic AI prediction, network cybersecurity intelligence, agentic systems, workflow automation and complete full-stack applications.',
  metrics: [
    { label: 'Experience', value: '4+ Years' },
    { label: 'Upwork Status', value: 'Top Rated' },
    { label: 'Job Success', value: '100% JSS' },
    { label: 'Delivered Work', value: '20+ Projects' },
  ],
  internationalRegions: ['Canada', 'United States', 'United Kingdom', 'Australia', 'Global Remote'],
  education: {
    degree: 'BS Software Engineering',
    institution: 'PMAS Arid Agriculture University',
    campus: 'Information Technology Campus, Rawalpindi, Pakistan',
    cgpa: '3.3 / 4.0',
  },
};

export const EXPERTISE_AREAS: ExpertiseItem[] = [
  {
    id: 'voice-ai',
    title: 'Real-time Voice AI',
    summary:
      'AI phone agents and live voice/video experiences with low-latency audio pipelines, call workflows, streaming, transfers, voicemail handling and business-system integrations.',
    capabilities: [
      'Inbound and outbound voice agents (90+ languages)',
      'STT -> LLM -> TTS real-time streaming architecture',
      'Silero VAD and automatic end-of-speech turn taking',
      'Animated AI avatar video & voice call integration',
      'Twilio media streams and live call transfers',
      'Appointment booking and patient/customer intake',
      'Concurrent-call engineering & load balancing',
      'Speech and conversation state management',
    ],
  },
  {
    id: 'agents',
    title: 'LLM and Agentic Systems',
    summary:
      'Tool-using agents, multi-agent orchestration, DICOM & cybersecurity AI models, structured workflows and retrieval-grounded assistants built for production reliability.',
    capabilities: [
      'LangGraph stateful agents & supervisors',
      'DICOM medical imaging reading & AI prediction',
      'Function/tool calling with live databases & CRMs',
      'RAG and enterprise document retrieval',
      'Prompt engineering, guardrails & evaluation',
      'Conversation memory and cross-channel checkpoints',
      'Open-source (Ollama) and hosted LLM integration',
      'Human-in-the-loop escalation workflows',
    ],
  },
  {
    id: 'automations',
    title: 'Business & Marketing Automation',
    summary:
      'End-to-end operational and marketing automation linked to real CRMs, delivery logistics, payment systems, and autonomous social media engines.',
    capabilities: [
      'Autonomous social media content & visual generation',
      'Multi-channel auto-posting (LinkedIn, Instagram, FB, X)',
      'CRM handling & pipeline sync (GoHighLevel, Zoho)',
      'Delivery scheduling, skip/cancel & payment workflows',
      'Calendar and appointment actions',
      'n8n / Zapier / Make & custom Python workers',
      'Automated email intake and follow-up sequences',
      'Operational event tracking & analytics',
    ],
  },
  {
    id: 'full-stack',
    title: 'Full Stack & Backend Engineering',
    summary:
      'Production web applications, high-throughput microservices, network management portals, APIs, dashboards, and databases.',
    capabilities: [
      'Next.js and React TypeScript frontends',
      'Python / FastAPI & Django backends',
      'Node.js / Express / TypeScript microservices',
      'REST APIs, WebSockets & real-time webhooks',
      'PostgreSQL, MongoDB, MySQL & Redis',
      'DICOM PACS/RIS & EMR system integrations',
      'Admin portals, CMS & analytics dashboards',
      'Modular microservice architectures',
    ],
  },
  {
    id: 'infrastructure',
    title: 'Deployment & Reliability',
    summary:
      'Ship and maintain AI-enabled products on cloud infrastructure and Linux servers with observability, security, and concurrency control.',
    capabilities: [
      'Docker & multi-container orchestration',
      'AWS EC2, S3 & Google Cloud Platform',
      'Linux / Ubuntu VPS & Nginx reverse proxy',
      'CI/CD automated deployment pipelines',
      'Async queues (RabbitMQ / Redis) & concurrency',
      'Sub-second voice & inference latency optimization',
      'Production monitoring and debugging',
      'Zero-downtime service management',
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'hilum-healthcare-ai',
    slug: 'hilum-healthcare-ai',
    shortTitle: 'Hilum Healthcare & DICOM AI',
    title: 'Hilum Platforms (Wosler) — Healthcare Automation, DICOM Reading & Prediction AI',
    image: '/images/real/hilum-hero.png',
    workImage: '/images/shoaib-whiteboard-colleague.jpg',
    externalUrl: 'https://hilum.ca/',
    category: ['Healthcare AI', 'DICOM & Prediction AI', 'Voice AI', 'Backend Microservices'],
    clientLabel: 'Hilum / Wosler Corp. (Canada)',
    role: 'Full Stack AI Software Engineer',
    summary:
      '24/7 AI patient voice reception (Hilum Admin), self-service clinic check-in (Hilum Kiosk), DICOM ultrasound reading & AI diagnostic prediction (SonoSystem), and FastAPI backend microservices.',
    metrics: [
      { label: 'Patient Voice Reception', value: '24/7 Live AI' },
      { label: 'Medical Imaging', value: 'DICOM + AI Prediction' },
      { label: 'Clinic Integration', value: 'RIS / EMR Sync' },
      { label: 'Core Stack', value: 'FastAPI · LangGraph' },
    ],
    gallery: [
      {
        src: '/images/real/hilum-hero.png',
        title: 'Hilum Healthcare Ecosystem (hilum.ca)',
        badge: 'Live Platform Visual',
        caption: 'Unified Canadian healthcare platform eliminating clinic admin burnout.',
      },
      {
        src: '/images/real/hilum-admin-ui.png',
        title: 'Hilum Admin — AI Reception & Requisition Engine',
        badge: 'Hilum Admin UI',
        caption: 'Automated phone calls, requisition OCR reading, and instant RIS/EMR appointment booking.',
      },
      {
        src: '/images/real/hilum-sonos-card.png',
        title: 'SonoSystem — DICOM Reading & AI Prediction',
        badge: 'SonoSystem Medical AI',
        caption: 'Reads ultrasound DICOM studies, extracts measurements, and runs AI diagnostic predictions.',
      },
      {
        src: '/images/real/hilum-kiosk-card.png',
        title: 'Hilum Kiosk & Clinic Automation',
        badge: 'Hilum Kiosk',
        caption: 'Self-service patient check-in and real-time clinic workflow orchestration.',
      },
      {
        src: '/images/proj-hilum-dicom.jpg',
        title: 'DICOM Ultrasound Telemetry & AI Scoring View',
        badge: 'Prediction AI Pipeline',
        caption: 'Backend DICOM parser + anomaly probability overlay for diagnostic teams.',
      },
      {
        src: '/images/real/hilum-admin-card.png',
        title: '24/7 Patient Call & Booking Automation',
        badge: 'Voice AI Workflow',
        caption: 'Handles inbound/outbound patient scheduling calls with zero hold time.',
      },
    ],
    pipelineSteps: [
      { step: '01', title: 'Patient Call / Requisition', subtitle: 'Twilio Voice Stream or Fax/PDF Upload' },
      { step: '02', title: 'LangGraph + DICOM AI', subtitle: 'Intent Routing, OCR & DICOM Ultrasound Parsing' },
      { step: '03', title: 'Prediction & RIS/EMR Sync', subtitle: 'AI Diagnostic Scoring & Live Slot Booking' },
      { step: '04', title: 'Automated Confirmation', subtitle: 'Instant Patient SMS/Voice + Radiologist Report' },
    ],
    overview: [
      'Built for Canadian clinics on hilum.ca: combines Hilum Admin (24/7 AI voice reception & requisition booking), Hilum Kiosk, and SonoSystem (DICOM reading & AI diagnostic prediction).',
    ],
    problem:
      'Clinics face heavy phone queues, manual faxed requisitions, and time-consuming manual review of DICOM ultrasound studies.',
    solution: [
      '24/7 AI voice & chat reception (STT -> LangGraph -> TTS) connected to clinic RIS/EMR',
      'DICOM ultrasound study reader & AI diagnostic prediction pipeline for SonoSystem',
      'Automated medical requisition OCR extraction & scheduling microservices in Python/FastAPI',
    ],
    keyFeatures: [
      {
        title: 'DICOM Reading & Prediction AI',
        description: 'Parses ultrasound DICOM metadata/pixels and runs AI diagnostic prediction overlays.',
      },
      {
        title: 'Hilum Admin 24/7 Voice AI',
        description: 'Answers patient calls, verifies identity, and books/reschedules in RIS/EMR.',
      },
      {
        title: 'Requisition OCR Automation',
        description: 'Extracts exam codes from physician requisitions and triggers booking outreach.',
      },
      {
        title: 'FastAPI Microservices',
        description: 'High-concurrency Dockerized backend handling simultaneous clinic phone lines & imaging.',
      },
    ],
    stack: ['Python', 'FastAPI', 'DICOM / Pydicom', 'Prediction AI', 'LangGraph', 'Twilio', 'Whisper', 'ElevenLabs', 'PostgreSQL', 'Docker'],
    status: 'Production · Live at hilum.ca',
  },
  {
    id: 'h2o-water-company',
    slug: 'h2o-water-company',
    shortTitle: 'H2O Water Company Platform',
    title: 'H2O Water Company — Delivery Operations, CRM, Payments & AI Support',
    image: '/images/real/h2o-delivery.jpg',
    workImage: '/images/shoaib-cafe-coding.jpg',
    externalUrl: 'https://h2owatercompany.com/',
    category: ['Full Stack', 'CRM & Payments', 'Agentic Automation', 'Logistics'],
    clientLabel: 'H2O Water Company (Bay Area, USA)',
    role: 'Full Stack AI & Automation Engineer',
    summary:
      'Complete digital operations for Bay Area 5-gallon purified & alkaline water delivery—covering route scheduling, CRM handling, recurring payments, AI customer support, and marketing.',
    metrics: [
      { label: 'Delivery Region', value: 'SF Bay Area' },
      { label: 'Order Actions', value: 'Auto Skip / Reschedule' },
      { label: 'Billing & CRM', value: '2-Way Live Sync' },
      { label: 'Marketing', value: 'Automated Campaigns' },
    ],
    gallery: [
      {
        src: '/images/real/h2o-delivery.jpg',
        title: 'H2O Water Company — Bay Area Delivery Fleet',
        badge: 'Live Website Visual',
        caption: 'Direct 5-gallon water delivery for homes, offices, gyms, and schools.',
      },
      {
        src: '/images/proj-h2o-platform.jpg',
        title: 'Route Logistics, CRM & Payment Operations Center',
        badge: 'Operations Dashboard',
        caption: 'Unified dashboard managing recurring deliveries, CRM accounts, and automated billing.',
      },
      {
        src: '/images/real/h2o-purified.png',
        title: '5-Gallon Purified Water Subscription Workflow',
        badge: 'Product & Subscription',
        caption: 'Automated recurring order management and bottle quantity modifications.',
      },
      {
        src: '/images/real/h2o-alkaline.png',
        title: '5-Gallon Alkaline Water Commercial Accounts',
        badge: 'Commercial CRM',
        caption: 'Custom delivery intervals and multi-location billing for gyms and offices.',
      },
      {
        src: '/images/real/h2o-dispenser.png',
        title: 'Dispenser Rentals & Equipment Tracking',
        badge: 'Inventory & Billing',
        caption: 'Tracks dispenser installations, deposits, and recurring rental invoices.',
      },
      {
        src: '/images/real/h2o-jugs.png',
        title: 'Automated Customer Support & Route Updates',
        badge: 'AI Support Agent',
        caption: 'AI agent reads customer emails/calls and executes skip or reschedule actions in the DB.',
      },
    ],
    pipelineSteps: [
      { step: '01', title: 'Customer Order / Request', subtitle: 'Web Storefront, Email, or Phone Inquiry' },
      { step: '02', title: 'AI CRM Verification', subtitle: 'Matches Account, Route & Subscription Status' },
      { step: '03', title: 'Route & Payment Execution', subtitle: 'Updates Delivery Calendar & Recurring Billing' },
      { step: '04', title: 'Instant Confirmation', subtitle: 'Automated Receipt, SMS Alert & Marketing Sync' },
    ],
    overview: [
      'Powers h2owatercompany.com across the San Francisco Bay Area with automated delivery scheduling, CRM account management, recurring payment flows, and AI support agents.',
    ],
    problem:
      'Manual handling of recurring delivery changes, skip/cancel requests, CRM updates, and subscription billing slowed down daily operations.',
    solution: [
      'Full-stack subscription & route scheduling for 5-gallon purified and alkaline water deliveries',
      'AI Customer Operations Agent that auto-executes skip, pause, and reschedule requests in CRM',
      'Integrated recurring payment processing, invoice automation, and growth marketing campaigns',
    ],
    keyFeatures: [
      {
        title: 'Automated Delivery Scheduling',
        description: 'Dynamic recurring route calendars with instant AI skip, pause, and reschedule execution.',
      },
      {
        title: 'Unified CRM Lifecycle',
        description: 'Tracks residential, office, gym, and school accounts with live bottle & dispenser history.',
      },
      {
        title: 'Recurring Payments & Billing',
        description: 'Automated card billing, deposit tracking, and instant invoice adjustments.',
      },
      {
        title: 'AI Email & Call Support Agent',
        description: 'Matches customer records and resolves routine delivery changes without staff intervention.',
      },
    ],
    stack: ['Python', 'FastAPI', 'React', 'Node.js', 'CRM Integration', 'Payment Gateways', 'LangChain', 'PostgreSQL', 'Docker'],
    status: 'Production · Live at h2owatercompany.com',
  },
  {
    id: 'social-media-automation',
    slug: 'social-media-automation',
    shortTitle: 'AI Social Media Automation',
    title: 'Autonomous AI Social Media Engine — Instagram, YouTube, TikTok & Facebook Mobile Feeds',
    image: '/images/social-phones-showcase.jpg',
    workImage: '/images/shoaib-tech-talk.jpg',
    category: ['Marketing AI', 'Instagram · YouTube · TikTok · FB', 'Social Automation', 'CRM Sync'],
    clientLabel: 'H2O Water Company & Growth Brands',
    role: 'AI Automation & Full Stack Engineer',
    summary:
      'Dedicated autonomous marketing engine that generates branded vertical Reels, Shorts, TikToks & posts, schedules content calendars, and auto-publishes across Instagram, YouTube, TikTok, and Facebook.',
    metrics: [
      { label: 'Mobile Platforms', value: 'IG · YouTube · TikTok · FB' },
      { label: 'Content Creation', value: 'AI Video + Visuals' },
      { label: 'Publishing Mode', value: '100% Auto-Pilot' },
      { label: 'Lead Capture', value: 'Direct CRM Sync' },
    ],
    gallery: [
      {
        src: '/images/social-phones-showcase.jpg',
        title: 'Instagram, YouTube, TikTok & Facebook Live Mobile App Feeds',
        badge: '4-Phone Live Showcase',
        caption: 'Simultaneous native vertical publishing across Instagram Reels, YouTube Shorts, TikTok, and Facebook.',
      },
      {
        src: '/images/ai-social-video-studio.jpg',
        title: 'AI Social Media Content Calendar & Auto-Poster',
        badge: 'Automation Studio',
        caption: 'Generates branded visuals & captions and auto-schedules across 4 social networks.',
      },
      {
        src: '/images/real/h2o-jugs.png',
        title: 'Automated Product Campaign Visuals (H2O Water)',
        badge: 'AI Creative Output',
        caption: 'Promotional graphics and local Bay Area delivery offers generated automatically.',
      },
      {
        src: '/images/proj-automation-crm.jpg',
        title: 'Social Engagement to CRM Lead Attribution',
        badge: 'CRM Webhook Pipeline',
        caption: 'Routes comments, DMs, and campaign clicks directly into CRM sales pipelines.',
      },
    ],
    pipelineSteps: [
      { step: '01', title: 'Campaign Brief / Trigger', subtitle: 'Product Offer, Topic, or Weekly Schedule' },
      { step: '02', title: 'AI Copy & Image Studio', subtitle: 'Generates Platform Captions, Hashtags & Graphics' },
      { step: '03', title: 'Multi-Channel Auto-Post', subtitle: 'Publishes to Instagram, Facebook, LinkedIn & X' },
      { step: '04', title: 'CRM Lead Attribution', subtitle: 'Captures DMs/Clicks & Triggers Sales Follow-Up' },
    ],
    overview: [
      'A standalone AI marketing platform built to automate daily social content creation, visual design, scheduling, and multi-platform publishing.',
    ],
    problem:
      'Creating daily branded graphics, writing platform-specific captions, and posting manually across 4+ social channels takes hours every week.',
    solution: [
      'AI Content & Visual Generator producing ready-to-publish graphics, hooks, and hashtag sets',
      'Automated multi-platform scheduler connected to Meta Graph API, LinkedIn API, and X',
      'Social-to-CRM webhook automation that turns post engagement into tracked CRM leads',
    ],
    keyFeatures: [
      {
        title: 'AI Copy & Visual Studio',
        description: 'Creates branded promotional graphics and tailored captions for each social network.',
      },
      {
        title: 'Multi-Channel Auto-Posting',
        description: 'Direct API publishing to Instagram, Facebook Pages, LinkedIn, and X on autopilot.',
      },
      {
        title: 'Approval Queue & Calendar',
        description: 'Visual weekly calendar supporting both 1-click review and hands-free auto-publishing.',
      },
      {
        title: 'Social-to-CRM Sync',
        description: 'Pushes inbound social inquiries and campaign leads straight into the CRM.',
      },
    ],
    stack: ['Python', 'FastAPI', 'React', 'OpenAI / Gemini', 'Image Generation APIs', 'Meta Graph API', 'LinkedIn API', 'n8n', 'PostgreSQL'],
    status: 'Production · Active Automation Pipeline',
  },
  {
    id: 'sergeant-ai-coach',
    slug: 'sergeant-ai-coach',
    shortTitle: 'Sergeant AI Coach (Video & Voice)',
    title: 'Sergeant AI ("Better You") — Animated Character Video Call & Accountability Coach',
    image: '/images/proj-sergeant-ui.jpg',
    workImage: '/images/shoaib-whiteboard-architecture.jpg',
    videoUrl: '/videos/sergeant-ai-coach-promo.mp4',
    category: ['Animated Video AI', 'Voice AI', 'Accountability Coach', 'Full Stack'],
    clientLabel: 'Better You / Shaista AI Coaching Platform',
    role: 'Lead AI & Full Stack Engineer',
    summary:
      'Interactive AI accountability coach where you talk on a real FaceTime/Zoom-style video call with an expressive 3D Anime Sergeant AI character featuring human-like facial reactions, eye contact, nodding, and real-time voice lip-sync.',
    metrics: [
      { label: 'Live Interaction', value: 'Anime Video Call' },
      { label: 'AI Reactions', value: 'Human-Like Emotions' },
      { label: 'Coaching Memory', value: 'Cross-Session RAG' },
      { label: 'Accountability', value: 'Daily Check-In Calls' },
    ],
    gallery: [
      {
        src: '/images/proj-sergeant-ui.jpg',
        title: 'Better You — Sergeant AI Coaching App Screens',
        badge: 'Real App UI Suite',
        caption: 'Welcome screen, goal & aspiration selection, live voice/video call stage, and coaching chat.',
      },
      {
        src: '/images/sergeant-anime-videocall.jpg',
        title: 'Face-to-Face Video Call with Interactive AI Anime Sergeant',
        badge: 'Live Anime Video Call',
        caption: 'Talk just like a normal human video call while the AI Anime Coach reacts with natural expressions, nodding, and lip-sync.',
      },
      {
        src: '/images/sergeant-avatar.png',
        title: 'Animated Sergeant AI Character Avatar',
        badge: 'Interactive Character',
        caption: 'Expressive animated coach character with live audio-driven lip-sync and visual states.',
      },
      {
        src: '/images/sergeant-flow.png',
        title: 'Sergeant AI Coaching & Prompt Orchestration Flow',
        badge: 'System Architecture',
        caption: 'End-to-end architecture connecting user goals, persistent memory, and real-time voice/video.',
      },
    ],
    pipelineSteps: [
      { step: '01', title: 'Live Video / Voice Call', subtitle: 'Caller Speaks Face-to-Face with Sergeant AI' },
      { step: '02', title: 'Shared Memory Lookup', subtitle: 'Recalls Goals, Streaks & Yesterday’s Commitments' },
      { step: '03', title: 'Expressive TTS + Lip-Sync', subtitle: 'Real-Time Voice Synthesis & Avatar Animation' },
      { step: '04', title: 'Accountability Score', subtitle: 'Updates Daily Streak & Schedules Next Check-In' },
    ],
    overview: [
      'Sergeant AI ("Better You") brings an animated AI accountability coach to life on live video and voice calls—helping users achieve fitness, career, and discipline goals.',
    ],
    problem:
      'Static habit apps fail because users lack real-time, face-to-face human-like accountability and continuity.',
    solution: [
      'Live animated character video calls with real-time voice lip-sync and expressive visual states',
      'Proactive daily accountability calls that verify goal completion and update streak metrics',
      'Shared long-term memory across text chat, voice calls, and personalized action plans',
    ],
    keyFeatures: [
      {
        title: 'Live Animated Video Calls',
        description: 'Talk face-to-face on video with the animated Sergeant AI character reacting in real time.',
      },
      {
        title: 'Accountability Check-In Calls',
        description: 'Scheduled voice/video check-ins that keep users committed to daily habits and targets.',
      },
      {
        title: 'Persistent Coaching Memory',
        description: 'Remembers every goal, milestone, and promise across chat and video sessions.',
      },
      {
        title: 'Streak & Goal Analytics',
        description: 'Tracks daily completion scores, milestones, and structured action roadmaps.',
      },
    ],
    stack: ['React', 'TypeScript', 'Python', 'FastAPI', 'WebRTC / WebSockets', 'Animated Avatar Lip-Sync', 'Real-time Voice AI', 'LangGraph', 'PostgreSQL'],
    status: 'Built · Interactive Video & Voice AI Platform',
  },
  {
    id: 'valyrian-systems',
    slug: 'valyrian-systems',
    shortTitle: 'Valyrian Systems (AI Security)',
    title: 'Valyrian Systems (VSI) — AI Network Intelligence, DPI & Cybersecurity',
    image: '/images/real/valyrian-1.png',
    workImage: '/images/shoaib-whiteboard-colleague.jpg',
    externalUrl: 'https://valyriansys.com/',
    category: ['AI Cybersecurity', 'Network Intelligence', 'Backend Systems', 'DPI Telemetry'],
    clientLabel: 'Valyrian Systems Inc. (VSI)',
    role: 'Backend & AI Software Engineer',
    summary:
      'Carrier-grade network intelligence and AI cybersecurity combining Advanced Deep Packet Inspection (DPI), real-time anomaly detection, and a centralized Web Management System.',
    metrics: [
      { label: 'Core Engine', value: 'Advanced DPI + AI' },
      { label: 'Threat Detection', value: 'Line-Rate Real-Time' },
      { label: 'Control Plane', value: 'Web Management UI' },
      { label: 'Sectors', value: 'MNO · Cloud · Gov' },
    ],
    gallery: [
      {
        src: '/images/real/valyrian-1.png',
        title: 'Valyrian Systems (valyriansys.com) — Network Intelligence',
        badge: 'Live Platform Visual',
        caption: 'Actionable network intelligence and AI security for telecoms, cloud, and government.',
      },
      {
        src: '/images/real/valyrian-4.png',
        title: 'Advanced Deep Packet Inspection (DPI) Telemetry',
        badge: 'DPI Technology',
        caption: 'Real-time classification of protocols, encrypted flows, and application traffic.',
      },
      {
        src: '/images/real/valyrian-5.png',
        title: 'Centralized Web Management System',
        badge: 'Management Console',
        caption: 'Unified policy control, bandwidth QoE monitoring, and regulatory compliance reporting.',
      },
      {
        src: '/images/real/valyrian-2.jpg',
        title: 'Carrier, MNO & Cloud Security Infrastructure',
        badge: 'Enterprise Scale',
        caption: 'Protects Mobile Network Operators, MSSPs, Cloud Providers, and Government networks.',
      },
      {
        src: '/images/real/valyrian-3.jpg',
        title: 'Revenue, Retention & Regulatory Intelligence',
        badge: 'Three Core Pillars',
        caption: 'Turns high-throughput network metadata into security and business outcomes.',
      },
      {
        src: '/images/proj-valyrian-security.jpg',
        title: 'AI Threat & Anomaly Detection Command View',
        badge: 'AI Cybersecurity',
        caption: 'Flags DDoS signatures, zero-day anomalies, and policy violations in real time.',
      },
    ],
    pipelineSteps: [
      { step: '01', title: 'Line-Rate Traffic Capture', subtitle: 'Carrier / Cloud Packet Streams' },
      { step: '02', title: 'Advanced DPI Engine', subtitle: 'Protocol & Application Classification' },
      { step: '03', title: 'AI Anomaly Detection', subtitle: 'Real-Time Threat & Intrusion Scoring' },
      { step: '04', title: 'Web Management System', subtitle: 'Policy Enforcement & Regulatory Dashboards' },
    ],
    overview: [
      'Valyrian Systems (valyriansys.com) delivers Advanced DPI and AI cybersecurity solutions for Telecom Carriers, MNOs, MSPs, Cloud Providers, and Government agencies.',
    ],
    problem:
      'Operators and security teams need real-time visibility into complex network traffic and instant AI anomaly detection at carrier scale.',
    solution: [
      'Backend data pipelines and APIs integrating with VSI’s Advanced Deep Packet Inspection (DPI) engine',
      'AI-assisted network threat and anomaly detection workflows for malicious traffic and DDoS patterns',
      'Centralized Web Management System components for security policy orchestration and telemetry',
    ],
    keyFeatures: [
      {
        title: 'Advanced DPI Intelligence',
        description: 'Real-time protocol and application classification across high-throughput carrier links.',
      },
      {
        title: 'AI Threat & Anomaly Detection',
        description: 'Detects abnormal traffic spikes, botnets, and policy violations in real time.',
      },
      {
        title: 'Web Management System',
        description: 'Centralized console to configure rules, inspect QoE, and generate audit reports.',
      },
      {
        title: 'Telecom, Cloud & Gov Scale',
        description: 'Built for MNOs, Telecoms, MSPs/MSSPs, Cloud Providers, and Government defense.',
      },
    ],
    stack: ['Python', 'Backend Microservices', 'AI Anomaly Detection', 'Deep Packet Inspection (DPI)', 'REST APIs', 'PostgreSQL', 'Time-Series DB', 'Linux', 'Docker'],
    status: 'Production · Live at valyriansys.com',
  },
  {
    id: 'nextstep-multi-agent',
    slug: 'nextstep-multi-agent',
    shortTitle: 'NextStepAI Multi-Agent SaaS',
    title: 'NextStepAI — No-Code Multi-Agent AI Orchestration Platform',
    image: '/images/proj-multi-agent.jpg',
    workImage: '/images/shoaib-cafe-coding.jpg',
    category: ['Agentic AI', 'Multi-Agent SaaS', 'Voice & Chat', 'CRM Integrations'],
    clientLabel: 'NextStepAI Platform',
    role: 'AI / Full Stack Engineer',
    summary:
      'Multi-agent SaaS platform enabling businesses to launch supervisor-routed voice, chat, sales, and support AI agents connected to GoHighLevel, Zoho CRM, and calendars.',
    metrics: [
      { label: 'Architecture', value: 'LangGraph Supervisor' },
      { label: 'Channels', value: 'Voice · Web · SMS' },
      { label: 'CRM Connectors', value: 'GHL · Zoho · HubSpot' },
      { label: 'Setup', value: 'No-Code Builder' },
    ],
    gallery: [
      {
        src: '/images/proj-multi-agent.jpg',
        title: 'LangGraph Supervisor & Sub-Agent Router',
        badge: 'Multi-Agent Core',
        caption: 'Coordinates specialized Sales, Support, Booking, and Escalation agents seamlessly.',
      },
      {
        src: '/images/proj-voice-ai-clean.jpg',
        title: 'Omnichannel Voice & Chat Agent Execution',
        badge: 'Voice & Telephony',
        caption: 'Runs the same stateful agent brain across phone lines and web chat widgets.',
      },
      {
        src: '/images/proj-automation-crm.jpg',
        title: 'Plug-and-Play CRM & Calendar Connectors',
        badge: 'Live Integrations',
        caption: 'Two-way sync with GoHighLevel, Zoho CRM, Google Calendar, and Calendly.',
      },
    ],
    pipelineSteps: [
      { step: '01', title: 'Omnichannel Inbound', subtitle: 'Phone Call, Web Chat, SMS, or WhatsApp' },
      { step: '02', title: 'LangGraph Supervisor', subtitle: 'Routes to Sales, Booking, or Support Agent' },
      { step: '03', title: 'Live Tool Execution', subtitle: 'Queries RAG Docs, Calendar & CRM APIs' },
      { step: '04', title: 'CRM Sync / Handoff', subtitle: 'Updates Deal Stage or Transfers to Human' },
    ],
    overview: [
      'Enables non-technical teams to configure coordinated teams of voice and chat AI agents connected to live CRMs and calendars.',
    ],
    problem:
      'Single-prompt bots fail when customer conversations require multi-step sales qualification, live calendar booking, and CRM updates.',
    solution: [
      'Stateful LangGraph supervisor routing dynamically between Sales, Support, and Booking sub-agents',
      'Reusable OAuth & webhook connectors for GoHighLevel, Zoho CRM, calendars, and telephony',
      'Tenant-isolated RAG knowledge bases with human escalation guardrails',
    ],
    keyFeatures: [
      {
        title: 'Supervisor Agent Routing',
        description: 'Hands off tasks between specialized sub-agents while preserving full context.',
      },
      {
        title: 'CRM & Calendar Sync',
        description: 'Two-way integration with GoHighLevel, Zoho CRM, Calendly, and Google Calendar.',
      },
      {
        title: 'Omnichannel Voice & Chat',
        description: 'Deploys across Twilio/Retell phone lines, web chat, and messaging channels.',
      },
      {
        title: 'Human Takeover Controls',
        description: 'Instant live-agent transfer when high-value or sensitive inquiries arise.',
      },
    ],
    stack: ['Python', 'FastAPI', 'LangGraph', 'LangChain', 'React', 'TypeScript', 'Twilio / Retell', 'GoHighLevel / Zoho', 'PostgreSQL', 'Docker'],
    status: 'Built · Multi-Agent SaaS Architecture',
  },
  {
    id: 'baboo-travel-ai',
    slug: 'baboo-travel-ai',
    shortTitle: 'Baboo Travel Voice & CRM AI',
    title: 'Baboo Travel — Conversational Voice AI, Itinerary Intake & CRM Automation',
    image: '/images/proj-rag-knowledge.jpg',
    workImage: '/images/shoaib-tech-talk.jpg',
    category: ['Travel AI', 'Voice & Chat', 'CRM Automation'],
    clientLabel: 'Baboo Travel Technology',
    role: 'Full Stack AI & Automation Engineer',
    summary:
      '24/7 multilingual travel voice and chat qualification system that captures destinations, dates, and budgets and syncs ready-to-close deal cards into CRM pipelines.',
    metrics: [
      { label: 'Languages', value: '90+ Supported' },
      { label: 'Lead Capture', value: '24/7 Instant Intake' },
      { label: 'Knowledge Base', value: 'Destination RAG' },
      { label: 'CRM Output', value: 'Auto Deal Cards' },
    ],
    gallery: [
      {
        src: '/images/proj-rag-knowledge.jpg',
        title: 'Destination RAG & Traveler Qualification Engine',
        badge: 'Travel RAG AI',
        caption: 'Answers destination FAQs and extracts structured itinerary requirements.',
      },
      {
        src: '/images/proj-voice-ai-clean.jpg',
        title: '24/7 Multilingual Voice & Chat Concierge',
        badge: 'Voice & Chat Intake',
        caption: 'Qualifies global travelers in their native language across time zones.',
      },
      {
        src: '/images/proj-automation-crm.jpg',
        title: 'Automated CRM Pipeline & Advisor Handoff',
        badge: 'CRM Automation',
        caption: 'Populates CRM deal cards with budget, dates, and full transcript summary.',
      },
    ],
    pipelineSteps: [
      { step: '01', title: 'Global Traveler Inquiry', subtitle: 'Voice Call or Web Chat in Any Language' },
      { step: '02', title: 'AI Concierge & RAG', subtitle: 'Answers Package FAQs & Qualifies Budget/Dates' },
      { step: '03', title: 'Structured Extraction', subtitle: 'Converts Conversation into Itinerary JSON' },
      { step: '04', title: 'CRM Deal & Booking', subtitle: 'Creates CRM Deal Card & Books Advisor Call' },
    ],
    overview: [
      'Engages international travelers 24/7 via voice and chat, capturing structured trip details and syncing qualified leads directly into the CRM.',
    ],
    problem:
      'High-intent travel inquiries arriving across global time zones were delayed by manual qualification emails.',
    solution: [
      '24/7 multilingual voice and chat concierge qualifying destination, dates, group size, and budget',
      'RAG destination knowledge base answering package and seasonal travel questions accurately',
      'Automated CRM deal card creation and specialist advisor scheduling',
    ],
    keyFeatures: [
      {
        title: 'Multilingual Qualification',
        description: 'Converses naturally in 90+ languages to capture complete trip requirements.',
      },
      {
        title: 'Automated CRM Deal Cards',
        description: 'Creates enriched contact and deal records with transcripts and priority tags.',
      },
      {
        title: 'Destination RAG Assistant',
        description: 'Grounded answers on travel packages, visas, and seasonal recommendations.',
      },
      {
        title: 'Advisor Handoff & Booking',
        description: 'Schedules discovery calls or transfers luxury inquiries to human specialists.',
      },
    ],
    stack: ['Python', 'FastAPI', 'Voice AI', 'LangChain', 'RAG', 'CRM Webhooks', 'Node.js', 'React'],
    status: 'Delivered · Production Travel Workflow',
  },
  {
    id: 'executive-ally-platform',
    slug: 'executive-ally-platform',
    shortTitle: 'Executive Ally Platform',
    title: 'Executive Ally — Executive Career Platform, CMS & Analytics Ecosystem',
    image: '/images/proj-automation-crm.jpg',
    workImage: '/images/shoaib-whiteboard-architecture.jpg',
    category: ['Full Stack Web', 'Admin Portal & CMS', 'Calendar & Analytics'],
    clientLabel: 'Executive Ally (United States)',
    role: 'Full Stack Software Engineer',
    summary:
      'Editorial executive coaching platform and unified admin command center with custom Insights CMS, two-way Google Calendar sync, and live GA4 analytics.',
    metrics: [
      { label: 'Admin Portal', value: 'Unified Command UI' },
      { label: 'Calendar Sync', value: '2-Way Google OAuth' },
      { label: 'Publishing', value: 'Custom SEO CMS' },
      { label: 'Telemetry', value: 'Live GA4 + Clarity' },
    ],
    gallery: [
      {
        src: '/images/proj-automation-crm.jpg',
        title: 'Executive Ally Admin Command Center & CRM',
        badge: 'Admin Portal',
        caption: 'Manages Private Clients, Discovery Calls, Guide Leads, and Contact Inquiries.',
      },
      {
        src: '/images/proj-multi-agent.jpg',
        title: 'Two-Way Google Calendar Availability Engine',
        badge: 'Calendar Sync',
        caption: 'Real-time slot rules, date-range blocking, and automatic conflict prevention.',
      },
      {
        src: '/images/proj-rag-knowledge.jpg',
        title: 'Custom Insights CMS & GA4 Analytics Suite',
        badge: 'CMS & Telemetry',
        caption: 'Publishes SEO-ready articles with automatic sitemap updates and GA4 tracking.',
      },
    ],
    pipelineSteps: [
      { step: '01', title: 'Executive Visitor', subtitle: 'Editorial Storytelling & Career Guide Download' },
      { step: '02', title: 'Live Calendar Booking', subtitle: 'Checks 2-Way Google Calendar Availability' },
      { step: '03', title: 'Admin Command Center', subtitle: 'Logs Client, Lead & Inquiry Timelines' },
      { step: '04', title: 'CMS & GA4 Telemetry', subtitle: 'Tracks Conversion & Publishes SEO Insights' },
    ],
    overview: [
      'Full-stack executive coaching web platform and admin command center combining editorial storytelling, custom CMS publishing, Google Calendar sync, and GA4 analytics.',
    ],
    problem:
      'Managing executive clients, calendar availability, article publishing, and analytics across disconnected tools created operational friction.',
    solution: [
      'Cinematic React/TypeScript public site paired with a unified Admin Command Center',
      'Two-way Google Calendar OAuth availability engine and discovery call booking flow',
      'Custom Insights CMS with automatic sitemap generation and live GA4 telemetry dashboard',
    ],
    keyFeatures: [
      {
        title: 'Cinematic Editorial Frontend',
        description: 'Scroll-driven storytelling and high-converting executive lead capture flows.',
      },
      {
        title: 'Unified Admin Portal & CMS',
        description: 'Manage clients, discovery calls, guide leads, and SEO articles in one place.',
      },
      {
        title: '2-Way Google Calendar Sync',
        description: 'Custom open hours, date blocking, and real-time calendar synchronization.',
      },
      {
        title: 'Live GA4 Analytics',
        description: 'Built-in traffic, engagement, and conversion telemetry inside the admin portal.',
      },
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'Google Calendar API', 'GA4 Data API', 'Nodemailer', 'Nginx'],
    status: 'Production · Live Platform',
  },
];

export const EMPLOYMENT_HISTORY: EmploymentItem[] = [
  {
    id: 'freelance-upwork',
    role: 'Freelance Full Stack AI Software Engineer',
    organizationLabel: 'Independent / Upwork (Top Rated · 100% JSS)',
    location: 'Remote · International',
    period: 'Nov 2021 – Present',
    current: true,
    summary:
      'Delivering end-to-end production AI systems, real-time voice agents, business & marketing automations, and full-stack platforms for international clients across North America, Europe, and APAC.',
    contributions: [
      'Architected and deployed 20+ production AI, voice, automation, and full-stack software systems',
      'Built telephony-connected voice agents, animated AI coaching avatars, and multi-agent LangGraph platforms',
      'Engineered CRM, payment, delivery logistics, and autonomous social media marketing pipelines',
      'Maintained 100% Job Success Score across long-term enterprise and startup engagements',
    ],
    technologyTags: ['Python', 'FastAPI', 'React', 'Next.js', 'TypeScript', 'LangGraph', 'Voice AI', 'Docker', 'AWS'],
  },
  {
    id: 'wosler-hilum',
    role: 'Full Stack AI Engineer / AI Software Engineer',
    organizationLabel: 'Hilum / Wosler Corp. (Healthcare AI)',
    location: 'Canada · Remote',
    period: 'Oct 2024 – Sep 2026',
    current: false,
    summary:
      'Built and supported healthcare AI systems, Hilum Admin 24/7 conversational voice/booking workflows, and SonoSystem DICOM medical-imaging reading & AI prediction software.',
    contributions: [
      'Engineered inbound/outbound healthcare voice-call pipelines integrating STT, LangGraph, and TTS',
      'Developed DICOM medical imaging reading, metadata extraction, and AI diagnostic prediction pipelines',
      'Implemented automated requisition processing and clinic RIS/EMR appointment booking microservices',
      'Handled concurrency, latency optimization, Docker deployment, and production reliability',
    ],
    technologyTags: ['Python', 'FastAPI', 'DICOM AI', 'LangGraph', 'Twilio', 'Whisper', 'ElevenLabs', 'Docker', 'AWS', 'GCP'],
  },
  {
    id: 'nettech',
    role: 'Senior / Full Stack AI Engineer',
    organizationLabel: 'UK Technology Consultancy',
    location: 'UK · Remote',
    period: 'May 2025 – Jul 2026',
    current: false,
    summary:
      'Worked on AI engineering and software integration projects involving voice agents, LLM workflows, and business automation.',
    contributions: [
      'Developed AI-powered workflows and backend integrations',
      'Worked on conversational and agent-based business applications',
    ],
    technologyTags: ['Python', 'LLMs', 'Voice AI', 'APIs'],
  },
  {
    id: 'controlshift',
    role: 'AI Team Lead',
    organizationLabel: 'AI Delivery Team',
    location: 'Remote',
    period: 'May 2025 – Aug 2025',
    current: false,
    summary: 'AI leadership and engineering role focused on solution architecture and AI system delivery.',
    contributions: [
      'Contributed to solution architecture and AI engineering execution',
      'Collaborated on implementation of AI-related features',
    ],
    technologyTags: ['AI Engineering', 'System Design', 'LLMs'],
  },
  {
    id: 'orison',
    role: 'Agentic AI Developer',
    organizationLabel: 'AI Solutions Provider',
    location: 'Remote',
    period: 'Apr 2024 – Oct 2024',
    current: false,
    summary: 'Built agentic AI features and tool integrations for business software use cases.',
    contributions: [
      'Worked on LLM and agent pipelines',
      'Integrated tools and APIs into AI-driven workflows',
    ],
    technologyTags: ['Python', 'LangChain', 'LLMs', 'APIs'],
  },
  {
    id: 'valyrian',
    role: 'Backend / AI Engineer',
    organizationLabel: 'Valyrian Systems (VSI)',
    location: 'Remote',
    period: 'Nov 2021 – Dec 2024',
    current: false,
    summary: 'Worked on backend software development, Deep Packet Inspection (DPI) data pipelines, cybersecurity analytics, databases, and APIs.',
    contributions: [
      'Backend application development and network intelligence system integration',
      'Worked with relational/NoSQL databases, REST APIs, and AI-enabled cybersecurity features',
    ],
    technologyTags: ['Backend Engineering', 'Python', 'Cybersecurity AI', 'DPI', 'APIs', 'Databases'],
  },
];

export const TECHNICAL_STACK = [
  {
    group: 'Languages & Web',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'React', 'Next.js', 'FastAPI', 'Node.js'],
  },
  {
    group: 'AI, Agents & Medical/Security AI',
    items: ['LangGraph', 'LangChain', 'DICOM / Medical AI', 'RAG', 'OpenAI / Claude / Gemini', 'Ollama', 'Multi-Agent Systems'],
  },
  {
    group: 'Voice, Video & Telephony',
    items: ['Twilio', 'Retell AI', 'Vapi', 'Ultravox', 'Whisper', 'ElevenLabs', 'Animated Video Avatars', 'Silero VAD'],
  },
  {
    group: 'Data, Automation & Cloud',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'RabbitMQ', 'Docker', 'AWS EC2', 'GCP', 'n8n / Social APIs'],
  },
];

export const WORK_METHOD = [
  { step: '01 · Understand', description: 'Map the current workflow, constraints, users, and existing systems.' },
  { step: '02 · Design', description: 'Choose the simplest reliable architecture — conventional code, automation, or AI.' },
  { step: '03 · Build', description: 'Create API, model, and frontend integrations with real failure paths.' },
  { step: '04 · Validate', description: 'Test with realistic inputs, concurrency, latency, and edge cases.' },
  { step: '05 · Deploy', description: 'Ship, monitor, document, and iterate from production feedback.' },
];

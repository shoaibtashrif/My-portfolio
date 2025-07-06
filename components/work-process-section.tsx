"use client"

import { motion } from "framer-motion"
import {
  MessageSquare,
  FileSearch,
  Cog,
  Presentation,
  Code2,
  Rocket,
  HeadphonesIcon,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react"

const processSteps = [
  {
    id: "01",
    title: "Discovery Call",
    subtitle: "Understanding Your Vision",
    description:
      "We start with a comprehensive discussion to understand your business needs, challenges, and AI goals.",
    icon: <MessageSquare className="h-6 w-6" />,
    duration: "30-45 min",
    deliverable: "Project roadmap & feasibility analysis",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/5",
    borderColor: "border-blue-500/20",
  },
  {
    id: "02",
    title: "Requirements Analysis",
    subtitle: "Deep Dive into Details",
    description:
      "Detailed analysis of use cases, data requirements, and technical specifications for optimal AI performance.",
    icon: <FileSearch className="h-6 w-6" />,
    duration: "1-2 days",
    deliverable: "Technical requirements document",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-500/5",
    borderColor: "border-indigo-500/20",
  },
  {
    id: "03",
    title: "Architecture Design",
    subtitle: "Blueprint for Success",
    description:
      "Design complete AI pipeline architecture with data flow, model selection, and integration strategies.",
    icon: <Cog className="h-6 w-6" />,
    duration: "2-3 days",
    deliverable: "System architecture & tech stack",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/5",
    borderColor: "border-purple-500/20",
  },
  {
    id: "04",
    title: "Prototype Development",
    subtitle: "Proof of Concept",
    description:
      "Create working prototype to validate approach and demonstrate core functionality before full development.",
    icon: <Presentation className="h-6 w-6" />,
    duration: "3-5 days",
    deliverable: "Interactive prototype demo",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/5",
    borderColor: "border-pink-500/20",
  },
  {
    id: "05",
    title: "Full Development",
    subtitle: "Building Your Solution",
    description:
      "Complete development using cutting-edge frameworks like Langchain, Langraph with custom implementations.",
    icon: <Code2 className="h-6 w-6" />,
    duration: "2-6 weeks",
    deliverable: "Production-ready AI solution",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/5",
    borderColor: "border-emerald-500/20",
  },
  {
    id: "06",
    title: "Testing & Launch",
    subtitle: "Quality Assurance",
    description: "Comprehensive testing, optimization, and seamless deployment with monitoring and documentation.",
    icon: <Rocket className="h-6 w-6" />,
    duration: "3-5 days",
    deliverable: "Live deployment & documentation",
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-500/5",
    borderColor: "border-orange-500/20",
  },
  {
    id: "07",
    title: "Ongoing Support",
    subtitle: "Long-term Partnership",
    description: "Continuous monitoring, updates, and technical support to ensure optimal performance and growth.",
    icon: <HeadphonesIcon className="h-6 w-6" />,
    duration: "Ongoing",
    deliverable: "24/7 support & maintenance",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-500/5",
    borderColor: "border-cyan-500/20",
  },
]

export default function WorkProcessSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.02)_50%,transparent_75%)] bg-[length:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How I Build Your
            <span className="text-indigo-400"> AI Solution</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A proven 7-step methodology that transforms your ideas into powerful AI solutions
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="relative max-w-7xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-cyan-500/50 hidden lg:block" />

          {/* Process Steps */}
          <div className="space-y-16 lg:space-y-24">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Step Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right lg:pr-16" : "lg:text-left lg:pl-16"}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`${step.bgColor} ${step.borderColor} border-2 rounded-2xl p-8 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
                  >
                    {/* Background Gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />

                    {/* Step Header */}
                    <div
                      className={`flex items-center gap-4 mb-6 ${index % 2 === 0 ? "lg:justify-end" : "lg:justify-start"}`}
                    >
                      <div className={`order-2 ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                        <div className="text-sm text-gray-400 font-medium">{step.id}</div>
                        <h3 className="text-2xl font-bold text-white mb-1">{step.title}</h3>
                        <div className="text-indigo-400 font-medium">{step.subtitle}</div>
                      </div>
                      <div className={`order-1 ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}>
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          {step.icon}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed mb-6 text-lg">{step.description}</p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-indigo-400" />
                        <div>
                          <div className="text-sm text-gray-400">Duration</div>
                          <div className="text-white font-medium">{step.duration}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-indigo-400" />
                        <div>
                          <div className="text-sm text-gray-400">Deliverable</div>
                          <div className="text-white font-medium">{step.deliverable}</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-6 w-full bg-gray-700/50 rounded-full h-2">
                      <motion.div
                        className={`h-2 bg-gradient-to-r ${step.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Central Timeline Node */}
                <div className="relative z-10 hidden lg:block">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="w-6 h-6 bg-white rounded-full border-4 border-indigo-500 shadow-lg"
                  />
                  {index < processSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                      viewport={{ once: true }}
                      className="absolute top-8 left-1/2 transform -translate-x-1/2"
                    >
                      <ArrowRight className="h-5 w-5 text-indigo-400 rotate-90" />
                    </motion.div>
                  )}
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Success Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-8">Proven Track Record</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: "100%", label: "Success Rate", icon: <CheckCircle2 className="h-6 w-6" /> },
                { value: "4+", label: "Years Experience", icon: <Target className="h-6 w-6" /> },
                { value: "10+", label: "Projects Delivered", icon: <Rocket className="h-6 w-6" /> },
                { value: "24/7", label: "Support Available", icon: <HeadphonesIcon className="h-6 w-6" /> },
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3 text-indigo-400">{metric.icon}</div>
                  <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-gray-300 text-sm">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

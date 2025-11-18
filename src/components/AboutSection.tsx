"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Brain, Cpu, Zap, TrendingUp } from 'lucide-react'

function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return <span ref={ref}>{count}</span>
}

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Models',
      description: 'Leveraging state-of-the-art machine learning algorithms',
    },
    {
      icon: Cpu,
      title: 'Automation Excellence',
      description: 'Streamline workflows and eliminate repetitive tasks',
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Lightning-fast data analysis and decision making',
    },
    {
      icon: TrendingUp,
      title: 'Scalable Solutions',
      description: 'Grow seamlessly from startup to enterprise',
    },
  ]

  return (
    <section id="about" ref={ref} className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            About <span className="neon-gradient-text">LUXERA</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're pioneers in AI automation, transforming how businesses operate with intelligent, 
            data-driven solutions that deliver measurable results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/20 to-[#D4AF37]/20 rounded-3xl blur-3xl" />
              <div className="relative glassmorphism rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Years Experience', value: 10, suffix: '+' },
                    { label: 'AI Experts', value: 50, suffix: '+' },
                    { label: 'Success Rate', value: 98, suffix: '%' },
                    { label: 'Countries', value: 25, suffix: '+' },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-black/30 rounded-xl">
                      <div className="text-3xl font-bold neon-gradient-text mb-2">
                        <AnimatedCounter end={stat.value} />
                        {stat.suffix}
                      </div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold mb-6">Why Choose Us?</h3>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-start space-x-4 glassmorphism p-4 rounded-xl hover:border-[#00FFFF]/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-[#00FFFF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="text-[#00FFFF]" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
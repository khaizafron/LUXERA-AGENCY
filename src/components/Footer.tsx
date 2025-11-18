"use client"

import { Facebook, Twitter, Linkedin, Instagram, Github, Mail } from 'lucide-react'

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'Github' },
    { icon: Mail, href: 'mailto:khai@luxera.com', label: 'Email' },
  ]

  const footerLinks = {
    Company: ['About Us', 'Careers', 'Press Kit', 'Blog'],
    Services: ['AI Chatbots', 'Automation', 'Analytics', 'Consulting'],
    Resources: ['Documentation', 'API Reference', 'Community', 'Support'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
  }

  return (
    <footer className="relative bg-black border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00FFFF] to-[#D4AF37] rounded-lg flex items-center justify-center glow-cyan">
                <span className="text-black font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold text-white">
                LUXERA <span className="neon-gradient-text">AGENCY</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Transforming businesses with cutting-edge AI automation and intelligence solutions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#00FFFF]/20 hover:border-[#00FFFF] border border-transparent transition-all duration-300 group"
                  >
                    <Icon className="text-gray-400 group-hover:text-[#00FFFF] transition-colors" size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#00FFFF] transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} LUXERA AGENCY. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-[#00FFFF] transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-[#00FFFF] transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-[#00FFFF] transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-30" />
    </footer>
  )
}
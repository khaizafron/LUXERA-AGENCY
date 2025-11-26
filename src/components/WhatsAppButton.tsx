"use client"

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const phoneNumber = '+601126941552' // Replace with actual WhatsApp number

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          boxShadow: '0 0 20px rgba(37, 211, 102, 0.5)',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="text-white" size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="text-white" size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-8 glassmorphism rounded-2xl p-6 w-80 z-50 border-[#25D366]/30"
          >
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Chat with us</h3>
                <p className="text-gray-400 text-sm">
                  Hi there 👋 How can we help you today?
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${phoneNumber}?text=Hi%2C%20I%27m%20interested%20in%20learning%20more%20about%20LUXERA%20AGENCY%27s%20AI%20solutions.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300"
            >
              <MessageCircle size={20} />
              <span>Start Chat</span>
            </a>

            <p className="text-gray-500 text-xs text-center mt-3">
              Typically replies within minutes
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

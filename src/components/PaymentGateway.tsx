import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  Lock, 
  Globe, 
  ChevronDown,
  Loader2
} from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface PaymentGatewayProps {
  plan: SubscriptionPlan;
  onBack: () => void;
  onComplete: () => void;
}

type Currency = 'USD' | 'MYR';
type PaymentMethod = 'card' | 'fpx' | 'ewallet';

const EXCHANGE_RATE = 4.75; // USD to MYR

const ALL_COUNTRIES = [
  "United States", "Malaysia", "Singapore", "Indonesia", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan",
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cambodia", "Cameroon", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland",
  "Gabon", "Gambia", "Georgia", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ plan, onBack, onComplete }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [country, setCountry] = useState('United States');

  // Pricing Calculations
  const basePrice = plan.price;
  const price = currency === 'MYR' ? basePrice * EXCHANGE_RATE : basePrice;
  const taxRate = country === 'Malaysia' ? 0.08 : 0; // 8% SST for Malaysia
  const taxAmount = price * taxRate;
  const total = price + taxAmount;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(currency === 'MYR' ? 'en-MY' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate Stripe/Gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 2500);
  };

  // Common input class for consistency - ensuring dark background
  const inputClass = "w-full bg-[#1A1D24] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0F1115]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-green-500" />
            <span className="text-xs font-medium text-green-500 uppercase tracking-wider">256-bit SSL Secure Payment</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Billing Location */}
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Globe className="text-cyan-500" size={20} /> Billing Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">Full Name</label>
                <input type="text" placeholder="Nur Adibah" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">Email Address</label>
                <input type="email" placeholder="nur@luxera.ai" className={inputClass} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                 <label className="text-xs text-gray-400">Country / Region</label>
                 <div className="relative">
                    <select 
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        if (e.target.value === 'Malaysia') setCurrency('MYR');
                        else setCurrency('USD');
                      }}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      {ALL_COUNTRIES.map((c) => (
                        <option key={c} value={c} className="bg-[#1A1D24] text-white">
                          {c} {c === 'Malaysia' ? '(MYR)' : c === 'United States' ? '(USD)' : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-3 text-gray-500 pointer-events-none" size={14} />
                 </div>
              </div>
            </div>
          </section>

          {/* 2. Payment Method */}
          <section>
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard className="text-purple-500" size={20} /> Payment Method
             </h3>
             
             {/* Tabs */}
             <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 min-w-[120px] p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'card' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                >
                   <CreditCard size={24} />
                   <span className="text-xs font-bold">Credit Card</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('fpx')}
                  className={`flex-1 min-w-[120px] p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'fpx' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                >
                   <Building2 size={24} />
                   <span className="text-xs font-bold">FPX Banking</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('ewallet')}
                  className={`flex-1 min-w-[120px] p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'ewallet' ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                >
                   <Smartphone size={24} />
                   <span className="text-xs font-bold">E-Wallet</span>
                </button>
             </div>

             {/* Method Content */}
             <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[200px]">
                <AnimatePresence mode="wait">
                  
                  {/* CARD */}
                  {paymentMethod === 'card' && (
                    <motion.div 
                      key="card"
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                       <div className="space-y-1.5">
                          <label className="text-xs text-gray-400">Card Number</label>
                          <div className="relative">
                             <input type="text" placeholder="0000 0000 0000 0000" className={`${inputClass} pl-10 font-mono`} />
                             <CreditCard className="absolute left-3 top-2.5 text-gray-500" size={16} />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                             <label className="text-xs text-gray-400">Expiry Date</label>
                             <input type="text" placeholder="MM / YY" className={`${inputClass} font-mono text-center`} />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-xs text-gray-400">CVC / CWW</label>
                             <div className="relative">
                                <input type="text" placeholder="123" className={`${inputClass} font-mono text-center`} />
                                <Lock className="absolute right-3 top-2.5 text-gray-500" size={14} />
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                          <ShieldCheck size={14} className="text-green-500" />
                          Payments are securely processed by Stripe.
                       </div>
                    </motion.div>
                  )}

                  {/* FPX */}
                  {paymentMethod === 'fpx' && (
                    <motion.div 
                      key="fpx"
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                       <p className="text-sm text-gray-300 mb-4">Select your bank for secure FPX payment:</p>
                       <div className="grid grid-cols-2 gap-3">
                          {['Maybank2u', 'CIMB Clicks', 'Public Bank', 'RHB Now', 'Hong Leong', 'AmBank'].map(bank => (
                             <div key={bank} className="p-3 border border-white/10 rounded-lg bg-[#1A1D24] hover:border-cyan-500 cursor-pointer flex items-center gap-2 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                <span className="text-sm">{bank}</span>
                             </div>
                          ))}
                       </div>
                       <p className="text-xs text-gray-500 mt-4">You will be redirected to your bank's login page to complete the transaction.</p>
                    </motion.div>
                  )}
                  
                  {/* E-WALLET */}
                  {paymentMethod === 'ewallet' && (
                     <motion.div 
                       key="ewallet"
                       initial={{ opacity: 0, y: 10 }} 
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className="space-y-4"
                     >
                        <p className="text-sm text-gray-300 mb-4">Choose your e-wallet:</p>
                        <div className="grid grid-cols-2 gap-3">
                           {['GrabPay', 'Touch \'n Go', 'Boost', 'ShopeePay'].map(wallet => (
                              <div key={wallet} className="p-3 border border-white/10 rounded-lg bg-[#1A1D24] hover:border-cyan-500 cursor-pointer flex items-center gap-2 transition-colors">
                                 <Smartphone size={16} className="text-gray-400" />
                                 <span className="text-sm">{wallet}</span>
                              </div>
                           ))}
                        </div>
                     </motion.div>
                   )}

                </AnimatePresence>
             </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Summary */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Plan Card */}
          <div className="relative bg-[#0F1115] rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden">
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
             <div className="p-6 border-b border-white/10">
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Selected Plan</h4>
                <div className="flex justify-between items-end">
                   <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                   <div className="text-right">
                      <div className="text-xl font-bold text-cyan-400">{formatPrice(price)}</div>
                      <div className="text-xs text-gray-500">per month</div>
                   </div>
                </div>
             </div>
             <div className="p-6 bg-white/5 space-y-3">
                {plan.features.map((feature, i) => (
                   <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {feature}
                   </div>
                ))}
             </div>
          </div>

          {/* Total Breakdown */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-3">
             <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(price)}</span>
             </div>
             {taxRate > 0 && (
               <div className="flex justify-between text-sm text-gray-400">
                  <span>Tax ({country} SST 8%)</span>
                  <span>{formatPrice(taxAmount)}</span>
               </div>
             )}
             <div className="h-px bg-white/10 my-2"></div>
             <div className="flex justify-between items-center">
                <span className="font-bold text-white">Total Due Today</span>
                <span className="text-2xl font-bold neon-gradient-text">{formatPrice(total)}</span>
             </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-lg shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
             {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" /> Processing Securely...
                </>
             ) : (
               <>
                 Pay {formatPrice(total)}
               </>
             )}
          </button>

          <p className="text-center text-xs text-gray-500">
             By confirming your payment, you allow Luxera to charge your card for this payment and future payments in accordance with our terms.
          </p>

        </div>
      </div>
    </div>
  );
};
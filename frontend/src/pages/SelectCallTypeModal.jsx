import React from 'react';
import { X, ArrowRight, FileText, User } from 'lucide-react';

const SelectCallTypeModal = ({ onClose, onSelectClaim, onRequestNew }) => {
  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 flex items-center justify-center z-50 p-4 animate-overlay-enter">
      
      {/* Outer ambient glow wrapper */}
      <div className="relative w-full max-w-[750px] mx-auto animate-modal-enter">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-purple-400/10 to-blue-300/20 rounded-[28px] blur-3xl pointer-events-none"></div>
        
        {/* Main Modal Container */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden flex flex-col p-1.5">
          
          {/* Inner content wrapper with subtle gradient background */}
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#FFFFFF] rounded-[24px] p-8 relative overflow-hidden h-full">
            
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex flex-col">
                <h1 className="text-[26px] font-extrabold text-[#0F172A] mb-1.5 tracking-tight">Select Call Type</h1>
                <div className="flex space-x-1.5 mb-5">
                  <div className="w-8 h-1 bg-[#3B82F6] rounded-full"></div>
                  <div className="w-3 h-1 bg-[#E2E8F0] rounded-full"></div>
                </div>
                
                <h2 className="text-[15px] font-bold text-[#0F172A] mb-1">What is the goal of this call batch?</h2>
                <p className="text-[#64748B] text-[13px] font-medium">Pick what type of call you would like Bristol Healthcare Services to make on your behalf.</p>
              </div>
              
              <button 
                onClick={onClose} 
                className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] hover:shadow-md hover:scale-105 transition-all duration-300 shadow-sm"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              {/* Primary Claims Card (Glassmorphic & Premium) */}
              <div className="bg-white rounded-[20px] overflow-hidden flex relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0]/80 h-[220px] group hover:shadow-[0_15px_40px_-10px_rgba(59,130,246,0.15)] transition-all duration-500">
                
                {/* Left side Content */}
                <div className="w-[50%] p-8 flex flex-col justify-center z-10 bg-white relative">
                  <div className="mb-5">
                    <h3 className="text-[32px] font-extrabold text-[#1E3A8A] leading-none mb-3 tracking-tight">Claims</h3>
                    <div className="w-10 h-[3px] bg-[#3B82F6] rounded-full"></div>
                  </div>
                  
                  <p className="text-[#334155] text-[14px] leading-relaxed mb-6 max-w-[260px]">
                    Call insurance to manage and check <span className="text-[#1E3A8A] font-bold">the status of claims.</span>
                  </p>

                  <div className="flex items-center space-x-2.5">
                    <div className="flex items-center space-x-1 px-3 py-1.5 bg-[#F0F5FF] text-[#1E3A8A] rounded-[10px] text-[12px] font-semibold border border-[#D6E4FF]/50 shadow-sm">
                      <User size={14} className="text-[#3B82F6] opacity-80" />
                      <span>To: Insurance</span>
                    </div>
                    <div className="flex items-center space-x-1 px-3 py-1.5 bg-[#F0F5FF] text-[#1E3A8A] rounded-[10px] text-[12px] font-semibold border border-[#D6E4FF]/50 shadow-sm">
                      <User size={14} className="text-[#3B82F6] opacity-80" />
                      <span>Re: Patient</span>
                    </div>
                  </div>
                </div>
                
                {/* Subtle divider */}
                <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#CBD5E1] to-transparent opacity-50 relative z-10"></div>

                {/* Right side Action & Background (Futuristic Soft Glow) */}
                <div className="w-[50%] flex flex-col justify-center items-center z-10 relative bg-gradient-to-br from-[#F4F9FF] to-[#E5F0FF] overflow-hidden">
                  
                  {/* Mesh / Wave patterns */}
                  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 w-full h-full object-cover pointer-events-none opacity-[0.35]">
                    <path d="M0,250 C150,150 250,350 400,200" stroke="url(#paint0_linear)" strokeWidth="1" fill="none"/>
                    <path d="M0,270 C150,170 250,370 400,220" stroke="url(#paint0_linear)" strokeWidth="1" fill="none"/>
                    <path d="M0,290 C150,190 250,390 400,240" stroke="url(#paint0_linear)" strokeWidth="1" fill="none"/>
                    <defs>
                      <linearGradient id="paint0_linear" x1="0" y1="200" x2="400" y2="200" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3B82F6" stopOpacity="0"/>
                        <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.8"/>
                        <stop offset="1" stopColor="#3B82F6" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Concentric glow circles */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                    <div className="w-[260px] h-[260px] rounded-full border border-[#3B82F6]/5 absolute"></div>
                    <div className="w-[180px] h-[180px] rounded-full border border-[#3B82F6]/10 absolute bg-[#3B82F6]/[0.02]"></div>
                    <div className="w-[120px] h-[120px] rounded-full border border-[#3B82F6]/15 absolute bg-[#3B82F6]/[0.03]"></div>
                    <div className="w-[80px] h-[80px] rounded-full bg-[#3B82F6]/10 absolute blur-xl"></div>
                  </div>

                  <button 
                    onClick={onSelectClaim}
                    className="flex flex-col items-center justify-center group cursor-pointer relative z-20 mt-2"
                  >
                    <div className="w-16 h-16 rounded-full bg-white shadow-[0_8px_30px_rgba(59,130,246,0.15)] flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 border border-white/80 group-hover:shadow-[0_12px_40px_rgba(59,130,246,0.25)]">
                      <ArrowRight size={24} className="text-[#1E3A8A] group-hover:text-[#3B82F6] transition-colors" />
                    </div>
                    <span className="text-[#1E3A8A] font-bold text-[13px]">Select This Call Type</span>
                  </button>
                </div>
              </div>

              {/* Secondary Request Card (Minimal) */}
              <div className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] rounded-[16px] p-5 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.02)] relative overflow-hidden group hover:border-[#3B82F6]/30 transition-colors">
                
                <div className="flex items-center space-x-4">
                  <div className="w-1 h-10 bg-[#3B82F6] rounded-full ml-1.5"></div>
                  
                  <div className="w-10 h-10 rounded-full bg-[#F0F5FF] flex items-center justify-center text-[#3B82F6] border border-[#D6E4FF] shadow-sm">
                    <FileText size={18} />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-[14px] font-bold text-[#0F172A] mb-0.5">Not seeing your call type?</h3>
                    <p className="text-[#64748B] text-[13px] font-medium">We can create a custom call type tailored to your needs.</p>
                  </div>
                </div>
                
                <button 
                  onClick={onRequestNew}
                  className="px-5 py-2.5 border-[1.5px] border-[#3B82F6]/20 text-[#3B82F6] rounded-[10px] font-bold hover:bg-[#F0F5FF] hover:border-[#3B82F6] transition-all duration-300 flex items-center space-x-2 bg-white shadow-sm text-[13px]"
                >
                  <FileText size={16} />
                  <span>Request New Call Type</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center border-t border-[#E2E8F0]/60 pt-5 relative z-10">
              <button 
                onClick={onClose}
                className="flex items-center space-x-2 text-[#64748B] font-semibold text-[14px] hover:text-[#0F172A] transition-colors group"
              >
                <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-white transition-colors">
                  <X size={12} strokeWidth={2.5} />
                </div>
                <span>Close</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCallTypeModal;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Phone, 
  Clock, 
  RotateCcw, 
  Download, 
  History, 
  Trash2, 
  Zap, 
  PlayCircle,
  FileText,
  ChevronLeft,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  PhoneCall,
  Check,
  ThumbsUp,
  ThumbsDown,
  Info,
  Mic,
  Activity,
  MoreHorizontal,
  Plus,
  Copy,
  ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import React from 'react';

const CallDetails = () => {
  const { batchId, callId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [callData, setCallData] = useState(null);
  const [batchData, setBatchData] = useState(null);
  const [userNotes, setUserNotes] = useState('');
  const [isAddingNotes, setIsAddingNotes] = useState(false);
  const [editingResultId, setEditingResultId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [currentCallIndex, setCurrentCallIndex] = useState(443);
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
  const [showBatchQuality, setShowBatchQuality] = useState(false);
  const [showBatchDetails, setShowBatchDetails] = useState(false);

  const mockTranscript = [
    { speaker: 'System', text: 'Thank you for calling UnitedHealthcare Medicare Insurance plans from UnitedHealthcare Insurance Company or one of its affiliates.' },
    { speaker: 'System', text: 'To help direct your call, please say or enter your provider NPI number.' },
    { speaker: 'Agent (AI)', text: '1234567890' },
    { speaker: 'System', text: 'Thank you. Are you calling to check the status of a claim, verify eligibility, or something else?' },
    { speaker: 'Agent (AI)', text: 'Claim status.' },
    { speaker: 'System', text: 'Okay, claim status. Please say or enter the member\'s ID number.' },
    { speaker: 'Agent (AI)', text: '987654321' },
    { speaker: 'System', text: 'Thank you. Please say the date of service.' },
    { speaker: 'Agent (AI)', text: 'March 11th, 2026.' },
    { speaker: 'System', text: 'Let me look that up for you.' },
    { speaker: 'System', text: 'I found a claim for date of service March 11th, 2026. The billed amount was $154.00. The claim was processed on March 13th, 2026.' },
    { speaker: 'System', text: 'The allowed amount is $128.15. The amount paid by insurance is $128.15. The check has not been issued yet.' },
    { speaker: 'System', text: 'Do you need the transaction or check number?' },
    { speaker: 'Agent (AI)', text: 'No.' },
    { speaker: 'System', text: 'Is there anything else I can help you with regarding this claim?' },
    { speaker: 'Agent (AI)', text: 'No, thank you.' },
    { speaker: 'System', text: 'Thank you for calling UnitedHealthcare. Goodbye.' }
  ];

  const API_BASE = 'http://127.0.0.1:8000/api/v1';

  useEffect(() => {
    fetchData();
  }, [batchId, callId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch batch data for context
      try {
        const bRes = await axios.get(`${API_BASE}/batches/${batchId}`);
        setBatchData(bRes.data);
      } catch (e) {
        setBatchData({ name: "Batch 2 - AC Jan 03, 2026", id: batchId, completed_calls: 340, total_calls: 493 });
      }

      // Simulation for demo
      setTimeout(() => {
        setCallData({
          id: callId || 'C-6513',
          patient: 'Palko, carol',
          insurance: 'Aarp medicare supplement',
          status: 'Paid',
          completedAt: '4/11/2026 4:11 PM',
          attempts: 2,
          created: '4/9/2026 2:49 PM',
          summary: "Called UnitedHealthcare AARP Medicare Supplement at 800-227-7782. Claim # 6000123025851. Agent searched claim status for DOS 03/11/2026. IVR reported claim processed 03/13/2026, allowed $128.15, paid $128.15, and check not issued yet.",
          shortSummary: "Claim processed and paid ($128.15) for DOS 03/11/2026. Check not issued yet.",
          detailedOverview: "Called UnitedHealthcare AARP Medicare Supplement at 800-227-7782 regarding Claim # 6000123025851. The AI agent checked the claim status for Date of Service 03/11/2026.\n\nThe IVR system reported that the claim was successfully processed on 03/13/2026. The allowed amount was $128.15, and the total amount paid by the insurance is $128.15. However, the check has not been issued yet at the time of the call.\n\nNote: Transaction/Check number, patient responsibility, and EFT number were not provided by the IVR. The call automatically ended after the IVR closed the session.",
          results: [
            { id: 1, label: 'Summary', response: 'The IVR confirms the search was successful and can help the user by...', collected: 'unknown' },
            { id: 2, label: 'Transaction/Check Number', response: '—', collected: 'unknown' },
            { id: 3, label: 'Amount Paid', response: 'The insurance paid nearly the date and policy these cards.', collected: '$128.15' },
            { id: 4, label: 'Claim Paid Date', response: 'It was processed on 03/13/2026 for nearly the any day.', collected: '03/13/2026' },
            { id: 5, label: 'Patient Responsibility', response: '—', collected: 'unknown' },
            { id: 6, label: 'EFT Number', response: '—', collected: 'unknown' },
            { id: 7, label: 'Denial Reason', response: 'Medicare approach plan decline and nearly date and these cards.', collected: '$128.15' },
            { id: 8, label: 'Check Issue Date', response: 'The check has not been issued yet.', collected: 'Check has not been issued yet.' },
          ],
          transcripts: [
            {
              attempt: 3,
              time: '04/12/2026 1:41 AM',
              type: 'Most Recent',
              phone: '+1 800-227-7789',
              text: 'Thank you for calling UnitedHealthcare Medicare Insurance plans from UnitedHealthcare Insurance Company or one of its affiliates.'
            }
          ],
          additionalDetails: [
            { key: "Claim Status", val: "Paid" },
            { key: "Date of Service", val: "03/11/2026" },
            { key: "Amount Charged", val: "$154.00" },
            { key: "Medicare Paid", val: "$128.15" },
            { key: "Check Issue Date", val: "Check has not been issued yet" },
            { key: "Claim Number", val: "6000123025851" },
            { key: "Billed Amount", val: "$154.00" },
            { key: "Medicare Approved", val: "$128.15" },
            { key: "Insurance Paid", val: "$128.15" },
            { key: "Amount Paid by Insurance", val: "$128.15" },
            { key: "Processed Date", val: "03/13/2026" }
          ]
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleStartEdit = (result) => {
    setEditingResultId(result.id);
    setEditValue(result.collected);
  };

  const handleCancelEdit = () => {
    setEditingResultId(null);
    setEditValue('');
  };

  const handleSaveClick = (result) => {
    setPendingChange({ 
      id: result.id, 
      label: result.label, 
      oldValue: result.collected, 
      value: editValue 
    });
    setHasAcknowledged(false);
    setIsConfirming(true);
  };

  const handleConfirmSave = () => {
    if (!pendingChange) return;

    setCallData(prev => {
      // 1. Update results table
      const updatedResults = prev.results.map(r => 
        r.id === pendingChange.id ? { ...r, collected: pendingChange.value } : r
      );

      // 2. Sync with additionalDetails
      const fieldMapping = {
        'Amount Paid': ['Medicare Paid', 'Insurance Paid', 'Amount Paid by Insurance', 'Amount Charged', 'Medicare Approved'],
        'Claim Paid Date': ['Processed Date'],
        'Check Issue Date': ['Check Issue Date'],
        'Transaction/Check Number': ['Claim Number'],
        'Summary': []
      };

      const keysToUpdate = fieldMapping[pendingChange.label] || [pendingChange.label];
      
      const updatedDetails = prev.additionalDetails.map(detail => {
        if (keysToUpdate.includes(detail.key)) {
          return { ...detail, val: pendingChange.value };
        }
        return detail;
      });

      return {
        ...prev,
        results: updatedResults,
        additionalDetails: updatedDetails
      };
    });

    setEditingResultId(null);
    setEditValue('');
    setPendingChange(null);
    setIsConfirming(false);
    setHasAcknowledged(false);
  };

  const handleNavigate = (direction) => {
    // Simulate navigation by incrementing/decrementing the call ID number
    const prefix = callId?.includes('-') ? callId.split('-')[0] : 'C';
    const num = parseInt(callId?.split('-')[1] || '6513');
    const nextNum = direction === 'next' ? num + 1 : num - 1;
    
    // Update the counter state as well
    setCurrentCallIndex(prev => direction === 'next' ? prev + 1 : prev - 1);
    
    navigate(`/batches/view/${batchId}/calls/${prefix}-${nextNum}`);
  };

  const handleSaveNotes = () => {
    // In a real app, this would be an API call
    console.log("Saving notes:", userNotes);
    setIsAddingNotes(false);
  };

  const handleDownloadReport = () => {
    const headers = ["Field", "IVR Response", "Collected Info"];
    const rows = callData.results.map(r => [r.label, r.response, r.collected]);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Call Report");
    XLSX.writeFile(workbook, `Call_Report_${callData.id}.xlsx`);
  };

  const handleDownloadRecording = (e, date) => {
    e.stopPropagation();
    const blob = new Blob(["Dummy audio content"], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Call_Recording_${date.replace(/\//g, '-')}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTranscriptText = (e, date) => {
    e.stopPropagation();
    
    const fullConversation = `Call Transcript - ${date}
Attempt: 3
Phone: +1 800-227-7789

[00:00:00] System: Thank you for calling UnitedHealthcare Medicare Insurance plans from UnitedHealthcare Insurance Company or one of its affiliates.
[00:00:08] System: To help direct your call, please say or enter your provider NPI number.
[00:00:15] Agent (AI): 1234567890
[00:00:18] System: Thank you. Are you calling to check the status of a claim, verify eligibility, or something else?
[00:00:25] Agent (AI): Claim status.
[00:00:27] System: Okay, claim status. Please say or enter the member's ID number.
[00:00:33] Agent (AI): 987654321
[00:00:36] System: Thank you. Please say the date of service.
[00:00:40] Agent (AI): March 11th, 2026.
[00:00:44] System: Let me look that up for you.
[00:00:48] System: I found a claim for date of service March 11th, 2026. The billed amount was $154.00. The claim was processed on March 13th, 2026.
[00:01:00] System: The allowed amount is $128.15. The amount paid by insurance is $128.15. The check has not been issued yet.
[00:01:12] System: Do you need the transaction or check number?
[00:01:15] Agent (AI): No.
[00:01:16] System: Is there anything else I can help you with regarding this claim?
[00:01:20] Agent (AI): No, thank you.
[00:01:22] System: Thank you for calling UnitedHealthcare. Goodbye.`;

    const blob = new Blob([fullConversation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Call_Transcript_${date.replace(/\//g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7F9]">
        <Loader2 className="animate-spin text-[#3B82F6]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col pb-8 font-sans">
      <div className="max-w-[1536px] w-full mx-auto px-6 py-2">
        
        {/* Breadcrumbs & Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center space-x-2 text-[11px] mb-2 text-[#717784] font-bold">
              <Link to="/" className="hover:text-[#3B82F6] transition-colors">Dashboard</Link>
              <ChevronRight size={12} strokeWidth={3} />
              <Link to="/search-batches" className="hover:text-[#3B82F6] transition-colors">Call Batch</Link>
              <ChevronRight size={12} strokeWidth={3} />
              <Link to={`/batches/view/${batchId}`} className="text-[#3B82F6] font-black">View Call Batch</Link>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate(`/batches/view/${batchId}`)}
                className="w-10 h-10 rounded-full bg-white border border-[#EAECEF] flex items-center justify-center text-[#717784] hover:text-[#3B82F6] hover:border-[#3B82F6] transition-all shadow-sm group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <h1 className="text-[28px] font-black text-[#1A1C21] tracking-tight leading-none">View Call Batch</h1>
            </div>
            <p className="text-[#717784] text-[13px] font-bold mt-1 ml-[52px]">Review the summary and details of this call batch.</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center space-x-4">
            <StepItem number={1} label="Info to Collect" completed />
            <ChevronRight size={14} className="text-[#3B82F6] opacity-50" />
            <StepItem number={2} label="Data" completed />
            <ChevronRight size={14} className="text-[#3B82F6] opacity-50" />
            <StepItem number={3} label="Schedule" completed />
            <ChevronRight size={14} className="text-[#D0D5DD]" />
            <StepItem number={4} label="Report" active />
          </div>
        </div>

        {/* Call Banner */}
        <div className="bg-[#2563EB] bg-gradient-to-br from-[#60A5FA] via-[#3B82F6] to-[#2563EB] rounded-[20px] p-5 text-white shadow-lg relative overflow-hidden mb-6">
          {/* Subtle wave pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
              <path d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 L1000,200 L0,200 Z" fill="white" />
              <path d="M0,150 C200,250 400,-50 600,150 C800,350 900,50 1000,150 L1000,200 L0,200 Z" fill="white" />
            </svg>
          </div>
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-[12px] flex items-center justify-center border border-white/20 shadow-inner">
                <Phone size={20} className="text-white" />
              </div>
              <div className="max-w-4xl">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-[18px] font-black tracking-tight uppercase">CALL ID: {callData.id}</h2>
                  <span className="bg-[#FFFFFF33] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-sm flex items-center shadow-sm">
                    AI-Powered
                  </span>
                </div>
                <p className="text-[13px] font-semibold text-white/90 leading-relaxed max-w-2xl">
                  {callData.shortSummary || "Claim processed and paid ($128.15) for DOS 03/11/2026. Check not issued yet."}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-4">
              <div className="flex items-center space-x-3">
                 <span className="text-[12px] font-black tracking-widest text-white/80">
                   493 / {currentCallIndex}
                 </span>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleNavigate('prev')}
                      className="w-7 h-7 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all shadow-sm active:scale-95"
                    >
                       <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={() => handleNavigate('next')}
                      className="w-7 h-7 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all shadow-sm active:scale-95"
                    >
                       <ChevronRight size={16} />
                    </button>
                  </div>
              </div>
              <button 
                onClick={() => setIsAddingNotes(!isAddingNotes)}
                className={`px-5 py-2 border rounded-xl text-[12px] font-black transition-all flex items-center backdrop-blur-sm shadow-md group ${isAddingNotes ? 'bg-white text-[#3B82F6] border-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
              >
                {isAddingNotes ? (
                  <><X size={14} className="mr-2" /> Close Notes</>
                ) : (
                  <><Edit2 size={14} className="mr-2 group-hover:scale-110 transition-transform" /> Add Call Notes</>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Notes Area */}
          {isAddingNotes && (
            <div className="mt-6 pt-6 border-t border-white/20 animate-in slide-in-from-top-4 duration-300">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[14px] font-black uppercase tracking-wider flex items-center">
                    <FileText size={16} className="mr-2" /> Manual Call Notes
                  </h4>
                  <span className="text-[10px] font-bold text-white/60">Auto-saved as draft</span>
                </div>
                <textarea 
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Enter any additional observations or notes about this call..."
                  className="w-full h-32 bg-white/10 border border-white/20 rounded-2xl p-4 text-[14px] font-medium text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all resize-none shadow-inner"
                  autoFocus
                />
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => setIsAddingNotes(false)}
                    className="px-4 py-2 text-[12px] font-black hover:text-white/70 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveNotes}
                    className="px-6 py-2 bg-white text-[#3B82F6] rounded-xl text-[12px] font-black hover:bg-blue-50 transition-all shadow-lg flex items-center"
                  >
                    <Check size={14} className="mr-2" /> Save Notes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
           <MetricCard 
             icon={<PhoneCall size={20}/>} 
             label="Completed Calls" 
             value="340 / 493" 
             percentage="68.9%" 
             color="text-[#059669]" 
             bg="bg-[#ECFDF5]" 
             borderColor="border-[#A7F3D0]"
           />
           <MetricCard 
             icon={<Clock size={20}/>} 
             label="In Review" 
             value="128" 
             percentage="25.9%" 
             color="text-[#3B82F6]" 
             bg="bg-[#E8F1FC]" 
             borderColor="border-[#D0E3F9]"
           />
           <MetricCard 
             icon={<RotateCcw size={20}/>} 
             label="Total Attempts" 
             value={callData.attempts} 
             percentage="0.5%" 
             color="text-[#7C3AED]" 
             bg="bg-[#F5F3FF]" 
             borderColor="border-[#DDD6FE]"
           />
           <MetricCard 
             icon={<Clock size={20}/>} 
             label="Avg Call Time" 
             value="4m 6s" 
             color="text-[#EA580C]" 
             bg="bg-[#FFF7ED]" 
             borderColor="border-[#FED7AA]"
           />
        </div>

        {/* Content Layout */}
        <div className="flex gap-6">
          
          {/* Main Content (Left) */}
          <div className="flex-1 space-y-6">
             
             {/* Call Overview Section */}
             <div className="bg-white rounded-[20px] p-5 border border-[#EAECEF] shadow-sm relative">
                <div className="flex items-center space-x-3 mb-3">
                   <div className="w-8 h-8 bg-[#E8F1FC] rounded-[10px] flex items-center justify-center text-[#3B82F6] border border-[#D0E3F9]">
                      <FileText size={16} />
                   </div>
                   <h3 className="font-black text-[#1A1C21] text-[14px]">Call Overview</h3>
                   <span className="bg-[#E8F1FC] text-[#3B82F6] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#D0E3F9] flex items-center shadow-sm">
                      <Zap size={10} className="mr-1 fill-[#3B82F6]" /> AI-Powered
                   </span>
                </div>
                <p className="text-[13px] font-semibold text-[#4A4F59] leading-relaxed whitespace-pre-wrap">
                   {callData.detailedOverview || "Called UnitedHealthcare AARP Medicare Supplement at 800-227-7782 regarding Claim # 6000123025851. The AI agent checked the claim status for Date of Service 03/11/2026.\n\nThe IVR system reported that the claim was successfully processed on 03/13/2026. The allowed amount was $128.15, and the total amount paid by the insurance is $128.15. However, the check has not been issued yet at the time of the call.\n\nNote: Transaction/Check number, patient responsibility, and EFT number were not provided by the IVR. The call automatically ended after the IVR closed the session."}
                </p>
             </div>

             {/* Call Results Table */}
             <div className="bg-white rounded-[24px] border border-[#EAECEF] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#EAECEF] flex justify-between items-center bg-[#F9FAFB]">
                   <div className="flex items-center space-x-3">
                      <CheckCircle2 size={20} className="text-[#3B82F6]" />
                      <h3 className="font-black text-[#1A1C21] text-[15px]">Call Results</h3>
                   </div>
                   <div className="flex items-center text-[12px] font-black text-[#717784] bg-white px-3 py-1 rounded-lg border border-[#EAECEF] shadow-sm">
                      <Info size={14} className="mr-2 text-[#98A2B3]" /> 18 Info Collected
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-[#F8FAFC]">
                         <tr className="border-b border-[#EAECEF]">
                            <th className="px-6 py-3 text-[11px] font-black text-[#717784] uppercase tracking-widest w-12 text-center">#</th>
                            <th className="px-4 py-3 text-[11px] font-black text-[#717784] uppercase tracking-widest">FIELD</th>
                            <th className="px-4 py-3 text-[11px] font-black text-[#717784] uppercase tracking-widest w-[40%]">IVR RESPONSE</th>
                            <th className="px-4 py-3 text-[11px] font-black text-[#717784] uppercase tracking-widest">INFO COLLECTED</th>
                            <th className="px-6 py-3 text-[11px] font-black text-[#717784] uppercase tracking-widest text-center">EDIT</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAECEF]">
                         {callData.results.map((r, idx) => (
                            <tr key={idx} className={`transition-colors group ${editingResultId === r.id ? 'bg-[#F1F5FD]' : 'hover:bg-[#F8FAFC]'}`}>
                               <td className="px-6 py-4 text-[12px] font-bold text-[#98A2B3] text-center">{r.id}</td>
                               <td className="px-4 py-4 text-[13px] font-black text-[#1A1C21]">{r.label}</td>
                               <td className="px-4 py-4 text-[12px] font-semibold text-[#4A4F59] leading-tight pr-10">{r.response}</td>
                               <td className="px-4 py-4">
                                  {editingResultId === r.id ? (
                                    <input 
                                      type="text"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="w-full px-3 py-1.5 border border-[#3B82F6] rounded-lg text-[13px] font-black focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/10 bg-white"
                                      autoFocus
                                    />
                                  ) : (
                                    <span className={`text-[13px] font-black ${r.collected === 'unknown' ? 'text-red-500' : 'text-[#1A1C21]'}`}>{r.collected}</span>
                                  )}
                               </td>
                               <td className="px-6 py-4 text-center">
                                  {editingResultId === r.id ? (
                                    <div className="flex items-center justify-center space-x-2">
                                      <button 
                                        onClick={() => handleSaveClick(r)}
                                        className="text-[#059669] hover:bg-[#ECFDF5] p-1.5 rounded-lg transition-all"
                                      >
                                        <Check size={14} strokeWidth={3} />
                                      </button>
                                      <button 
                                        onClick={handleCancelEdit}
                                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                                      >
                                        <X size={14} strokeWidth={3} />
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => handleStartEdit(r)}
                                      className="text-[#98A2B3] hover:text-[#3B82F6] transition-all p-1.5 rounded-lg hover:bg-[#E8F1FC]"
                                    >
                                       <Edit2 size={14} />
                                    </button>
                                  )}
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <div className="px-6 py-3 border-t border-[#EAECEF] bg-[#F9FAFB] flex justify-end">
                   <button className="text-[12px] font-black text-red-500 hover:text-red-600 flex items-center group">
                      <Trash2 size={14} className="mr-2 group-hover:scale-110 transition-transform" /> Delete Call Results
                   </button>
                </div>
             </div>

             {/* Call Transcript Section */}
             <div className="bg-white rounded-[24px] p-6 border border-[#EAECEF] shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                   <div className="w-8 h-8 bg-[#E8F1FC] rounded-[10px] flex items-center justify-center text-[#3B82F6] border border-[#D0E3F9]">
                      <FileText size={18} />
                   </div>
                   <h3 className="font-black text-[#1A1C21] text-[15px]">Call Transcript</h3>
                </div>
                <div className="pb-4 mb-4 border-b border-[#EAECEF] flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <span className="text-[14px] font-black text-[#1A1C21]">Attempt #3</span>
                      <span className="text-[11px] font-bold text-[#717784]">04/12/2026 1:41 AM</span>
                      <span className="bg-[#FFF7ED] text-[#EA580C] text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-[#FED7AA] shadow-sm">Most Recent</span>
                      <span className="text-[11px] font-black text-[#717784] bg-[#F4F7F9] px-2.5 py-0.5 rounded-lg border border-[#EAECEF]">4m 28s</span>
                   </div>
                   <button 
                      onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                      className="text-[12px] font-black text-[#3B82F6] hover:underline flex items-center group"
                    >
                       {isTranscriptExpanded ? 'Hide transcript' : 'View full transcript'} 
                       <ChevronRight size={14} className={`ml-1 transition-transform ${isTranscriptExpanded ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                    </button>
                </div>
                <div className={`text-[13px] leading-relaxed p-4 bg-[#F8FAFC] rounded-2xl border border-[#EAECEF] ${isTranscriptExpanded ? 'space-y-3 max-h-96 overflow-y-auto' : ''}`}>
                    {isTranscriptExpanded ? (
                      mockTranscript.map((msg, idx) => (
                        <div key={idx} className="flex">
                           <span className={`font-black mr-3 shrink-0 ${msg.speaker === 'System' ? 'text-[#3B82F6]' : 'text-[#059669]'}`}>{msg.speaker}:</span>
                           <span className="font-semibold text-[#4A4F59]">{msg.text}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex">
                         <span className="font-black text-[#3B82F6] mr-3 shrink-0">System:</span>
                         <span className="font-semibold text-[#4A4F59]">Thank you for calling UnitedHealthcare Medicare Insurance plans from UnitedHealthcare Insurance Company or one of its affiliates.</span>
                      </div>
                    )}
                 </div> 
             </div>

             {/* Full Output (Download Links) */}
             <div>
                <h3 className="text-[15px] font-black text-[#1A1C21] mb-4 ml-1 uppercase tracking-wider">Full Output</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white rounded-[24px] p-5 border border-[#EAECEF] shadow-sm">
                      <div className="flex items-center space-x-3 mb-5 pb-3 border-b border-[#F4F7F9]">
                         <div className="w-8 h-8 bg-[#F8FAFC] rounded-[10px] flex items-center justify-center text-[#717784] border border-[#EAECEF]">
                            <Phone size={16} />
                         </div>
                         <h4 className="text-[13px] font-black text-[#1A1C21]">Call Recordings</h4>
                      </div>
                      <div className="space-y-4">
                         {[1, 2, 3].map(i => (
                            <div key={i} onClick={(e) => handleDownloadRecording(e, '4/12/2026')} className="flex items-center justify-between group cursor-pointer hover:bg-[#F8FAFC] p-2 -m-2 rounded-xl transition-all">
                               <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-[#E8F1FC] text-[#3B82F6] flex items-center justify-center group-hover:bg-[#3B82F6] group-hover:text-white transition-all shadow-sm border border-[#D0E3F9]">
                                     <Mic size={14} />
                                  </div>
                                  <span className="text-[12px] font-bold text-[#4A4F59] group-hover:text-[#1A1C21]">Call Recording - 4/12/2026</span>
                               </div>
                               <Download size={14} className="text-[#98A2B3] group-hover:text-[#3B82F6] transition-colors" />
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="bg-white rounded-[24px] p-5 border border-[#EAECEF] shadow-sm">
                      <div className="flex items-center space-x-3 mb-5 pb-3 border-b border-[#F4F7F9]">
                         <div className="w-8 h-8 bg-[#F8FAFC] rounded-[10px] flex items-center justify-center text-[#717784] border border-[#EAECEF]">
                            <Activity size={16} />
                         </div>
                         <h4 className="text-[13px] font-black text-[#1A1C21]">Call Transcripts</h4>
                      </div>
                      <div className="space-y-4">
                         {[1, 2, 3].map(i => (
                            <div key={i} onClick={(e) => handleDownloadTranscriptText(e, '4/12/2026')} className="flex items-center justify-between group cursor-pointer hover:bg-[#F8FAFC] p-2 -m-2 rounded-xl transition-all">
                               <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-[#E8F1FC] text-[#3B82F6] flex items-center justify-center group-hover:bg-[#3B82F6] group-hover:text-white transition-all shadow-sm border border-[#D0E3F9]">
                                     <FileText size={14} />
                                  </div>
                                  <span className="text-[12px] font-bold text-[#4A4F59] group-hover:text-[#1A1C21]">Call Transcript - 4/12/2026</span>
                               </div>
                               <Download size={14} className="text-[#98A2B3] group-hover:text-[#3B82F6] transition-colors" />
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>

          </div>

          {/* Right Sidebar (Cards) */}
          <div className="w-[340px] shrink-0 space-y-6">
             
             {/* Batch Summary Card */}
             <div className="bg-white rounded-[24px] p-6 border border-[#EAECEF] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center space-x-2">
                      <FileText size={18} className="text-[#3B82F6]" />
                      <h3 className="font-black text-[#1A1C21] text-[15px]">Batch Summary</h3>
                   </div>
                   <span className="text-[10px] font-black text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-lg border border-[#A7F3D0] shadow-sm">Completed</span>
                </div>
                <div className="space-y-3.5 mb-6">
                   <SidebarRow label="Batch Title" value="Batch 2 - AC Jan 03, 2026" />
                   <SidebarRow label="Call Type" value="Claims IVR" badge />
                   <SidebarRow label="Goal" value="Claim Status" />
                   <SidebarRow label="To" value="Insurance" />
                   <SidebarRow label="Regarding" value="Patient" />
                   <SidebarRow label="Batch ID" value={batchId || "hardcoded-1"} />
                </div>
                <div className="pt-4 border-t border-[#F4F7F9] flex items-center justify-between">
                   <button onClick={() => setShowBatchQuality(true)} className="text-[12px] font-black text-[#3B82F6] hover:underline">View Batch Quality</button>
                   <div className="flex space-x-4">
                      <ThumbsUp size={16} className="text-[#98A2B3] cursor-pointer hover:text-[#3B82F6] transition-all hover:scale-110" />
                      <ThumbsDown size={16} className="text-[#98A2B3] cursor-pointer hover:text-red-500 transition-all hover:scale-110" />
                   </div>
                </div>
             </div>

             {/* Batch Activity Card */}
             <div className="bg-white rounded-[24px] p-6 border border-[#EAECEF] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center space-x-2">
                      <Activity size={18} className="text-[#3B82F6]" />
                      <h3 className="font-black text-[#1A1C21] text-[15px]">Batch Activity</h3>
                   </div>
                   <span className="flex items-center text-[11px] font-black text-[#059669]">
                      <div className="w-2 h-2 rounded-full bg-[#059669] mr-2 shadow-sm"></div> Completed
                   </span>
                </div>
                <div className="space-y-3.5 mb-6">
                   <SidebarRow label="Calls" value="340 / 493 complete" />
                   <SidebarRow label="Last Attempt" value="4/12/2026 1:41 AM" />
                   <SidebarRow label="Attempts" value="2" />
                   <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-[#717784] uppercase tracking-widest">Created</span>
                      <div className="flex items-center space-x-2">
                         <div className="w-6 h-6 rounded-lg bg-[#E8F1FC] flex items-center justify-center text-[10px] font-black text-[#3B82F6] border border-[#D0E3F9] shadow-sm">AC</div>
                         <span className="text-[13px] font-black text-[#1A1C21]">1/3/2026</span>
                      </div>
                   </div>
                </div>
                <div className="pt-4 border-t border-[#F4F7F9] text-center">
                   <button onClick={() => setShowBatchDetails(true)} className="text-[12px] font-black text-[#3B82F6] hover:underline">View Details</button>
                </div>
             </div>

             {/* Additional Details Grid Card */}
             <div className="bg-white rounded-[24px] p-6 border border-[#EAECEF] shadow-sm">
                <div className="flex items-center space-x-2 mb-6">
                   <Info size={18} className="text-[#3B82F6]" />
                   <h3 className="font-black text-[#1A1C21] text-[15px]">Additional Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   {callData.additionalDetails.map((detail, idx) => (
                      <div key={idx} className="flex items-start">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-1.5 mr-2 shrink-0 shadow-[0_0_4px_rgba(59,130,246,0.4)]"></div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#717784] uppercase tracking-widest leading-none mb-1">{detail.key}</span>
                            <span className="text-[11px] font-bold text-[#1A1C21] leading-tight">{detail.val}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Download Call Report CTA Button */}
             <div className="bg-gradient-to-br from-[#60A5FA] to-[#2563EB] rounded-[24px] p-1 shadow-lg shadow-blue-900/20 relative group overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <button 
                  onClick={handleDownloadReport}
                  className="relative z-10 w-full flex flex-col items-center justify-center p-6 bg-transparent rounded-[20px] transition-transform group-active:scale-95"
                >
                   <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-4 shadow-inner">
                      <Download size={24} className="text-white" />
                   </div>
                   <h4 className="text-[18px] font-black text-white text-center leading-tight mb-5">Download<br/>Call Report</h4>
                   <div className="w-full bg-white text-[#3B82F6] py-3 rounded-xl text-[13px] font-black shadow-xl hover:bg-[#F8FAFC] transition-colors">
                      Download Report
                   </div>
                </button>
             </div>

          </div>

        </div>

      </div>

      {/* Acknowledgement Modal */}
      {isConfirming && (
        <div className="fixed inset-0 bg-[#1A1C21]/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-[#EAECEF]">
            <div className="p-8 border-b border-[#EAECEF] bg-[#F9FAFB]">
              <div className="w-14 h-14 bg-[#E8F1FC] rounded-[20px] flex items-center justify-center text-[#3B82F6] mb-6 border border-[#D0E3F9] shadow-inner">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-[24px] font-black text-[#1A1C21] leading-tight">Acknowledgement Required</h3>
              <p className="text-[15px] font-bold text-[#717784] mt-2">You are about to manually change the collected information for this call.</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-[#FFF7ED] border border-[#FED7AA] p-4 rounded-2xl flex items-start space-x-3">
                <AlertCircle className="text-[#EA580C] shrink-0 mt-0.5" size={18} />
                <p className="text-[13px] font-bold text-[#9A3412] leading-relaxed">
                  Changing this data will affect the final report and potentially subsequent batch processing. Please ensure the new value is accurate.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F4F7F9] rounded-2xl border border-[#EAECEF]">
                  <span className="text-[10px] font-black text-[#717784] uppercase tracking-wider block mb-1">Current Value</span>
                  <span className="text-[14px] font-bold text-[#4A4F59] break-words">{pendingChange?.oldValue}</span>
                </div>
                <div className="p-4 bg-[#E8F1FC] rounded-2xl border border-[#D0E3F9]">
                  <span className="text-[10px] font-black text-[#3B82F6] uppercase tracking-wider block mb-1">New Value</span>
                  <span className="text-[14px] font-black text-[#1A1C21] break-words">{pendingChange?.value}</span>
                </div>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <div className="mt-1 relative">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-5 h-5 border-2 border-[#D0D5DD] rounded-md checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-all cursor-pointer"
                    checked={hasAcknowledged}
                    onChange={(e) => setHasAcknowledged(e.target.checked)}
                  />
                  <Check size={14} className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={4} />
                </div>
                <span className="text-[13px] font-bold text-[#4A4F59] group-hover:text-[#1A1C21] transition-colors leading-snug">
                  I acknowledge that I am manually changing this data and I have verified the new value is correct.
                </span>
              </label>
            </div>
            <div className="p-8 bg-[#F9FAFB] flex items-center justify-end space-x-4 border-t border-[#EAECEF]">
              <button 
                onClick={() => setIsConfirming(false)} 
                className="px-6 py-3 text-[14px] font-black text-[#4A4F59] hover:text-[#1A1C21] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSave} 
                disabled={!hasAcknowledged}
                className="px-10 py-4 bg-[#3B82F6] text-white rounded-2xl text-[14px] font-black hover:bg-[#1E40AF] transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Quality Modal */}
      {showBatchQuality && (
        <div className="fixed inset-0 bg-[#1A1C21]/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-[#EAECEF]">
            <div className="p-8 border-b border-[#EAECEF] bg-[#F9FAFB] flex justify-between items-start">
              <div>
                <div className="w-14 h-14 bg-[#ECFDF5] rounded-[20px] flex items-center justify-center text-[#059669] mb-6 border border-[#A7F3D0] shadow-inner">
                  <ThumbsUp size={32} />
                </div>
                <h3 className="text-[24px] font-black text-[#1A1C21] leading-tight">Batch Quality</h3>
                <p className="text-[15px] font-bold text-[#717784] mt-2">Quality metrics for Batch 2 - AC Jan 03, 2026</p>
              </div>
              <button onClick={() => setShowBatchQuality(false)} className="text-[#98A2B3] hover:text-[#1A1C21] transition-colors hover:bg-white p-2 rounded-xl border border-transparent hover:border-[#EAECEF]">
                 <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-4">
               <div className="flex justify-between items-center p-4 bg-[#F4F7F9] rounded-2xl border border-[#EAECEF]">
                  <span className="text-[13px] font-black text-[#717784] uppercase tracking-wider">Overall Score</span>
                  <span className="text-[18px] font-black text-[#059669]">98.2%</span>
               </div>
               <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-[#EAECEF]">
                  <span className="text-[13px] font-bold text-[#4A4F59]">AI Understanding Accuracy</span>
                  <span className="text-[14px] font-black text-[#1A1C21]">99.5%</span>
               </div>
               <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-[#EAECEF]">
                  <span className="text-[13px] font-bold text-[#4A4F59]">IVR Navigation Success</span>
                  <span className="text-[14px] font-black text-[#1A1C21]">96.0%</span>
               </div>
               <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-[#EAECEF]">
                  <span className="text-[13px] font-bold text-[#4A4F59]">Information Extraction Rate</span>
                  <span className="text-[14px] font-black text-[#1A1C21]">100%</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Batch Details Modal */}
      {showBatchDetails && (
        <div className="fixed inset-0 bg-[#1A1C21]/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-[#EAECEF]">
            <div className="p-8 border-b border-[#EAECEF] bg-[#F9FAFB] flex justify-between items-start">
              <div>
                <div className="w-14 h-14 bg-[#E8F1FC] rounded-[20px] flex items-center justify-center text-[#3B82F6] mb-6 border border-[#D0E3F9] shadow-inner">
                  <Activity size={32} />
                </div>
                <h3 className="text-[24px] font-black text-[#1A1C21] leading-tight">Batch Activity Details</h3>
                <p className="text-[15px] font-bold text-[#717784] mt-2">Detailed breakdown of the current batch progress.</p>
              </div>
              <button onClick={() => setShowBatchDetails(false)} className="text-[#98A2B3] hover:text-[#1A1C21] transition-colors hover:bg-white p-2 rounded-xl border border-transparent hover:border-[#EAECEF]">
                 <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-[#F4F7F9] rounded-2xl border border-[#EAECEF]">
                   <span className="text-[10px] font-black text-[#717784] uppercase tracking-wider block mb-1">Successful Connects</span>
                   <span className="text-[18px] font-black text-[#059669]">325 <span className="text-[12px] text-[#059669]/70">(95.5%)</span></span>
                 </div>
                 <div className="p-4 bg-[#F4F7F9] rounded-2xl border border-[#EAECEF]">
                   <span className="text-[10px] font-black text-[#717784] uppercase tracking-wider block mb-1">Failed/Voicemail</span>
                   <span className="text-[18px] font-black text-[#EA580C]">15 <span className="text-[12px] text-[#EA580C]/70">(4.4%)</span></span>
                 </div>
               </div>
               <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-[#EAECEF]">
                  <span className="text-[13px] font-bold text-[#4A4F59]">Peak Call Volume</span>
                  <span className="text-[14px] font-black text-[#1A1C21]">10:00 AM - 11:00 AM</span>
               </div>
               <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-[#EAECEF]">
                  <span className="text-[13px] font-bold text-[#4A4F59]">Agent Utilization</span>
                  <span className="text-[14px] font-black text-[#1A1C21]">85%</span>
               </div>
               <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-[#EAECEF]">
                  <span className="text-[13px] font-bold text-[#4A4F59]">Next scheduled retry</span>
                  <span className="text-[14px] font-black text-[#1A1C21]">04/13/2026 09:00 AM</span>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper Components
const StepItem = ({ number, label, active, completed }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] transition-all duration-300
      ${active ? 'bg-[#3B82F6] text-white shadow-lg scale-110 ring-4 ring-blue-100' : 
        completed ? 'bg-[#3B82F6] text-white' : 'bg-white border-2 border-[#D0D5DD] text-[#98A2B3]'}`}>
      {completed && !active ? <Check size={12} strokeWidth={4} /> : number}
    </div>
    <span className={`block font-black text-[11px] tracking-tight ${active || completed ? 'text-[#1A1C21]' : 'text-[#717784]'}`}>{label}</span>
  </div>
);

const MetricCard = ({ icon, label, value, percentage, color, bg, borderColor }) => (
  <div className={`bg-white rounded-[20px] p-4 border border-[#EAECEF] shadow-sm flex items-center justify-between group hover:shadow-md transition-all hover:-translate-y-1`}>
     <div className="flex items-center space-x-3">
        <div className={`w-9 h-9 rounded-[10px] ${bg} ${color} flex items-center justify-center border ${borderColor} shadow-sm transition-transform group-hover:scale-110`}>
           {React.cloneElement(icon, { size: 16 })}
        </div>
        <div className="flex flex-col">
           <span className="text-[10px] font-black text-[#717784] uppercase tracking-widest leading-none mb-1">{label}</span>
           <span className="text-[16px] font-black text-[#1A1C21] tracking-tight">{value}</span>
        </div>
     </div>
     {percentage && (
        <div className={`flex items-center ${color} text-[11px] font-black px-2 py-1 rounded-lg ${bg} border ${borderColor}`}>
           <div className={`w-1.5 h-1.5 rounded-full bg-current mr-2`}></div>
           {percentage}
        </div>
     )}
  </div>
);

const SidebarRow = ({ label, value, badge }) => (
  <div className="flex justify-between items-center">
    <span className="text-[11px] font-bold text-[#717784] uppercase tracking-widest leading-none">{label}</span>
    {badge ? (
      <span className="text-[10px] font-black text-[#3B82F6] bg-[#E8F1FC] px-2 py-0.5 rounded-lg border border-[#D0E3F9] shadow-sm">{value}</span>
    ) : (
      <span className="text-[13px] font-black text-[#1A1C21] tracking-tight">{value}</span>
    )}
  </div>
);

export default CallDetails;

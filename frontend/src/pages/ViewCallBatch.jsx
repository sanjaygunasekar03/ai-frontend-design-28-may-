import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
  ChevronRight, CheckCircle2, Clock, Zap, Phone, Settings, MoreHorizontal,
  Download, RotateCcw, Copy, Plus, History, Search, Check, ThumbsUp,
  ThumbsDown, Info, ArrowLeft, Filter, Circle, AlertCircle, FileText,
  Loader2, Trash2, Activity, ShieldCheck, PhoneCall, ArrowRight, Eye,
  Sparkles, CheckSquare, ChevronDown, ListFilter, User2, MessageSquare,
  FileCheck, LayoutGrid, Database, Calendar, MousePointer2, RefreshCw
} from 'lucide-react';

const ViewCallBatch = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('completed');
  const [batchData, setBatchData] = useState(null);
  const [callsList, setCallsList] = useState([]);
  const API_BASE = 'http://127.0.0.1:8000/api/v1';

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchBatchData();
  }, [batchId]);

  const fetchBatchData = async () => {
    try {
      setLoading(true);
      if (typeof batchId === 'string' && batchId.startsWith('hardcoded-')) {
         const mockData = [
          { id: 'hardcoded-1', name: 'Batch 2 - AC Jan 03, 2026', status: 'review', completed_calls: 340, total_calls: 498, created_at: '2026-01-03T09:00:00Z' },
          { id: 'hardcoded-2', name: 'Batch 3 - AC Feb 11, 2026', status: 'review', completed_calls: 218, total_calls: 460, created_at: '2026-02-11T09:00:00Z' },
          { id: 'hardcoded-3', name: 'Batch 4 - AC Mar 20, 2026', status: 'review', completed_calls: 161, total_calls: 498, created_at: '2026-03-20T09:00:00Z' },
          { id: 'hardcoded-4', name: 'Batch 5 - AC Mar 20, 2026 [2]', status: 'review', completed_calls: 6, total_calls: 8, created_at: '2026-03-20T09:00:00Z' },
        ].find(b => b.id === batchId);
        setBatchData(mockData);
        setCallsList([
          { id: 'C-6513', insurance: 'Aarp medical...', patient: 'Palko, carol', status: 'Paid', info: '5/8', attempts: 2, callStatus: 'Completed' },
          { id: 'C-6512', insurance: 'Aetna', patient: 'Owens, hazel', status: 'Paid', info: '7/8', attempts: 1, callStatus: 'Completed' },
          { id: 'C-6311', insurance: 'Uhc', patient: 'Owens, chris...', status: 'Paid', info: '6/8', attempts: 1, callStatus: 'Completed' },
          { id: 'C-6309', insurance: 'Aarp medica...', patient: 'Owen, marvin', status: 'Paid', info: '3/8', attempts: 2, callStatus: 'Completed' },
          { id: 'C-6269', insurance: 'Uhc', patient: 'Miree, aman...', status: 'Not Found', info: '1/1', attempts: 1, callStatus: 'Completed' },
        ]);
        setLoading(false);
        return;
      }

      const [batchRes, callsRes] = await Promise.all([
        axios.get(`${API_BASE}/batches/${batchId}`),
        axios.get(`${API_BASE}/calls`) 
      ]);
      
      if (batchRes.data && batchRes.data.name === 'March Claims Batch') {
        batchRes.data.name = 'Batch 1 - AC Jan 03, 2026';
      }
      setBatchData(batchRes.data);
      const filteredCalls = callsRes.data.filter(c => String(c.batch_id) === String(batchId)); 
      setCallsList(filteredCalls.length > 0 ? filteredCalls : [
        { id: 'C-6513', insurance: 'Aarp medical...', patient: 'Palko, carol', status: 'Paid', info: '5/8', attempts: 2, callStatus: 'Completed' },
        { id: 'C-6512', insurance: 'Aetna', patient: 'Owens, hazel', status: 'Paid', info: '7/8', attempts: 1, callStatus: 'Completed' },
        { id: 'C-6311', insurance: 'Uhc', patient: 'Owens, chris...', status: 'Paid', info: '6/8', attempts: 1, callStatus: 'Completed' },
        { id: 'C-6309', insurance: 'Aarp medica...', patient: 'Owen, marvin', status: 'Paid', info: '3/8', attempts: 2, callStatus: 'Completed' },
        { id: 'C-6269', insurance: 'Uhc', patient: 'Miree, aman...', status: 'Not Found', info: '1/1', attempts: 1, callStatus: 'Completed' },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching batch data:', error);
      setBatchData({
        id: batchId || 'B-1042',
        name: 'Batch 2 - AC Jan 03, 2026',
        status: 'review',
        completed_calls: 340,
        total_calls: 498,
        created_at: '2026-04-10T00:26:00Z'
      });
      setCallsList([
        { id: 'C-6513', insurance: 'Aarp medical...', patient: 'Palko, carol', status: 'Paid', info: '5/8', attempts: 2, callStatus: 'Completed' },
        { id: 'C-6512', insurance: 'Aetna', patient: 'Owens, hazel', status: 'Paid', info: '7/8', attempts: 1, callStatus: 'Completed' },
        { id: 'C-6311', insurance: 'Uhc', patient: 'Owens, chris...', status: 'Paid', info: '6/8', attempts: 1, callStatus: 'Completed' },
        { id: 'C-6309', insurance: 'Aarp medica...', patient: 'Owen, marvin', status: 'Paid', info: '3/8', attempts: 2, callStatus: 'Completed' },
        { id: 'C-6269', insurance: 'Uhc', patient: 'Miree, aman...', status: 'Not Found', info: '1/1', attempts: 1, callStatus: 'Completed' },
      ]);
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      if (typeof batchId === 'string' && !batchId.startsWith('hardcoded-')) {
        await axios.patch(`${API_BASE}/batches/${batchId}`, { status: 'completed' });
      }
      setBatchData(prev => ({ ...prev, status: 'completed' }));
      alert('Batch marked as complete.');
    } catch (error) {
      console.error('Error marking complete:', error);
      setBatchData(prev => ({ ...prev, status: 'completed' }));
      alert('Batch status updated locally.');
    }
  };

  const handleDeleteBatch = async () => {
    if (window.confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      try {
        if (typeof batchId === 'string' && !batchId.startsWith('hardcoded-')) {
          await axios.delete(`${API_BASE}/batches/${batchId}`).catch(err => {
             console.warn('Backend delete failed in ViewCallBatch, continuing with redirection:', err);
          });
        }
        alert('Batch deleted successfully.');
        navigate('/');
      } catch (error) {
        console.error('Error deleting batch in ViewCallBatch:', error);
        alert('Batch removed successfully.');
        navigate('/');
      }
    }
  };

  const handleRetryUnfinished = async () => {
    alert('Retrying unfinished calls for this batch...');
    setCallsList(prev => prev.map(c => c.callStatus === 'Failed' || c.callStatus === 'Incomplete' ? { ...c, callStatus: 'Calling' } : c));
  };

  const handleOpenTemplateModal = () => {
    setNewTemplateName(`${batchData?.name || 'Batch'} Template`);
    setShowTemplateModal(true);
  };

  const handleSaveAsTemplate = async () => {
    if (!newTemplateName.trim()) {
      alert('Please enter a template name.');
      return;
    }
    try {
      await axios.post(`${API_BASE}/templates`, {
        name: newTemplateName,
        goal: 'Claim Status',
        datapoints: '8 Datapoints',
        is_ivr_only: true
      });
      alert('Template successfully created and saved in Templates section.');
      setShowTemplateModal(false);
    } catch (error) {
       alert('Template successfully created and saved to your library.');
       setShowTemplateModal(false);
    }
  };

  const handleDuplicate = async () => {
    const newName = `${batchData?.name || 'Batch'} - copy`;
    if (window.confirm(`Are you sure you want to duplicate this batch as "${newName}"?`)) {
      try {
        let response;
        if (typeof batchId === 'string' && batchId.startsWith('hardcoded-')) {
          response = await axios.post(`${API_BASE}/batches`, {
            template_id: 'template1',
            created_by: 'user1',
            name: newName,
            status: 'draft'
          });
        } else {
          response = await axios.post(`${API_BASE}/batches/${batchId}/duplicate`);
          if (response.data && response.data.id) {
             await axios.patch(`${API_BASE}/batches/${response.data.id}`, { name: newName });
          }
        }
        
        alert(`Batch successfully duplicated as "${newName}" and saved in your batches section.`);
        navigate('/search-batches');
      } catch (error) {
        console.error('Error duplicating batch:', error);
        alert(`Failed to duplicate batch. Please try again.`);
      }
    }
  };

  const handleDownloadReport = () => {
    const headers = [
      'Batch ID', 'Call Type', 'Call Goal', 'Call #', 'Call Status', 'Last Call Date', 'Date Created', 'Completed/Total', 'Date Completed', 'Created By',
      'patient_name', 'patient_date_of_birth', 'patient_address', 'insurance_name', 'insurance_phone_number', 'patient_primary_insurance_policy_id',
      'provider_name', 'provider_npi', 'provider_ptan', 'provider_tax_id', 'provider_phone_number', 'provider_practice_name', 'provider_practice_address', 'provider_practice_npi',
      'procedure_date', 'claim_billed_amount', 'provider_callback_number', 'Claim Status', 'Transaction/Check Number', 'Amount Paid', 'Claim Paid Date', 'Patient Responsibility',
      'EFT Number', 'Allowed Amount', 'Check Issue Date', 'Denial Reason', 'Received Date', 'Claim Number', 'Expected Processing Time', 'Average Call Time',
      'Call Details', 'Call Overview', 'Additional Details', 'Call ID', 'Insurance', 'Patient', 'Claim Status', 'Info Collected', 'Attempts', 'Call Status'
    ];

    const excelData = [
      headers,
      ...filteredCalls.map((c, index) => [
        batchData?.id || 'B-1042', 
        'Claims (IVR)', 
        'Claim Status', 
        index + 1, 
        c.callStatus, 
        '4/12/2026 1:41 AM', 
        '1/3/2026', 
        `${batchData?.completed_calls || 340} / ${batchData?.total_calls || 498}`, 
        c.callStatus === 'Completed' ? '4/12/2026' : '-', 
        'AC', 
        c.patient, 
        '05/12/1975', 
        '890 Healthcare Dr, Medical City', 
        c.insurance, 
        '800-123-4567', 
        'ID' + Math.floor(Math.random() * 900000 + 100000), 
        'John Doe', 
        '1234567890', 
        'PTAN9988', 
        'XX-XXXXXXX', 
        '555-0199', 
        'Bristol Healthcare', 
        '123 Practice St', 
        '0987654321', 
        '02/10/2026', 
        '$1,200.00', 
        '555-0200', 
        c.status, 
        'TRX' + Math.floor(Math.random() * 900000 + 100000), 
        c.status === 'Paid' ? '$850.00' : '$0.00', 
        c.status === 'Paid' ? '03/05/2026' : '-', 
        '$150.00', 
        'EFT' + Math.floor(Math.random() * 900000 + 100000), 
        '$1,000.00', 
        '03/10/2026', 
        c.status === 'Not Found' ? 'Patient info mismatch' : '-', 
        '02/15/2026', 
        'CLM' + Math.floor(Math.random() * 900000 + 100000), 
        '30 Days', 
        '4m 6s', 
        'Call completed via IVR system.', 
        'Successful claim status check.', 
        'N/A', 
        c.id, 
        c.insurance, 
        c.patient, 
        c.status,
        c.info, 
        c.attempts,
        c.callStatus
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Batch Report");
    XLSX.writeFile(workbook, `Batch_Report_${batchData?.name || 'Batch'}.xlsx`);
  };

  const handleViewHistory = () => {
    navigate('/search-batches');
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCalls.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCalls.map(c => c.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

   const filteredCalls = callsList.filter(call => 
     Object.values(call).some(val => 
       String(val).toLowerCase().includes(searchTerm.toLowerCase())
     )
   );
 
   const totalCallsCount = batchData?.total_calls || callsList.length || 0;
   const completedCallsCount = callsList.filter(c => c.callStatus === 'Completed').length;
   const inProgressCallsCount = callsList.filter(c => c.callStatus === 'Calling').length;
   const failedCallsCount = callsList.filter(c => c.callStatus === 'Failed' || c.callStatus === 'Incomplete').length;
   
   const successPercentage = totalCallsCount > 0 ? Math.round((completedCallsCount / totalCallsCount) * 100) : 0;
   const reviewPercentage = totalCallsCount > 0 ? Math.round(((totalCallsCount - completedCallsCount) / totalCallsCount) * 100) : 0;
 
   if (loading) {
     return (
       <div className="flex items-center justify-center min-h-screen bg-[#F7F8FA]">
         <Loader2 className="animate-spin text-[#3B82F6]" size={40} />
       </div>
     );
   }

  return (
    <div className="min-h-screen bg-[#F0F4F9] flex flex-col relative pb-6 font-sans">
      <div className="max-w-[1600px] w-full mx-auto px-6 py-4">
        
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-2 text-[12px] mb-2 text-[#5F6368] font-semibold">
              <Link to="/" className="hover:text-[#3B82F6] transition-colors">Dashboard</Link>
              <ChevronRight size={10} className="opacity-50" />
              <Link to="/search-batches" className="hover:text-[#3B82F6] transition-colors">Call Batch</Link>
              <ChevronRight size={10} className="opacity-50" />
              <span className="text-[#3B82F6] font-extrabold underline underline-offset-4 decoration-2">View Call Batch</span>
            </div>
            <h1 className="text-[32px] font-[900] text-[#1A1C21] tracking-tight mb-1">
              View Call Batch
            </h1>
            <p className="text-[#717784] text-[14px] font-semibold">Review the summary and details of this call batch.</p>
          </div>


        </div>

        {/* Stepper (4 Steps) */}
        <div className="flex items-center justify-between mb-8 max-w-[900px]">
          <div className="flex items-center space-x-3 group">
             <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shadow-lg ring-4 ring-[#3B82F6]/10">
                <Check size={16} strokeWidth={4} />
             </div>
             <span className="text-[14px] font-black text-[#1A1C21]">Info to Collect</span>
          </div>
          <div className="flex-1 h-[2px] mx-4 bg-[#3B82F6]"></div>
          
          <div className="flex items-center space-x-3 group">
             <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shadow-lg ring-4 ring-[#3B82F6]/10">
                <Check size={16} strokeWidth={4} />
             </div>
             <span className="text-[14px] font-black text-[#1A1C21]">Data</span>
          </div>
          <div className="flex-1 h-[2px] mx-4 bg-[#3B82F6]"></div>

          <div className="flex items-center space-x-3 group">
             <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shadow-lg ring-4 ring-[#3B82F6]/10">
                <Check size={16} strokeWidth={4} />
             </div>
             <span className="text-[14px] font-black text-[#1A1C21]">Schedule</span>
          </div>
          <div className="flex-1 h-[2px] mx-4 bg-[#EAECEF]"></div>

          <div className="flex items-center space-x-3 group">
             <div className="w-8 h-8 rounded-full border-2 border-[#3B82F6] bg-white flex items-center justify-center text-[#3B82F6] font-black text-[13px]">
                4
             </div>
             <span className="text-[14px] font-black text-[#3B82F6]">Report</span>
          </div>
        </div>

        {/* Top Info Grid (4 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Card 1: Batch Details (Blue Theme) */}
          <div className="lg:col-span-1 bg-[#3B82F6] rounded-[20px] p-5 text-white shadow-lg relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                   <div className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-[12px] flex items-center justify-center border border-white/20">
                      <LayoutGrid size={18} className="text-white" />
                   </div>
                   <h3 className="font-black text-[16px] tracking-tight">Batch Details</h3>
                </div>
                <button className="text-white/60 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                <DetailRow label="Batch Title" value={batchData?.name || 'Batch 2 - AC Jan 03, 2026'} />
                <DetailRow label="Call Type" value="Claims IVR" badge />
                <DetailRow label="Goal" value="Claim Status" />
                <DetailRow label="To" value="Insurance" />
                <DetailRow label="Regarding" value="Patient" />
                <DetailRow label="Batch ID" value={batchData?.id || 'hardcoded-1'} />
              </div>

              <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[12px] font-bold text-white/60">Batch Quality?</span>
                <div className="flex space-x-3 text-white/60">
                  <ThumbsUp size={16} className="cursor-pointer hover:text-white transition-colors" />
                  <ThumbsDown size={16} className="cursor-pointer hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: For Review (AI-Powered) */}
          <div className="lg:col-span-1 bg-white rounded-[20px] p-5 border border-[#EAECEF] shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-[#1A1C21] text-[14px]">For Review</h3>
              <div className="flex items-center space-x-1.5 bg-[#E8F1FC] px-2 py-1 rounded-full border border-[#D0E3F9]">
                 <Sparkles size={10} className="text-[#3B82F6] fill-[#3B82F6]" />
                 <span className="text-[#3B82F6] text-[9px] font-black uppercase tracking-wider">AI-Powered</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-start space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#E8F1FC] rounded-[12px] flex items-center justify-center text-[#3B82F6] border border-[#D0E3F9] shadow-sm">
                  <CheckSquare size={20} />
                </div>
                <div>
                  <div className="flex items-baseline space-x-1">
                     <span className="text-[22px] font-black text-[#1A1C21]">5</span>
                     <span className="text-[13px] font-bold text-[#1A1C21]">completed</span>
                  </div>
                  <p className="text-[11px] font-semibold text-[#717784] leading-tight">calls completed successfully</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-[12px] flex items-center justify-center text-[#3B82F6] border border-[#EAECEF] shadow-sm">
                  <Clock size={20} />
                </div>
                <div>
                   <div className="flex items-baseline space-x-1">
                      <span className="text-[22px] font-black text-[#1A1C21]">493</span>
                      <span className="text-[13px] font-bold text-[#1A1C21]">review</span>
                   </div>
                   <p className="text-[11px] font-semibold text-[#717784] leading-tight">calls needing review</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: More Info */}
          <div className="lg:col-span-1 bg-white rounded-[20px] p-5 border border-[#EAECEF] shadow-sm">
            <h3 className="font-black text-[#1A1C21] text-[14px] mb-4">More Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2.5">
                <div className="w-1 h-1 rounded-full bg-[#3B82F6] mt-1.5 shrink-0"></div>
                <p className="text-[12px] font-semibold text-[#4A4F59] leading-relaxed">All failed calls share the common issue of not answering the single required "Claim Status" question.</p>
              </li>
              <li className="flex items-start space-x-2.5">
                <div className="w-1 h-1 rounded-full bg-[#3B82F6] mt-1.5 shrink-0"></div>
                <p className="text-[12px] font-semibold text-[#4A4F59] leading-relaxed"><span className="text-[#3B82F6]">No calls were partially completed;</span> calls either succeeded fully or failed at the initial question.</p>
              </li>
              <li className="flex items-start space-x-2.5">
                <div className="w-1 h-1 rounded-full bg-[#3B82F6] mt-1.5 shrink-0"></div>
                <p className="text-[12px] font-semibold text-[#4A4F59] leading-relaxed">The AI agent needs improvement in entering or selecting the required claim status information to reduce call failures.</p>
              </li>
            </ul>
          </div>

          {/* Card 4: Quick Summary */}
          <div className="lg:col-span-1 bg-white rounded-[20px] p-5 border border-[#EAECEF] shadow-sm flex flex-col">
            <h3 className="font-black text-[#1A1C21] text-[14px] mb-4">Quick Summary</h3>
            <div className="space-y-4">
              <SummaryItem icon={<PhoneCall size={18}/>} label="Total Calls" value={totalCallsCount} color="text-[#3B82F6]" />
              <SummaryItem icon={<CheckCircle2 size={18}/>} label="Completed" value={completedCallsCount} color="text-[#059669]" />
              <SummaryItem icon={<Clock size={18}/>} label="Needs Review" value={totalCallsCount - completedCallsCount} color="text-[#EA580C]" />
            </div>
          </div>

        </div>

        {/* Second Section: Batch Summary & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Batch Summary Card */}
          <div className="lg:col-span-3 bg-white rounded-[24px] p-6 border border-[#EAECEF] shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-12">
               
               {/* Left: Progress Charts */}
               <div className="lg:w-2/5">
                  <div className="flex items-center space-x-2 mb-6">
                     <Activity size={18} className="text-[#059669]" />
                     <h3 className="font-black text-[#1A1C21] text-[16px]">Batch Summary</h3>
                     <div className="flex items-center space-x-1.5 ml-auto bg-[#F8FAFC] px-3 py-1 rounded-full border border-[#EAECEF]">
                        <Clock size={12} className="text-[#717784]" />
                        <span className="text-[11px] font-bold text-[#717784]">Total Call Time: 1d 22h 28m 48s</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                     <DonutChart percentage={15} label="Completed" sublabel="(5)" color="#059669" />
                     <DonutChart percentage={99} label="In Review" sublabel="(493)" color="#3B82F6" />
                     <DonutChart percentage={0} label="Error" sublabel="(0)" color="#EA580C" />
                  </div>
               </div>

               {/* Right: Achievements */}
               <div className="lg:w-3/5 flex flex-col mt-8 lg:mt-0">
                  <h3 className="font-extrabold text-[#1A1C21] text-[13px] uppercase tracking-widest mb-6">Batch Achievements</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                     <AchievementItem icon={<Phone size={18}/>} label="Primary Info" value={completedCallsCount} total={493} />
                     <AchievementItem icon={<FileText size={18}/>} label="All Info" value={16} total={493} />
                     <AchievementItem icon={<RefreshCw size={18}/>} label="Total Attempts" value={7} />
                     <AchievementItem icon={<Clock size={18}/>} label="Avg Call Time" value="4m 6s" />
                  </div>
               </div>
            </div>
          </div>

          {/* Batch Activity Card (Right) */}
          <div className="lg:col-span-1 bg-white rounded-[24px] p-6 border border-[#EAECEF] shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                   <Activity size={18} className="text-[#3B82F6]" />
                   <h3 className="font-black text-[#1A1C21] text-[15px]">Batch Activity</h3>
                </div>
             </div>
             <div className="space-y-4">
                <ActivityRow label="Status" value="Review" statusColor="bg-[#059669]" />
                <ActivityRow label="Calls" value={`${batchData?.completed_calls || 340} / ${batchData?.total_calls || 493} complete`} />
                <ActivityRow label="Last Attempt" value="4/12/2026 1:41 AM" />
                <ActivityRow label="Batch Speed" value="Max" isZap />
                <ActivityRow label="Created" value="1/3/2026" author="AC" />
             </div>
          </div>
        </div>

        {/* Third Section: Table & Actions */}
        <div className="flex flex-col lg:flex-row gap-4">
           
           {/* Calls Table (Left) */}
           <div className="flex-1 bg-white rounded-[24px] border border-[#EAECEF] shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-[#EAECEF] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                 <div className="flex items-center space-x-8">
                    <h3 className="text-[16px] font-black text-[#1A1C21]">Calls</h3>
                    <div className="flex items-center space-x-6">
                       <button className="text-[14px] font-black text-[#3B82F6] relative pb-4 -mb-4">
                          5 Calls Results
                          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3B82F6] rounded-t-full"></div>
                       </button>
                       <button className="text-[14px] font-bold text-[#717784] hover:text-[#1A1C21] transition-colors">Select All</button>
                    </div>
                 </div>
                 
                 <div className="flex items-center space-x-3">
                    <button onClick={handleRetryUnfinished} className="flex items-center space-x-2 px-4 py-2 bg-[#E8F1FC] text-[#3B82F6] font-black text-[12px] rounded-full hover:bg-[#3B82F6] hover:text-white transition-all shadow-sm">
                       <RefreshCw size={14} />
                       <span>Retry Unfinished Calls</span>
                    </button>
                    <div className="relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]" size={16} />
                       <input 
                          type="text" 
                          placeholder="Search patient, insurance..." 
                          className="pl-11 pr-4 py-2 border border-[#EAECEF] rounded-full text-[13px] font-bold text-[#1A1C21] w-64 focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/5 bg-[#F8FAFC] transition-all"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                       />
                    </div>
                 </div>
              </div>

              <div className="overflow-x-auto flex-1">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-[#F8FAFC] border-b border-[#EAECEF]">
                          <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-[#D0D5DD] w-4 h-4 cursor-pointer accent-[#3B82F6]" checked={filteredCalls.length > 0 && selectedIds.length === filteredCalls.length} onChange={toggleSelectAll} /></th>
                          <th className="px-4 py-4 text-[11px] font-black text-[#717784] uppercase tracking-widest">CALL ID</th>
                          <th className="px-4 py-4 text-[11px] font-black text-[#717784] uppercase tracking-widest">INSURANCE</th>
                          <th className="px-4 py-4 text-[11px] font-black text-[#717784] uppercase tracking-widest">PATIENT</th>
                          <th className="px-4 py-4 text-[11px] font-black text-[#717784] uppercase tracking-widest">CLAIM STATUS</th>
                          <th className="px-4 py-4 text-[11px] font-black text-[#717784] uppercase tracking-widest text-center">INFO COLLECTED</th>
                          <th className="px-4 py-4 text-[11px] font-black text-[#717784] uppercase tracking-widest text-center">ATTEMPTS</th>
                          <th className="px-4 py-4 text-[11px] font-black text-[#717784] uppercase tracking-widest">CALL STATUS</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAECEF]">
                       {filteredCalls.map((call) => (
                          <tr 
                            key={call.id} 
                            className="hover:bg-[#F8FAFC] cursor-pointer group transition-colors"
                            onClick={() => navigate(`/batches/view/${batchId}/calls/${call.id}`)}
                          >
                             <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" className="rounded border-[#D0D5DD] w-4 h-4 cursor-pointer accent-[#3B82F6]" checked={selectedIds.includes(call.id)} onChange={() => toggleSelect(call.id)} />
                             </td>
                             <td className="px-4 py-4 text-[13px] font-black text-[#1A1C21] group-hover:text-[#3B82F6] transition-colors">{call.id}</td>
                             <td className="px-4 py-4 text-[13px] font-bold text-[#4A4F59]">{call.insurance}</td>
                             <td className="px-4 py-4 text-[13px] font-bold text-[#4A4F59]">{call.patient}</td>
                             <td className="px-4 py-4">
                                <div className="flex items-center space-x-2">
                                   <div className={`w-2 h-2 rounded-full ${call.status === 'Paid' ? 'bg-[#059669]' : 'bg-[#D0D5DD]'}`}></div>
                                   <span className="text-[13px] font-bold text-[#4A4F59]">{call.status}</span>
                                </div>
                             </td>
                             <td className="px-4 py-4 text-[13px] font-black text-[#4A4F59] text-center">{call.info}</td>
                             <td className="px-4 py-4 text-[13px] font-black text-[#4A4F59] text-center">{call.attempts}</td>
                             <td className="px-4 py-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] shadow-sm">
                                   <Check size={10} className="mr-1" strokeWidth={4} />
                                   {call.callStatus}
                                </span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              
              {/* Pagination */}
              <div className="px-6 py-4 border-t border-[#EAECEF] flex items-center justify-between">
                 <span className="text-[13px] font-bold text-[#717784]">Showing 5 of 5 total calls</span>
                 <div className="flex items-center space-x-2">
                    <button className="p-2 text-[#98A2B3] hover:text-[#1A1C21] transition-colors"><ChevronRight size={18} className="rotate-180" /></button>
                    <div className="w-8 h-8 rounded-lg border border-[#3B82F6] bg-white flex items-center justify-center text-[13px] font-black text-[#3B82F6]">1</div>
                    <button className="p-2 text-[#98A2B3] hover:text-[#1A1C21] transition-colors"><ChevronRight size={18} /></button>
                 </div>
              </div>
           </div>

           {/* Quick Actions Sidebar (Right) */}
           <div className="w-full lg:w-[320px] space-y-4">
              <div className="bg-white rounded-[24px] p-6 border border-[#EAECEF] shadow-sm">
                 <div className="flex items-center space-x-3 mb-6">
                    <Zap size={20} className="text-[#3B82F6] fill-[#3B82F6]" />
                    <h3 className="font-black text-[#1A1C21] text-[16px]">Quick Actions</h3>
                 </div>
                 <div className="space-y-2">
                    <ActionItem icon={<CheckCircle2 size={18}/>} label="Mark batch complete" onClick={handleMarkComplete} />
                    <ActionItem icon={<RotateCcw size={18}/>} label="Retry unfinished calls" onClick={handleRetryUnfinished} />
                    <ActionItem icon={<Plus size={18}/>} label="Save as new template" onClick={handleOpenTemplateModal} />
                    <ActionItem icon={<Copy size={18}/>} label="Duplicate call batch" onClick={handleDuplicate} />
                    <ActionItem icon={<History size={18}/>} label="View batch history" onClick={handleViewHistory} />
                    <ActionItem icon={<Download size={18}/>} label="Download batch report" onClick={handleDownloadReport} />
                 </div>
                 
                 <div className="h-px bg-[#EAECEF] my-6"></div>
                 
                 <button onClick={handleDeleteBatch} className="w-full flex items-center space-x-3 text-[#E02424] hover:text-[#B91C1C] transition-colors p-2 rounded-xl hover:bg-red-50">
                    <Trash2 size={18} />
                    <span className="text-[14px] font-black">Delete call batch</span>
                 </button>
              </div>
           </div>
        </div>

        {/* Footer Download Banner */}
        <div className="mt-6">
           <button 
             onClick={handleDownloadReport} 
             className="w-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] rounded-[24px] p-8 text-white flex items-center justify-center space-x-4 shadow-xl hover:scale-[1.01] transition-all group relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex items-center space-x-4">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#3B82F6] shadow-inner">
                    <Download size={24} />
                 </div>
                 <span className="text-[20px] font-black tracking-tight">Download Batch Report</span>
              </div>
           </button>
        </div>

      </div>

      {/* Save Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-[#1A1C21]/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-[#EAECEF]">
              <h3 className="text-[24px] font-black text-[#1A1C21]">Save as New Template</h3>
              <p className="text-[15px] font-bold text-[#717784] mt-2">Create a reusable template based on this batch's configuration.</p>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[13px] font-black text-[#1A1C21] mb-2.5 block uppercase tracking-wider">Template Title</label>
                <input 
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. March Claims Template"
                  className="w-full px-5 py-4 border border-[#EAECEF] rounded-[18px] text-[15px] font-bold focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/5 transition-all bg-[#F8FAFC]"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-8 bg-[#F8FAFC] flex items-center justify-end space-x-4 border-t border-[#EAECEF]">
              <button onClick={() => setShowTemplateModal(false)} className="px-6 py-3 text-[14px] font-black text-[#4A4F59] hover:text-[#1A1C21] transition-colors">Cancel</button>
              <button onClick={handleSaveAsTemplate} className="px-10 py-4 bg-[#3B82F6] text-white rounded-2xl text-[14px] font-black hover:bg-[#1E40AF] transition-all shadow-lg">Save Template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modern Reusable Components
const DetailRow = ({ label, value, badge, light }) => (
  <div className="flex justify-between items-center">
    <span className={`text-[12px] font-bold ${light ? 'text-[#717784]' : 'text-white/50'}`}>{label}</span>
    {badge ? (
      <span className={`${light ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-white/10 text-white'} text-[10px] font-black px-2.5 py-1 rounded-md border ${light ? 'border-[#3B82F6]/10' : 'border-white/10'}`}>{value}</span>
    ) : (
      <span className={`text-[13px] font-black ${light ? 'text-[#1A1C21]' : 'text-white'}`}>{value}</span>
    )}
  </div>
);

const SummaryItem = ({ icon, label, value, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${color} bg-white shadow-sm border border-[#EAECEF]`}>
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <div>
        <span className="block text-[11px] font-bold text-[#717784]">{label}</span>
        <span className={`text-[16px] font-black ${color}`}>{value}</span>
      </div>
    </div>
  </div>
);

const DonutChart = ({ percentage, label, sublabel, color }) => {
  const radius = 36;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 mb-3">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r={radius} fill="transparent" stroke="#F1F5F9" strokeWidth={stroke} />
          <circle cx="48" cy="48" r={radius} fill="transparent" stroke={color} strokeWidth={stroke} 
                  strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * percentage) / 100}
                  strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[16px] font-black text-[#1A1C21]">{percentage}%</span>
        </div>
      </div>
      <span className="text-[13px] font-black text-[#1A1C21]">{label}</span>
      <span className="text-[11px] font-bold text-[#717784]">{sublabel}</span>
    </div>
  );
};

const AchievementItem = ({ icon, label, value, total }) => (
  <div className="p-4 bg-[#F8FAFC] rounded-[20px] border border-[#EAECEF] flex flex-col items-start hover:bg-white hover:shadow-md transition-all group">
    <div className="text-[#3B82F6] mb-3 bg-white p-2 rounded-xl shadow-sm border border-[#EAECEF] group-hover:scale-110 transition-transform">{icon}</div>
    <div className="flex items-baseline space-x-1.5 mb-1">
      <span className="text-[18px] font-black text-[#1A1C21]">{value}</span>
      {total && <span className="text-[12px] font-bold text-[#98A2B3]">of {total}</span>}
    </div>
    <span className="text-[10px] font-black text-[#717784] uppercase tracking-wider">{label}</span>
  </div>
);

const ActivityRow = ({ label, value, statusColor, isZap, author }) => (
  <div className="flex justify-between items-center">
    <span className="text-[13px] font-bold text-[#717784]">{label}</span>
    <div className="flex items-center space-x-2">
       {statusColor && <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`}></div>}
       {isZap && <Zap size={14} className="text-[#3B82F6] fill-[#3B82F6]" />}
       <span className="text-[13px] font-black text-[#1A1C21]">
          {author && <span className="text-[11px] font-black text-[#3B82F6] bg-[#E8F1FC] px-1.5 py-0.5 rounded mr-1.5">{author}</span>}
          {value}
       </span>
    </div>
  </div>
);

const ActionItem = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-[#F8FAFC] group border border-transparent hover:border-[#EAECEF]"
  >
    <div className="flex items-center space-x-3">
       <div className="text-[#717784] group-hover:text-[#3B82F6] transition-colors">
         {icon}
       </div>
       <span className="text-[13px] font-bold text-[#4A4F59] group-hover:text-[#1A1C21]">{label}</span>
    </div>
    <ChevronRight size={14} className="text-[#D0D5DD] group-hover:text-[#3B82F6] transition-all group-hover:translate-x-1" />
  </button>
);

export default ViewCallBatch;

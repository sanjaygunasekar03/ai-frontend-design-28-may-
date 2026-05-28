import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RequestNewCallType from './RequestNewCallType';
import { X, Phone, ArrowRight, FileText, CheckCircle2, ChevronDown, Settings, Search, Eye, Star, MoreVertical, ArrowLeft, Shield, FlaskConical, User, Check } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const CreateBatchWizard = () => {
  const { step: stepParam } = useParams();
  const step = stepParam || 'select-type';
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({});
  const [templateFilter, setTemplateFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [ivrOnly, setIvrOnly] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    if (step === 'select-template') {
      fetchTemplates();
    }
  }, [step]);

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await axios.get(`${API_BASE}/templates`);
      setTemplates(res.data);
    } catch (err) {
      console.error('Error fetching templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const callTypes = [
    { id: 'claims', name: 'Claims Status', description: 'Check the status of submitted claims' },
  ];

  const questions = [
    { id: 'patient_name', label: 'Patient Name', type: 'text' },
    { id: 'dob', label: 'Date of Birth', type: 'date' },
    { id: 'member_id', label: 'Member ID', type: 'text' },
    { id: 'dos', label: 'Date of Service', type: 'date' },
  ];


  const handleTypeSelect = (type) => {
    setSelectedType(type);
    navigate('/batches/new/select-template');
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    navigate(`/batches/edit/${templateId}`);
  };

  const handleFormChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleNext = () => {
    if (step === 'configure') navigate('/batches/new/upload');
    else if (step === 'upload') navigate('/batches/new/review');
  };

  const handleBack = () => {
    if (step === 'select-template') navigate('/batches/new/select-type');
    else if (step === 'configure') navigate('/batches/new/select-template');
    else if (step === 'upload') navigate('/batches/new/configure');
    else if (step === 'review') navigate('/batches/new/upload');
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleOpenRequestForm = () => {
    setShowRequestForm(true);
  };

  const handleCloseRequestForm = () => {
    setShowRequestForm(false);
  };

  const handleRequestSubmit = (formData) => {
    console.log('New call type request submitted:', formData);
    // In a real app, this would send the data to an API
  };

  if (step === 'select-type' || !step) {
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
                  onClick={handleClose}
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
                      <path d="M0,250 C150,150 250,350 400,200" stroke="url(#paint0_linear)" strokeWidth="1" fill="none" />
                      <path d="M0,270 C150,170 250,370 400,220" stroke="url(#paint0_linear)" strokeWidth="1" fill="none" />
                      <path d="M0,290 C150,190 250,390 400,240" stroke="url(#paint0_linear)" strokeWidth="1" fill="none" />
                      <defs>
                        <linearGradient id="paint0_linear" x1="0" y1="200" x2="400" y2="200" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#3B82F6" stopOpacity="0" />
                          <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.8" />
                          <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
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
                      onClick={() => handleTypeSelect('claims')}
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
                    onClick={handleOpenRequestForm}
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
                  onClick={handleClose}
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
        {/* Request New Call Type Form */}
        {showRequestForm && (
          <RequestNewCallType
            onClose={handleCloseRequestForm}
            onSubmit={handleRequestSubmit}
          />
        )}
      </div>
    );
  }

  if (step === 'select-template') {
    const filteredTemplates = templates
      .filter(template => {
        if (ivrOnly && !template.is_ivr_only) return false;
        if (searchTerm && !template.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (templateFilter !== 'All Status' && templateFilter !== 'All' && template.status !== templateFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'A-Z') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'Most Recent') {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
      });

    // Helper for styles inside component
    const getTemplateStyle = (name) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('verification')) {
        return {
          cardBorder: 'border-l-[#5B21B6]',
          btnBg: 'bg-[#5B21B6]',
          btnHover: 'hover:bg-[#4C1D95]',
          badgeText: 'text-[#5B21B6]',
          badgeBg: 'bg-[#F5F3FF]',
          ivrBadgeText: 'text-[#5B21B6]',
          ivrBadgeBg: 'bg-[#F5F3FF]',
          desc: 'Verify customer information and identity using secure questions.'
        };
      } else if (lowerName.includes('test')) {
        return {
          cardBorder: 'border-l-[#EA580C]',
          btnBg: 'bg-[#0F172A]',
          btnHover: 'hover:bg-[#1E293B]',
          badgeText: 'text-[#EA580C]',
          badgeBg: 'bg-[#FFF7ED]',
          ivrBadgeText: 'text-[#EA580C]',
          ivrBadgeBg: 'bg-[#FFF7ED]',
          desc: 'Share and explain test results to the customer.'
        };
      } else {
        return {
          cardBorder: 'border-l-[#059669]',
          btnBg: 'bg-[#059669]',
          btnHover: 'hover:bg-[#047857]',
          badgeText: 'text-[#059669]',
          badgeBg: 'bg-[#ECFDF5]',
          ivrBadgeText: 'text-[#059669]',
          ivrBadgeBg: 'bg-[#ECFDF5]',
          desc: 'Check the current status of a customer\'s claim.'
        };
      }
    };

    return (
      <div className="fixed inset-0 bg-[#0F172A]/40 flex items-center justify-center z-50 p-4 animate-overlay-enter">
        <div className="bg-[#F8FAFC] rounded-[20px] shadow-2xl max-w-[800px] w-full mx-auto overflow-hidden flex flex-col h-[85vh] relative animate-modal-enter">

          {/* Main content scrollable area */}
          <div className="flex-1 overflow-y-auto p-8 relative z-10">

            {/* Header Section */}
            <div className="mb-8 relative">
              <h1 className="text-[26px] font-extrabold text-[#0F172A] tracking-tight mb-1">Select a Call Template</h1>
              <p className="text-[#64748B] text-[13px] font-medium mb-3">Choose the best template for your call conversation.</p>
              <div className="w-8 h-1 bg-[#3B82F6] rounded-full"></div>
            </div>

            {/* Soft Ambient Background Blob */}
            <div className="absolute top-[-50px] right-[-50px] w-[350px] h-[250px] bg-gradient-to-tr from-blue-100/40 via-indigo-200/40 to-purple-100/40 blur-[70px] rounded-full pointer-events-none z-0"></div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-white border border-[#F1F5F9] rounded-[16px] shadow-sm mb-8 relative z-10">

              <div className="flex items-center space-x-5">

                <div className="flex flex-col space-y-1">
                  <span className="text-[#64748B] font-medium text-[11px]">Sort by</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2 border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] font-semibold bg-white focus:outline-none focus:border-[#3B82F6]"
                    >
                      <option>Most Recent</option>
                      <option>A-Z</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                  </div>
                </div>

                <div className="w-px h-10 bg-[#F1F5F9]"></div>

                <label className="flex items-center space-x-2.5 cursor-pointer mt-4">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={ivrOnly}
                      onChange={(e) => setIvrOnly(e.target.checked)}
                      className="peer appearance-none w-4 h-4 border-2 border-[#CBD5E1] rounded-[4px] bg-white checked:bg-white checked:border-[#CBD5E1] transition-colors"
                    />
                    <Check size={12} className="absolute text-[#3B82F6] opacity-0 peer-checked:opacity-100 pointer-events-none stroke-[3]" />
                  </div>
                  <span className="text-[12px] text-[#0F172A] font-semibold leading-snug">IVR Templates<br />Only</span>
                </label>

                <div className="w-px h-10 bg-[#F1F5F9]"></div>

                <div className="flex flex-col space-y-1">
                  <span className="text-[#64748B] font-medium text-[11px]">Template Status</span>
                  <div className="relative">
                    <select
                      value={templateFilter}
                      onChange={(e) => setTemplateFilter(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2 border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] font-semibold bg-white focus:outline-none focus:border-[#3B82F6]"
                    >
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Draft</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                  </div>
                </div>

              </div>

              <div className="flex items-center space-x-4 mt-4 lg:mt-0">

                <div className="flex flex-col items-center justify-center bg-[#F8FAFC] border border-[#F1F5F9] w-[70px] h-[50px] rounded-[8px]">
                  <span className="text-[#3B82F6] font-bold text-[18px] leading-none mb-0.5">{filteredTemplates.length}</span>
                  <span className="text-[#3B82F6] text-[10px] font-semibold text-center leading-tight">Templates<br />found</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-56 pl-3 pr-3 py-2 border border-[#E2E8F0] rounded-[6px] text-[13px] font-medium focus:outline-none focus:border-[#3B82F6] placeholder-[#94A3B8]"
                  />
                </div>

              </div>
            </div>

            {/* Template List */}
            <div className="space-y-4 relative z-10 pb-4">
              {loadingTemplates ? (
                <div className="text-center py-20 text-[#64748B]">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full mb-4"></div>
                  <p className="font-medium text-[13px]">Loading templates...</p>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-20 text-[#64748B] bg-white border border-dashed border-[#E2E8F0] rounded-[16px] font-medium text-[13px]">
                  No templates found.
                </div>
              ) : filteredTemplates.map((template) => {
                const style = getTemplateStyle(template.name);

                return (
                  <div
                    key={template.id}
                    className={`bg-white border-y border-r border-l-[3px] border-[#E2E8F0] ${style.cardBorder} rounded-[10px] p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md ${selectedTemplate === template.id ? 'shadow-md border-r-[#3B82F6] border-y-[#3B82F6]' : ''}`}
                  >
                    <div className="flex flex-col max-w-[60%]">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-[15px] font-bold text-[#0F172A]">{template.name}</h3>
                        {template.is_ivr_only && (
                          <span className={`px-1.5 py-0.5 ${style.ivrBadgeBg} ${style.ivrBadgeText} rounded-[4px] text-[10px] font-bold uppercase tracking-wider`}>IVR ONLY</span>
                        )}
                      </div>
                      <p className="text-[#64748B] text-[13px] font-medium mb-4">
                        {style.desc}
                      </p>
                      <div className="flex items-center space-x-3 text-[12px]">
                        <span className="text-[#64748B] font-medium">
                          {template.name.includes("Test") ? "Level: HIGH Datapoints" : `${template.datapoints} Datapoints`}
                        </span>
                        <div className="w-px h-3 bg-[#E2E8F0]"></div>
                        <span className={`px-1.5 py-0.5 ${style.badgeBg} ${style.badgeText} rounded-[4px] font-bold`}>
                          {template.goal === 'verification' || !template.goal ? (template.name.includes('Test') ? 'Test' : (template.name.includes('Verification') ? 'Verification' : 'Claim Status')) : template.goal}
                        </span>
                        <div className="w-px h-3 bg-[#E2E8F0]"></div>
                        <span className="text-[#64748B] font-medium">
                          {template.created_at ? new Date(template.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Apr 9, 2026'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template.id);
                        }}
                        className="px-5 py-2 bg-white border border-[#E2E8F0] text-[#0F172A] rounded-[6px] hover:bg-[#F8FAFC] transition-colors font-bold text-[13px]"
                      >
                        Preview
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template.id);
                        }}
                        className={`px-5 py-2 ${style.btnBg} text-white rounded-[6px] ${style.btnHover} transition-colors font-bold text-[13px] flex items-center space-x-1.5`}
                      >
                        <span>Use Template</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-[#F1F5F9] bg-white shrink-0 relative z-10 rounded-b-[20px]">
            <button
              onClick={handleBack}
              className="px-5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px] text-[#0F172A] font-bold text-[13px] hover:bg-[#F1F5F9] transition-colors"
            >
              Back
            </button>

            <button
              onClick={() => navigate('/templates')}
              className="px-5 py-2 bg-white border border-[#E2E8F0] rounded-[6px] text-[#0F172A] font-bold text-[13px] hover:bg-[#F8FAFC] transition-colors shadow-sm"
            >
              Manage Templates
            </button>

            <div className="flex items-center space-x-2 text-[13px]">
              <span className="text-[#64748B] font-medium">Sort by:</span>
              <span className="text-[#3B82F6] font-bold flex items-center cursor-pointer hover:text-[#2563EB]">
                Most Recent <ChevronDown size={14} className="ml-1" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'configure') {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1A1C21] tracking-tight mb-8">Configure Questions</h1>
        <div className="bg-white border border-[#EAECEF] rounded-xl p-8 space-y-6 shadow-sm">
          {questions.map((q) => (
            <div key={q.id}>
              <label className="block text-sm font-semibold text-[#4A4F59] mb-3 uppercase tracking-wider">{q.label}</label>
              <input
                type={q.type}
                className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg text-[#1A1C21] focus:outline-none focus:ring-2 focus:ring-[#00B8D9] bg-white"
                onChange={(e) => handleFormChange(q.id, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={handleBack} className="px-6 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-[#4A4F59] font-semibold hover:bg-[#F7F8FA] transition-colors">Back</button>
          <button onClick={handleNext} className="px-6 py-2.5 bg-[#00B8D9] text-white rounded-lg font-semibold hover:bg-[#00A3C1] transition-colors">Next</button>
        </div>
      </div>
    );
  }

  if (step === 'upload') {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1A1C21] tracking-tight mb-8">Upload Data</h1>
        <div className="bg-white border-2 border-dashed border-[#D0D5DD] rounded-xl p-12 text-center shadow-sm hover:border-[#00B8D9] transition-colors">
          <p className="text-[#717784] mb-6 text-lg">Drag and drop your CSV file here or click to browse</p>
          <input type="file" accept=".csv" className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="bg-[#00B8D9] text-white px-6 py-3 rounded-lg cursor-pointer font-semibold hover:bg-[#00A3C1] transition-colors">
            Choose File
          </label>
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={handleBack} className="px-6 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-[#4A4F59] font-semibold hover:bg-[#F7F8FA] transition-colors">Back</button>
          <button onClick={handleNext} className="px-6 py-2.5 bg-[#00B8D9] text-white rounded-lg font-semibold hover:bg-[#00A3C1] transition-colors">Next</button>
        </div>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1A1C21] tracking-tight mb-8">Review & Create Batch</h1>
        <div className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-sm">
          <p className="text-[#1A1C21] text-lg"><strong>Type:</strong> {selectedType}</p>
          <p className="text-[#1A1C21] text-lg"><strong>Data:</strong> Ready to process</p>
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={handleBack} className="px-6 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-[#4A4F59] font-semibold hover:bg-[#F7F8FA] transition-colors">Back</button>
          <button className="px-6 py-2.5 bg-[#00B8D9] text-white rounded-lg font-semibold hover:bg-[#00A3C1] transition-colors">Create Batch</button>
        </div>
      </div>
    );
  }

  return <div>Invalid step</div>;
};

export default CreateBatchWizard;
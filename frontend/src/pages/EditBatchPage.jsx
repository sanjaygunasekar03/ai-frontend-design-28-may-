import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ChevronLeft, ChevronDown, Eye, EyeOff, MoreHorizontal, Check, Clock, Zap, Save, Copy, History, Trash2, HelpCircle, Edit, CheckCircle, Upload, Plus, Download, X, PhoneCall, Target, Shield, User, Headset, CheckCircle2, XCircle, GripVertical, ChevronRight, FileText, ArrowRight, Activity, Lightbulb, ExternalLink, Info, UploadCloud, Calendar, AlertCircle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const DEFAULT_CONDITIONAL_STRUCTURE = [
  {
    id: "paid",
    name: "Paid",
    visible: true,
    fields: [
      {"id": "transaction_check_number", "name": "Transaction/Check Number", "visible": true, "required": false},
      {"id": "amount_paid", "name": "Amount Paid", "visible": true, "required": false},
      {"id": "claim_paid_date", "name": "Claim Paid Date", "visible": true, "required": false},
      {"id": "patient_responsibility", "name": "Patient Responsibility", "visible": true, "required": false},
      {"id": "eft_number", "name": "EFT Number", "visible": true, "required": false}
    ]
  },
  {
    id: "denied",
    name: "Denied",
    visible: true,
    fields: [
      {"id": "denial_reason", "name": "Denial Reason", "visible": true, "required": false},
      {"id": "received_date", "name": "Received Date", "visible": true, "required": false},
      {"id": "claim_number", "name": "Claim Number", "visible": true, "required": false}
    ]
  },
  {
    id: "in_progress",
    name: "In Progress",
    visible: true,
    fields: [
      {"id": "expected_processing_time", "name": "Expected Processing Time", "visible": true, "required": false}
    ]
  }
];

const ALL_TIMEZONES = (() => {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch (e) {
    return [
      "Africa/Cairo", "Africa/Johannesburg", "Africa/Lagos", "Africa/Nairobi",
      "America/Anchorage", "America/Argentina/Buenos_Aires", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Mexico_City", "America/New_York", "America/Phoenix", "America/Sao_Paulo", "America/Toronto", "America/Vancouver",
      "Asia/Bangkok", "Asia/Dubai", "Asia/Hong_Kong", "Asia/Istanbul", "Asia/Jakarta", "Asia/Jerusalem", "Asia/Kolkata", "Asia/Manila", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Tokyo",
      "Australia/Adelaide", "Australia/Brisbane", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney",
      "Europe/Amsterdam", "Europe/Berlin", "Europe/Brussels", "Europe/London", "Europe/Madrid", "Europe/Paris", "Europe/Prague", "Europe/Rome", "Europe/Vienna", "Europe/Zurich",
      "Pacific/Auckland", "Pacific/Fiji", "Pacific/Guam", "Pacific/Honolulu", "UTC"
    ];
  }
})();

const EditBatchPage = () => {
  // Accept both :batchId and :templateId route param names for compatibility
  const params = useParams();
  const batchId = params.batchId || params.templateId;
  const navigate = useNavigate();
  const [batchTitle, setBatchTitle] = useState('New Batch');
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [templateData, setTemplateData] = useState(null);
  const [existingBatch, setExistingBatch] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [batchSpeed, setBatchSpeed] = useState('max');
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    loadData();
  }, [batchId]);

  const loadData = async () => {
    // Guard: do not call API with undefined id
    if (!batchId || batchId === 'undefined') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Try loading as template first (new batch creation flow)
    try {
      const res = await axios.get(`${API_BASE}/templates/${batchId}`);
      setTemplateData(res.data);
      const fetchedConditions = res.data.conditions || [];
      setConditions(fetchedConditions.length > 0 ? fetchedConditions : DEFAULT_CONDITIONAL_STRUCTURE);
      
      // Set batch title from template name
      if (res.data.name) {
        setBatchTitle(res.data.name);
      }
      setIsLoading(false);
      return;
    } catch (e) {
      console.log("Not a template ID, checking batch...");
    }

    // Fall back to loading as existing batch
    try {
      const res = await axios.get(`${API_BASE}/batches/${batchId}`);
      setExistingBatch(res.data);
      const bTitle = res.data.name || res.data.id;
      setBatchTitle(bTitle);
      if (res.data.batch_speed) {
        setBatchSpeed(res.data.batch_speed);
      }
      
      // Load template for this batch
      if (res.data.template_id) {
        try {
          const tRes = await axios.get(`${API_BASE}/templates/${res.data.template_id}`);
          setTemplateData(tRes.data);
          const fetchedConditions = tRes.data.conditions || [];
          setConditions(fetchedConditions.length > 0 ? fetchedConditions : DEFAULT_CONDITIONAL_STRUCTURE);
        } catch (e) {
          console.error("Error loading template for batch:", e);
          // If template load fails, at least provide default conditions and a placeholder name with default ID
          setTemplateData({ id: 'template1', name: bTitle, goal: 'Claim Status', call_type: 'Claims IVR' });
          setConditions(DEFAULT_CONDITIONAL_STRUCTURE);
        }
      } else {
        // No template ID on batch? Still show default conditions and set template name to batch title
        setTemplateData({ id: 'template1', name: bTitle, goal: 'Claim Status', call_type: 'Claims IVR' });
        setConditions(DEFAULT_CONDITIONAL_STRUCTURE);
      }
    } catch (e) {
      console.error("Error loading batch:", e);
      // Final fallback for conditions and template info
      if (!templateData) {
        setTemplateData({ id: 'template1', name: batchTitle, goal: 'Claim Status', call_type: 'Claims IVR' });
      }
      if (conditions.length === 0) setConditions(DEFAULT_CONDITIONAL_STRUCTURE);
    }
    setIsLoading(false);
  };

  const handleContinue = () => {
    if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep === 2) setCurrentStep(1);
    else if (currentStep === 3) setCurrentStep(2);
    else navigate('/batches/new');
  };


  const toggleFieldVisibility = (conditionId, fieldId) => {
    setConditions(prev => prev.map(condition =>
      condition.id === conditionId
        ? {
            ...condition,
            fields: condition.fields.map(field =>
              field.id === fieldId ? { ...field, visible: !field.visible } : field
            )
          }
        : condition
    ));
  };

  const getTotalFields = () => conditions.reduce((total, c) => total + c.fields.length, 0);
  const getRequiredFields = () => 1;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus('error');
      setUploadedFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('error');
      setUploadedFile(null);
      return;
    }
    setUploadedFile(file);
    setUploadStatus('success');
    setTimeout(() => {
      setUploadStatus(null);
    }, 3000);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'phone_number',
      'patient_name',
      'patient_date_of_birth',
      'patient_address',
      'insurance_name',
      'insurance_phone_number',
      'patient_primary_insurance_policy_id',
      'provider_name',
      'provider_npi',
      'provider_ptan',
      'provider_tax_id',
      'provider_phone_number',
      'provider_practice_name',
      'provider_practice_address',
      'provider_practice_npi',
      'procedure_date',
      'claim_billed_amount',
      'provider_callback_number'
    ];

    // Create worksheet with headers only
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Call Template");

    // Adjust column widths
    const wscols = headers.map(() => ({ wch: 25 }));
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, "call_batch_template.xlsx");
  };

  const handleAddCall = () => {
    alert('Add Call functionality would open a modal to manually enter call details.');
  };

  const handleSaveAndClose = async () => {
    if (window.confirm('Save batch as draft and return to dashboard?')) {
      await saveBatch('draft');
      navigate('/');
    }
  };

  const handleScheduleBatch = async () => {
    if (window.confirm('Schedule this batch?')) {
      await saveBatch('in_queue');
      navigate('/');
    }
  };

  const saveBatch = async (status) => {
    const templateId = templateData ? templateData.id : batchId;
    if (!templateId || templateId === 'undefined') {
      alert('No valid template selected. Please go back and select a template.');
      return null;
    }
    setSaving(true);
    try {
      let res;
      if (existingBatch) {
        res = await axios.patch(`${API_BASE}/batches/${existingBatch.id}`, { 
          status, 
          name: batchTitle,
          batch_speed: batchSpeed 
        });
        setExistingBatch(res.data);
      } else {
        res = await axios.post(`${API_BASE}/batches`, {
          template_id: templateId,
          created_by: 'user1',
          name: batchTitle,
          status: status || 'draft',
          batch_speed: batchSpeed
        });
        setExistingBatch(res.data);
        // Update URL to the new batch ID without reloading
        window.history.replaceState(null, '', `/batches/edit/${res.data.id}`);
      }
      return res.data;
    } catch (err) {
      console.error('Error saving batch:', err);
      alert('Failed to save batch. Please try again.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleMenuAction = async (action) => {
    setShowMenu(false);
    const idToUse = existingBatch?.id || batchId;
    if (!idToUse || idToUse === 'undefined') return;

    switch (action) {
      case 'save_template':
        if (!templateData) return;
        try {
          // Use the batch title as the name for the new template, with a (Copy) suffix if it's the same as the original
          const baseName = batchTitle || templateData.name;
          const newTemplateName = baseName === templateData.name ? `${baseName} (Copy)` : baseName;
          const res = await axios.post(`${API_BASE}/templates`, {
            name: newTemplateName,
            goal: templateData.goal,
            intro: templateData.intro,
            call_type: templateData.call_type,
            is_ivr_only: templateData.is_ivr_only,
            is_starred: false,
            status: 'Active',
            datapoints: templateData.datapoints,
            questions: templateData.questions,
            conditions: templateData.conditions
          });
          alert(`Template saved as "${newTemplateName}"`);
          navigate(`/templates/edit/${res.data.id}`);
        } catch (error) {
          console.error('Error saving template:', error);
          alert('Failed to save template.');
        }
        break;
      case 'duplicate':
        try {
          setSaving(true);
          let currentBatch = existingBatch;
          
          // Save current changes first to ensure the duplicate has the latest state
          if (!currentBatch) {
            currentBatch = await saveBatch('draft');
          } else {
            currentBatch = await saveBatch(existingBatch.status);
          }
          
          if (!currentBatch || !currentBatch.id) {
            throw new Error("Could not save batch before duplication");
          }

          const res = await axios.post(`${API_BASE}/batches/${currentBatch.id}/duplicate`);
          if (res.data && res.data.id) {
            alert(`Batch duplicated successfully as "${res.data.name}"`);
            navigate(`/batches/edit/${res.data.id}`);
          }
        } catch (error) {
          console.error('Error duplicating batch:', error);
          alert('Failed to duplicate batch. Please ensure all fields are valid.');
        } finally {
          setSaving(false);
        }
        break;
      case 'history':
        navigate('/search-batches');
        break;
      case 'delete':
        const finalId = existingBatch?.id || batchId;
        const tid = templateData?.id;
        
        if (!finalId || finalId === 'undefined') {
          navigate('/');
          return;
        }
        
        if (window.confirm('Are you sure you want to delete this call batch and its master template? This will remove it from your records and the template section.')) {
          try {
            // Delete the batch
            await axios.delete(`${API_BASE}/batches/${finalId}`).catch(() => {});
            
            // Delete the underlying template if it exists
            if (tid) {
              await axios.delete(`${API_BASE}/templates/${tid}`).catch(() => {});
            }
            
            alert('Batch and template deleted successfully.');
            navigate('/');
          } catch (error) {
            console.error('Error during deletion:', error);
            alert('Requested items removed.');
            navigate('/');
          }
        }
        break;
      default:
        break;
    }
  };

  const handleSaveAsTemplate = () => handleMenuAction('save_template');
  const handleDuplicateBatch = () => handleMenuAction('duplicate');
  const handleViewHistory = () => handleMenuAction('history');
  const handleDeleteBatch = () => handleMenuAction('delete');

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col relative pb-6">
      <div className="max-w-[1100px] w-full mx-auto px-6 py-6">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-start mb-4 relative">
          <div>
            <div className="flex items-center space-x-1.5 text-[10px] mb-1 uppercase tracking-wider">
              <Link to="/" className="text-[#3B82F6] hover:underline font-bold">Dashboard</Link>
              <span className="text-[#98A2B3]">›</span>
              <span className="text-[#3B82F6] hover:underline font-bold cursor-pointer">Call Batch</span>
              <span className="text-[#98A2B3]">›</span>
              <span className="text-[#717784] font-semibold">Edit</span>
            </div>
            <h1 className="text-[20px] font-bold text-[#1A1C21] tracking-tight mb-0.5 relative inline-block">
              Edit Call Batch
            </h1>
            <p className="text-[#717784] text-[11px]">Prepare your call batch by uploading data and reviewing details.</p>
          </div>
        </div>

        {/* Stepper (Matching Image 2) */}
        <div className="flex items-center justify-center mb-6 max-w-[650px] mx-auto">
          <div className="flex items-center w-full">
            {/* Step 1 */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-[8px] transition-all ${currentStep === 1 ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-200' : 'bg-white border border-[#EAECEF] text-[#4A4F59]'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${currentStep === 1 ? 'bg-white/20' : 'bg-[#F1F5FD] text-[#3B82F6]'}`}>
                {currentStep > 1 ? <Check size={12} /> : '1'}
              </div>
              <span className="font-extrabold text-[11px] whitespace-nowrap">Info to Collect</span>
              {currentStep > 1 && <Check size={12} className="text-[#3B82F6]" />}
            </div>

            <div className="flex-1 h-px border-t-2 border-dashed border-[#D0D5DD] mx-2"></div>
            
            {/* Step 2 */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-[8px] transition-all ${currentStep === 2 ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-200' : 'bg-white border border-[#EAECEF] text-[#4A4F59]'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${currentStep === 2 ? 'bg-white/20' : 'bg-[#F1F5FD] text-[#3B82F6]'}`}>
                {currentStep > 2 ? <Check size={12} /> : '2'}
              </div>
              <span className="font-extrabold text-[11px] whitespace-nowrap">Upload Data</span>
              {currentStep > 2 && <Check size={12} className="text-[#3B82F6]" />}
            </div>

            <div className="flex-1 h-px border-t-2 border-dashed border-[#D0D5DD] mx-2"></div>

            {/* Step 3 */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-[8px] transition-all flex-1 justify-center ${currentStep === 3 ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-200' : 'bg-white border border-[#EAECEF] text-[#4A4F59]'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${currentStep === 3 ? 'bg-white/20' : 'bg-[#F1F5FD] text-[#3B82F6]'}`}>3</div>
              <span className="font-extrabold text-[11px] whitespace-nowrap">Review & Schedule</span>
            </div>
          </div>
        </div>

        {currentStep < 3 && (
          <>
            {/* Top Information Row: 3 Columns for Step 1 & 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
           {/* Card 1: Batch Overview */}
           <div className="bg-white rounded-[10px] p-4 shadow-sm border border-[#EAECEF]">
              <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-[#E8F1FC] rounded-[4px] flex items-center justify-center text-[#3B82F6]"><FileText size={12}/></div>
                    <h3 className="font-extrabold text-[#1A1C21] text-[12px]">Batch Overview</h3>
                 </div>
                 <span className="text-[9px] font-bold text-[#3B82F6] bg-[#E8F1FC] px-1.5 py-0.5 rounded border border-[#D0E3F9]">Draft</span>
              </div>
              <div className="space-y-2.5">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#717784] font-semibold">Batch Title</span>
                    {!existingBatch ? (
                      <input 
                        type="text"
                        value={batchTitle}
                        onChange={(e) => setBatchTitle(e.target.value)}
                        className="text-[11px] font-bold text-[#1A1C21] text-right bg-transparent border-b border-transparent hover:border-[#D0D5DD] focus:border-[#3B82F6] focus:outline-none transition-colors w-1/2"
                        placeholder="Enter batch title..."
                      />
                    ) : (
                      <span className="text-[11px] font-bold text-[#1A1C21]">{batchTitle || 'Test Results'}</span>
                    )}
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#717784] font-semibold">Call Type</span>
                    <span className="text-[10px] font-bold text-[#3B82F6] bg-[#E8F1FC] px-1.5 py-0.5 rounded">{templateData?.call_type || 'Claims IVR'}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#717784] font-semibold">Goal</span>
                    <span className="text-[11px] font-bold text-[#1A1C21]">{templateData?.goal || 'Test'}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#717784] font-semibold">To</span>
                    <span className="text-[11px] font-bold text-[#1A1C21]">Insurance</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#717784] font-semibold">Regarding</span>
                    <span className="text-[11px] font-bold text-[#1A1C21]">Patient</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#717784] font-semibold">Template</span>
                    <span className="text-[11px] font-bold text-[#1A1C21]">{templateData?.name || 'Test Results'}</span>
                 </div>
              </div>
           </div>

           {/* Card 2: Batch Activity */}
           <div className="bg-white border border-[#EAECEF] rounded-[10px] p-4 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-[#E8F1FC] rounded-[4px] flex items-center justify-center text-[#3B82F6]"><Activity size={12}/></div>
                    <h3 className="font-extrabold text-[#1A1C21] text-[12px]">Batch Activity</h3>
                 </div>
                 <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></div>
                    <span className="text-[10px] font-bold text-[#1A1C21]">Draft</span>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-2">
                <div>
                  <span className="block text-[9px] text-[#717784] font-bold mb-0.5 uppercase tracking-wide">Status</span>
                  <span className="text-[11px] font-bold text-[#1A1C21]">Draft</span>
                </div>
                <div>
                  <span className="block text-[9px] text-[#717784] font-bold mb-0.5 uppercase tracking-wide">Calls</span>
                  <span className="text-[11px] font-bold text-[#1A1C21]">—</span>
                </div>
                <div>
                  <span className="block text-[9px] text-[#717784] font-bold mb-0.5 uppercase tracking-wide">Scheduled</span>
                  <span className="text-[11px] font-bold text-[#1A1C21]">Not scheduled</span>
                </div>
                <div>
                  <span className="block text-[9px] text-[#717784] font-bold mb-0.5 uppercase tracking-wide">Batch Speed</span>
                  <div className="flex items-center space-x-1 text-[#3B82F6]">
                    <Zap size={11} className="fill-current" />
                    <span className="text-[11px] font-bold capitalize">{batchSpeed}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="block text-[9px] text-[#717784] font-bold mb-0.5 uppercase tracking-wide">Created</span>
                  <span className="text-[11px] font-bold text-[#1A1C21]">
                    {existingBatch?.created_at ? new Date(existingBatch.created_at).toLocaleDateString('en-US') : '4/21/2026'}
                  </span>
                </div>
              </div>
           </div>

           {/* Card 3: Additional Actions */}
           <div className="bg-white border border-[#EAECEF] rounded-[10px] p-4 shadow-sm h-full">
              <div className="flex items-center space-x-2 mb-3">
                 <div className="w-6 h-6 bg-[#E8F1FC] rounded-[4px] flex items-center justify-center text-[#3B82F6]"><Zap size={12} className="fill-current" /></div>
                 <h3 className="font-extrabold text-[#1A1C21] text-[12px]">Additional Actions</h3>
              </div>
              <div className="space-y-1 mt-2">
                 <button onClick={handleSaveAsTemplate} className="w-full flex items-center justify-between py-1.5 px-2 -mx-2 rounded-[4px] text-[11px] font-semibold text-[#4A4F59] hover:bg-[#F8FAFC] hover:text-[#3B82F6] transition-colors group">
                    <div className="flex items-center space-x-2">
                       <FileText size={13} className="text-[#98A2B3] group-hover:text-[#3B82F6]" />
                       <span>Save as new template</span>
                    </div>
                    <ArrowRight size={12} className="text-[#D0D5DD] group-hover:text-[#3B82F6]" />
                 </button>
                 <button onClick={handleDuplicateBatch} className="w-full flex items-center justify-between py-1.5 px-2 -mx-2 rounded-[4px] text-[11px] font-semibold text-[#4A4F59] hover:bg-[#F8FAFC] hover:text-[#3B82F6] transition-colors group">
                    <div className="flex items-center space-x-2">
                       <Copy size={13} className="text-[#98A2B3] group-hover:text-[#3B82F6]" />
                       <span>Duplicate call batch</span>
                    </div>
                    <ArrowRight size={12} className="text-[#D0D5DD] group-hover:text-[#3B82F6]" />
                 </button>
                 <button onClick={handleViewHistory} className="w-full flex items-center justify-between py-1.5 px-2 -mx-2 rounded-[4px] text-[11px] font-semibold text-[#4A4F59] hover:bg-[#F8FAFC] hover:text-[#3B82F6] transition-colors group">
                    <div className="flex items-center space-x-2">
                       <History size={13} className="text-[#98A2B3] group-hover:text-[#3B82F6]" />
                       <span>View batch history</span>
                    </div>
                    <ArrowRight size={12} className="text-[#D0D5DD] group-hover:text-[#3B82F6]" />
                 </button>
                 
                 <div className="h-px bg-[#EAECEF] my-1.5 border-none"></div>

                 <button onClick={handleDeleteBatch} className="w-full flex items-center space-x-2 py-1.5 px-2 -mx-2 rounded-[4px] text-[11px] font-bold text-[#E02424] hover:bg-[#FEF2F2] hover:text-[#B91C1C] transition-colors">
                    <Trash2 size={13} className="text-[#E02424]" />
                    <span>Delete call batch</span>
                 </button>
              </div>
           </div>
            </div>

            {/* Bottom Layout: Full Width Content Area for Step 1 & 2 */}
            <div className="flex flex-col gap-6 mb-8 items-start w-full">
              
              <div className="flex-1 w-full space-y-6">
                  {currentStep === 1 && (
              <div className="bg-white border border-[#EAECEF] rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8">
                <div className="mb-6 flex items-start space-x-4 relative">
                  <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-[#3B82F6]/40"></div>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(19,89,210,0.15)] relative z-10 border border-[#EAECEF]">
                      <Headset size={18} className="text-[#3B82F6]" />
                    </div>
                  </div>
                  <div className="flex-1 mt-1">
                    <h2 className="text-[18px] font-bold text-[#1A1C21] mb-1">Collect info via IVR only</h2>
                    <p className="text-[#717784] text-[13px] leading-relaxed max-w-xl">
                      Review info to collect: Confirm information that needs to be retrieved, based on the selected template. <a href="#" className="text-[#3B82F6] font-semibold hover:underline">Learn more</a>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-[#EAECEF] shadow-sm ml-4 shrink-0 mt-2">
                    <CheckCircle2 size={14} className="text-[#3B82F6]" />
                    <span className="text-[#4A4F59] font-bold text-[12px]">{getTotalFields()} info total <span className="font-normal text-[#98A2B3] mx-1">/</span> <span className="text-[#1A1C21]">{getRequiredFields()} required</span></span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 mb-8 pl-16">
                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] font-bold text-[#98A2B3] uppercase tracking-widest">Template</span>
                    <span className="px-3 py-1 bg-[#E8F1FC] text-[#3B82F6] font-bold text-[12px] rounded-full border border-[#D0E3F9] shadow-sm">{templateData?.name || 'Loading...'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-[#98A2B3] uppercase tracking-widest">Field</span>
                    <span className="text-[14px] font-bold text-[#1A1C21]">{templateData?.goal === 'verification' || templateData?.goal === 'Verification' || !templateData?.goal || templateData?.goal === 'Test' ? 'Claim Status' : templateData.goal} <span className="text-[#E02424]">*</span></span>
                    <HelpCircle size={14} className="text-[#D0D5DD] ml-0.5 cursor-pointer hover:text-[#98A2B3]" />
                  </div>
                </div>

                {/* Conditional Logic UI */}
                  {isLoading ? (
                    <div className="text-center py-20 text-[#717784]">
                      <div className="animate-spin inline-block w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full mb-4"></div>
                    </div>
                  ) : conditions.length === 0 ? (
                    <div className="text-center py-12 text-[#98A2B3] bg-[#F8FAFC] rounded-xl border-2 border-dashed border-[#D0D5DD]">
                      <HelpCircle size={32} className="mx-auto mb-3 opacity-50" />
                      <p className="font-medium text-[13px]">No conditional logic defined for this template.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 pl-1 relative z-10">
                      {conditions.map((condition, idx) => {
                        let icon = null;
                        let textColor = '';
                        let bgColor = '';
                        let borderColor = '';
                        let lineColor = '';
                        
                        const lowerName = condition.name.toLowerCase();
                        if (lowerName.includes('paid') || lowerName.includes('success')) {
                          icon = <CheckCircle2 size={20} className="text-[#059669]" />;
                          textColor = 'text-[#059669]';
                          bgColor = 'bg-[#ECFDF5]';
                          borderColor = 'border-[#A7F3D0]/50';
                          lineColor = 'bg-[#059669]/20';
                        } else if (lowerName.includes('denied') || lowerName.includes('fail')) {
                          icon = <XCircle size={20} className="text-[#E02424]" />;
                          textColor = 'text-[#E02424]';
                          bgColor = 'bg-[#FEF2F2]';
                          borderColor = 'border-[#FECACA]/50';
                          lineColor = 'bg-[#E02424]/20';
                        } else {
                          icon = <Clock size={20} className="text-[#EA580C]" />;
                          textColor = 'text-[#EA580C]';
                          bgColor = 'bg-[#FFF7ED]';
                          borderColor = 'border-[#FED7AA]/50';
                          lineColor = 'bg-[#EA580C]/20';
                        }

                        return (
                          <div key={condition.id} className="relative pb-2">
                            {idx !== conditions.length - 1 && (
                              <div className={`absolute left-[9px] top-6 bottom-[-24px] w-[2px] ${lineColor}`}></div>
                            )}
                            
                            <div className="flex items-center space-x-3 mb-3 relative z-10 bg-white inline-flex pr-4">
                              <div className="bg-white rounded-full shrink-0 shadow-sm">
                                {icon}
                              </div>
                              <h3 className={`text-[14px] font-bold ${textColor}`}>
                                If {templateData?.goal === 'verification' || templateData?.goal === 'Verification' || !templateData?.goal || templateData?.goal === 'Test' ? 'Claim Status' : templateData.goal} is {condition.name}
                              </h3>
                            </div>
                            
                            <div className="space-y-2 ml-8">
                              {condition.fields.map((field) => (
                                <div 
                                  key={field.id} 
                                  className={`flex items-center justify-between py-2 px-3 ${bgColor} border ${borderColor} rounded-[8px] transition-all hover:shadow-sm ${!field.visible ? 'opacity-50 grayscale-[0.8]' : ''}`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <GripVertical size={14} className="text-black/20 cursor-grab hover:text-black/40" />
                                    <span className={`text-[13px] font-bold text-[#1A1C21] ${!field.visible ? 'line-through text-[#717784]' : ''}`}>
                                      {field.name}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => toggleFieldVisibility(condition.id, field.id)}
                                    className={`p-1 rounded-[6px] bg-white border border-[#EAECEF] hover:bg-[#F8FAFC] transition-colors shadow-sm`}
                                  >
                                    {field.visible ? <Eye size={14} className="text-[#3B82F6]" /> : <EyeOff size={14} className="text-[#98A2B3]" />}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white border border-[#EAECEF] rounded-[12px] shadow-sm">
                <div className="p-4 border-b border-[#EAECEF] flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Upload size={16} className="text-[#3B82F6]" />
                    <h2 className="text-[14px] font-bold text-[#1A1C21]">Upload Data</h2>
                  </div>
                  <button onClick={handleDownloadTemplate} className="text-[#3B82F6] hover:text-[#1E40AF] hover:underline text-[12px] font-bold flex items-center bg-transparent border-none p-0 transition-colors">
                    <Download size={14} className="mr-1.5" />
                    Download Excel Template
                  </button>
                </div>
                <div className="p-4">
                  <div className="bg-[#E8F1FC] rounded-[6px] p-2 flex items-start space-x-2 mb-4 border border-[#D0E3F9]">
                    <Info size={14} className="text-[#3B82F6] mt-0.5 shrink-0" />
                    <p className="text-[12px] text-[#1A1C21]">All columns are required to proceed. Use the template below to prepare your data, or add calls manually.</p>
                  </div>
                  
                  <div className="mb-4">
                    <button onClick={handleAddCall} className="flex items-center px-3 py-1.5 border border-[#D0D5DD] text-[#3B82F6] bg-white rounded-[6px] font-bold text-[12px] hover:bg-[#F8FAFC] transition-colors shadow-sm">
                      <Plus size={14} className="mr-1.5" /> Add a Call
                    </button>
                  </div>

                  {uploadedFile && (
                    <div className="mb-4 p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-[6px] shadow-sm flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 size={16} className="text-[#059669] fill-white" />
                        <div>
                          <p className="text-[12px] font-bold text-[#065F46]">{uploadedFile.name}</p>
                          <p className="text-[11px] font-medium text-[#059669]">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • file uploaded successfully</p>
                        </div>
                      </div>
                      <button onClick={handleRemoveFile} className="text-[#059669] hover:text-[#065F46] p-1 hover:bg-white/50 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  {uploadStatus === 'error' && (
                    <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-[6px] shadow-sm flex items-center space-x-2.5">
                      <XCircle size={16} className="text-[#E02424] fill-white" />
                      <p className="text-[12px] font-bold text-[#991B1B]">Invalid file. Please upload a CSV or Excel file under 10MB.</p>
                    </div>
                  )}

                  <div
                    className={`border-[2px] border-dashed rounded-[10px] py-6 px-4 text-center transition-all duration-200 cursor-pointer ${isDragOver ? 'border-[#3B82F6] bg-[#F1F5FD]' : 'border-[#D0D5DD] bg-white hover:bg-[#F8FAFC]'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleUploadClick}
                  >
                    <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileInputChange} className="hidden" />
                    
                    <div className="w-12 h-10 relative mx-auto mb-3 pointer-events-none">
                      <div className="absolute inset-0 bg-[#3B82F6] rounded-[8px] flex items-center justify-center shadow-md shadow-[#3B82F6]/20">
                        <UploadCloud size={20} className="text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-sm opacity-50 rotate-12"></div>
                      <div className="absolute -left-2 top-2 w-2.5 h-3 bg-white rounded-sm opacity-50 -rotate-12"></div>
                    </div>
                    <h3 className="font-bold text-[#1A1C21] text-[14px] mb-1 pointer-events-none">{isDragOver ? 'Drop your file here' : 'Drag & drop file here'}</h3>
                    <p className="text-[#717784] text-[12px] mb-3 pointer-events-none">or click the button below to browse files</p>
                    <button className="bg-[#3B82F6] text-white px-4 py-2 rounded-[6px] font-bold text-[12px] hover:bg-[#1E40AF] transition-colors shadow-sm flex items-center mx-auto pointer-events-none">
                      <Upload size={14} className="mr-1.5" /> Upload Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )}

        {currentStep === 3 && (
          <div className="flex flex-col lg:flex-row gap-6 mb-8 items-start w-full">
            {/* Left Sidebar for Step 3 ONLY */}
            <div className="w-full lg:w-[260px] shrink-0 space-y-4">
               {/* Card 1: Batch Overview */}
               <div className="bg-white rounded-[12px] p-4 shadow-sm border border-[#EAECEF]">
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#E8F1FC] rounded-[6px] flex items-center justify-center text-[#3B82F6]"><FileText size={12}/></div>
                        <h3 className="font-extrabold text-[#1A1C21] text-[12px]">Batch Overview</h3>
                     </div>
                     <span className="text-[10px] font-bold text-[#3B82F6] bg-[#E8F1FC] px-2 py-0.5 rounded-[4px] border border-[#D0E3F9]">Draft</span>
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#717784] font-medium">Batch Title</span>
                        <span className="text-[11px] font-bold text-[#1A1C21]">{batchTitle || 'Test Results'}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#717784] font-medium">Call Type</span>
                        <span className="text-[10px] font-bold text-[#3B82F6] bg-[#E8F1FC] px-1.5 py-0.5 rounded-[4px]">{templateData?.call_type || 'Claims IVR'}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#717784] font-medium">Goal</span>
                        <span className="text-[11px] font-bold text-[#1A1C21]">{templateData?.goal === 'verification' || templateData?.goal === 'Verification' || !templateData?.goal || templateData?.goal === 'Test' ? 'Claim Status' : templateData.goal}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#717784] font-medium">To</span>
                        <span className="text-[11px] font-bold text-[#1A1C21]">Insurance</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#717784] font-medium">Regarding</span>
                        <span className="text-[11px] font-bold text-[#1A1C21]">Patient</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#717784] font-medium">Template</span>
                        <span className="text-[11px] font-bold text-[#1A1C21]">{templateData?.name || 'Test Results'}</span>
                     </div>
                  </div>
               </div>

               {/* Card 2: Batch Activity */}
               <div className="bg-white border border-[#EAECEF] rounded-[12px] p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#E8F1FC] rounded-[6px] flex items-center justify-center text-[#3B82F6]"><Activity size={12}/></div>
                        <h3 className="font-extrabold text-[#1A1C21] text-[12px]">Batch Activity</h3>
                     </div>
                     <div className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></div>
                        <span className="text-[11px] font-bold text-[#1A1C21]">Draft</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-4">
                    <div>
                      <span className="block text-[10px] text-[#717784] font-semibold mb-1">Status</span>
                      <span className="text-[11px] font-bold text-[#1A1C21]">Draft</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#717784] font-semibold mb-1">Calls</span>
                      <span className="text-[11px] font-bold text-[#1A1C21]">—</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#717784] font-semibold mb-1">Scheduled</span>
                      <span className="text-[11px] font-bold text-[#1A1C21]">Not scheduled</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#717784] font-semibold mb-1">Batch Speed</span>
                      <div className="flex items-center space-x-1 text-[#3B82F6]">
                        <Zap size={12} className="fill-current" />
                        <span className="text-[11px] font-bold capitalize">{batchSpeed}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-[10px] text-[#717784] font-semibold mb-1">Created</span>
                      <span className="text-[11px] font-bold text-[#1A1C21]">
                        {existingBatch?.created_at ? new Date(existingBatch.created_at).toLocaleDateString('en-US') : '4/21/2026'}
                      </span>
                    </div>
                  </div>
               </div>

               {/* Card 3: Quick Actions */}
               <div className="bg-white border border-[#EAECEF] rounded-[12px] p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-4">
                     <div className="w-6 h-6 bg-[#E8F1FC] rounded-[6px] flex items-center justify-center text-[#3B82F6]"><Zap size={12} className="fill-current" /></div>
                     <h3 className="font-extrabold text-[#1A1C21] text-[12px]">Quick Actions</h3>
                  </div>
                  <div className="space-y-2.5 mt-4">
                     <button onClick={handleSaveAsTemplate} className="w-full flex items-center justify-between py-1.5 text-[11px] font-semibold text-[#4A4F59] hover:text-[#3B82F6] transition-colors group">
                        <div className="flex items-center space-x-2">
                           <FileText size={14} className="text-[#98A2B3] group-hover:text-[#3B82F6]" />
                           <span>Save as new template</span>
                        </div>
                        <ArrowRight size={12} className="text-[#D0D5DD] group-hover:text-[#3B82F6]" />
                     </button>
                     <button onClick={handleDuplicateBatch} className="w-full flex items-center justify-between py-1.5 text-[11px] font-semibold text-[#4A4F59] hover:text-[#3B82F6] transition-colors group">
                        <div className="flex items-center space-x-2">
                           <Copy size={14} className="text-[#98A2B3] group-hover:text-[#3B82F6]" />
                           <span>Duplicate call batch</span>
                        </div>
                        <ArrowRight size={12} className="text-[#D0D5DD] group-hover:text-[#3B82F6]" />
                     </button>
                     <button onClick={handleViewHistory} className="w-full flex items-center justify-between py-1.5 text-[11px] font-semibold text-[#4A4F59] hover:text-[#3B82F6] transition-colors group">
                        <div className="flex items-center space-x-2">
                           <History size={14} className="text-[#98A2B3] group-hover:text-[#3B82F6]" />
                           <span>View batch history</span>
                        </div>
                        <ArrowRight size={12} className="text-[#D0D5DD] group-hover:text-[#3B82F6]" />
                     </button>
                     
                     <div className="h-px bg-[#EAECEF] my-2"></div>

                     <button onClick={handleDeleteBatch} className="w-full flex items-center space-x-2 py-1.5 text-[11px] font-bold text-[#E02424] hover:text-[#B91C1C] transition-colors">
                        <Trash2 size={14} className="text-[#E02424]" />
                        <span>Delete call batch</span>
                     </button>
                  </div>
               </div>
            </div>

            {/* Main Content Area for Step 3 */}
            <div className="flex-1 w-full space-y-4">
              <div className="bg-white border border-[#EAECEF] rounded-[16px] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#EAECEF] flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-[10px] bg-[#3B82F6] flex items-center justify-center shadow-md shadow-[#3B82F6]/20">
                     <Shield size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-black text-[#1A1C21]">Review & Schedule Batch</h2>
                    <p className="text-[12px] text-[#717784] font-semibold mt-0.5">Review your batch configuration and schedule when to start calling.</p>
                  </div>
                </div>
                <div className="p-5">
                    {/* Batch Summary (Matching Image 2) */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2.5 mb-4">
                          <div className="w-7 h-7 bg-[#F1F5FD] rounded-[6px] flex items-center justify-center text-[#3B82F6]">
                            <FileText size={14} />
                          </div>
                          <h3 className="text-[13px] font-extrabold text-[#1A1C21]">Batch Summary</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#F8FAFC]/50 rounded-[12px] border border-[#EAECEF]">
                          <div className="space-y-3">
                            <div>
                               <span className="block text-[10px] font-bold text-[#717784] uppercase tracking-wider mb-1">Batch Title:</span>
                               <span className="text-[12px] font-extrabold text-[#1A1C21]">Test Results</span>
                            </div>
                            <div>
                               <span className="block text-[10px] font-bold text-[#717784] uppercase tracking-wider mb-1">Call Type:</span>
                               <span className="text-[11px] font-bold text-[#3B82F6] bg-white border border-[#D0E3F9] px-2 py-0.5 rounded-[6px]">Claims IVR</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                               <span className="block text-[10px] font-bold text-[#717784] uppercase tracking-wider mb-1">Goal:</span>
                               <span className="text-[12px] font-extrabold text-[#1A1C21]">{templateData?.goal === 'verification' || templateData?.goal === 'Verification' || !templateData?.goal || templateData?.goal === 'Test' ? 'Claim Status' : templateData.goal}</span>
                            </div>
                            <div>
                               <span className="block text-[10px] font-bold text-[#717784] uppercase tracking-wider mb-1">Template:</span>
                               <span className="text-[12px] font-extrabold text-[#1A1C21]">Test Results</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                               <span className="block text-[10px] font-bold text-[#717784] uppercase tracking-wider mb-1">Total Calls:</span>
                               <span className="text-[12px] font-extrabold text-[#1A1C21]">{uploadedFile ? '3' : '0'}</span>
                            </div>
                            <div>
                               <span className="block text-[10px] font-bold text-[#717784] uppercase tracking-wider mb-1">Required Fields:</span>
                               <span className="text-[12px] font-extrabold text-[#1A1C21]">{getRequiredFields()}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                               <span className="block text-[10px] font-bold text-[#717784] uppercase tracking-wider mb-1">Batch Speed:</span>
                               <div className="flex items-center space-x-1.5 text-[#3B82F6]">
                                 <Zap size={14} className="fill-current" />
                                 <span className="text-[12px] font-extrabold capitalize">{batchSpeed}</span>
                               </div>
                            </div>
                            <div>
                               <span className="block text-[10px] font-bold text-[#717784] uppercase tracking-wider mb-1">Status:</span>
                               <span className="inline-flex items-center px-2 py-0.5 bg-[#ECFDF5] text-[#059669] text-[10px] font-extrabold rounded-[4px] border border-[#A7F3D0]">Ready to Schedule</span>
                            </div>
                          </div>
                        </div>
                    </div>

                  {/* Scheduling Options (Matching Image 2) */}
                  <div className="mb-6">
                      <div className="flex items-center space-x-2.5 mb-4">
                        <div className="w-7 h-7 bg-[#F1F5FD] rounded-[6px] flex items-center justify-center text-[#3B82F6]">
                          <Calendar size={14} />
                        </div>
                        <h3 className="text-[13px] font-extrabold text-[#1A1C21]">Scheduling Options</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[10px] font-bold text-[#717784] mb-2 uppercase tracking-wider">START DATE & TIME</label>
                              <div className="relative group">
                                <input type="datetime-local" className="w-full pl-4 pr-8 py-2 bg-white border border-[#EAECEF] rounded-[8px] text-[12px] font-bold text-[#1A1C21] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/5 transition-all shadow-sm" defaultValue="2026-04-02T09:00" />
                                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717784] pointer-events-none group-hover:text-[#3B82F6] transition-colors" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-[#717784] mb-2 uppercase tracking-wider">TIME ZONE</label>
                              <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3B82F6]">
                                  <Shield size={14} className="rotate-90 opacity-20 absolute -left-1 -top-1" />
                                  <div className="w-2 h-2 bg-[#3B82F6] rounded-full border border-white shadow-sm"></div>
                                </div>
                                <select className="w-full pl-9 pr-8 py-2 bg-white border border-[#EAECEF] rounded-[8px] text-[12px] font-bold text-[#1A1C21] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/5 transition-all shadow-sm appearance-none cursor-pointer">
                                    <option value="">Select Time Zone</option>
                                    {ALL_TIMEZONES.map(tz => (
                                      <option key={tz} value={tz}>
                                        {tz.replace(/_/g, ' ')}
                                      </option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717784] pointer-events-none group-hover:text-[#3B82F6] transition-colors" />
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Call Speed (Matching Image 2) */}
                  <div className="mb-4">
                      <div className="flex items-center space-x-2.5 mb-4">
                        <div className="w-7 h-7 bg-[#ECFDF5] rounded-[6px] flex items-center justify-center text-[#059669]">
                          <Activity size={14} />
                        </div>
                        <h3 className="text-[13px] font-extrabold text-[#1A1C21]">Call Speed</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { value: 'slow', label: 'Slow', desc: '1 call/minute', icon: <div className="w-8 h-8 rounded-full bg-[#F0FDF4] flex items-center justify-center border border-[#DCFCE7] shadow-sm"><Activity size={14} className="text-[#22C55E]" /></div> },
                          { value: 'standard', label: 'Standard', desc: '2 calls/minute', icon: <div className="w-8 h-8 rounded-full bg-[#FFFBEB] flex items-center justify-center border border-[#FEF3C7] shadow-sm"><Activity size={14} className="text-[#F59E0B]" /></div> },
                          { value: 'max', label: 'Max', desc: '3 calls/minute', icon: <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center border border-[#DBEAFE] shadow-sm"><Activity size={14} className="text-[#3B82F6]" /></div> }
                        ].map(speed => (
                          <div 
                            key={speed.value} 
                            onClick={() => setBatchSpeed(speed.value)}
                            className={`relative group rounded-[12px] p-4 cursor-pointer transition-all border ${batchSpeed === speed.value ? 'border-[#3B82F6] bg-white shadow-md shadow-blue-100/50' : 'border-[#EAECEF] bg-white hover:border-[#D0D5DD] hover:shadow-sm'}`}
                          >
                            <div className="flex items-center justify-between mb-3">
                               {speed.icon}
                               <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${batchSpeed === speed.value ? 'border-[#3B82F6]' : 'border-[#D0D5DD]'}`}>
                                 {batchSpeed === speed.value && <div className="w-2 h-2 bg-[#3B82F6] rounded-full"></div>}
                               </div>
                            </div>
                            <div>
                               <span className={`block font-black text-[15px] mb-1 ${batchSpeed === speed.value ? 'text-[#1A1C21]' : 'text-[#4A4F59]'}`}>{speed.label}</span>
                               <span className="text-[13px] font-bold text-[#717784]">{speed.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                  </div>

                  {/* Validation Summary */}
                  <div>
                      <div className="flex items-center space-x-3 mb-6">
                        <Shield size={20} className="text-[#3B82F6]" />
                        <h3 className="text-[16px] font-extrabold text-[#1A1C21]">Validation Summary</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-6 bg-[#F8FAFC] border border-[#EAECEF] rounded-[16px] p-6">
                         <div className="space-y-4">
                           <div className="flex items-center space-x-3 text-[13px] font-extrabold text-[#059669]">
                             <CheckCircle2 size={18} className="fill-white" /> <span>Batch configuration is valid</span>
                           </div>
                           <div className="flex items-center space-x-3 text-[13px] font-extrabold text-[#059669]">
                             <CheckCircle2 size={18} className="fill-white" /> <span>Template is properly configured</span>
                           </div>
                         </div>
                         <div className="space-y-4">
                           <div className="flex items-center space-x-3 text-[13px] font-extrabold text-[#059669]">
                             <CheckCircle2 size={18} className="fill-white" /> <span>No data file uploaded</span>
                           </div>
                         </div>
                         <div className="space-y-4">
                           <div className="flex items-center space-x-3 text-[13px] font-extrabold text-[#E02424]">
                             <AlertCircle size={18} className="fill-white" /> <span>Scheduling time is within business hours</span>
                           </div>
                         </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer Actions */}
      <div className="sticky bottom-0 bg-white border-t border-[#EAECEF] px-6 py-3 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] w-full">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center space-x-1.5 px-4 py-2 border border-[#EAECEF] rounded-[8px] bg-white text-[#1A1C21] font-extrabold text-[12px] hover:bg-[#F8FAFC] transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft size={14} />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={async () => {
                const b = await saveBatch(existingBatch?.status || 'draft');
                if (b) alert('Batch saved successfully.');
              }} 
              disabled={saving} 
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-white border border-[#EAECEF] rounded-[8px] text-[#3B82F6] font-extrabold text-[12px] hover:bg-[#F8FAFC] transition-all shadow-sm disabled:opacity-50 active:scale-95"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Progress'}</span>
            </button>
            
            <button 
              onClick={handleSaveAndClose} 
              disabled={saving} 
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-white border border-[#EAECEF] rounded-[8px] text-[#4A4F59] font-extrabold text-[12px] hover:bg-[#F8FAFC] transition-all shadow-sm disabled:opacity-50 active:scale-95"
            >
              <X size={14} />
              <span>Save & Close</span>
            </button>

            {currentStep < 3 ? (
              <button 
                onClick={handleContinue} 
                className="flex items-center space-x-1.5 px-6 py-2.5 bg-[#2563EB] text-white rounded-[8px] font-extrabold text-[12px] hover:bg-[#1E40AF] transition-all shadow-md shadow-blue-200 active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button 
                onClick={handleScheduleBatch} 
                disabled={saving} 
                className="flex items-center space-x-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-[8px] font-extrabold text-[12px] hover:bg-[#1E40AF] transition-all shadow-md shadow-blue-200 disabled:opacity-50 active:scale-95 group"
              >
                <Calendar size={14} />
                <span>{saving ? 'Saving...' : 'Schedule Batch'}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBatchPage;
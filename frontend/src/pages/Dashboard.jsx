import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  Phone,
  Layers,
  FileText,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Clock,
  Circle,
  RefreshCw,
  History,
  StopCircle,
  Edit3,
  Zap,
  User,
  CheckCircle2,
  Download,
  Trash2,
  Bell,
  Calendar,
  Loader2
} from 'lucide-react';

import heroImage from '../assets/hero.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const { onLogout } = useOutletContext();
  const [showRecentDropdown, setShowRecentDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [batches, setBatches] = useState([]);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const API_BASE = 'http://127.0.0.1:8000/api/v1';

  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
      if (showRecentDropdown && !event.target.closest('.recently-viewed-container')) {
        setShowRecentDropdown(false);
      }
      if (showTimeFilter && !event.target.closest('.time-filter-container')) {
        setShowTimeFilter(false);
      }
      if (showProfileDropdown && !event.target.closest('.profile-container')) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId, showRecentDropdown, showTimeFilter]);

  const fetchData = async () => {
    try {
      const [batchesRes, callsRes] = await Promise.all([
        axios.get(`${API_BASE}/batches`),
        axios.get(`${API_BASE}/calls`)
      ]);
      setBatches(batchesRes.data);
      setCalls(callsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const timeRanges = {
    '24h': 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '3m': 'Last 3 Months'
  };

  // Dynamic metrics data based on backend data
  const getMetricsData = (range) => {
    // Calculate metrics from backend calls
    const totalCalls = calls.length;
    const paidCalls = calls.filter(c => c.outcome && c.outcome.paid_amount > 0).length;
    const deniedCalls = calls.filter(c => c.outcome && c.outcome.denial_reason).length;

    const baseData = [
      { title: "MEDICARE", phone: "+1 8552528782", growth: "8%", avg: "72%", count: Math.floor(totalCalls * 0.4) },
      { title: "HUMANA", phone: "+1 8004486262", growth: "15%", avg: "85%", count: Math.floor(totalCalls * 0.3) },
      { title: "BLUE CROSS", phone: "Blue Shield of Wyom...", growth: "0%", avg: "55%", count: Math.floor(totalCalls * 0.2) },
      { title: "CIGNA", phone: "+1 8002446224", growth: "-2%", avg: "68%", count: Math.floor(totalCalls * 0.1) }
    ];

    // Adjust counts based on time range (simulate)
    const multiplier = { '24h': 0.1, '7d': 0.3, '30d': 0.7, '3m': 1 }[range] || 1;
    return baseData.map(item => ({ ...item, count: Math.floor(item.count * multiplier) }));
  };

  const recentlyViewedBatches = batches.slice(0, 5).map(batch => ({
    id: batch.id,
    name: batch.name === 'March Claims Batch' ? 'Batch 1 - AC Jan 03, 2026' : (batch.name || batch.id),
    category: "Claims (IVR)",
    status: (batch.status?.toLowerCase() === 'in_progress' || batch.status === 'In Progress') ? 'calling' : batch.status?.toLowerCase(),
    calls: batch.status?.toLowerCase() !== 'draft' ? { current: batch.completed_calls, total: batch.total_calls } : null,
    info: batch.status?.toLowerCase() === 'draft' ? batch.total_calls : 0,
    date: batch.created_at ? new Date(batch.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
    speed: "Max",
    creator: "AC",
    createdAt: batch.created_at ? new Date(batch.created_at).toLocaleDateString() : new Date().toLocaleDateString()
  }));

  const handleStopBatch = async (batchId) => {
    if (window.confirm(`Are you sure you want to stop batch "${batchId}"?`)) {
      try {
        // Change status from in_progress to in_queue (stopped)
        await axios.patch(`${API_BASE}/batches/${batchId}`, {
          status: "in_queue"
        });
        // Refresh data to show changes
        await fetchData();
        alert(`Batch "${batchId}" has been stopped.`);
      } catch (error) {
        console.error('Error stopping batch:', error);
        alert('Failed to stop batch. Please try again.');
      }
    }
  };

  const handleEditBatch = (batchId) => {
    // Navigate to edit batch page with the batch ID
    navigate(`/batches/edit/${batchId}`);
  };

  const handleViewReport = (batchId) => {
    const batch = batches.find(b => b.id === batchId);
    const batchName = batch ? (batch.name === 'March Claims Batch' ? 'Batch 1 - AC Jan 03, 2026' : (batch.name || batch.id)) : 'Completed Batch';
    
    setSelectedReport({
      id: batchId,
      name: batchName,
      content: `The claim batch processing was successfully completed with optimal performance. Out of 500 total calls, 485 were fully automated via the IVR system, representing a 97% automation efficiency. Our AI identified 15 high-complexity cases requiring specialized manual review for non-standard denial codes. This batch operation successfully validated $24,500 in claim reimbursements, maintaining a high precision rate with an average processing time of 1m 24s per record.`
    });
  };

  const handleReviewBatch = (batchId) => {
    navigate(`/batches/view/${batchId}`);
  };

  const handleRefresh = async () => {
    try {
      await fetchData();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const handleMenuToggle = (batchId) => {
    setOpenMenuId(openMenuId === batchId ? null : batchId);
  };

  const handleMenuAction = async (action, batchId) => {
    setOpenMenuId(null);
    setShowRecentDropdown(false);
    switch (action) {
      case 'edit':
        handleEditBatch(batchId);
        break;
      case 'duplicate':
        try {
          if (typeof batchId === 'string' && batchId.startsWith('hardcoded-')) {
            const mockName = batchId === 'hardcoded-1' ? "Batch 2 - AC Jan 03, 2026" : 
                            batchId === 'hardcoded-2' ? "Batch 3 - AC Feb 11, 2026" :
                            batchId === 'hardcoded-3' ? "Batch 4 - AC Mar 20, 2026" : "Batch 5 - AC Mar 20, 2026 [2]";
            await axios.post(`${API_BASE}/batches`, {
              template_id: 'template1',
              created_by: 'user1',
              name: `${mockName} - copy`,
              status: 'draft'
            });
          } else {
            await axios.post(`${API_BASE}/batches/${batchId}/duplicate`);
          }
          await fetchData();
          alert(`Batch duplicated successfully and saved to your batches.`);
        } catch (error) {
          console.error('Error duplicating batch:', error);
          alert('Failed to duplicate batch. Please try again.');
        }
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete batch "${batchId}"?`)) {
          try {
            await axios.delete(`${API_BASE}/batches/${batchId}`);
            await fetchData();
            alert(`Batch "${batchId}" has been deleted.`);
          } catch (error) {
            console.error('Error deleting batch:', error);
            alert('Failed to delete batch. Please try again.');
          }
        }
        break;
      case 'retry':
        try {
          // Logic: Update status to in_progress to trigger leftover calls
          await axios.patch(`${API_BASE}/batches/${batchId}`, { 
            status: "in_progress" 
          });
          await fetchData();
          alert(`Batch "${batchId}" moved to Queue. Remaining calls will be processed.`);
        } catch (error) {
          console.error('Error retrying batch:', error);
          alert('Failed to retry calls. Please try again.');
        }
        break;
      case 'complete':
        if (window.confirm(`Mark batch "${batchId}" as complete?`)) {
          try {
            await axios.patch(`${API_BASE}/batches/${batchId}`, { 
              status: "completed" 
            });
            await fetchData();
            alert(`Batch "${batchId}" has been marked as complete.`);
          } catch (error) {
            console.error('Error completing batch:', error);
            alert('Failed to update status. Please try again.');
          }
        }
        break;
      case 'download':
        try {
          // Logic: Trigger file download from the backend report endpoint
          // In a real app, this would be a specialized download endpoint
          const downloadUrl = `${API_BASE}/batches/${batchId}/download`; 
          window.open(downloadUrl, '_blank');
          alert('Generating report. Your download should start shortly.');
        } catch (error) {
          console.error('Error downloading report:', error);
          alert('Failed to start download. Please try again.');
        }
        break;
      default:
        break;
    }
  };

  const draftBatches = batches.filter(b => b.status?.toLowerCase() === 'draft');
  const queueBatches = batches.filter(b => ['in_queue', 'in_progress', 'calling'].includes(b.status?.toLowerCase()));
  const reviewBatches = batches.filter(b => b.status?.toLowerCase() === 'review');
  const completedBatches = batches.filter(b => b.status?.toLowerCase() === 'completed');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F0F5FA]">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-transparent px-6 py-4 pb-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-[#102A51]">Call Dashboard</h1>
              <span className="text-sm text-[#98A2B3]">
                Updated {lastUpdated.toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
              <button
                onClick={handleRefresh}
                className="flex items-center text-[#3B82F6] hover:text-[#00A3C1] transition-colors text-sm font-semibold"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative recently-viewed-container">
                <button
                  onClick={() => setShowRecentDropdown(!showRecentDropdown)}
                  className="flex items-center px-4 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-sm font-semibold hover:bg-[#F7F8FA] transition-colors"
                >
                  <History size={16} className="mr-2 text-[#717784]" />
                  Recently Viewed Batches
                  <ChevronDown size={14} className="ml-2 text-[#98A2B3]" />
                </button>

                {showRecentDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-[#EAECEF] rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                    {recentlyViewedBatches.map((batch, index) => (
                      <div key={batch.id} className={index > 0 ? "border-t border-[#EAECEF]" : ""}>
                        <div className="p-4 hover:bg-[#F7F8FA] transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-[#1A1C21] truncate mb-1">
                                {batch.name}
                              </h4>
                              <span className="text-xs font-bold text-[#1070B7] bg-[#E1F1F8] px-2 py-1 rounded">
                                {batch.category}
                              </span>
                            </div>
                            <div className="flex items-center ml-3">
                              {batch.status === 'calling' ? (
                                <div className="flex items-center text-xs text-[#3B82F6] font-semibold">
                                  <Phone size={14} className="mr-1" />
                                  Calling
                                </div>
                              ) : (
                                <div className="flex items-center text-xs text-[#717784]">
                                  <Loader2 size={14} className="mr-1" />
                                  Draft
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4 text-xs text-[#717784]">
                              <div className="flex items-center">
                                <CheckCircle2 size={14} className="mr-1 text-[#3B82F6]" />
                                {batch.calls ? `${batch.calls.current} / ${batch.calls.total} Calls` : '0 / 0 Calls'}
                              </div>
                              <div className="flex items-center">
                                <Circle size={14} className="mr-1 text-[#717784]" />
                                {batch.info} Info
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-[#717784]">
                              <span>{batch.date}</span>
                              <div className="flex items-center">
                                <Zap size={12} className="mr-1 text-[#3B82F6]" />
                                {batch.speed}
                              </div>
                              <div className="flex items-center">
                                <div className="w-5 h-5 rounded-full bg-[#F7F8FA] border border-[#EAECEF] flex items-center justify-center text-xs font-bold text-[#4A4F59]">
                                  {batch.creator}
                                </div>
                                <span className="ml-1">{batch.createdAt}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 menu-container">
                              {batch.status === 'calling' ? (
                                <button
                                  onClick={() => handleStopBatch(batch.id)}
                                  className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50"
                                >
                                  Stop
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleEditBatch(batch.id)}
                                  className="px-3 py-1.5 border border-[#3B82F6] text-[#3B82F6] rounded-lg text-xs font-semibold hover:bg-[#E0F8FC]"
                                >
                                  Edit
                                </button>
                              )}
                              <div className="relative">
                                <button
                                  onClick={() => handleMenuToggle(batch.id)}
                                  className="p-1.5 border border-[#D0D5DD] rounded-lg text-[#717784] hover:bg-[#F7F8FA]"
                                >
                                  <MoreHorizontal size={14} />
                                </button>
                                {openMenuId === batch.id && (
                                  <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-[#EAECEF] rounded-lg shadow-lg z-50">
                                    <button
                                      onClick={() => handleMenuAction('edit', batch.id)}
                                      className="w-full text-left px-3 py-2 text-xs text-[#4A4F59] hover:bg-[#F7F8FA] transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleMenuAction('duplicate', batch.id)}
                                      className="w-full text-left px-3 py-2 text-xs text-[#4A4F59] hover:bg-[#F7F8FA] transition-colors"
                                    >
                                      Duplicate
                                    </button>
                                    <button
                                      onClick={() => handleMenuAction('delete', batch.id)}
                                      className="w-full text-left px-3 py-2 text-xs text-[#E02424] hover:bg-red-50 transition-colors"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/batches/new/select-type"
                className="px-6 py-2.5 bg-[#3B82F6] text-white rounded-lg font-semibold hover:bg-[#1E40AF] transition-colors flex items-center shadow-sm"
              >
                <Plus size={18} className="mr-2" />
                Create Call Batch
              </Link>


              
              <div className="relative profile-container">
                <div 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 ml-4 cursor-pointer pl-2 border-l border-[#EAECEF]"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-[#F0F5FA] flex items-center justify-center">
                    <User size={20} className="text-[#3B82F6]" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-bold text-[#1A1C21]">Albert</p>
                    <p className="text-[11px] text-[#717784]">Admin</p>
                  </div>
                  <ChevronDown size={14} className={`text-[#717784] transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </div>

                {showProfileDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#EAECEF] rounded-xl shadow-xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-[#F2F4F7] bg-[#F9FAFB]">
                      <p className="text-sm font-bold text-[#1A1C21]">Albert</p>
                      <p className="text-xs text-[#717784]">albert@bristol.com</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => { navigate('/settings?tab=account'); setShowProfileDropdown(false); }}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-[#4A4F59] hover:bg-[#F7F8FA] hover:text-[#3B82F6] rounded-lg transition-colors group"
                      >
                        <User size={16} className="text-[#98A2B3] group-hover:text-[#3B82F6]" />
                        <span className="font-semibold">Account Settings</span>
                      </button>
                      <button 
                        onClick={() => { navigate('/settings?tab=notifications'); setShowProfileDropdown(false); }}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-[#4A4F59] hover:bg-[#F7F8FA] hover:text-[#3B82F6] rounded-lg transition-colors group"
                      >
                        <Bell size={16} className="text-[#98A2B3] group-hover:text-[#3B82F6]" />
                        <span className="font-semibold">Notifications</span>
                      </button>
                      <button 
                        onClick={() => { navigate('/help'); setShowProfileDropdown(false); }}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-[#4A4F59] hover:bg-[#F7F8FA] hover:text-[#3B82F6] rounded-lg transition-colors group"
                      >
                        <HelpCircle size={16} className="text-[#98A2B3] group-hover:text-[#3B82F6]" />
                        <span className="font-semibold">Help Center</span>
                      </button>
                    </div>
                    <div className="p-2 border-t border-[#F2F4F7]">
                      <button 
                        onClick={onLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-[#E02424] hover:bg-red-50 rounded-lg transition-colors group"
                      >
                        <LogOut size={16} className="text-[#E02424]" />
                        <span className="font-bold">Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="px-6 py-2 pb-4 flex gap-5 flex-1 overflow-hidden min-h-0">
          
          {/* Left Column (Hero + Kanban) */}
          <div className="flex-1 flex flex-col space-y-4 min-w-0 h-full">

          <div className="bg-white border border-[#E1EAF5] rounded-xl p-4 px-5 flex-shrink-0 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#F7F8FA] rounded-full flex items-center justify-center">
                  <Phone size={20} className="text-[#717784]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A1C21]">System Calls</h3>
                  <p className="text-xs text-[#98A2B3]">No connections</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  to="/settings?tab=system-calls"
                  className="flex items-center space-x-2 px-3 py-1.5 border border-[#DCE4F0] bg-white rounded-lg text-xs font-semibold text-[#4A4F59] hover:bg-[#F0F5FA] transition-colors"
                >
                  <Plus size={14} /> Add connection
                </Link>
                <Link
                  to="/settings?tab=account"
                  className="p-2 border border-[#D0D5DD] rounded-lg text-[#717784] hover:bg-[#F7F8FA] transition-colors inline-block"
                >
                  <Settings size={14} />
                </Link>
              </div>
            </div>
          </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">

              {/* Draft Section */}
              <BatchCardContainer title="Draft" count={draftBatches.length + 1} viewAllPath="/search-batches?status=draft" hasHeader={true}>
                <BatchCard
                  id="draft-1"
                  name="Batch 6 - AC Apr 03, 2026"
                  status="Draft"
                  date="Not scheduled"
                  user="AC"
                  onEdit={handleEditBatch}
                  onMenuToggle={handleMenuToggle}
                  onMenuAction={handleMenuAction}
                  isMenuOpen={openMenuId === "draft-1"}
                  isStandaloneContent={true}
                />
                {draftBatches.map((batch, index) => (
                  <React.Fragment key={batch.id}>
                    <hr className="border-[#F2F4F7]" />
                    <BatchCard
                      id={batch.id}
                      name={batch.name || `Batch ${batch.id}`}
                      status="Draft"
                      date="Not scheduled"
                      user="AC"
                      onEdit={handleEditBatch}
                      onMenuToggle={handleMenuToggle}
                      onMenuAction={handleMenuAction}
                      isMenuOpen={openMenuId === batch.id}
                      isStandaloneContent={true}
                    />
                  </React.Fragment>
                ))}
              </BatchCardContainer>

              {/* In Queue Section */}
              <BatchCardContainer title="In Queue" count={queueBatches.length} viewAllPath="/search-batches?status=calling" hasHeader={true}>
                {queueBatches.length > 0 ? queueBatches.map((batch, index) => (
                  <React.Fragment key={batch.id}>
                    {index > 0 && <hr className="border-[#F2F4F7]" />}
                    <BatchCard
                      id={batch.id}
                      name={batch.name || `Batch ${batch.id}`}
                      status="Calling"
                      date={batch.created_at ? new Date(batch.created_at).toLocaleDateString() : "Today"}
                      user="AC"
                      stats={`${batch.completed_calls || 0} / ${batch.total_calls || 0} Calls`}
                      onStop={() => handleStopBatch(batch.id)}
                      onMenuToggle={handleMenuToggle}
                      onMenuAction={handleMenuAction}
                      isMenuOpen={openMenuId === batch.id}
                      isStandaloneContent={true}
                      active={batch.status?.toLowerCase() === 'in_progress'}
                    />
                  </React.Fragment>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full pb-8">
                    <div className="mb-3 text-[#98A2B3]">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                    </div>
                    <p className="text-xs font-semibold text-[#717784] mb-4">No active batches</p>
                    <Link to="/search-batches?type=scheduled" className="text-[11px] font-bold text-[#3B82F6] flex items-center hover:underline">
                      <Phone size={12} className="mr-1.5" />
                      View all scheduled batches
                    </Link>
                  </div>
                )}
              </BatchCardContainer>

              {/* Review Section */}
              <BatchCardContainer title="Review" count={reviewBatches.length + 4} viewAllPath="/search-batches?status=review" hasHeader={true}>
                <BatchCard
                  id="hardcoded-1"
                  name="Batch 2 - AC Jan 03, 2026"
                  status="Review"
                  date="Jan 3rd, 2026"
                      user="AC"
                      stats="340 / 498 Calls"
                      onReview={handleReviewBatch}
                      onMenuToggle={handleMenuToggle}
                      onMenuAction={handleMenuAction}
                      isMenuOpen={openMenuId === "hardcoded-1"}
                      isStandaloneContent={true}
                    />
                    <hr className="border-[#F2F4F7]" />
                    <BatchCard
                      id="hardcoded-2"
                      name="Batch 3 - AC Feb 11, 2026"
                      status="Review"
                      date="Feb 11th, 2026"
                      user="AC"
                      stats="218 / 460 Calls"
                      onReview={handleReviewBatch}
                      onMenuToggle={handleMenuToggle}
                      onMenuAction={handleMenuAction}
                      isMenuOpen={openMenuId === "hardcoded-2"}
                      isStandaloneContent={true}
                    />
                    <hr className="border-[#F2F4F7]" />
                    <BatchCard
                      id="hardcoded-3"
                      name="Batch 4 - AC Mar 05, 2026"
                      status="Review"
                      date="Mar 5th, 2026"
                      user="AC"
                      stats="150 / 300 Calls"
                      onReview={handleReviewBatch}
                      onMenuToggle={handleMenuToggle}
                      onMenuAction={handleMenuAction}
                      isMenuOpen={openMenuId === "hardcoded-3"}
                      isStandaloneContent={true}
                    />
                    <hr className="border-[#F2F4F7]" />
                    <BatchCard
                      id="hardcoded-4"
                      name="Batch 5 - AC Mar 21, 2026"
                      status="Review"
                      date="Mar 21st, 2026"
                      user="AC"
                      stats="420 / 420 Calls"
                      onReview={handleReviewBatch}
                      onMenuToggle={handleMenuToggle}
                      onMenuAction={handleMenuAction}
                      isMenuOpen={openMenuId === "hardcoded-4"}
                      isStandaloneContent={true}
                    />
                {reviewBatches.map((batch, index) => (
                  <React.Fragment key={batch.id}>
                    <hr className="border-[#F2F4F7]" />
                    <BatchCard
                      id={batch.id}
                      name={batch.name || `Batch ${batch.id}`}
                      status="Review"
                      date={batch.created_at ? new Date(batch.created_at).toLocaleDateString() : "Recent"}
                      user="AC"
                      stats={`${batch.completed_calls || 0} / ${batch.total_calls || 0} Calls`}
                      onReview={handleReviewBatch}
                      onMenuToggle={handleMenuToggle}
                      onMenuAction={handleMenuAction}
                      isMenuOpen={openMenuId === batch.id}
                      isStandaloneContent={true}
                    />
                  </React.Fragment>
                ))}
              </BatchCardContainer>

              {/* Completed Section */}
              <BatchCardContainer title="Completed" count={completedBatches.length + 1} viewAllPath="/search-batches?status=completed" hasHeader={true}>
                <BatchCard
                  id="completed-1-1"
                  name="Batch 1.1 - AC Jan 15, 2026"
                  status="Completed"
                  date="Completed"
                  user="AC"
                  onViewReport={handleViewReport}
                  onMenuToggle={handleMenuToggle}
                  onMenuAction={handleMenuAction}
                  isMenuOpen={openMenuId === "completed-1-1"}
                  isStandaloneContent={true}
                />
                {completedBatches.map((batch, index) => (
                  <React.Fragment key={batch.id}>
                    <hr className="border-[#F2F4F7]" />
                    <BatchCard
                      id={batch.id}
                      name={batch.name || `Batch ${batch.id}`}
                      status="Completed"
                      date={batch.created_at ? new Date(batch.created_at).toLocaleDateString() : "Completed"}
                      user="AC"
                      onViewReport={handleViewReport}
                      onMenuToggle={handleMenuToggle}
                      onMenuAction={handleMenuAction}
                      isMenuOpen={openMenuId === batch.id}
                      isStandaloneContent={true}
                    />
                  </React.Fragment>
                ))}
              </BatchCardContainer>
            </div>
          </div>
          
        {/* Right Column (Top Contacts + Scheduled) */}
          <div className="w-[280px] flex-shrink-0 flex flex-col space-y-4 h-full">
            {/* Top Contacts Section */}
            <div className="bg-white border border-[#E1EAF5] rounded-xl shadow-sm p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-[#1A1C21]">Top Contacts</h3>
                <div className="relative time-filter-container">
                  <button
                    onClick={() => setShowTimeFilter(!showTimeFilter)}
                    className="flex items-center px-3 py-1 bg-white border border-[#D0D5DD] rounded-full text-[10px] font-semibold text-[#4A4F59] hover:bg-[#F7F8FA] transition-colors"
                  >
                    {timeRanges[timeRange]}
                    <ChevronDown size={10} className="ml-1.5" />
                  </button>

                  {showTimeFilter && (
                    <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-[#EAECEF] rounded-lg shadow-lg z-50">
                      {Object.entries(timeRanges).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setTimeRange(key);
                            setShowTimeFilter(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F7F8FA] transition-colors ${
                            timeRange === key ? 'bg-[#E0F8FC] text-[#3B82F6] font-semibold' : 'text-[#4A4F59]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical Metrics List */}
              <div className="space-y-1.5 mt-3">
                {getMetricsData(timeRange).map((metric, index) => (
                  <MetricCard
                    key={index}
                    title={metric.title}
                    phone={metric.phone}
                    growth={metric.growth}
                    avg={metric.avg}
                    count={metric.count}
                  />
                ))}
              </div>
            </div>

            {/* Calls to be Scheduled Today */}
            <div className="bg-white border border-[#E1EAF5] rounded-xl shadow-sm p-4 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-sm font-bold text-[#1A1C21]">Calls to be Schedule Today</h3>
                <Link to="/search-calls" className="text-[11px] font-bold text-[#3B82F6] hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-1">
                {[
                  { initials: 'JS', name: 'John Smith', phone: '+1 307-555-0147', time: '09:30 AM', priority: 'High Priority', priorityColor: 'text-[#E02424]', bg: 'bg-[#E1F1F8]', text: 'text-[#1070B7]' },
                  { initials: 'MR', name: 'Mary Rodriguez', phone: '+1 307-555-0189', time: '10:15 AM', priority: 'Normal', priorityColor: 'text-[#3B82F6]', bg: 'bg-[#FFF3E0]', text: 'text-[#E65100]' },
                  { initials: 'BW', name: 'Brian Walker', phone: '+1 307-555-0123', time: '11:00 AM', priority: 'Normal', priorityColor: 'text-[#3B82F6]', bg: 'bg-[#E8F5E9]', text: 'text-[#2E7D32]' },
                  { initials: 'LP', name: 'Linda Peterson', phone: '+1 307-555-0167', time: '01:30 PM', priority: 'Low Priority', priorityColor: 'text-[#16A34A]', bg: 'bg-[#F3E5F5]', text: 'text-[#6A1B9A]' },
                  { initials: 'TW', name: 'Tom Wilson', phone: '+1 307-555-0198', time: '02:45 PM', priority: 'Low Priority', priorityColor: 'text-[#16A34A]', bg: 'bg-[#FCE4EC]', text: 'text-[#C2185B]' },
                ].map((call, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full ${call.bg} ${call.text} flex items-center justify-center text-xs font-bold`}>
                        {call.initials}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1C21] group-hover:text-[#3B82F6] transition-colors">{call.name}</h4>
                        <p className="text-[10px] text-[#717784]">{call.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-right">
                      <div>
                         <p className="text-[11px] font-bold text-[#4A4F59]">{call.time}</p>
                         <p className={`text-[9px] font-bold ${call.priorityColor}`}>{call.priority}</p>
                      </div>
                      <button className="w-8 h-8 rounded-full border border-[#EAECEF] flex items-center justify-center text-[#3B82F6] hover:bg-[#F7F8FA] transition-colors shadow-sm">
                        <Phone size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-[#EAECEF] text-center flex-shrink-0">
                <Link to="/search-calls" className="inline-flex items-center justify-center text-[11px] font-bold text-[#3B82F6] hover:underline">
                  <Calendar size={14} className="mr-1.5" /> View all calls
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setSelectedReport(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in fade-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[#F2F4F7] flex items-center justify-between bg-[#E1F1F8]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#1070B7] text-white flex items-center justify-center shadow-lg shadow-[#1070B7]/30">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1C21]">Batch Report Summary</h3>
                  <p className="text-xs text-[#1070B7] font-semibold">{selectedReport.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <RefreshCw size={18} className="rotate-45 text-[#1070B7]" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="bg-[#F4F7F9] border border-[#D1E0E8] rounded-2xl p-7 mb-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1070B7] opacity-[0.03] rounded-full translate-x-16 -translate-y-16"></div>
                <div className="flex items-center space-x-2.5 mb-5">
                   <div className="p-1.5 bg-[#3B82F6]/10 rounded-lg">
                     <Zap size={16} className="text-[#3B82F6]" />
                   </div>
                   <span className="text-[11px] font-bold text-[#3B82F6] uppercase tracking-[0.15em]">AI Performance Intelligence</span>
                </div>
                <p className="text-[15px] text-[#1A1C21] leading-[1.6] font-medium">
                  {selectedReport.content}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-[#EAECEF] rounded-xl text-center">
                   <div className="text-xl font-bold text-[#1070B7]">97.2%</div>
                   <div className="text-[10px] text-[#98A2B3] font-bold uppercase">Accuracy</div>
                </div>
                <div className="p-4 bg-white border border-[#EAECEF] rounded-xl text-center">
                   <div className="text-xl font-bold text-[#1070B7]">1m 24s</div>
                   <div className="text-[10px] text-[#98A2B3] font-bold uppercase">Avg Time</div>
                </div>
                <div className="p-4 bg-white border border-[#EAECEF] rounded-xl text-center">
                   <div className="text-xl font-bold text-[#1070B7]">$24.5k</div>
                   <div className="text-[10px] text-[#98A2B3] font-bold uppercase">Recovered</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#F9FAFB] border-t border-[#F2F4F7] flex justify-end">
               <button 
                 onClick={() => setSelectedReport(null)}
                 className="px-8 py-3 bg-[#1070B7] text-white rounded-xl text-sm font-bold hover:bg-[#0E63A1] transition-all shadow-lg shadow-[#1070B7]/20"
               >
                 Acknowledge Report
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// --- Sub-components (Refined) ---

const NavItem = ({ icon, label, active = false, to }) => (
  <Link to={to} className={`flex items-center px-4 py-2.5 cursor-pointer rounded-lg transition-all text-xs ${active ? 'bg-[#EAECEF] font-bold text-[#1A1C21] border-l-4 border-[#0D346C] rounded-l-none' : 'text-[#717784] hover:bg-[#F7F8FA]'}`}>
    <span className={`mr-3.5 ${active ? 'text-[#0D346C]' : 'text-[#717784]'}`}>{icon}</span>
    {label}
  </Link>
);

const MetricCard = ({ title, phone, growth, avg, count }) => {
  const isPositive = !growth.includes('-');
  
  return (
    <div className="bg-white py-2 border-b border-[#E1EAF5] last:border-0 flex flex-col space-y-1.5">
      <div className="flex justify-between items-start space-x-2">
        <h4 className="text-[11px] font-bold text-[#1A1C21] uppercase tracking-wider truncate flex-1">{title} <span className="text-[#98A2B3] font-normal mx-1">|</span> <span className="text-[#717784] font-normal normal-case truncate inline-block align-bottom max-w-[100px]">{phone}</span></h4>
        <span className="text-[9px] font-bold text-[#3B82F6] bg-[#E1F1F8] px-2 py-0.5 rounded flex-shrink-0 whitespace-nowrap">Claims (IVR)</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline space-x-2.5">
          <span className={`text-[11px] font-bold flex items-center ${!isPositive ? 'text-[#E02424]' : 'text-[#16A34A]'}`}>
            {growth} {!isPositive ? '▼' : '▲'}
          </span>
          <span className="text-[11px] font-bold text-[#1A1C21]">{avg} <span className="text-[#717784] font-normal">avg</span></span>
          <span className="text-[11px] text-[#717784]">{count} calls</span>
        </div>
      </div>
    </div>
  );
};

const BatchCardContainer = ({ title, count, children, viewAllPath, hasHeader = true }) => {
  return (
    <div className="bg-white rounded-xl border border-[#E1EAF5] shadow-sm flex flex-col h-full overflow-hidden">
      {hasHeader && (
        <div className="flex justify-between items-center p-4 pb-3 border-b border-[#F2F4F7] flex-shrink-0">
          <div className="flex items-center font-bold text-[13px] text-[#1A1C21]">
            {title === 'Draft' && <div className="w-6 h-6 rounded bg-[#3B82F6] text-white flex items-center justify-center mr-3"><Circle size={12} /></div>}
            {title === 'In Queue' && <div className="w-6 h-6 rounded bg-[#3B82F6] text-white flex items-center justify-center mr-3"><Zap size={12} /></div>}
            {title === 'Review' && <div className="w-6 h-6 rounded bg-[#3B82F6] text-white flex items-center justify-center mr-3"><FileText size={12} /></div>}
            {title === 'Completed' && <div className="w-6 h-6 rounded bg-[#3B82F6] text-white flex items-center justify-center mr-3"><CheckCircle2 size={12} /></div>}
            {title}
            {title === 'In Queue' && (
              <div className="ml-3 relative">
                <select className="appearance-none bg-white pl-2 pr-5 py-0.5 rounded-full text-[10px] font-semibold border border-[#D0D5DD] text-[#717784] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#3B82F6] cursor-pointer">
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#717784] pointer-events-none" />
              </div>
            )}
          </div>
          {viewAllPath ? (
            <Link to={viewAllPath} className="text-[11px] text-[#3B82F6] hover:underline font-semibold">
              View all ({count})
            </Link>
          ) : (
            <span className="text-[11px] text-[#717784] font-semibold">View all ({count})</span>
          )}
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 overflow-y-auto custom-scrollbar space-y-4">
        {children}
      </div>
    </div>
  );
};

const BatchCard = ({ id, name, status, date, user, active = false, stats, onEdit, onStop, onReview, onViewReport, onMenuToggle, onMenuAction, isMenuOpen, isStandaloneContent = false }) => {
  // Mock data for additional fields to mirror the second image
  const batchData = {
    calls: stats ? { current: parseInt(stats.split(' / ')[0]), total: parseInt(stats.split(' / ')[1].split(' ')[0]) } : null,
    info: stats ? Math.floor(parseInt(stats.split(' / ')[0]) * 0.9) : 0, 
    scheduledDate: date === 'Created recently' ? 'Not scheduled' : date,
    speed: 'Max'
  };

  return (
    <div className={`transition-all duration-200 group relative ${isStandaloneContent ? '' : 'bg-white border border-[#E1EAF5] rounded-lg p-3 shadow-sm hover:shadow-[0_4px_12px_rgba(37,99,235,0.06)]'}`}>
      {/* Top Labels */}
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-[9px] font-bold text-[#1070B7] bg-[#E1F1F8] px-1.5 py-0.5 rounded uppercase tracking-wider">Claims (IVR)</span>
        <span className="text-[9px] font-bold text-[#98A2B3] uppercase tracking-wider">Claim Status</span>
      </div>

      {/* Title and Status Icon */}
      <div className="flex justify-between items-start mb-2.5">
        <h4 className="text-xs font-bold text-[#102A51] leading-tight flex-1 pr-4" title={name}>
          {name}
        </h4>
        <div className="flex-shrink-0">
           {status === 'Draft' && <div className="w-5 h-5 rounded-full border-2 border-dashed border-[#D0D5DD] flex items-center justify-center"><Circle size={8} className="text-[#D0D5DD]" /></div>}
           {status === 'Calling' && <Phone size={16} className="text-[#3B82F6]" />}
           {status === 'Review' && (
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 if (onReview) onReview(id);
               }}
               className="hover:scale-110 transition-transform cursor-pointer p-0.5"
               title="Review Batch"
             >
               <FileText size={16} className="text-[#3B82F6]" />
             </button>
           )}
        </div>
      </div>

      {/* Progress Rings for In Queue/Review */}
      {(status === 'Calling' || status === 'Review') && batchData.calls && (
        <div className="flex items-center space-x-6 mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative w-7 h-7">
              <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" stroke="#F2F4F7" strokeWidth="4" fill="none" />
                <circle cx="16" cy="16" r="14" stroke="#3B82F6" strokeWidth="4" fill="none" strokeDasharray={`${(batchData.calls.current / batchData.calls.total) * 88} 88`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">{batchData.calls.current}</div>
            </div>
            <div className="text-[10px] text-[#717784] font-medium">{batchData.calls.current}/{batchData.calls.total} Calls</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative w-7 h-7">
              <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" stroke="#F2F4F7" strokeWidth="4" fill="none" />
                <circle cx="16" cy="16" r="14" stroke="#379AE6" strokeWidth="4" fill="none" strokeDasharray={`${(batchData.info / batchData.calls.total) * 88} 88`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">{batchData.info}</div>
            </div>
            <div className="text-[10px] text-[#717784] font-medium">{batchData.info} Info</div>
          </div>
        </div>
      )}

      {/* Date & Settings */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 text-[10px] text-[#717784]">
           <div className="flex items-center">
             <Clock size={12} className="mr-1.5 opacity-60" />
             {batchData.scheduledDate}
           </div>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-[#717784]">
           <Zap size={12} className="text-[#3B82F6]" />
           <span className="font-semibold">{batchData.speed}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F2F4F7]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-[#F9FAFB] border border-[#EAECEF] flex items-center justify-center text-[10px] font-bold text-[#717784]">
            {user}
          </div>
          <span className="text-[10px] text-[#98A2B3]">Created recently</span>
        </div>

        <div className="flex items-center space-x-2">
          {status === 'Completed' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onViewReport) onViewReport(id);
              }}
              className="flex items-center px-4 py-1.5 border border-[#1070B7] text-[#1070B7] rounded-lg text-xs font-bold hover:bg-[#E1F1F8] transition-colors"
            >
              Report Summary
            </button>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (active && onStop) onStop(id);
                  else if (status === 'Review' && onReview) onReview(id);
                  else if (onEdit) onEdit(id);
                }}
                className="flex items-center px-3 py-1.5 border border-[#3B82F6] text-[#3B82F6] rounded-md text-[10px] font-bold hover:bg-[#E0F8FC] transition-colors"
              >
                {active ? 'Stop' : status === 'Review' ? 'Review' : status === 'Calling' ? 'View' : 'Edit'}
                {status === 'Draft' && <Edit3 size={10} className="ml-1.5" />}
              </button>
              
              <div className="relative menu-container">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onMenuToggle) onMenuToggle(id);
                  }}
                  className="p-1.5 border border-[#D0D5DD] rounded-lg text-[#717784] hover:bg-[#F7F8FA] transition-colors"
                >
                  <MoreHorizontal size={14} />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#EAECEF] rounded-lg shadow-xl z-[100] overflow-hidden">
                    {status === 'Review' ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onMenuAction) onMenuAction('retry', id);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-[#4A4F59] hover:bg-[#F7F8FA] flex items-center transition-colors"
                        >
                          <RefreshCw size={14} className="mr-2.5 text-[#3B82F6]" /> Retry Unfinished
                        </button>
                         <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onMenuAction) onMenuAction('complete', id);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-[#4A4F59] hover:bg-[#F7F8FA] flex items-center transition-colors"
                        >
                          <CheckCircle2 size={14} className="mr-2.5 text-[#3B82F6]" /> Mark batch complete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onMenuAction) onMenuAction('edit', id);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-[#4A4F59] hover:bg-[#F7F8FA] flex items-center transition-colors"
                        >
                          <Edit3 size={14} className="mr-2.5 text-[#3B82F6]" /> Edit
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onMenuAction) onMenuAction('duplicate', id);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#4A4F59] hover:bg-[#F7F8FA] flex items-center transition-colors border-t border-[#F2F4F7]"
                    >
                      <Layers size={14} className="mr-2.5 text-[#3B82F6]" /> Duplicate Batch
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onMenuAction) onMenuAction('delete', id);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 flex items-center border-t border-[#F2F4F7]"
                    >
                      <Trash2 size={14} className="mr-2.5" /> Delete Batch
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          
          <ChevronRight size={16} className="text-[#D0D5DD] group-hover:text-[#717784] transition-colors" />
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
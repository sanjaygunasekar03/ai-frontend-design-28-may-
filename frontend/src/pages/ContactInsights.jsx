import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileText,
  Clock,
  CheckCircle2,
  Phone,
  Target,
  Calendar,
  Flag,
  Shield,
  TrendingDown,
  TrendingUp,
  MoreVertical,
  ChevronDown
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const ContactInsights = () => {
  const [activeTab, setActiveTab] = useState('Success');
  const [contactFilter, setContactFilter] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [timeFilter, setTimeFilter] = useState('Last 30');
  const [batches, setBatches] = useState([]);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [batchesRes, callsRes] = await Promise.all([
        axios.get(`${API_BASE}/batches`),
        axios.get(`${API_BASE}/calls`),
      ]);
      setBatches(batchesRes.data);
      setCalls(callsRes.data);
    } catch (err) {
      console.error('Error fetching contact insights data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Derive contacts table data from real calls
  const getFilteredData = () => {
    let filteredCalls = calls;

    // Filter by batch
    if (selectedBatch !== 'all') {
      filteredCalls = filteredCalls.filter(c => c.batch_id === selectedBatch);
    }

    // Filter by time (simplified - filter by call_date recency)
    if (timeFilter === 'Last 7') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      filteredCalls = filteredCalls.filter(c => new Date(c.call_date) >= cutoff);
    }

    // Group calls by call_to (insurance/contact)
    const grouped = {};
    filteredCalls.forEach(call => {
      const key = call.call_to || 'Unknown';
      if (!grouped[key]) {
        grouped[key] = { calls: [], lastCallDate: null };
      }
      grouped[key].calls.push(call);
      if (!grouped[key].lastCallDate || call.call_date > grouped[key].lastCallDate) {
        grouped[key].lastCallDate = call.call_date;
      }
    });

    return Object.entries(grouped).map(([contactId, data]) => {
      const totalCalls = data.calls.length;
      const completedCalls = data.calls.filter(c => c.status === 'Completed').length;
      const successPercent = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;
      const batchName = batches.find(b => b.id === data.calls[0]?.batch_id)?.name || data.calls[0]?.batch_id || '';
      return {
        contactId,
        callType: data.calls[0]?.call_type || 'Claims Status',
        goal: 'Claim Status',
        contactStatus: completedCalls === totalCalls ? 'Completed' : completedCalls > 0 ? 'In Progress' : 'Pending',
        calls: totalCalls,
        lastCall: data.lastCallDate ? new Date(data.lastCallDate).toLocaleDateString() : '—',
        successPercent,
        batch: batchName,
      };
    }).filter(item => !contactFilter || item.contactId.toLowerCase().includes(contactFilter.toLowerCase()));
  };

  const contactsData = getFilteredData();

  // Generate dynamic chart data based on selected batch
  const generateChartData = (seed) => {
    let multiplier = 1;
    if (seed !== 'all') {
      const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      multiplier = 0.5 + (hash % 10) / 10;
    }
    
    // Bar segment heights (reduced to prevent exceeding viewBox max height of 225)
    const baseGreen = [75, 55, 50, 65, 45, 70, 95];
    const baseOrange = [40, 35, 30, 35, 25, 40, 50];
    const baseBlue = [10, 10, 5, 10, 5, 10, 10];
    
    return {
      green: baseGreen.map(y => y * multiplier),
      orange: baseOrange.map(y => y * multiplier),
      blue: baseBlue.map(y => y * multiplier)
    };
  };

  const chartData = generateChartData(selectedBatch);
  const xCoords = [70, 175, 280, 385, 490, 595, 700];
  const barWidth = 28;
  const gap = 3;

  return (
    <div className="p-6 space-y-5 bg-[#F9FAFB] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-[#111827] tracking-tight flex items-center space-x-2">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center mr-2">
              <div className="w-2.5 h-2.5 border-2 border-white rounded-sm"></div>
            </div>
            Contact Insights
          </h1>
          <p className="text-[12px] text-[#6B7280] mt-1 ml-9">Track and analyze your contact center performance.</p>
        </div>
        <div className="flex items-end space-x-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#6B7280] mb-1.5 ml-1">Date Range</span>
            <div className="relative">
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-[#E5E7EB] rounded-lg text-[13px] font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer min-w-[160px] shadow-sm"
              >
                <option value="all">All Batches</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>{batch.name || batch.id}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] pointer-events-none" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#6B7280] mb-1.5 ml-1">Time Range</span>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-[#E5E7EB] rounded-lg text-[13px] font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer min-w-[130px] shadow-sm"
                >
                  <option value="Last 7">Last 7 Days</option>
                  <option value="Last 30">Last 30 Days</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Contacts */}
        <div className="bg-white border border-[#F3F4F6] rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full border border-[#E5E7EB] text-[#3B82F6] flex items-center justify-center bg-[#F9FAFB]">
                <Phone size={14} />
              </div>
              <p className="text-[13px] font-bold text-[#111827]">Total Contacts</p>
            </div>
            <h3 className="text-[28px] font-extrabold text-[#111827] leading-none mb-2">4,006</h3>
          </div>
          <div className="flex items-center text-[11px] font-semibold text-[#6B7280]">
            — <span className="ml-1 font-medium">vs last 30 days</span>
          </div>
        </div>

        {/* Submitted / Required */}
        <div className="bg-white border border-[#F3F4F6] rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full border border-[#E5E7EB] text-[#F59E0B] flex items-center justify-center bg-[#F9FAFB]">
                <Clock size={14} />
              </div>
              <p className="text-[13px] font-bold text-[#111827]">Submitted / Required</p>
            </div>
            <h3 className="text-[28px] font-extrabold text-[#111827] leading-none mb-2">856</h3>
          </div>
          <div className="flex items-center text-[11px] font-semibold text-[#EF4444]">
            <TrendingDown size={12} className="mr-1" />
            10.7% <span className="text-[#6B7280] ml-1 font-medium">vs last 30 days</span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white border border-[#F3F4F6] rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full border border-[#E5E7EB] text-[#10B981] flex items-center justify-center bg-[#F9FAFB]">
                <CheckCircle2 size={14} />
              </div>
              <p className="text-[13px] font-bold text-[#111827]">Completed</p>
            </div>
            <h3 className="text-[28px] font-extrabold text-[#111827] leading-none mb-2">1,902</h3>
          </div>
          <div className="flex items-center text-[11px] font-semibold text-[#10B981]">
            <TrendingUp size={12} className="mr-1" />
            24.6% <span className="text-[#6B7280] ml-1 font-medium">vs last 30 days</span>
          </div>
        </div>

        {/* Submitted */}
        <div className="bg-white border border-[#F3F4F6] rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full border border-[#E5E7EB] text-[#3B82F6] flex items-center justify-center bg-[#F9FAFB]">
                <FileText size={14} />
              </div>
              <p className="text-[13px] font-bold text-[#111827]">Submitted</p>
            </div>
            <h3 className="text-[28px] font-extrabold text-[#111827] leading-none mb-2">1,248</h3>
          </div>
          <div className="flex items-center text-[11px] font-semibold text-[#EF4444]">
            <TrendingDown size={12} className="mr-1" />
            18.4% <span className="text-[#6B7280] ml-1 font-medium">vs last 30 days</span>
          </div>
        </div>

      </div>

      {/* Main Chart + At a Glance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-[#F3F4F6] rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-[#111827]">Contact Activity Over Time</h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full"></div>
                <span className="text-[12px] font-semibold text-[#4B5563]">Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full"></div>
                <span className="text-[12px] font-semibold text-[#4B5563]">Abandoned</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full"></div>
                <span className="text-[12px] font-semibold text-[#4B5563]">Other</span>
              </div>
              <div className="relative">
                <select className="appearance-none pl-3 pr-8 py-1.5 border border-[#E5E7EB] rounded-md text-[12px] font-semibold text-[#4B5563] bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Last 7 Days</option>
                  <option>Last 14 Days</option>
                  <option>Last 30 Days</option>
                  <option>All Time</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="h-[260px] w-full relative mt-4">
            <svg width="100%" height="100%" viewBox="0 0 800 300" className="overflow-visible">
              <defs>
                <linearGradient id="gradGreenBar" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="gradOrangeBar" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="gradBlueBar" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              {/* Grid */}
              {Array.from({ length: 4 }).map((_, i) => (
                <g key={i}>
                  <line x1="40" y1={i * 75 + 10} x2="780" y2={i * 75 + 10} stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                  <text x="30" y={i * 75 + 15} className="text-[11px] font-medium fill-[#9CA3AF]" textAnchor="end">
                    {['2K', '1.5K', '1K', '500', '0'][i]}
                  </text>
                </g>
              ))}
              {/* X Axis */}
              {['May 01', 'May 02', 'May 03', 'May 04', 'May 05', 'May 06', 'May 07'].map((label, i) => (
                <text key={i} x={xCoords[i]} y="260" className="text-[11px] font-medium fill-[#9CA3AF]" textAnchor="middle">
                  {label}
                </text>
              ))}
              
              {/* Stacked Bars */}
              {xCoords.map((x, i) => {
                const gHeight = chartData.green[i];
                const oHeight = chartData.orange[i];
                const bHeight = chartData.blue[i];
                
                const gY = 235 - gHeight;
                const oY = gY - gap - oHeight;
                const bY = oY - gap - bHeight;

                return (
                  <g key={i}>
                    <rect x={x - barWidth/2} y={gY} width={barWidth} height={gHeight} rx="4" fill="url(#gradGreenBar)" style={{ transition: 'all 0.5s ease' }} />
                    <rect x={x - barWidth/2} y={oY} width={barWidth} height={oHeight} rx="4" fill="url(#gradOrangeBar)" style={{ transition: 'all 0.5s ease' }} />
                    <rect x={x - barWidth/2} y={bY} width={barWidth} height={bHeight} rx="4" fill="url(#gradBlueBar)" style={{ transition: 'all 0.5s ease' }} />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Live Queue */}
        <div className="bg-white border border-[#F3F4F6] rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
          <h3 className="text-[14px] font-bold text-[#111827] mb-4">Live Queue</h3>
          
          <div className="flex flex-col space-y-0.5">
             <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
               <div className="flex items-center space-x-3">
                 <div className="w-6 h-6 rounded bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center font-bold text-[11px]">
                   W
                 </div>
                 <span className="text-[12px] font-bold text-[#111827]">Warranty</span>
               </div>
               <span className="text-[11px] font-medium text-[#6B7280]">12 in queue</span>
             </div>
             
             <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
               <div className="flex items-center space-x-3">
                 <div className="w-6 h-6 rounded bg-[#E0F8FC] text-[#00B8D9] flex items-center justify-center font-bold text-[11px]">
                   M
                 </div>
                 <span className="text-[12px] font-bold text-[#111827]">Medical</span>
               </div>
               <span className="text-[11px] font-medium text-[#6B7280]">10 in queue</span>
             </div>
             
             <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
               <div className="flex items-center space-x-3">
                 <div className="w-6 h-6 rounded bg-[#FCE8E8] text-[#E02424] flex items-center justify-center font-bold text-[11px]">
                   B
                 </div>
                 <span className="text-[12px] font-bold text-[#111827]">Billing & Payments</span>
               </div>
               <span className="text-[11px] font-medium text-[#6B7280]">8 in queue</span>
             </div>
             
             <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
               <div className="flex items-center space-x-3">
                 <div className="w-6 h-6 rounded bg-[#FFF3E0] text-[#FF5722] flex items-center justify-center font-bold text-[11px]">
                   G
                 </div>
                 <span className="text-[12px] font-bold text-[#111827]">General Inquiries</span>
               </div>
               <span className="text-[11px] font-medium text-[#6B7280]">3 in queue</span>
             </div>

             <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
               <div className="flex items-center space-x-3">
                 <div className="w-6 h-6 rounded bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold text-[11px]">
                   S
                 </div>
                 <span className="text-[12px] font-bold text-[#111827]">Sales</span>
               </div>
               <span className="text-[11px] font-medium text-[#6B7280]">2 in queue</span>
             </div>
          </div>
        </div>
             

      </div>

      {/* Contact Performance Table */}
      <div className="bg-white border border-[#F3F4F6] rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden mt-4">
        <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-[#F3F4F6]">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center">
              <FileText size={14} />
            </div>
            <h3 className="text-[14px] font-bold text-[#111827]">Contact Performance</h3>
          </div>
          <button className="px-3 py-1.5 border border-[#E5E7EB] text-[#374151] rounded-lg text-[12px] font-semibold hover:bg-[#F9FAFB] transition-colors bg-white shadow-sm">
            View All Agents
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-white border-b border-[#E5E7EB]">
              <tr>
                <th className="px-5 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Agent</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Talk Time</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Contacts Handled</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Calls</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Avg. Duration</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Satisfaction</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Queue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] bg-white">
              {[
                { name: 'Darlene Robertson', initials: 'DR', color: 'bg-[#3B82F6]', time: '02:45:30', status: 'Online', statusColor: 'bg-[#10B981]', handled: 128, handledColor: 'text-[#10B981]', calls: 24, duration: '4m 32s', satisfaction: '94%', satColor: 'text-[#10B981]', queue: 'Medical' },
                { name: 'Albert K. Flores', initials: 'AK', color: 'bg-[#10B981]', time: '03:15:20', status: 'Online', statusColor: 'bg-[#10B981]', handled: 98, handledColor: 'text-[#10B981]', calls: 18, duration: '5m 12s', satisfaction: '92%', satColor: 'text-[#10B981]', queue: 'Billing & Payments' },
                { name: 'Savannah Williamson', initials: 'SW', color: 'bg-[#8B5CF6]', time: '02:20:10', status: 'Online', statusColor: 'bg-[#10B981]', handled: 86, handledColor: 'text-[#10B981]', calls: 17, duration: '3m 47s', satisfaction: '90%', satColor: 'text-[#10B981]', queue: 'Warranty' },
                { name: 'Marvin C. McKinney', initials: 'MC', color: 'bg-[#F59E0B]', time: '01:45:50', status: 'Away', statusColor: 'bg-[#F59E0B]', handled: 64, handledColor: 'text-[#F59E0B]', calls: 12, duration: '6m 18s', satisfaction: '78%', satColor: 'text-[#EF4444]', queue: 'General Inquiries' }
              ].map((agent, index) => (
                <tr key={index} className="hover:bg-[#F9FAFB] transition-colors cursor-pointer group">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`w-7 h-7 rounded flex items-center justify-center font-bold text-[11px] ${agent.color} text-white`}>
                        {agent.initials}
                      </div>
                      <span className="text-[13px] font-bold text-[#111827] group-hover:text-blue-600 transition-colors">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-[13px] font-medium text-[#4B5563]">
                    {agent.time}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-[13px]">
                     <div className="flex items-center space-x-1.5">
                       <div className={`w-2 h-2 rounded-full ${agent.statusColor}`}></div>
                       <span className="font-medium text-[#4B5563]">{agent.status}</span>
                     </div>
                  </td>
                  <td className={`px-5 py-3 whitespace-nowrap text-[13px] font-bold ${agent.handledColor}`}>
                    {agent.handled}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-[13px] font-medium text-[#4B5563]">
                    {agent.calls}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-[13px] font-bold text-[#111827]">
                    {agent.duration}
                  </td>
                  <td className={`px-5 py-3 whitespace-nowrap text-[13px] font-bold ${agent.satColor}`}>
                    {agent.satisfaction}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-[13px] font-medium text-[#4B5563]">
                    {agent.queue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white px-5 py-3 flex items-center justify-between border-t border-[#F3F4F6]">
          <span className="text-[13px] font-medium text-[#6B7280]">Showing 1 to 4 of 4 results</span>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F9FAFB] transition-colors">
              <ChevronDown size={14} className="transform rotate-90" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-blue-500 bg-blue-50 text-blue-600 font-bold text-[13px]">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
              <ChevronDown size={14} className="transform -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInsights;
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, ChevronRight } from 'lucide-react';

const FAQ_DATA = [
  // BATCHES
  {
    question: "How do I create a new call batch?",
    keywords: "create make new call batch batches start upload data",
    answer: "To create a new batch, navigate to the 'Batches' page from the sidebar or click the '+ Create Call Batch' button. Follow the wizard steps: select a call type, choose a template, and then upload your patient/claim data."
  },
  {
    question: "How do I view already created batches?",
    keywords: "view already created batches past previous see list history find old",
    answer: "To view your previously created batches, simply click on the 'Batches' tab in the left sidebar. This will open a complete list of all your batches where you can filter them by status (such as Draft, In Queue, Review, or Completed)."
  },
  {
    question: "How do I check the status of my calls?",
    keywords: "check view status see calls batches progress ongoing track",
    answer: "You can see live updates in the 'Dashboard' or go to the 'Batches' section. Clicking on a specific batch will show you the individual status of every call within that group."
  },
  {
    question: "How do I edit a draft batch?",
    keywords: "edit change update draft batch incomplete modify",
    answer: "Go to the Batches page, find the batch in the 'Drafts' section, click the three dots menu, and select 'Edit'. This will bring you back into the wizard to finish your setup."
  },
  {
    question: "How do I delete or stop a batch?",
    keywords: "delete remove stop cancel batch halt end terminate",
    answer: "For Draft batches, you can click the three dots menu and select 'Delete'. For In Queue batches, you can select 'Stop Batch' to halt any further calls from being made."
  },
  {
    question: "How do I download a batch report?",
    keywords: "download get save batch report summary export intelligence ai",
    answer: "Once a batch is Completed, you can click 'Report Summary' on the batch card. From the report modal, you can review and acknowledge the detailed AI performance intelligence metrics and export the data."
  },
  // TEMPLATES
  {
    question: "What does 'IVR Only' mean?",
    keywords: "ivr only mean meaning what automated interactive voice response bot",
    answer: "IVR Only stands for Interactive Voice Response. These templates are designed for calls where our system interacts only with automated phone systems, typically used for quick status checks without speaking to a live agent."
  },
  {
    question: "How can I request a new call type?",
    keywords: "request new call type need want custom add template missing",
    answer: "If you don't see the specific call type you need, go to the 'Templates' section and click the 'Request' button at the top. You can then fill out a form with your requirements, and our team will review it."
  },
  {
    question: "Can I duplicate an existing template?",
    keywords: "duplicate copy existing template same clone reuse",
    answer: "Yes! In the 'Templates' section, click the three dots (more actions) button on any template card and select 'Duplicate'. This will create an exact copy that you can then edit."
  },
  {
    question: "How do I create a new template?",
    keywords: "create make new template build scratch",
    answer: "Navigate to the 'Templates' page and click 'Create Template'. You will be able to define the AI instructions, required inputs, and expected outputs for your new call type."
  },
  // SYSTEM CALLS
  {
    question: "How do I add a new connection in System Calls?",
    keywords: "add new connection system calls link integrate connect portal",
    answer: "Go to the Dashboard and click the '+ Add connection' button in the System Calls banner, or navigate to Settings and select the 'System Calls' tab to add and manage your connections."
  },
  {
    question: "What are System Calls?",
    keywords: "what are system calls definition purpose integrations portals web",
    answer: "System Calls refer to automated data-fetching from external payer portals or EHR systems. By setting up connections, our AI can automatically retrieve claim statuses before resorting to a phone call."
  },
  // CONTACT INSIGHTS
  {
    question: "How do I view Contact Insights?",
    keywords: "view see contact insights analytics performance metrics stats providers",
    answer: "Navigate to the 'Contact Insights' page from the sidebar. There you can view detailed analytics, AI success rates, and performance metrics for all your contacts and insurance providers."
  },
  {
    question: "What is the Top Contacts section?",
    keywords: "what is top contacts section dashboard frequent called",
    answer: "The Top Contacts section on your Dashboard shows your most frequently called insurance providers or entities. It provides a quick glance at their connection health and typical call types."
  },
  // SETTINGS & OTHER
  {
    question: "Where can I change my notification settings?",
    keywords: "change update edit notification settings alerts emails preferences",
    answer: "Click on your profile picture in the top right corner and select 'Notifications', or go to Settings and click on the 'Notifications' tab."
  },
  {
    question: "How do I contact support?",
    keywords: "contact support help email phone reach assistance",
    answer: "If you need human assistance, you can email our support team directly at support@bristolhealthcare.com. We typically respond within 1 business day!"
  }
];

const HelpChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hello! I'm your Bristol Healthcare Services Assistant. How can I help you today?", time: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [botSuggestedQs, setBotSuggestedQs] = useState([]);
  const messagesEndRef = useRef(null);

  const getSuggestedFAQs = (query = "", excludeQuestion = "") => {
    if (!query) {
      return FAQ_DATA.filter(f => f.question !== excludeQuestion).sort(() => 0.5 - Math.random()).slice(0, 3);
    }
    
    const q = query.toLowerCase();
    const stopWords = ['how', 'to', 'do', 'i', 'can', 'the', 'a', 'is', 'what', 'where', 'when', 'why', 'my', 'in', 'of', 'for', 'and', 'with', 'about', 'on', 'at', 'does', 'are'];
    const queryWords = q.split(/[\s,]+/).filter(word => word.length > 2 && !stopWords.includes(word));
    
    const scoredFaqs = FAQ_DATA.map(faq => {
      let score = 0;
      const questionLower = faq.question.toLowerCase();
      const keywordsLower = (faq.keywords || "").toLowerCase();
      
      queryWords.forEach(kw => {
        if (questionLower.includes(kw) || keywordsLower.includes(kw)) score += 10;
      });
      return { faq, score };
    });

    const related = scoredFaqs
      .filter(item => item.faq.question !== excludeQuestion && item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.faq);

    if (related.length === 0) {
      return FAQ_DATA.filter(f => f.question !== excludeQuestion).sort(() => 0.5 - Math.random()).slice(0, 3);
    }
    
    let suggestions = related.slice(0, 3);
    if (suggestions.length < 3) {
      const remaining = FAQ_DATA.filter(f => f.question !== excludeQuestion && !suggestions.includes(f))
        .sort(() => 0.5 - Math.random());
      suggestions = [...suggestions, ...remaining.slice(0, 3 - suggestions.length)];
    }
    return suggestions;
  };

  useEffect(() => {
    // Initial random suggestions
    setBotSuggestedQs(getSuggestedFAQs());
  }, []);

  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const q = inputValue.toLowerCase();
      const queryWords = q.split(/[\s,]+/).filter(word => word.length > 2);
      
      const scored = FAQ_DATA.map(faq => {
        let score = 0;
        const qLower = faq.question.toLowerCase();
        const kLower = (faq.keywords || "").toLowerCase();
        
        if (qLower.includes(q)) score += 100;
        
        queryWords.forEach(kw => {
          if (qLower.includes(kw) || kLower.includes(kw)) score += 10;
        });
        return { faq, score };
      }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);
      
      setSuggestions(scored.map(item => item.faq));
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), type: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate bot thinking
    setTimeout(() => {
      findAnswer(text);
    }, 600);
  };

  const findAnswer = (query) => {
    const q = query.toLowerCase();
    
    // Stop words to ignore in keyword matching
    const stopWords = ['how', 'to', 'do', 'i', 'can', 'the', 'a', 'is', 'what', 'where', 'when', 'why', 'my', 'in', 'of', 'for', 'and', 'with', 'about', 'on', 'at', 'does', 'are'];
    const queryWords = q.split(/[\s,]+/).filter(word => word.length > 2 && !stopWords.includes(word));
    
    let bestMatch = null;
    let maxScore = 0;
    
    FAQ_DATA.forEach(faq => {
      let score = 0;
      const questionLower = faq.question.toLowerCase();
      const keywordsLower = (faq.keywords || "").toLowerCase();
      
      // Exact or partial string match gets high priority
      if (questionLower.includes(q) || q.includes(questionLower)) {
        score += 100;
      }
      
      // Keyword matching
      queryWords.forEach(kw => {
        if (questionLower.includes(kw) || keywordsLower.includes(kw)) {
          score += 10;
        }
      });
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = faq;
      }
    });

    let botResponse = "";
    let questionToExclude = "";
    if (bestMatch && maxScore > 0) {
      botResponse = bestMatch.answer;
      questionToExclude = bestMatch.question;
    } else {
      botResponse = "To best assist you, could you please provide a bit more detail? I can help with managing call batches, templates, contact insights, and system settings. Alternatively, you can contact our support team at support@bristolhealthcare.com.";
    }

    const botMsg = { id: Date.now() + 1, type: 'bot', text: botResponse, time: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setBotSuggestedQs(getSuggestedFAQs(query, questionToExclude));
  };

  const handleQuickQuestion = (faq) => {
    handleSend(faq.question);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#3B82F6] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 animate-bounce"
        >
          <MessageCircle size={32} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[400px] h-[600px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-[#EAECEF] transition-all duration-300 scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-[#3B82F6] p-6 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Help Assistant</h3>
                <p className="text-xs text-white/80">Online | Powered by AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F9FAFB]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'user' ? 'bg-[#3B82F6] ml-2' : 'bg-[#F0F2F5] mr-2'}`}>
                    {msg.type === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-[#4A4F59]" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.type === 'user' 
                      ? 'bg-[#3B82F6] text-white rounded-br-none' 
                      : 'bg-white text-[#4A4F59] border border-[#EAECEF] rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Suggestions */}
          {messages[messages.length - 1].type === 'bot' && (
            <div className="px-6 pb-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-[10px] text-[#98A2B3] uppercase font-bold tracking-widest mb-1 ml-2">Suggested Questions</p>
              <div className="flex flex-wrap gap-2">
                {botSuggestedQs.map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(faq)}
                    className="text-[11px] bg-white border border-[#D0D5DD] rounded-full px-3 py-1.5 text-[#4A4F59] hover:border-[#3B82F6] hover:bg-[#F0F5FA] hover:text-[#3B82F6] transition-all flex items-center shadow-sm"
                  >
                    {faq.question}
                    <ChevronRight size={10} className="ml-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#EAECEF] relative">
            {/* Auto-suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 w-full mb-2 px-4 z-50">
                <div className="bg-white border border-[#EAECEF] rounded-xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden max-h-48 overflow-y-auto">
                  {suggestions.map((faq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(faq)}
                      className="w-full text-left px-4 py-3 text-[13px] text-[#4A4F59] hover:bg-[#F7F8FA] hover:text-[#3B82F6] border-b border-[#F2F4F7] last:border-0 transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate pr-4 font-medium">{faq.question}</span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-[#3B82F6]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
                placeholder="Ask a question..."
                className="w-full pl-4 pr-12 py-3 bg-[#F7F8FA] border border-[#EAECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-sm"
              />
              <button 
                onClick={() => handleSend(inputValue)}
                className="absolute right-2 p-2 text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors"
                disabled={!inputValue.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpChatbot;

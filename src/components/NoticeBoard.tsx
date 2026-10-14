import React, { useState } from 'react';
import { User, Notice } from '../types';
import {
  Bell,
  PlusCircle,
  AlertCircle,
  Megaphone,
  CheckCircle,
  Calendar,
  X,
  Send,
  Sparkles
} from 'lucide-react';

interface NoticeBoardProps {
  currentUser: User;
  notices: Notice[];
  onAddNotice: (notice: Notice) => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({
  currentUser,
  notices,
  onAddNotice
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Academic' | 'Examination' | 'Event' | 'Placement' | 'Emergency'>('Academic');
  const [targetRole, setTargetRole] = useState<'all' | 'students' | 'teachers'>('all');
  const [isUrgent, setIsUrgent] = useState(false);

  const categories = ['all', 'Academic', 'Examination', 'Event', 'Placement', 'Emergency'];

  const filteredNotices = notices.filter(n => {
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
    if (currentUser.role === 'student' && n.targetRole === 'teachers') return false;
    if (currentUser.role === 'teacher' && n.targetRole === 'students') return false;
    return true;
  });

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newNotice: Notice = {
      id: `not_${Date.now()}`,
      title,
      content,
      category,
      targetRole,
      publishedDate: new Date().toISOString().split('T')[0],
      authorName: currentUser.name,
      isUrgent
    };

    onAddNotice(newNotice);
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setIsUrgent(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            <span>Autonomous Circulars & Notice Board</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Department of BCA • Official notifications, examination circulars, and event announcements
          </p>
        </div>

        {currentUser.role !== 'student' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New Notice</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl capitalize whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Circulars' : cat}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotices.map(notice => (
          <div
            key={notice.id}
            className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
              notice.isUrgent ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200/80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      notice.category === 'Examination'
                        ? 'bg-purple-100 text-purple-800'
                        : notice.category === 'Placement'
                        ? 'bg-emerald-100 text-emerald-800'
                        : notice.category === 'Event'
                        ? 'bg-blue-100 text-blue-800'
                        : notice.category === 'Emergency'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {notice.category}
                  </span>

                  {notice.isUrgent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                      Urgent Action
                    </span>
                  )}
                </div>

                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {notice.publishedDate}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-2">{notice.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line mb-4">
                {notice.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Issued by: <strong className="text-slate-700">{notice.authorName}</strong></span>
              <span className="capitalize font-medium text-blue-600">
                Audience: {notice.targetRole === 'all' ? 'All College' : notice.targetRole}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Post Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Broadcast College Notice</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostNotice} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notice Heading *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Schedule for Autonomous Internal Assessment-II"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Event">Event / Fest</option>
                    <option value="Placement">Placement</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Audience</label>
                  <select
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="all">Entire Institution</option>
                    <option value="students">Students Only</option>
                    <option value="teachers">Faculty Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Detailed Content *</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Draft the circular message, requirements, venues, and contact information..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgentFlag"
                  checked={isUrgent}
                  onChange={e => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="urgentFlag" className="font-semibold text-rose-700 cursor-pointer">
                  Mark as Urgent Notice (Highlighted alert banner)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

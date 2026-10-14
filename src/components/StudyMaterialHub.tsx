import React, { useState } from 'react';
import { User, StudyMaterial } from '../types';
import {
  BookOpen,
  Download,
  FileText,
  Search,
  Upload,
  FolderOpen,
  CheckCircle,
  FileCode,
  Archive,
  X
} from 'lucide-react';

interface StudyMaterialHubProps {
  currentUser: User;
  materials: StudyMaterial[];
  onAddMaterial: (mat: StudyMaterial) => void;
}

export const StudyMaterialHub: React.FC<StudyMaterialHubProps> = ({
  currentUser,
  materials,
  onAddMaterial
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectName, setSubjectName] = useState('Web Technology & MERN Stack');
  const [fileType, setFileType] = useState<'pdf' | 'doc' | 'slides' | 'code' | 'zip'>('pdf');
  const [fileSize, setFileSize] = useState('3.5 MB');

  const filteredMaterials = materials.filter(m => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.subjectName.toLowerCase().includes(q) ||
      m.uploadedBy.toLowerCase().includes(q)
    );
  });

  const handleDownload = (mat: StudyMaterial) => {
    setDownloadSuccess(`Initiated download for "${mat.title}"`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newMat: StudyMaterial = {
      id: `mat_${Date.now()}`,
      title,
      description,
      subjectId: 'sub_501',
      subjectName,
      semester: 5,
      uploadedBy: currentUser.name,
      uploadDate: new Date().toISOString().split('T')[0],
      fileType,
      fileSize: fileSize || '2.8 MB',
      downloads: 0
    };

    onAddMaterial(newMat);
    setIsUploadModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <FileCode className="w-5 h-5 text-emerald-600" />;
      case 'zip':
        return <Archive className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-rose-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Autonomous E-Learning & Study Material Repository</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Department of BCA • Syllabus, Lab Manuals, Question Banks & Lecture Notes
          </p>
        </div>

        {currentUser.role !== 'student' && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Learning Resource</span>
          </button>
        )}
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search study materials, subjects, syllabus or question banks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map(mat => (
          <div
            key={mat.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-slate-100 rounded-xl">{getIcon(mat.fileType)}</div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {mat.fileType.toUpperCase()} • {mat.fileSize}
                </span>
              </div>

              <span className="text-[11px] font-bold text-slate-500 block mb-1">
                {mat.subjectName}
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-2">{mat.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                {mat.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>By: {mat.uploadedBy}</span>
                <span>{mat.downloads} downloads</span>
              </div>

              <button
                onClick={() => handleDownload(mat)}
                className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resource</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Upload Study Resource</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Unit 4: Node.js Event Loop & Express Middleware"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Course / Subject *</label>
                <input
                  type="text"
                  required
                  value={subjectName}
                  onChange={e => setSubjectName(e.target.value)}
                  placeholder="e.g. Web Technology & MERN Stack"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Summarize the topics, syllabus coverage, and learning objectives..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">File Format</label>
                  <select
                    value={fileType}
                    onChange={e => setFileType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="zip">ZIP Archive</option>
                    <option value="code">Source Code / Solution</option>
                    <option value="slides">Presentation Slides</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">File Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={e => setFileSize(e.target.value)}
                    placeholder="e.g. 4.5 MB"
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
                >
                  Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

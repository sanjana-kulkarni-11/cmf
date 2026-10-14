import React, { useState } from 'react';
import { User, TimetableSlot, CollegeEvent } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Users,
  Sparkles,
  Trophy,
  Code2
} from 'lucide-react';

interface TimetableAndEventsProps {
  currentUser: User;
  timetable: TimetableSlot[];
  events: CollegeEvent[];
}

export const TimetableAndEvents: React.FC<TimetableAndEventsProps> = ({
  currentUser,
  timetable,
  events
}) => {
  const [activeTab, setActiveTab] = useState<'timetable' | 'events'>('timetable');
  const [selectedDay, setSelectedDay] = useState<
    'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  >('Monday');

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  const currentDaySlots = timetable.filter(s => s.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>Academic Timetable & Institutional Events</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Department of BCA • Class schedules, laboratory allocations, and college activities
          </p>
        </div>

        <div className="flex border border-slate-200 rounded-xl p-1 bg-slate-50">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'timetable'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Class Timetable
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            College Events ({events.length})
          </button>
        </div>
      </div>

      {activeTab === 'timetable' && (
        <div className="space-y-5">
          {/* Day Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {days.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  selectedDay === d
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Slots List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentDaySlots.map(slot => (
              <div
                key={slot.id}
                className={`p-5 rounded-2xl border transition-all ${
                  slot.type === 'Lab'
                    ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                    : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold font-mono">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {slot.time}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      slot.type === 'Lab'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {slot.type === 'Lab' ? 'Practical Lab' : 'Theory'}
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <span className="text-xs font-mono font-bold text-blue-700">
                    {slot.subjectCode}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{slot.subjectName}</h3>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slot.facultyName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slot.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(evt => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {evt.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    {evt.date}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-2">{evt.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {evt.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-600 pt-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Organizer: {evt.organizer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

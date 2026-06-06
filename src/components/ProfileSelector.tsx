/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, TestTube, Microscope, ChevronDown, Check } from 'lucide-react';

interface ProfileSelectorProps {
  currentProfile: string;
  onProfileChange: (profile: string) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ currentProfile, onProfileChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const profiles = [
    { name: 'Letícia', role: 'Iniciação Científica (IC)', icon: Microscope, color: 'text-amber-600 bg-amber-50/70 border border-amber-100' },
    { name: 'Érica', role: 'Pesquisadora', icon: TestTube, color: 'text-rose-600 bg-rose-50/70 border border-rose-100' },
  ];

  // Prevent click leak
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#profile-selector-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const activeInfo = profiles.find((p) => p.name === currentProfile) || profiles[0];
  const IconComponent = activeInfo.icon;

  return (
    <div id="profile-selector-container" className="relative">
      {/* Target active button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium bg-white hover:bg-stone-50 border border-amber-200/50 rounded-2xl shadow-xs transition-all text-slate-800"
      >
        <span className={`p-1 rounded-lg ${activeInfo.color}`}>
          <IconComponent size={14} className="stroke-[2.5]" />
        </span>
        <div className="text-left hidden sm:block">
          <p className="text-slate-800 leading-none font-bold">{currentProfile}</p>
          <p className="text-[9px] text-slate-500 font-mono tracking-wider mt-0.5">{activeInfo.role}</p>
        </div>
        <span className="text-slate-800 font-bold sm:hidden">{currentProfile}</span>
        <ChevronDown size={14} className="text-slate-400 ml-1" />
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-amber-200/60 p-2 rounded-2xl shadow-md z-30 transition-all">
          <div className="px-3 py-1.5 border-b border-stone-100 mb-1">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">
              Selecionar Identidade
            </span>
          </div>
          {profiles.map((p) => {
            const Picon = p.icon;
            const isSelected = p.name === currentProfile;
            return (
              <button
                key={p.name}
                onClick={() => {
                  onProfileChange(p.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between text-left p-2 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-amber-50/50 text-slate-850 font-bold'
                    : 'text-slate-600 hover:bg-stone-50 font-normal'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`p-1.5 rounded-lg ${p.color}`}>
                    <Picon size={14} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{p.name}</p>
                    <p className="text-[9.5px] text-slate-500 font-mono">{p.role}</p>
                  </div>
                </div>
                {isSelected && <Check size={14} className="text-amber-500 mr-1" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

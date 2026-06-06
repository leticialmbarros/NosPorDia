/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

export const ChemistryBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      
      {/* 1. TOP-BORDERS DNA DOUBLE HELIX WITH FLOWERS VINES (Reference to Image 1 top) */}
      <div className="absolute top-0 inset-x-0 h-16 opacity-30 md:opacity-45 hidden sm:block">
        <svg width="100%" height="80" className="w-full text-stone-300 dark:text-stone-800" fill="none">
          {/* We repeat helix loops with floral accents across the width */}
          <pattern id="dna-flower-pattern" width="200" height="80" patternUnits="userSpaceOnUse">
            {/* Helical wave 1 */}
            <path d="M 0 30 Q 50 10 100 30 T 200 30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Helical wave 2 */}
            <path d="M 0 30 Q 50 50 100 30 T 200 30" stroke="currentColor" strokeWidth="1.5" />
            
            {/* Helical connectors (hydrogen bonds as cute dots or lines) */}
            <line x1="25" y1="20" x2="25" y2="40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="75" y1="20" x2="75" y2="40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="125" y1="20" x2="125" y2="40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="175" y1="20" x2="175" y2="40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />

            {/* Little aesthetic flowers growing on the wave intersection (pink and yellow wild buds) */}
            <circle cx="50" cy="20" r="4" className="fill-rose-300 stroke-rose-400" strokeWidth="0.5" />
            <path d="M 47 20 Q 50 15 53 20" className="stroke-green-400" strokeWidth="1" />
            
            <circle cx="150" cy="40" r="3" className="fill-amber-300 stroke-amber-400" strokeWidth="0.5" />
            <path d="M 147 40 Q 150 45 153 40" className="stroke-green-400" strokeWidth="1" />

            {/* Little leaves wrapping around */}
            <path d="M 10 30 C 15 25, 20 28, 25 30 C 20 32, 15 35, 10 30 Z" className="fill-green-200/60 stroke-green-400/50" strokeWidth="0.5" />
            <path d="M 110 30 C 115 35, 120 32, 125 30 C 120 28, 115 25, 110 30 Z" className="fill-green-200/60 stroke-green-400/50" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="80" fill="url(#dna-flower-pattern)" />
        </svg>
      </div>

      {/* 2. RIGHT-SIDE VERTICAL FLOWERING DNA STRAND (Reference to Image 1 right side) */}
      <div className="absolute right-0 top-24 bottom-24 w-12 md:w-20 opacity-30 md:opacity-40 hidden lg:block">
        <svg width="80" height="100%" className="h-full text-stone-300 dark:text-stone-800" fill="none">
          <pattern id="dna-vertical" width="80" height="240" patternUnits="userSpaceOnUse">
            {/* DNA vertical wave 1 */}
            <path d="M 30 0 Q 10 60 30 120 T 30 240" stroke="currentColor" strokeWidth="1.5" />
            {/* DNA vertical wave 2 */}
            <path d="M 30 0 Q 50 60 30 120 T 30 240" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" />
            
            {/* Horizontal bonds */}
            <line x1="20" y1="30" x2="40" y2="30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="15" y1="90" x2="45" y2="90" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="15" y1="150" x2="45" y2="150" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="20" y1="210" x2="40" y2="210" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />

            {/* Delicate multi-colored Flowers growing on the helix */}
            <g transform="translate(30, 60)">
              <circle cx="0" cy="0" r="5" className="fill-rose-400/40 stroke-rose-500" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.5" className="fill-amber-300" />
              {/* Petals */}
              <circle cx="-5" cy="0" r="2.5" className="fill-rose-300/50" />
              <circle cx="5" cy="0" r="2.5" className="fill-rose-300/50" />
              <circle cx="0" cy="-5" r="2.5" className="fill-rose-300/50" />
              <circle cx="0" cy="5" r="2.5" className="fill-rose-300/50" />
            </g>

            <g transform="translate(30, 180)">
              <circle cx="0" cy="0" r="4" className="fill-amber-400/40 stroke-amber-500" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1" className="fill-rose-300" />
              {/* Petals */}
              <path d="M -3 -3 Q 0 -8 3 -3" className="stroke-amber-400" strokeWidth="1.5" />
              <path d="M -3 3 Q 0 8 3 3" className="stroke-amber-400" strokeWidth="1.5" />
            </g>

            {/* Climbing green leafy vines wrappers */}
            <path d="M 30 0 C 45 40, 20 80, 30 120 C 40 160, 15 200, 30 240" className="stroke-emerald-400/40" strokeWidth="1.2" />
          </pattern>
          <rect width="80" height="100%" fill="url(#dna-vertical)" />
        </svg>
      </div>

      {/* 3. BOTTOM-LEFT CORNER: SYSTEMATIC LAB VESSLES SPROUTING BEAUTIFUL FLOWERS (Image 1 Bottom) */}
      <div className="absolute left-4 bottom-4 w-64 h-48 opacity-35 md:opacity-[0.55] hidden md:block z-0">
        <svg viewBox="0 0 240 180" width="100%" height="100%" className="text-stone-400" fill="none">
          {/* Flask 1: Erlenmeyer with rose liquid and heart steam */}
          <g transform="translate(15, 60)">
            {/* Heart bubble rising */}
            <motion.path
              animate={{ y: [0, -15, 0], scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              d="M 15 -10 C 12 -15, 8 -15, 5 -12 C 2 -9, 2 -5, 8 -1 C 14 -5, 14 -9, 11 -12 C 8 -15, 15 -10, 15 -10 Z"
              className="fill-rose-450/40 stroke-rose-500"
              strokeWidth="0.7"
            />
            
            {/* Flask glass structure */}
            <path d="M 23 20 L 23 5 Q 23 3 20 3 L 14 3 Q 11 3 11 5 L 11 20 L 2 55 Q 0 60 5 60 L 29 60 Q 34 60 32 55 Z" stroke="currentColor" strokeWidth="1.5" />
            {/* Liquid level */}
            <path d="M 6 45 L 28 45 Q 31 52 29 58 L 5 58 Q 3 52 6 45 Z" className="fill-rose-300/40 dark:fill-rose-950/20 stroke-rose-400/80" strokeWidth="1" />
            
            {/* Flower growing out of the flask mouth */}
            <path d="M 17 -8 Q 23 -24 35 -24" className="stroke-emerald-400" strokeWidth="1.5" />
            <g transform="translate(35, -24)">
              <circle cx="0" cy="0" r="4" className="fill-rose-400/60 stroke-rose-500" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1" className="fill-white" />
              <path d="M-8 0 Q0 -6 8 0 T -8 0" className="fill-rose-300/40" />
            </g>
          </g>

          {/* Flask 2: Round bottom boiling flask with Yellow liquid (Curcumina essence) (Image 1 bottom central) */}
          <g transform="translate(85, 45)">
            {/* Clouds of vapor */}
            <motion.path
              animate={{ x: [0, 4, 0], y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              d="M 15 -5 Q 20 -15 30 -5 T 45 -5"
              className="stroke-amber-300"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            {/* Flask glass */}
            <path d="M 16 18 L 16 3 Q 16 1 14 1 L 20 1 Q 18 1 18 3 L 18 18 A 20 20 0 1 1 15.9 18.1 Z" stroke="currentColor" strokeWidth="1.5" />
            {/* Glowing Golden solution inside */}
            <circle cx="17" cy="36" r="16" className="fill-amber-300/35 dark:fill-amber-950/25 stroke-amber-400/60" strokeWidth="1" />

            {/* Big scientific flower blooming upwards */}
            <path d="M 17 -5 Q 12 -25 5 -35 Q 20 -40 28 -48" className="stroke-emerald-500" strokeWidth="1.5" />
            <g transform="translate(28, -48)">
              {/* Petals of Curcumin Blossom */}
              <path d="M 0 0 C 10 -10, 20 -5, 10 10 C 0 20, -10 10, 0 0 Z" className="fill-amber-400/80 stroke-amber-500" strokeWidth="1" />
              <path d="M 0 0 C -10 -10, -20 -5, -10 10 C 0 20, 10 10, 0 0 Z" className="fill-rose-400/70 stroke-rose-500" strokeWidth="1" />
              <circle cx="0" cy="5" r="3.5" className="fill-yellow-300" />
            </g>
          </g>

          {/* Vessel 3: Graduation Cylinder / Beaker with flower growing (Image 1 Bottom right vessel) */}
          <g transform="translate(155, 55)">
            {/* Cylinder Glass outline */}
            <path d="M 10 1 Q 12 1 12 3 L 12 60 L 32 60 L 32 3 Q 32 1 34 1" stroke="currentColor" strokeWidth="1.5" />
            <line x1="21" y1="15" x2="27" y2="15" stroke="currentColor" strokeWidth="1" />
            <line x1="21" y1="28" x2="27" y2="28" stroke="currentColor" strokeWidth="1" />
            <line x1="21" y1="42" x2="27" y2="42" stroke="currentColor" strokeWidth="1" />
            
            {/* Blue-Green Bio-Solution */}
            <rect x="13" y="24" width="18" height="35" className="fill-cyan-300/30 dark:fill-cyan-950/20 stroke-cyan-400/60" strokeWidth="1" />

            {/* Beautiful leafy vine springing from within */}
            <path d="M 22 24 Q 35 -8 40 -30" className="stroke-green-500" strokeWidth="1.5" />
            {/* Green Leaves */}
            <path d="M 28 8 Q 38 12 35 1" className="fill-green-300/70" />
            <path d="M 33 -10 Q 23 -15 25 -2" className="fill-green-300/70" />

            {/* Beautiful Daisy Flower head */}
            <g transform="translate(40, -30)">
              {/* Petals */}
              <circle cx="-5" cy="-5" r="4.5" className="fill-purple-300/60 stroke-purple-400" strokeWidth="0.5" />
              <circle cx="5" cy="-5" r="4.5" className="fill-purple-300/60 stroke-purple-400" strokeWidth="0.5" />
              <circle cx="-5" cy="5" r="4.5" className="fill-purple-300/60 stroke-purple-400" strokeWidth="0.5" />
              <circle cx="5" cy="5" r="4.5" className="fill-purple-300/60 stroke-purple-400" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="4" className="fill-yellow-400" />
            </g>
          </g>
        </svg>
      </div>

      {/* 4. FLOATING PERIODIC TABLE STICKERS / SEEDS (Image 2 right boundary style) */}
      <div className="absolute right-3 md:right-6 top-1/4 space-y-8 pointer-events-auto hidden md:block select-none">
        
        {/* GOLD / Au periodic tile sticker */}
        <motion.div
          animate={{ y: [0, -4, 0], rotate: [3, 4, 3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 bg-rose-50 dark:bg-[#2A1518] text-rose-800 dark:text-rose-450 border border-rose-250 dark:border-rose-950 p-1 rounded-sm text-center font-mono shadow-3xs leading-none cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="text-[7px] text-rose-500 flex justify-between px-0.5">
            <span>79</span>
            <span>197</span>
          </div>
          <div className="text-sm font-bold mt-1">Au</div>
          <div className="text-[6.5px] opacity-75 uppercase tracking-wide">gold</div>
        </motion.div>

        {/* SCANDIUM / Sc block */}
        <motion.div
          animate={{ y: [0, 4, 0], rotate: [-4, -2, -4] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="w-12 h-12 bg-amber-50/70 dark:bg-[#231E16] text-amber-800 dark:text-amber-450 border border-amber-200 p-1 rounded-sm text-center font-mono shadow-3xs leading-none cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="text-[7px] text-amber-600 flex justify-between px-0.5">
            <span>21</span>
            <span>44.9</span>
          </div>
          <div className="text-sm font-bold mt-1">Sc</div>
          <div className="text-[6px] opacity-75 uppercase tracking-wide">scandium</div>
        </motion.div>

        {/* CUSTOM INVENTED ELEMENT: Cc / Curcumina! */}
        <motion.div
          animate={{ y: [0, -3, 0], rotate: [6, 4, 6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="w-12 h-12 bg-amber-100/55 dark:bg-[#302115] text-amber-900 dark:text-amber-400 border border-amber-300 p-1 rounded-sm text-center font-mono shadow-3xs leading-none cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="text-[7px] text-amber-700 flex justify-between px-0.5">
            <span>21</span>
            <span>&infin;</span>
          </div>
          <div className="text-sm font-bold mt-1">Cc</div>
          <div className="text-[5.5px] opacity-80 uppercase tracking-tight font-bold">curcumina</div>
        </motion.div>

        {/* CUTE MOLECULE OUTLINE */}
        <div className="w-12 h-12 flex items-center justify-center text-rose-300 dark:text-stone-850 opacity-40">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="5" r="2.5" fill="currentColor" />
            <circle cx="5" cy="12" r="2.5" fill="currentColor" />
            <circle cx="19" cy="12" r="2.5" fill="currentColor" />
            <circle cx="12" cy="19" r="2.5" fill="currentColor" />
            <line x1="12" y1="7.5" x2="12" y2="16.5" />
            <line x1="7.5" y1="12" x2="16.5" y2="12" />
          </svg>
        </div>
      </div>

      {/* 5. CUTE MICROSCOPE WITH MOLECULAR HEART (Reference to Image 2 bottom left) */}
      <div className="absolute right-12 bottom-6 w-32 h-32 opacity-25 md:opacity-35 hidden xl:block">
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="text-rose-400 dark:text-stone-800" fill="none">
          {/* Microscope body */}
          <path d="M 20 85 L 80 85 M 35 85 L 35 75 C 35 55, 55 45, 55 25" stroke="currentColor" strokeWidth="2.5" />
          
          {/* Eyepiece / Lens barrel */}
          <path d="M 50 15 L 60 25" stroke="currentColor" strokeWidth="2.5" />
          <path d="M 42 22 L 54 34" stroke="currentColor" strokeWidth="3" />
          
          {/* Adjuster knob */}
          <circle cx="35" cy="65" r="4" stroke="currentColor" strokeWidth="2" fill="white" />
          
          {/* Slide stage with a glowing Heart slide */}
          <line x1="30" y1="52" x2="58" y2="52" stroke="currentColor" strokeWidth="3" />
          <g transform="translate(42, 45)">
            <motion.path
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              d="M 4 4 C 3 2, 1 2, 0 3 C -1 2, -3 2, -4 4 C -4 6, -2 8, 0 10 C 2 8, 4 6, 4 4 Z"
              className="fill-rose-500/80 stroke-rose-600"
              strokeWidth="0.5"
            />
          </g>

          {/* Cute face expression on base to look "Kawaii" inspired by Image 2 microscope base */}
          <g transform="translate(62, 75)">
            {/* Smiling mouth and eyes */}
            <path d="M -15 0 Q -10 -5 -5 0" stroke="currentColor" strokeWidth="1" />
            <circle cx="-18" cy="-5" r="1.5" fill="currentColor" />
            <circle cx="-2" cy="-5" r="1.5" fill="currentColor" />
            {/* Cute pink cheek */}
            <circle cx="-20" cy="-2" r="1.5" className="fill-rose-300" />
            <circle cx="0" cy="-2" r="1.5" className="fill-rose-300" />
          </g>
        </svg>
      </div>

    </div>
  );
};

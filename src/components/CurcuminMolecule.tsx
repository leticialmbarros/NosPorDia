/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface CurcuminMoleculeProps {
  className?: string;
  interactive?: boolean;
}

export const CurcuminMolecule: React.FC<CurcuminMoleculeProps> = ({ className = '', interactive = false }) => {
  // Let's model a beautiful, stylized chemical formula structure of Curcumin
  // (1E,6E)-1,7-bis(4-hydroxy-3-methoxyphenyl)hepta-1,6-diene-3,5-dione
  const atoms = [
    // Left Phenol Ring
    { id: 'left-oh', x: 40, y: 150, label: 'OH', color: 'text-orange-500' },
    { id: 'left-c4', x: 90, y: 150, label: 'C' },
    { id: 'left-c3', x: 115, y: 110, label: 'C' },
    { id: 'left-och3', x: 100, y: 60, label: 'OCH₃', color: 'text-amber-500 font-sans' },
    { id: 'left-c2', x: 165, y: 110, label: 'C' },
    { id: 'left-c1', x: 190, y: 150, label: 'C' },
    { id: 'left-c6', x: 165, y: 190, label: 'C' },
    { id: 'left-c5', x: 115, y: 190, label: 'C' },

    // Aliphatic chain
    { id: 'chain-c7', x: 240, y: 150, label: 'CH' },
    { id: 'chain-c8', x: 280, y: 120, label: 'CH' },
    { id: 'chain-c9', x: 330, y: 140, label: 'C=O', color: 'text-orange-600 font-semibold' },
    { id: 'chain-c10', x: 380, y: 110, label: 'CH₂' },
    { id: 'chain-c11', x: 430, y: 140, label: 'C=O', color: 'text-orange-600 font-semibold' },
    { id: 'chain-c12', x: 480, y: 120, label: 'CH' },
    { id: 'chain-c13', x: 520, y: 150, label: 'CH' },

    // Right Phenol Ring
    { id: 'right-c1', x: 570, y: 150, label: 'C' },
    { id: 'right-c2', x: 595, y: 110, label: 'C' },
    { id: 'right-och3', x: 580, y: 60, label: 'OCH₃', color: 'text-amber-500 font-sans' },
    { id: 'right-c3', x: 645, y: 110, label: 'C' },
    { id: 'right-c4', x: 670, y: 150, label: 'C' },
    { id: 'right-oh', x: 720, y: 150, label: 'OH', color: 'text-orange-500' },
    { id: 'right-c5', x: 645, y: 190, label: 'C' },
    { id: 'right-c6', x: 595, y: 190, label: 'C' },
  ];

  const bonds = [
    // Left Phenol Ring Bonds
    { from: 'left-oh', to: 'left-c4', type: 'single' },
    { from: 'left-c4', to: 'left-c3', type: 'single' },
    { from: 'left-c3', to: 'left-och3', type: 'single' },
    { from: 'left-c3', to: 'left-c2', type: 'double' },
    { from: 'left-c2', to: 'left-c1', type: 'single' },
    { from: 'left-c1', to: 'left-c6', type: 'double' },
    { from: 'left-c6', to: 'left-c5', type: 'single' },
    { from: 'left-c5', to: 'left-c4', type: 'double' },

    // Chain links
    { from: 'left-c1', to: 'chain-c7', type: 'single' },
    { from: 'chain-c7', to: 'chain-c8', type: 'double' },
    { from: 'chain-c8', to: 'chain-c9', type: 'single' },
    { from: 'chain-c9', to: 'chain-c10', type: 'single' },
    { from: 'chain-c10', to: 'chain-c11', type: 'single' },
    { from: 'chain-c11', to: 'chain-c12', type: 'single' },
    { from: 'chain-c12', to: 'chain-c13', type: 'double' },
    { from: 'chain-c13', to: 'right-c1', type: 'single' },

    // Right Phenol Ring Bonds
    { from: 'right-c1', to: 'right-c2', type: 'double' },
    { from: 'right-c2', to: 'right-och3', type: 'single' },
    { from: 'right-c2', to: 'right-c3', type: 'single' },
    { from: 'right-c3', to: 'right-c4', type: 'double' },
    { from: 'right-c4', to: 'right-oh', type: 'single' },
    { from: 'right-c4', to: 'right-c5', type: 'single' },
    { from: 'right-c5', to: 'right-c6', type: 'double' },
    { from: 'right-c6', to: 'right-c1', type: 'single' },
  ];

  return (
    <div className={`overflow-visible relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 760 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[180px] md:max-h-none text-slate-300 dark:text-slate-700"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Render Bonds as Lines */}
        {bonds.map((bond, idx) => {
          const fromAtom = atoms.find((a) => a.id === bond.from);
          const toAtom = atoms.find((a) => a.id === bond.to);
          if (!fromAtom || !toAtom) return null;

          if (bond.type === 'double') {
            const dx = toAtom.x - fromAtom.x;
            const dy = toAtom.y - fromAtom.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            // normal offset vector
            const ox = (-dy / len) * 4;
            const oy = (dx / len) * 4;

            return (
              <g key={`bond-${idx}`}>
                <line
                  x1={fromAtom.x + ox}
                  y1={fromAtom.y + oy}
                  x2={toAtom.x + ox}
                  y2={toAtom.y + oy}
                  className="stroke-amber-400/50 dark:stroke-amber-600/30"
                  strokeWidth="1.5"
                />
                <line
                  x1={fromAtom.x - ox}
                  y1={fromAtom.y - oy}
                  x2={toAtom.x - ox}
                  y2={toAtom.y - oy}
                  className="stroke-amber-500/80 dark:stroke-amber-600/60"
                  strokeWidth="1.5"
                />
              </g>
            );
          }

          // Single bond
          return (
            <line
              key={`bond-${idx}`}
              x1={fromAtom.x}
              y1={fromAtom.y}
              x2={toAtom.x}
              y2={toAtom.y}
              className="stroke-amber-400/40 dark:stroke-amber-700/30"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Render Atoms as circular nodes with text key */}
        {atoms.map((atom) => {
          const isSpecial = atom.label !== 'C' && atom.label !== 'CH' && atom.label !== 'CH₂';
          return (
            <g key={atom.id} className={interactive ? 'pointer-events-auto cursor-pointer' : ''}>
              {/* Outer Glow for Bioactive functional groups */}
              {isSpecial && (
                <circle
                  cx={atom.x}
                  cy={atom.y}
                  r="14"
                  className="fill-amber-100/50 dark:fill-amber-950/20 stroke-amber-200/50 dark:stroke-amber-800/20"
                />
              )}

              {/* Central Atomic core */}
              <circle
                cx={atom.x}
                cy={atom.y}
                r={isSpecial ? 8 : 4}
                className={
                  isSpecial
                    ? 'fill-amber-500 dark:fill-amber-600'
                    : 'fill-slate-400 dark:fill-slate-500'
                }
              />

              {/* Atom Label */}
              {isSpecial && (
                <text
                  x={atom.x}
                  y={atom.y + 24}
                  textAnchor="middle"
                  className={`text-[10px] font-mono tracking-tight ${
                    atom.color || 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {atom.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Floating Molecular Hearts (Chemistry & Romance Synthesis) */}
        <motion.g
          animate={{ y: [0, -7, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Heart near left-oh phenol group */}
          <path
            d="M 40 125 C 35 120, 30 120, 30 125 C 30 130, 40 138, 40 138 C 40 138, 50 130, 50 125 C 50 120, 45 120, 40 125 Z"
            className="fill-rose-500/40 dark:fill-rose-500/25 stroke-rose-500/80 dark:stroke-rose-450/60"
            strokeWidth="1.2"
          />
        </motion.g>

        <motion.g
          animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          {/* Heart near central aliphatic chain dione linkage */}
          <path
            d="M 380 75 C 375 70, 370 70, 370 75 C 370 80, 380 88, 380 88 C 380 88, 390 80, 390 75 C 390 70, 385 70, 380 75 Z"
            className="fill-rose-500/50 dark:fill-rose-500/30 stroke-rose-400 dark:stroke-rose-450/70"
            strokeWidth="1.2"
          />
        </motion.g>

        <motion.g
          animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          {/* Heart near right-oh phenol group */}
          <path
            d="M 720 125 C 715 120, 710 120, 710 125 C 710 130, 720 138, 720 138 C 720 138, 730 130, 730 125 C 730 120, 725 120, 720 125 Z"
            className="fill-rose-500/40 dark:fill-rose-500/25 stroke-rose-500/80 dark:stroke-rose-450/60"
            strokeWidth="1.2"
          />
        </motion.g>
      </svg>
    </div>
  );
};

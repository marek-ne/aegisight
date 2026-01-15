import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { IngestionVisual } from '../components/stages/IngestionVisual';
import { FingerprintVisual } from '../components/stages/FingerprintVisual';
import { SignatureVisual } from '../components/stages/SignatureVisual';
import { PhysicsGateVisual } from '../components/stages/PhysicsGateVisual';
import { OutputVisual } from '../components/stages/OutputVisual';
import '../index.css';

const registry: Record<string, React.FC> = {
    'visual-ingestion': IngestionVisual,
    'visual-fingerprint': FingerprintVisual,
    'visual-signature': SignatureVisual,
    'visual-physics': PhysicsGateVisual,
    'visual-output': OutputVisual,
};

// Wrapper to mimic the Visualizer container style
const CardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="relative w-full h-full flex items-center justify-center bg-[#050505] text-slate-200 overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="relative z-10 w-full h-full aspect-[4/3] flex items-center justify-center p-2">
            {children}
        </div>
    </div>
);

// Store roots to allow unmounting
const roots: Record<string, Root> = {};

const mount = (id: string, domId: string) => {
    const container = document.getElementById(domId);
    if (!container) return;

    const Component = registry[id];
    if (!Component) return;

    // If already mounted, do nothing (or could remount to restart animation)
    if (roots[domId]) {
        // To strict restart animation, we might want to unmount first
        roots[domId].unmount();
        delete roots[domId];
    }

    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <CardWrapper>
                <Component />
            </CardWrapper>
        </React.StrictMode>
    );
    roots[domId] = root;
    console.log(`[Aegisight Widget] Mounted ${id} into ${domId}`);
};

const unmount = (domId: string) => {
    if (roots[domId]) {
        roots[domId].unmount();
        delete roots[domId];
        console.log(`[Aegisight Widget] Unmounted ${domId}`);
    }
};

// Expose API
(window as any).AegisightWidget = {
    mount,
    unmount
};

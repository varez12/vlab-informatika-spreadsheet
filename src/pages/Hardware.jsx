import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF, Html } from '@react-three/drei'
import { Settings } from 'lucide-react';

const models = {
    Memory: {
        url: '/assets/Memory.glb',
        label: 'RAM Memory',
        desc: 'Menyimpan data sementara.',
        scale: 1,
        rotation: [0, 0, 0] // Face forward 
    },
    Motherboard: {
        url: '/assets/Motherboard.glb',
        label: 'Motherboard',
        desc: 'Papan sirkuit utama.',
        scale: 1,
        rotation: [-Math.PI / 6, 0, 0] // Tilt down to show top with slots
    },
    SSD: {
        url: '/assets/SSD.glb',
        label: 'Storage (SSD)',
        desc: 'Media penyimpanan data cepat.',
        scale: 1,
        rotation: [Math.PI, Math.PI, 0] // Flip on X and Y to show label side horizontal
    },
    VGA: {
        url: '/assets/VGA.glb',
        label: 'Graphics Card',
        desc: 'Pemroses grafis (GPU).',
        scale: 1,
        rotation: [0, Math.PI / 4, 0] // Angle to show fans from front side
    },
    Processor: {
        url: '/assets/Processor.glb',
        label: 'Processor (CPU)',
        desc: 'Otak komputer. Memproses semua perintah.',
        scale: 1,
        rotation: [Math.PI, 0, 0] // Flip to show IHS (metal top)
    },
    PowerSupply: {
        url: '/assets/Power_supply.glb',
        label: 'Power Supply',
        desc: 'Sumber daya listrik komponen komputer.',
        scale: 1,
        rotation: [Math.PI, Math.PI / 4, 0] // Flip and angle to show fan side
    },
};

function HardwareModel({ config }) {
    const { scene } = useGLTF(config.url)
    return <primitive
        object={scene}
        scale={config.scale || 1}
        rotation={config.rotation || [0, 0, 0]}
    />
}

// Fallback Box if models fail
function FallbackBox() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="hotpink" />
        </mesh>
    )
}

export default function Hardware() {
    const [selected, setSelected] = useState('Memory');

    return (
        <div className="w-full h-full bg-[#050510] relative flex flex-col">


            <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 5] }}>
                <color attach="background" args={['#050510']} />

                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Suspense fallback={<Html center><div className="text-white font-bold animate-pulse">Memuat 3D...</div></Html>}>
                    <Stage environment="city" intensity={0.5} adjustCamera={1}>
                        <HardwareModel config={models[selected]} />
                    </Stage>
                </Suspense>

                <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
            </Canvas>

            {/* UI Overlay */}
            {/* UI Overlay */}

            {/* 1. Header (Top Left) */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 pointer-events-none">
                <div className="pointer-events-auto">
                    <h1 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 text-indigo-400">
                        <Settings className="animate-spin-slow w-5 h-5 md:w-6 md:h-6" /> HARDWARE 3D
                    </h1>
                    <p className="text-xs md:text-sm text-white/60 mt-1">Jelajahi komponen komputer:</p>
                </div>
            </div>

            {/* 2. Info Box (Bottom on Mobile above menu, Bottom Left on Desktop) */}
            <div className="absolute bottom-24 left-4 right-4 md:top-auto md:bottom-8 md:left-8 md:right-auto w-auto md:w-64 z-10 pointer-events-none">
                <div className="bg-black/60 p-4 rounded-xl border border-white/10 backdrop-blur-md pointer-events-auto shadow-2xl">
                    <p className="text-indigo-300 font-bold mb-1 text-lg">{models[selected].label}</p>
                    <p className="text-xs text-white/80 leading-relaxed">{models[selected].desc}</p>
                </div>
            </div>

            {/* 3. Navigation Menu (Bottom Horizontal on Mobile, Left Vertical on Desktop) */}
            <div className="absolute bottom-4 left-0 w-full md:top-28 md:bottom-auto md:left-8 md:w-64 z-20 pointer-events-none">
                <div className="flex flex-row md:flex-col gap-3 px-4 md:px-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0 pointer-events-auto snap-x">
                    {Object.keys(models).map((key) => (
                        <button
                            key={key}
                            onClick={() => setSelected(key)}
                            className={`shrink-0 px-4 py-3 md:py-3 rounded-xl text-left font-bold transition-all flex items-center gap-3 border backdrop-blur-sm snap-start ${selected === key
                                ? 'bg-indigo-600 border-indigo-500 shadow-lg scale-105 ring-2 ring-indigo-400/50'
                                : 'bg-white/10 border-white/10 hover:bg-white/20 text-white/70'
                                }`}
                        >
                            <span className="text-sm md:text-base whitespace-nowrap">{models[key].label}</span>
                            {selected === key && <div className="w-2 h-2 bg-white rounded-full animate-pulse shrink-0" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. Controls Hint (Hidden on small mobile, visible on larger screens) */}
            <div className="hidden md:block absolute bottom-8 right-8 text-white/30 text-xs text-right pointer-events-none select-none">
                <p>Kiri Klik + Drag: Putar</p>
                <p>Scroll: Zoom</p>
            </div>
        </div>
    )
}

// Preload for faster switching
Object.values(models).forEach(m => useGLTF.preload(m.url));

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
        <div className="w-full h-screen bg-[#050510] relative flex flex-col">


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
            <div className="absolute top-20 left-6 text-white space-y-4 max-w-xs pointer-events-none">
                <div className="pointer-events-auto">
                    <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2 text-indigo-400">
                        <Settings className="animate-spin-slow" /> HARDWARE 3D
                    </h1>
                    <p className="text-sm opacity-60">Pilih komponen:</p>
                </div>

                <div className="flex flex-col gap-2 pointer-events-auto">
                    {Object.keys(models).map((key) => (
                        <button
                            key={key}
                            onClick={() => setSelected(key)}
                            className={`px-4 py-3 rounded-xl text-left font-bold transition-all flex items-center justify-between border ${selected === key
                                ? 'bg-indigo-600 border-indigo-500 shadow-lg scale-105'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <span>{models[key].label}</span>
                            {selected === key && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                        </button>
                    ))}
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-white/10 backdrop-blur-md mt-4 pointer-events-auto">
                    <p className="text-indigo-300 font-bold mb-1">{models[selected].label}</p>
                    <p className="text-xs opacity-80 leading-relaxed">{models[selected].desc}</p>
                </div>
            </div>

            <div className="absolute bottom-6 right-6 text-white/30 text-xs text-right pointer-events-none">
                <p>Kiri Klik + Drag: Putar</p>
                <p>Scroll: Zoom</p>
            </div>
        </div>
    )
}

// Preload for faster switching
Object.values(models).forEach(m => useGLTF.preload(m.url));

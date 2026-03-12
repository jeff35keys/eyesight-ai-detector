import { motion } from 'framer-motion';

const layers = [
  { label: 'Input\n224×224×3', w: 60, h: 100, color: 'hsl(var(--medical-teal))' },
  { label: 'Conv2D\n32 filters', w: 50, h: 90, color: 'hsl(var(--medical-blue))' },
  { label: 'Pool\n112×112', w: 40, h: 70, color: 'hsl(var(--medical-cyan))' },
  { label: 'Conv2D\n64 filters', w: 45, h: 80, color: 'hsl(var(--medical-blue))' },
  { label: 'Pool\n56×56', w: 35, h: 60, color: 'hsl(var(--medical-cyan))' },
  { label: 'Conv2D\n128 filters', w: 40, h: 70, color: 'hsl(var(--medical-blue))' },
  { label: 'Pool\n28×28', w: 30, h: 50, color: 'hsl(var(--medical-cyan))' },
  { label: 'Conv2D\n256 filters', w: 35, h: 60, color: 'hsl(var(--medical-blue))' },
  { label: 'GAP', w: 25, h: 30, color: 'hsl(var(--medical-green))' },
  { label: 'Dense\n512', w: 30, h: 40, color: 'hsl(var(--accent))' },
  { label: 'Dense\n256', w: 25, h: 35, color: 'hsl(var(--accent))' },
  { label: 'Output\n4 classes', w: 30, h: 30, color: 'hsl(var(--medical-teal))' },
];

export function CNNDiagram() {
  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="flex items-center gap-2 min-w-[800px] justify-center px-4">
        {layers.map((layer, i) => (
          <div key={i} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="rounded-lg flex items-center justify-center shadow-md border border-white/20"
                style={{ width: layer.w, height: layer.h, background: layer.color }}
              >
                <span className="text-[9px] text-white font-medium text-center leading-tight whitespace-pre-line px-1">
                  {layer.label}
                </span>
              </div>
            </motion.div>
            {i < layers.length - 1 && (
              <div className="w-4 h-0.5 bg-border mx-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

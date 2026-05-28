// Pure-SVG charts, theme-aware

const Sparkline = ({ data, width = 120, height = 40, color, fill = true }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + h - ((v - min) / range) * h;
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ');
  const area = path + ` L ${pts[pts.length - 1][0].toFixed(2)},${height} L ${pts[0][0].toFixed(2)},${height} Z`;
  const id = React.useId();
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${id})`} />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const AreaChart = ({ data, height = 240, color = 'var(--accent)', labels, title }) => {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState({ w: 600, h: height });
  const [hover, setHover] = React.useState(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setSize({ w: e.contentRect.width, h: height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [height]);

  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;
  const padL = 44, padR = 12, padT = 16, padB = 26;
  const w = size.w - padL - padR;
  const h = size.h - padT - padB;
  const pts = data.map((v, i) => {
    const x = padL + (i / (data.length - 1)) * w;
    const y = padT + h - ((v - min) / range) * h;
    return [x, y];
  });
  const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ');
  const area = line + ` L ${pts[pts.length - 1][0].toFixed(2)},${padT + h} L ${pts[0][0].toFixed(2)},${padT + h} Z`;

  const gridLines = 4;
  const yTicks = Array.from({ length: gridLines + 1 }, (_, i) => min + (range * i / gridLines));
  const id = React.useId();

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.round(((x - padL) / w) * (data.length - 1));
    const clamped = Math.max(0, Math.min(data.length - 1, idx));
    setHover(clamped);
  };

  return (
    <div ref={ref} style={{ width: '100%', position: 'relative' }}>
      <svg width={size.w} height={size.h} style={{ display: 'block' }} onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* grid + axis labels */}
        {yTicks.map((t, i) => {
          const y = padT + h - ((t - min) / range) * h;
          return (
            <g key={i}>
              <line x1={padL} x2={padL + w} y1={y} y2={y} stroke="var(--border)" strokeDasharray={i === 0 ? '0' : '3 3'} strokeWidth="1" />
              <text x={padL - 8} y={y + 3} fontSize="10" fill="var(--text-mute)" textAnchor="end" fontFamily="inherit">
                {t >= 1000 ? (t / 1000).toFixed(1) + 'k' : Math.round(t)}
              </text>
            </g>
          );
        })}
        {/* x labels */}
        {labels && [0, Math.floor(data.length / 3), Math.floor(data.length * 2 / 3), data.length - 1].map(i => (
          <text key={i} x={padL + (i / (data.length - 1)) * w} y={size.h - 6} fontSize="10" fill="var(--text-mute)" textAnchor="middle" fontFamily="inherit">
            {labels[i]}
          </text>
        ))}
        <path d={area} fill={`url(#${id})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* hover */}
        {hover !== null && (
          <g>
            <line x1={pts[hover][0]} x2={pts[hover][0]} y1={padT} y2={padT + h} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <circle cx={pts[hover][0]} cy={pts[hover][1]} r="5" fill="var(--bg-elev)" stroke={color} strokeWidth="2" />
          </g>
        )}
      </svg>
      {hover !== null && (
        <div style={{
          position: 'absolute',
          left: Math.min(pts[hover][0] + 10, size.w - 120),
          top: pts[hover][1] - 8,
          background: 'var(--bg-elev)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '6px 10px',
          fontSize: 12,
          boxShadow: 'var(--shadow-md)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ color: 'var(--text-mute)', fontSize: 11 }}>{labels ? labels[hover] : `Day ${hover + 1}`}</div>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{data[hover].toLocaleString()}</div>
        </div>
      )}
    </div>
  );
};

const BarChart = ({ data, height = 200, color = 'var(--accent)', labels }) => {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(600);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(es => setW(es[0].contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const max = Math.max(...data) * 1.1;
  const padL = 36, padR = 12, padT = 10, padB = 26;
  const innerW = w - padL - padR;
  const innerH = height - padT - padB;
  const gap = 6;
  const barW = (innerW - gap * (data.length - 1)) / data.length;
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={height}>
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = padT + innerH - t * innerH;
          return (
            <g key={i}>
              <line x1={padL} x2={padL + innerW} y1={y} y2={y} stroke="var(--border)" strokeDasharray={t === 0 ? '0' : '3 3'} />
              <text x={padL - 8} y={y + 3} fontSize="10" fill="var(--text-mute)" textAnchor="end" fontFamily="inherit">{Math.round(max * t)}</text>
            </g>
          );
        })}
        {data.map((v, i) => {
          const barH = (v / max) * innerH;
          const x = padL + i * (barW + gap);
          const y = padT + innerH - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} rx="4" fill={color} opacity="0.9" />
              {labels && <text x={x + barW / 2} y={height - 8} fontSize="10" fill="var(--text-mute)" textAnchor="middle" fontFamily="inherit">{labels[i]}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const DonutChart = ({ data, size = 160, strokeWidth = 22 }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-sunken)" strokeWidth={strokeWidth} />
      {data.map((d, i) => {
        const len = (d.value / total) * c;
        const seg = (
          <circle
            key={i}
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += len;
        return seg;
      })}
    </svg>
  );
};

Object.assign(window, { Sparkline, AreaChart, BarChart, DonutChart });

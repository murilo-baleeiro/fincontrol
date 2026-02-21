"use client";

interface DonutChartDatum {
  category: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartDatum[];
  title?: string;
}

export default function DonutChart({ data, title }: DonutChartProps) {
  const radius = 54;
  const stroke = 16;
  const viewBoxSize = 140;
  const center = viewBoxSize / 2;
  const circumference = 2 * Math.PI * radius;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-center">
        <svg
          width="160"
          height="160"
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          role="img"
          aria-label="Grafico de rosquinha"
        >
          <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={stroke} />
          {total > 0 &&
            data.map((item) => {
              const segment = (item.value / total) * circumference;
              const segmentOffset = circumference - offset;
              offset += segment;

              return (
                <circle
                  key={item.category}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${segment} ${circumference - segment}`}
                  strokeDashoffset={segmentOffset}
                  strokeLinecap="butt"
                  transform={`rotate(-90 ${center} ${center})`}
                />
              );
            })}
          <circle cx={center} cy={center} r={radius - stroke / 2} fill="transparent" />
          <text x={center} y={center - 4} textAnchor="middle" className="fill-white text-[10px]">
            {title || "Total"}
          </text>
          <text x={center} y={center + 12} textAnchor="middle" className="fill-white text-sm font-semibold">
            {total > 0 ? total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ 0,00"}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        {data.map((item) => (
          <div key={item.category} className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-light text-white/90">{item.category}</span>-
            <span className="text-white/80">
              {item.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { formatPrice } from "@/lib/store";

export function FinanceCalculator({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(20);
  const [term, setTerm] = useState(60);
  const [apr, setApr] = useState(6.4);

  const down = (price * downPct) / 100;
  const principal = price - down;
  const monthlyRate = apr / 100 / 12;
  const monthly =
    monthlyRate === 0
      ? principal / term
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

  return (
    <div className="rounded-[12px] bg-panel p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Financing estimate</p>
        <span className="text-[11px] text-dim">
          {term} mo · {apr.toFixed(1)}% APR
        </span>
      </div>

      <div className="mt-3 space-y-3 text-sm">
        <div>
          <div className="flex justify-between text-xs text-dim">
            <span>Down payment ({downPct}%)</span>
            <span className="text-ivory">{formatPrice(down)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={60}
            step={1}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            aria-label="Down payment percentage"
            className="mt-1.5 w-full accent-[var(--gold)]"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-dim">
            <span>Term</span>
            <span className="text-ivory">{term} months</span>
          </div>
          <input
            type="range"
            min={12}
            max={84}
            step={12}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            aria-label="Loan term in months"
            className="mt-1.5 w-full accent-[var(--gold)]"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-dim">
            <span>Interest rate</span>
            <span className="text-ivory">{apr.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={0.1}
            value={apr}
            onChange={(e) => setApr(Number(e.target.value))}
            aria-label="Annual interest rate"
            className="mt-1.5 w-full accent-[var(--gold)]"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-[10px] bg-ink px-3 py-3">
        <span className="text-xs text-dim">Est. monthly</span>
        <span className="font-serif text-2xl font-semibold text-brass">
          {formatPrice(monthly)}
          <span className="text-sm text-dim">/mo</span>
        </span>
      </div>
    </div>
  );
}

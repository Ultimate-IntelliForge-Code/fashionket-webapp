export interface IEnvironment {
  /** VAT/tax percent as decimal (e.g., 0.025 for 2.5%) */
  taxPercent: number;
}

const parseNumber = (value: string | undefined, fallback: number) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const env: IEnvironment = {
  taxPercent: parseNumber(import.meta.env.VITE_TAX_PERCENT as any, 0.025),
};

export const ENV = env;
export const TAX_PERCENT = env.taxPercent;

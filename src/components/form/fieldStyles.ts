/** Border colour rules shared by text inputs and selects, taken from the design:
 *  grey when empty, navy once filled, red on error. */
export function controlBorder({ hasValue, hasError }: { hasValue: boolean; hasError: boolean }) {
  if (hasError) return "border-error focus:border-error focus:ring-error";
  return hasValue
    ? "border-brand-ink focus:border-brand-ink focus:ring-brand-ink"
    : "border-gray-400 focus:border-brand-ink focus:ring-brand-ink";
}

export const controlBase =
  "h-[60px] w-full rounded-[4px] border-[0.5px] bg-white px-3 text-lg text-gray-900 outline-none placeholder:text-gray-700 focus:ring-1 disabled:bg-gray-50";

export const labelClass = "mb-3 block text-base leading-none font-light text-gray-600";

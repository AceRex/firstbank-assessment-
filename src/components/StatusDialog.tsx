import { useId, type ReactNode } from "react";
import Modal from "./Modal";

type StatusDialogProps = {
  open: boolean;
  onClose?: () => void;
  /** 50px lucide icon (its circle draws at ~42px, as in the design). */
  icon?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  /** Buttons; two buttons are laid out side by side, one fills the width. */
  actions: ReactNode;
};

/**
 * Centered icon + title + message + actions, the layout shared by every dialog in the designs.
 * 450px wide; 354.375px tall with an icon, 335px without (min-heights, so text that wraps
 * on narrow screens grows the dialog instead of being clipped).
 * With an icon the spacing follows the design: 75 top · 50 icon · 42 · title · 8 · body (max 270px wide)
 * · buttons pinned 48 from the bottom, so a one- or two-line message keeps the same height.
 */
export default function StatusDialog({ open, onClose, icon, title, children, actions }: StatusDialogProps) {
  const id = useId();
  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={`${id}-title`}
      describedBy={children ? `${id}-body` : undefined}
    >
      <div
        className={`flex flex-col items-center px-[25px] text-center ${
          icon ? "min-h-[354.375px] pt-[75px] pb-12" : "min-h-[335px] justify-center py-8"
        }`}
      >
        {icon && (
          <div aria-hidden className="mb-[42px] flex size-[50px] items-center justify-center">
            {icon}
          </div>
        )}
        <h2 id={`${id}-title`} className="text-center text-xl leading-[1.5] font-bold text-gray-900">
          {title}
        </h2>
        {children && (
          <div
            id={`${id}-body`}
            className={`w-full text-sm leading-[1.5] font-normal text-gray-500 ${icon ? "mt-2 max-w-[270px]" : "mt-3"}`}
          >
            {children}
          </div>
        )}
        <div className={`grid w-full auto-cols-fr grid-flow-col gap-4 ${icon ? "mt-auto pt-4" : "mt-6"}`}>
          {actions}
        </div>
      </div>
    </Modal>
  );
}

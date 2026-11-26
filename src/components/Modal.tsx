import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  /** Called when the user presses Escape. Omit to make the dialog non-dismissable (it stays open until the page closes it). */
  onClose?: () => void;
  labelledBy: string;
  describedBy?: string;
  children: ReactNode;
};

/**
 * Accessible modal built on the native <dialog> element, which gives us focus trapping,
 * Escape handling and an inert background for free.
 */
export default function Modal({ open, onClose, labelledBy, describedBy, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onCancel={(event) => {
        event.preventDefault(); // keep React in control of `open`
        onClose?.();
      }}
      onClose={() => {
        // Browsers don't always honour preventDefault on Escape (Chrome's close-watcher rules),
        // so the dialog can close natively while React still says it's open. Re-sync here:
        // dismissable dialogs report the close; required ones reopen.
        if (!open) return;
        if (onClose) onClose();
        else ref.current?.showModal();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-[450px] rounded-lg bg-white p-0 shadow-xl backdrop:bg-black/40"
    >
      {children}
    </dialog>
  );
}

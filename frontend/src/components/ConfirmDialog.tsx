import { useEffect, useId, useRef } from "react";

type Props = {
    open: boolean,
    title: string,
    message: string,
    confirmLabel: string,
    busy?: boolean,
    error?: string | null,
    onConfirm: () => void,
    onCancel: () => void,
};

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel,
    busy = false,
    error = null,
    onConfirm,
    onCancel,
}: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    function handleCancel() {
        if (!busy) onCancel();
    }

    return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        handleCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) handleCancel();
      }}
    >
      <div className="confirm-dialog-content">
        <h2 id={titleId}>{title}</h2>
        <p>{message}</p>
        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button type="button" onClick={handleCancel} disabled={busy}>
            Cancelar
          </button>
          <button
            type="button"
            className="danger"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Aguarde...' : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );

}
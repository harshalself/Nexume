import React from "react";
import Modal from "./Modal";
import { Button } from "./button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}) => (
  <Modal open={open} onClose={onCancel}>
    <div className="card-hover border-2 border-blue-100 hover:shadow-lg transition-all duration-300 group bg-white p-6 rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;

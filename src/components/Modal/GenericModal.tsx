import React from "react";
import { Modal } from "antd";

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number; 
}

const GenericModal: React.FC<GenericModalProps> = ({ open, onClose, title, children, width = 500 }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={title}
      width={width}
    >
      {children}
    </Modal>
  );
};

export default GenericModal;

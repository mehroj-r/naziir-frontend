import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

export default function ConfirmModal({
  isOpen,
  onClose,
  title = "Are you sure?",
  onConfirm,
  onCancel = () => {},
  isLoading = false
}) {
  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalFooter gap={2} >
          <Button
            flex="1"
            onClick={() => {
              onCancel();
              onClose();
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            flex="1" 
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

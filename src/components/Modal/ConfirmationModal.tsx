import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@radix-ui/react-alert-dialog";

import { Button } from "antd";

const DeleteButton = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button danger>Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
        <Button danger>Cancel</Button>
        <Button danger onClick={onDelete}>
          Yes, Delete
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;

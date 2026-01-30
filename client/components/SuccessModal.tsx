"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

import { useRouter } from "next/navigation";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    buttonText?: string;
}

const SuccessModal = ({
    isOpen,
    onClose,
    title = "Success!",
    message = "Your action was successful.",
    buttonText = "Continue",
}: SuccessModalProps) => {
    const router = useRouter();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md text-center">
                <DialogHeader className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-center">{title}</DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center mt-4">
                    <Button
                        onClick={() => {
                            onClose();
                            router.push("/");
                        }}
                        className="w-full sm:w-auto min-w-[120px]"
                    >
                        {buttonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SuccessModal;

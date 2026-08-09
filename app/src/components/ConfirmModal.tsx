import React, { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning";
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Remove from cart",
  description = "Are you sure you want to delete this item fro cart?",
  confirmText = "Yes, Remove Item",
  cancelText = "No, Cancel",
  variant = "danger",
  icon,
  isLoading: externalIsLoading,
}: ConfirmModalProps) {
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalIsLoading ?? internalLoading;

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Confirmation action failed:", error);
    } finally {
      setInternalLoading(false);
    }
  };

  const variantStyles = {
    danger: {
      iconBg: "bg-[#FFF0F0]",
      confirmBtn: "bg-[#FF3B30] text-white hover:bg-[#E03228]",
      cancelBtn: "border border-[#FF3B30]/60 text-[#FF3B30] hover:bg-[#FFF0F0]",
      defaultIcon: <Trash2 className="w-5 h-5 text-[#FF3B30]" />,
    },
    primary: {
      iconBg: "bg-blue-50",
      confirmBtn: "bg-[#0B2D6E] text-white hover:bg-navy",
      cancelBtn: "border border-[#0B2D6E]/60 text-[#0B2D6E] hover:bg-blue-50",
      defaultIcon: <Trash2 className="w-5 h-5 text-[#0B4A8F]" />,
    },
    warning: {
      iconBg: "bg-amber-50",
      confirmBtn: "bg-amber-600 text-white hover:bg-amber-700",
      cancelBtn: "border border-amber-600/60 text-amber-600 hover:bg-amber-50",
      defaultIcon: <Trash2 className="w-5 h-5 text-amber-600" />,
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.danger;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <AlertDialogContent className="bg-white rounded-2xl p-5 border-none outline-none max-w-[340px] w-[90%] shadow-xl flex flex-col items-center text-center gap-0">
        <AlertDialogHeader className="flex flex-col items-center text-center w-full space-y-0">
          {/* Compact Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-2.5 shrink-0",
              currentVariant.iconBg
            )}
          >
            {icon || currentVariant.defaultIcon}
          </div>

          {/* Compact Title */}
          <AlertDialogTitle className="text-base font-bold text-[#1A1A1A] text-center w-full tracking-tight">
            {title}
          </AlertDialogTitle>

          {/* Compact Description */}
          <AlertDialogDescription className="text-gray-500 text-xs mt-1 text-center w-full leading-snug">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Compact Buttons Row */}
        <AlertDialogFooter className="mt-5 flex flex-row gap-2.5 w-full justify-between items-center sm:justify-between">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className={cn(
              "flex-1 h-9 px-3 rounded-lg font-medium transition-colors cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed justify-center items-center flex shrink-0",
              currentVariant.cancelBtn
            )}
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
            className={cn(
              "flex-1 h-9 px-3 rounded-lg font-medium transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed shadow-xs shrink-0",
              currentVariant.confirmBtn
            )}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
            <span>{confirmText}</span>
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

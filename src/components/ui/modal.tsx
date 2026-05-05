import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  contentClassName?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  height?: string | number;
}

export const Modal: React.FC<ModalProps> = ({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
  contentClassName,
  size = "md",
  height = "70%",
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const onOpenChange = (newOpen: boolean) => {
    if (controlledOnOpenChange) {
      controlledOnOpenChange(newOpen);
    } else {
      setUncontrolledOpen(newOpen);
    }
  };

  // Size configurations
  const sizeClasses = {
    sm: "sm:max-w-md",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
    full: "sm:max-w-[95vw] sm:h-[95vh]",
  };

  // For mobile (Drawer) - bottom slide with 70% height
  const MobileDrawer = () => (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent
        className={cn(
          "flex flex-col rounded-t-3xl",
          contentClassName
        )}
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
        onInteractOutside={(e) => {
          if (!closeOnOverlayClick) {
            e.preventDefault();
          }
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-mmp-primary2/30" />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {(title || description || showCloseButton) && (
            <div className="sticky top-0 bg-white z-10 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {title && (
                    <DrawerHeader className="p-0 mb-2">
                      <DrawerTitle className="text-xl font-semibold text-mmp-primary">
                        {title}
                      </DrawerTitle>
                    </DrawerHeader>
                  )}
                  {description && (
                    <DrawerDescription className="text-mmp-primary/60 text-sm">
                      {description}
                    </DrawerDescription>
                  )}
                </div>
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-mmp-primary2/20 text-mmp-primary"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className={cn("flex-1", className)}>{children}</div>

          {footer && (
            <DrawerFooter className="sticky bottom-0 bg-white pt-4 pb-2 mt-4 border-t border-mmp-primary2/20">
              {footer}
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );

  // For desktop (Dialog) - centered modal
  const DesktopDialog = () => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "flex flex-col max-h-[85vh] p-0 gap-0",
          sizeClasses[size],
          contentClassName
        )}
        onInteractOutside={(e) => {
          if (!closeOnOverlayClick) {
            e.preventDefault();
          }
        }}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <div className="sticky top-0 bg-white z-10 border-b border-mmp-primary2/20 px-6 py-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-6">
                {title && (
                  <DialogHeader className="p-0">
                    <DialogTitle className="text-xl font-semibold text-mmp-primary">
                      {title}
                    </DialogTitle>
                  </DialogHeader>
                )}
                {description && (
                  <DialogDescription className="text-mmp-primary/60 text-sm mt-1">
                    {description}
                  </DialogDescription>
                )}
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-mmp-primary2/20 text-mmp-primary absolute right-4 top-4"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <DialogFooter className="sticky bottom-0 bg-white border-t border-mmp-primary2/20 px-6 py-4">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );

  return isDesktop ? <DesktopDialog /> : <MobileDrawer />;
};

// Custom hooks for easy modal control
export const useModal = () => {
  const [open, setOpen] = React.useState(false);
  return {
    open,
    setOpen,
    onOpenChange: setOpen,
  };
};

// Pre-styled modal content components
interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalBody: React.FC<ModalContentProps> = ({ children, className }) => (
  <div className={cn("space-y-4", className)}>{children}</div>
);

export const ModalSection: React.FC<ModalContentProps & { title?: string }> = ({ 
  children, 
  title, 
  className 
}) => (
  <div className={cn("space-y-2", className)}>
    {title && (
      <h3 className="text-sm font-semibold text-mmp-primary">{title}</h3>
    )}
    <div className="text-sm text-mmp-primary/70">{children}</div>
  </div>
);

export const ModalActions: React.FC<ModalContentProps> = ({ children, className }) => (
  <div className={cn("flex justify-end gap-3", className)}>{children}</div>
);
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@src/components/ui/toast";
import { useToast } from "@src/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        icon,
        title,
        description,
        action,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            {icon && <span className="grow-0 shrink-0">{icon}</span>}
            <div className="grid flex-1 gap-1 mih-w-0">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

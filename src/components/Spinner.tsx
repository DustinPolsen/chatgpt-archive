import { Loader2 } from "lucide-react";

export function Spinner() {
  return (
    <div className="w-full flex items-center justify-center h-24 flex-none">
      <SpinnerIcon />
    </div>
  );
}

export function SpinnerIcon({ size = 32 }: { size?: number }) {
  return (
    <Loader2
      className="animate-spin"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}

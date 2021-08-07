export function EmptyResult({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center w-full py-6 text-sm text-muted-foreground">
      {`No ${name} found`}
    </div>
  );
}

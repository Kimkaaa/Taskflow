import { LoaderCircle } from "lucide-react";

type PageLoadingProps = {
  message: string;
};

export default function PageLoading({ message }: PageLoadingProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-app-bg px-6 py-8 text-white">
      <div className="flex flex-col items-center gap-3 text-app-muted">
        <LoaderCircle className="h-6 w-6 animate-spin" aria-hidden="true" />
        <p className="text-sm">{message}</p>
      </div>
    </main>
  );
}
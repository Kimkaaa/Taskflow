type EditTaskPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-slate-500">Edit Task</p>
        <h1 className="mt-2 text-3xl font-bold">작업 수정</h1>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-600">
            수정할 작업 ID:{" "}
            <span className="font-semibold text-slate-900">{id}</span>
          </p>
        </div>
      </section>
    </main>
  );
}
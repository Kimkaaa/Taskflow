type MemoListProps = {
  memo: string | null;
};

export default function MemoList({ memo }: MemoListProps) {
  const memoItems =
    memo
      ?.split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  if (memoItems.length === 0) {
    return <p className="mt-2 text-slate-500">등록된 메모가 없습니다.</p>;
  }

  return (
    <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
      {memoItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
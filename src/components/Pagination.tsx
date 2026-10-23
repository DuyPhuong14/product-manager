interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>«</button>
      {pages.map((p) => (
        <button key={p} className={p === page ? 'active' : ''} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)}>»</button>
    </div>
  );
}
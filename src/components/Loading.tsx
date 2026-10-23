export default function Loading({ text = 'Đang tải dữ liệu...' }: { text?: string }) {
  return (
    <div className="state">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
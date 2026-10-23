interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="state state-error">
      <p className="state-title">Đã xảy ra lỗi</p>
      <p>{message}</p>
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          Thử lại
        </button>
      )}
    </div>
  );
}
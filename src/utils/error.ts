export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Đã có lỗi xảy ra, vui lòng thử lại';
}
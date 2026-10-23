import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import ErrorState from './ErrorState';

export default function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} - ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Lỗi không xác định';

  return (
    <>
      <ErrorState message={message} />
      <p style={{ textAlign: 'center' }}>
        <Link to="/products">Về trang danh sách</Link>
      </p>
    </>
  );
}
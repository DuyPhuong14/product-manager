import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function EmptyState({ title, description, children }: Props) {
  return (
    <div className="state">
      <p className="state-title">{title}</p>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
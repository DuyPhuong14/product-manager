import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  breadcrumb: Crumb[];
}

export default function PageHeader({ title, subtitle, breadcrumb }: Props) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      <nav className="breadcrumb">
        {breadcrumb.map((c, i) => (
          <span key={c.label}>
            {i > 0 && <span className="sep">/</span>}
            {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
          </span>
        ))}
      </nav>
    </div>
  );
}
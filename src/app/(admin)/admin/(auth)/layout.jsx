/**
 * Auth layout — full-bleed login screen, no sidebar/header chrome.
 */
export default function AdminAuthLayout({ children }) {
  return (
    <div className="admin-root min-h-screen" data-admin-auth>
      {children}
    </div>
  );
}

import './globals.css';

export const metadata = {
  title: 'نظام المتجر المتكامل',
  description: 'متجر، كاشير، ولوحة تحكم',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#f9fafb' }}>
        {children}
      </body>
    </html>
  );
}

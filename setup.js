const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log("🚀 جاري بناء النظام المتكامل (المتجر، الكاشير، لوحة التحكم)...");

// 1. إنشاء مجلدات المشروع الأساسية
const dirs = [
  'src/app/(store)/cart',
  'src/app/(store)/checkout',
  'src/app/(pos)',
  'src/app/(admin)/dashboard',
  'src/app/(admin)/orders',
  'src/app/(admin)/customers',
  'src/app/(admin)/categories',
  'src/app/(admin)/inventory',
  'src/app/(admin)/users',
  'src/app/(admin)/logs',
  'src/app/(admin)/settings',
  'src/app/(admin)/offers',
  'prisma'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
  console.log(`📁 تم إنشاء المجلد: ${dir}`);
});

// 2. إنشاء مخطط قاعدة البيانات (Prisma Schema) حسب متطلباتك الدقيقة
const prismaSchema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // يمكن تغييره لاحقاً إلى PostgreSQL
  url      = "file:./dev.db"
}

model Product {
  id           String   @id @default(cuid())
  name         String
  code         String   @unique
  supplierCode String?
  images       String   // سيتم تخزين مسارات الـ 10 صور كـ JSON
  categoryId   String
  category     Category @relation(fields: [categoryId], references: [id])
  details      String
  brand        String?
  cost         Float
  price        Float
  sizes        ProductSize[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ProductSize {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id])
  size      String
  stock     Int     @default(0)
}

model Category {
  id       String    @id @default(cuid())
  name     String
  products Product[]
}

model User {
  id       String   @id @default(cuid())
  name     String
  phone    String?
  role     String   @default("CUSTOMER") // ADMIN, CASHIER, CUSTOMER
  logs     UserLog[]
}

model UserLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  action    String
  createdAt DateTime @default(now())
}

model Order {
  id            String   @id @default(cuid())
  customerName  String
  totalAmount   Float
  paymentMethod String   // TRANSFER, CASH, CARD
  source        String   // STORE, POS
  status        String   @default("PENDING")
  createdAt     DateTime @default(now())
}
`;
fs.writeFileSync(path.join(__dirname, 'prisma/schema.prisma'), prismaSchema);
console.log("🗄️ تم إنشاء مخطط قاعدة البيانات بنجاح.");

// 3. إنشاء ملفات الواجهات (Pages) لكل قسم
const pages = {
  'src/app/(store)/page.tsx': 'export default function StoreHome() { return <h1>واجهة المتجر الرئيسية - تصفح المنتجات</h1>; }',
  'src/app/(pos)/page.tsx': 'export default function POS() { return <h1>نظام الكاشير - مسح الأكواد وإصدار الفواتير</h1>; }',
  'src/app/(admin)/dashboard/page.tsx': 'export default function Dashboard() { return <h1>لوحة التحكم - الرسوم البيانية والمبيعات</h1>; }',
  'src/app/(admin)/inventory/page.tsx': 'export default function Inventory() { return <h1>إدارة المخزون والمنتجات (إضافة، تعديل، حذف، المقاسات)</h1>; }',
  'src/app/(admin)/orders/page.tsx': 'export default function Orders() { return <h1>إدارة الطلبات</h1>; }',
  'src/app/(admin)/customers/page.tsx': 'export default function Customers() { return <h1>إدارة العملاء</h1>; }',
  'src/app/(admin)/users/page.tsx': 'export default function Users() { return <h1>إدارة المستخدمين والصلاحيات</h1>; }',
  'src/app/(admin)/logs/page.tsx': 'export default function Logs() { return <h1>حركة المستخدمين (Logs)</h1>; }',
  'src/app/(admin)/settings/page.tsx': 'export default function Settings() { return <h1>الإعدادات والتحكم الكامل</h1>; }',
  'src/app/(admin)/offers/page.tsx': 'export default function Offers() { return <h1>الخصومات والعروض</h1>; }',
};

for (const [filePath, content] of Object.entries(pages)) {
  fs.writeFileSync(path.join(__dirname, filePath), content);
}
console.log("📄 تم إنشاء جميع واجهات النظام (المتجر، الكاشير، الأدمن).");

// 4. إنشاء ملف package.json مبدئي لتثبيت المكتبات
const packageJson = {
  "name": "store-pos-erp",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "@prisma/client": "latest",
    "lucide-react": "latest",
    "recharts": "latest",
    "zustand": "latest"
  },
  "devDependencies": {
    "prisma": "latest",
    "typescript": "latest",
    "@types/react": "latest",
    "@types/node": "latest",
    "tailwindcss": "latest"
  }
};
fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(packageJson, null, 2));
console.log("📦 تم تجهيز ملف package.json.");

console.log("✅ انتهى السكربت! الهيكل الأساسي وقاعدة البيانات جاهزة بالكامل.");
console.log("👉 الخطوة التالية: اكتب في التيرمينال: npm install ثم npx prisma db push");

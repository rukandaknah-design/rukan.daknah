const fs = require('fs');
const path = require('path');
console.log('🔧 جاري إصلاح تعارض المسارات...');
const appDir = path.join(__dirname, 'src/app');
const storeDir = path.join(appDir, '(store)');
if (fs.existsSync(storeDir)) {
    if (fs.existsSync(path.join(storeDir, 'page.tsx'))) fs.renameSync(path.join(storeDir, 'page.tsx'), path.join(appDir, 'page.tsx'));
    if (fs.existsSync(path.join(storeDir, 'cart'))) fs.renameSync(path.join(storeDir, 'cart'), path.join(appDir, 'cart'));
    if (fs.existsSync(path.join(storeDir, 'checkout'))) fs.renameSync(path.join(storeDir, 'checkout'), path.join(appDir, 'checkout'));
    fs.rmdirSync(storeDir);
    console.log('✅ تم تعيين المتجر كالصفحة الرئيسية.');
}
const posGroupDir = path.join(appDir, '(pos)');
const posRealDir = path.join(appDir, 'pos');
if (fs.existsSync(posGroupDir)) {
    fs.renameSync(posGroupDir, posRealDir);
    console.log('✅ تم تحويل الكاشير إلى مسار /pos');
}
const adminGroupDir = path.join(appDir, '(admin)');
const adminRealDir = path.join(appDir, 'admin');
if (fs.existsSync(adminGroupDir)) {
    fs.renameSync(adminGroupDir, adminRealDir);
    console.log('✅ تم تحويل لوحة التحكم إلى مسار /admin');
}
console.log('🎉 تم الإصلاح بنجاح! جاري تشغيل السيرفر...');

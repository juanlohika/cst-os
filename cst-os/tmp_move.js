const fs = require('fs');
fs.mkdirSync('apps/web/app/admin/app-builder/[id]', { recursive: true });
if (fs.existsSync('apps/web/app/admin/app-builder/page.tsx')) {
    fs.renameSync('apps/web/app/admin/app-builder/page.tsx', 'apps/web/app/admin/app-builder/[id]/page.tsx');
}

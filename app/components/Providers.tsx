'use client';

import { LanguageProvider } from '@/app/lib/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            {children}
        </LanguageProvider>
    );
}

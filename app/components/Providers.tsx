'use client';

import { LanguageProvider } from '@/app/lib/i18n';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LanguageProvider>
                {children}
            </LanguageProvider>
        </ThemeProvider>
    );
}

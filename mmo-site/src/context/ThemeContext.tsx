import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeState = {
    theme: 'system',
    setTheme: () => null,
}

const ThemContext = createContext<ThemeState>(initialState)

export function ThemeContext({
    children,
    defaultTheme = 'system',
    storageKey = 'ui-theme',
    ...props
}: ThemeProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove('light', 'dark')

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
                .matches
                ? 'dark'
                : 'light'

            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemContext.Provider {...props} value={value}>
            {children}
        </ThemContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemContext)

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeContext')

    return context
}

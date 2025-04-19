// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Định nghĩa kiểu cho theme
type ThemeType = 'light' | 'dark';

interface Theme {
    background: string;
    text: string;
    // Thêm các màu khác nếu cần
}

interface ThemeContextType {
    theme: ThemeType;
    colors: Theme;
    toggleTheme: () => void;
}

// Định nghĩa các theme
const lightTheme: Theme = {
    background: '#fff',
    text: '#000',
};

const darkTheme: Theme = {
    background: '#000',
    text: '#fff',
};

// Tạo Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider
type ThemeProviderProps = {
    children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<ThemeType>('dark'); // Mặc định là dark mode

    const colors = theme === 'light' ? lightTheme : darkTheme;

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook để sử dụng theme
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

import React from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'react-hot-toast';

// A wrapper to sync next-themes with Ant Design theme
const AntdThemeProvider = ({ children }) => {
  const { resolvedTheme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm:
          resolvedTheme === 'dark'
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          // Customize Ant Design tokens here to match Tailwind
          fontFamily: 'Inter, Roboto, sans-serif',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export const AppProvider = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AntdThemeProvider>
        {children}
        <Toaster position="top-right" />
      </AntdThemeProvider>
    </ThemeProvider>
  );
};

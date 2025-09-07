import './globals.css'
import Header from './components/Header'
import AuthProvider from './components/AuthProvider'
import { ToastProvider } from './components/ToastProvider'

export const metadata = {
  title: 'Balanced+',
  description: 'Balanced+ web app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/monogramaiconblack.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/monogramaiconwhite.png" media="(prefers-color-scheme: dark)" />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

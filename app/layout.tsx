import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "言语云³ 中央控制平台™",
  description: "个人成长与开发管理的综合平台",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            body {
              margin: 0;
              padding: 0;
              font-family: ${inter.style.fontFamily};
              background-image: url('/images/yanyu-background-new.jpg');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
              background-attachment: fixed;
              min-height: 100vh;
            }
            
            /* 添加动态效果 */
            body::before {
              content: '';
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(
                45deg,
                rgba(59, 130, 246, 0.1) 0%,
                rgba(16, 185, 129, 0.1) 25%,
                rgba(139, 92, 246, 0.1) 50%,
                rgba(59, 130, 246, 0.1) 75%,
                rgba(16, 185, 129, 0.1) 100%
              );
              background-size: 400% 400%;
              animation: gradientShift 15s ease infinite;
              pointer-events: none;
              z-index: -1;
            }
            
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            /* 添加微妙的粒子效果 */
            body::after {
              content: '';
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: 
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
              animation: float 20s ease-in-out infinite;
              pointer-events: none;
              z-index: -1;
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              33% { transform: translateY(-20px) rotate(1deg); }
              66% { transform: translateY(10px) rotate(-1deg); }
            }
          `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

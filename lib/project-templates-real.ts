/**
 * 真实可用的项目模板
 */

export const REAL_PROJECT_TEMPLATES = {
  "yanyu-cloud-dashboard": {
    name: "言语云³ 仪表盘",
    description: "基于当前项目的仪表盘模板",
    files: {
      "package.json": {
        name: "yanyu-cloud-dashboard",
        version: "1.0.0",
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
        },
        dependencies: {
          next: "^14.0.0",
          react: "^18.0.0",
          "react-dom": "^18.0.0",
          "@radix-ui/react-accordion": "^1.1.2",
          "class-variance-authority": "^0.7.0",
          clsx: "^2.0.0",
          "lucide-react": "^0.294.0",
          "tailwind-merge": "^2.0.0",
          "tailwindcss-animate": "^1.0.7",
        },
        devDependencies: {
          "@types/node": "^20.0.0",
          "@types/react": "^18.0.0",
          "@types/react-dom": "^18.0.0",
          autoprefixer: "^10.0.0",
          eslint: "^8.0.0",
          "eslint-config-next": "^14.0.0",
          postcss: "^8.0.0",
          tailwindcss: "^3.3.0",
          typescript: "^5.0.0",
        },
      },
      "vercel.json": {
        version: 2,
        name: "yanyu-cloud-dashboard",
        builds: [{ src: "package.json", use: "@vercel/next" }],
        regions: ["hkg1"],
      },
    },
  },
}

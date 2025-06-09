"use client"

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "transparent",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          color: "white",
        }}
      >
        {/* 头部 */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem auto",
              fontSize: "3.5rem",
              backdropFilter: "blur(20px)",
              border: "2px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            ☁️
          </div>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              textShadow: "0 4px 20px rgba(0,0,0,0.3)",
              background: "linear-gradient(135deg, #ffffff, #e0f2fe, #b3e5fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            言语云³ 中央控制平台™
          </h1>
          <p
            style={{
              fontSize: "1.3rem",
              opacity: "0.9",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              fontWeight: "300",
            }}
          >
            YanYu Cloud³ Central Control Platform™
          </p>
        </div>

        {/* 功能模块 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            marginBottom: "4rem",
          }}
        >
          {/* 设备资产管理 */}
          <a
            href="/dashboard/assets"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "2rem",
                transition: "all 0.4s ease",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)"
                e.currentTarget.style.transform = "translateY(0) scale(1)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  fontSize: "2rem",
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
                }}
              >
                📦
              </div>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  marginBottom: "0.8rem",
                  color: "#ffffff",
                }}
              >
                设备资产管理
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: "0.85",
                  lineHeight: "1.6",
                  color: "#e0f2fe",
                }}
              >
                设备清单、软件许可、网络资源统一管理
              </p>
            </div>
          </a>

          {/* 学习成长中心 */}
          <a
            href="/dashboard/learning"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "2rem",
                transition: "all 0.4s ease",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)"
                e.currentTarget.style.transform = "translateY(0) scale(1)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  fontSize: "2rem",
                  boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
                }}
              >
                📚
              </div>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  marginBottom: "0.8rem",
                  color: "#ffffff",
                }}
              >
                学习成长中心
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: "0.85",
                  lineHeight: "1.6",
                  color: "#e0f2fe",
                }}
              >
                知识管理、学习路径规划、技能发展追踪
              </p>
            </div>
          </a>

          {/* 开发工具库 */}
          <a
            href="/dashboard/dev-tools"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "2rem",
                transition: "all 0.4s ease",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)"
                e.currentTarget.style.transform = "translateY(0) scale(1)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  fontSize: "2rem",
                  boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
                }}
              >
                💻
              </div>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  marginBottom: "0.8rem",
                  color: "#ffffff",
                }}
              >
                开发工具库
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: "0.85",
                  lineHeight: "1.6",
                  color: "#e0f2fe",
                }}
              >
                代码资产管理、项目模板、API文档
              </p>
            </div>
          </a>

          {/* 安全防护系统 */}
          <a
            href="/dashboard/security"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "2rem",
                transition: "all 0.4s ease",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)"
                e.currentTarget.style.transform = "translateY(0) scale(1)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  fontSize: "2rem",
                  boxShadow: "0 8px 25px rgba(239, 68, 68, 0.4)",
                }}
              >
                🛡️
              </div>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  marginBottom: "0.8rem",
                  color: "#ffffff",
                }}
              >
                安全防护系统
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: "0.85",
                  lineHeight: "1.6",
                  color: "#e0f2fe",
                }}
              >
                密码管理、安全审计、合规性追踪
              </p>
            </div>
          </a>

          {/* 数据分析中心 */}
          <a
            href="/dashboard/analytics"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "2rem",
                transition: "all 0.4s ease",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)"
                e.currentTarget.style.transform = "translateY(0) scale(1)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  fontSize: "2rem",
                  boxShadow: "0 8px 25px rgba(245, 158, 11, 0.4)",
                }}
              >
                📊
              </div>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  marginBottom: "0.8rem",
                  color: "#ffffff",
                }}
              >
                数据分析中心
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: "0.85",
                  lineHeight: "1.6",
                  color: "#e0f2fe",
                }}
              >
                个人数据仪表盘、趋势分析、决策支持
              </p>
            </div>
          </a>

          {/* 自动化工作流 */}
          <a
            href="/dashboard/automation"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "2rem",
                transition: "all 0.4s ease",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)"
                e.currentTarget.style.transform = "translateY(0) scale(1)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  fontSize: "2rem",
                  boxShadow: "0 8px 25px rgba(99, 102, 241, 0.4)",
                }}
              >
                ⚡
              </div>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  marginBottom: "0.8rem",
                  color: "#ffffff",
                }}
              >
                自动化工作流
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: "0.85",
                  lineHeight: "1.6",
                  color: "#e0f2fe",
                }}
              >
                工作流设计器、定时任务、智能提醒
              </p>
            </div>
          </a>

          {/* 部署指导引擎 */}
          <a
            href="/dashboard/deployment"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "2rem",
                transition: "all 0.4s ease",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)"
                e.currentTarget.style.transform = "translateY(0) scale(1)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  fontSize: "2rem",
                  boxShadow: "0 8px 25px rgba(20, 184, 166, 0.4)",
                }}
              >
                🚀
              </div>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  marginBottom: "0.8rem",
                  color: "#ffffff",
                }}
              >
                部署指导引擎
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: "0.85",
                  lineHeight: "1.6",
                  color: "#e0f2fe",
                }}
              >
                智能部署指导、项目模板、平台配置管理
              </p>
            </div>
          </a>

          {/* 网络监控中心 */}
          <a
            href="/dashboard/network-monitor"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "2rem",
                transition: "all 0.4s ease",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)"
                e.currentTarget.style.transform = "translateY(0) scale(1)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #64748b, #475569)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  fontSize: "2rem",
                  boxShadow: "0 8px 25px rgba(100, 116, 139, 0.4)",
                }}
              >
                🖥️
              </div>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  marginBottom: "0.8rem",
                  color: "#ffffff",
                }}
              >
                网络监控中心
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: "0.85",
                  lineHeight: "1.6",
                  color: "#e0f2fe",
                }}
              >
                实时网络监控、性能分析、趋势预测
              </p>
            </div>
          </a>
        </div>

        {/* 底部 */}
        <div
          style={{
            textAlign: "center",
            opacity: "0.8",
          }}
        >
          <p
            style={{
              fontSize: "1rem",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              color: "#e0f2fe",
            }}
          >
            © 2024 言语云³ 中央控制平台™ - 统一管理您的数字生活
          </p>
        </div>
      </div>
    </div>
  )
}

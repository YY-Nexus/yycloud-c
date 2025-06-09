export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">仪表板</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">欢迎使用言语云³ 中央控制平台</p>
        </div>

        {/* 快速统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">总资产</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">学习进度</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">68%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">安全评分</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">98/100</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">活跃工作流</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/dashboard/assets" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📦</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">资产管理</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">管理您的设备、软件许可和网络资源</p>
            </div>
          </a>

          <a href="/dashboard/learning" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📚</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">学习中心</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">规划学习路径，追踪技能发展进度</p>
            </div>
          </a>

          <a href="/dashboard/dev-tools" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">💻</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">开发工具</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">代码格式化、API测试等开发工具</p>
            </div>
          </a>

          <a href="/dashboard/security" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🛡️</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">安全中心</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">密码管理、安全审计和合规性追踪</p>
            </div>
          </a>

          <a href="/dashboard/analytics" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📊</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">数据分析</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">数据仪表盘、趋势分析和决策支持</p>
            </div>
          </a>

          <a href="/dashboard/automation" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">⚡</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">自动化</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">工作流设计器、定时任务和智能提醒</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

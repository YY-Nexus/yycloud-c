/**
 * ==========================================
 * 言语云³ 中央控制平台™
 * YanYu Cloud³ Central Control Platform™
 *
 * Vercel API 集成
 * ==========================================
 */

interface VercelProject {
  id: string
  name: string
  accountId: string
  createdAt: number
  updatedAt: number
  link?: {
    type: string
    repo: string
    repoId: number
    org?: string
  }
  targets?: {
    production: {
      id: string
      url: string
      alias: string[]
    }
  }
}

interface VercelDeployment {
  uid: string
  name: string
  url: string
  created: number
  state: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED"
  type: "LAMBDAS"
  meta: Record<string, any>
  target: "production" | "staging"
  aliasAssigned?: boolean
  aliasError?: any
}

interface VercelTeam {
  id: string
  slug: string
  name: string
  createdAt: number
  avatar?: string
}

export class VercelAPI {
  private baseURL = "https://api.vercel.com"
  private token: string | null = null

  constructor() {
    // 从环境变量或本地存储获取token
    this.token = this.getStoredToken()
  }

  private getStoredToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("vercel_token")
  }

  setToken(token: string): void {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("vercel_token", token)
    }
  }

  clearToken(): void {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("vercel_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.token) {
      throw new Error("Vercel token 未设置，请先进行身份验证")
    }

    const url = `${this.baseURL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Vercel API 错误 (${response.status}): ${error}`)
    }

    return response.json()
  }

  // 验证token有效性
  async validateToken(): Promise<boolean> {
    try {
      await this.getUser()
      return true
    } catch {
      return false
    }
  }

  // 获取用户信息
  async getUser(): Promise<any> {
    return this.request("/v2/user")
  }

  // 获取团队列表
  async getTeams(): Promise<{ teams: VercelTeam[] }> {
    return this.request("/v2/teams")
  }

  // 获取项目列表
  async getProjects(teamId?: string): Promise<{ projects: VercelProject[] }> {
    const query = teamId ? `?teamId=${teamId}` : ""
    return this.request(`/v9/projects${query}`)
  }

  // 创建新项目
  async createProject(
    name: string,
    options: {
      teamId?: string
      framework?: string
      gitRepository?: {
        type: "github" | "gitlab" | "bitbucket"
        repo: string
      }
      environmentVariables?: Array<{
        key: string
        value: string
        target: ("production" | "preview" | "development")[]
      }>
      buildCommand?: string
      outputDirectory?: string
      installCommand?: string
      devCommand?: string
    } = {},
  ): Promise<VercelProject> {
    const body: any = {
      name: name.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      framework: options.framework || "nextjs",
    }

    if (options.gitRepository) {
      body.gitRepository = options.gitRepository
    }

    if (options.environmentVariables) {
      body.environmentVariables = options.environmentVariables
    }

    if (options.buildCommand) {
      body.buildCommand = options.buildCommand
    }

    if (options.outputDirectory) {
      body.outputDirectory = options.outputDirectory
    }

    if (options.installCommand) {
      body.installCommand = options.installCommand
    }

    if (options.devCommand) {
      body.devCommand = options.devCommand
    }

    const query = options.teamId ? `?teamId=${options.teamId}` : ""
    return this.request(`/v10/projects${query}`, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  // 获取项目详情
  async getProject(projectId: string, teamId?: string): Promise<VercelProject> {
    const query = teamId ? `?teamId=${teamId}` : ""
    return this.request(`/v9/projects/${projectId}${query}`)
  }

  // 删除项目
  async deleteProject(projectId: string, teamId?: string): Promise<void> {
    const query = teamId ? `?teamId=${teamId}` : ""
    return this.request(`/v9/projects/${projectId}${query}`, {
      method: "DELETE",
    })
  }

  // 创建部署
  async createDeployment(
    projectName: string,
    files: Record<string, string>,
    options: {
      teamId?: string
      target?: "production" | "staging"
      projectSettings?: {
        buildCommand?: string
        outputDirectory?: string
        installCommand?: string
        devCommand?: string
      }
    } = {},
  ): Promise<VercelDeployment> {
    const body: any = {
      name: projectName,
      files: Object.entries(files).map(([file, data]) => ({
        file,
        data: Buffer.from(data).toString("base64"),
        encoding: "base64",
      })),
      projectSettings: options.projectSettings,
      target: options.target || "production",
    }

    const query = options.teamId ? `?teamId=${options.teamId}` : ""
    return this.request(`/v13/deployments${query}`, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  // 获取部署列表
  async getDeployments(
    projectId?: string,
    options: {
      teamId?: string
      limit?: number
      until?: number
      since?: number
    } = {},
  ): Promise<{ deployments: VercelDeployment[] }> {
    const params = new URLSearchParams()

    if (options.teamId) params.append("teamId", options.teamId)
    if (projectId) params.append("projectId", projectId)
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.until) params.append("until", options.until.toString())
    if (options.since) params.append("since", options.since.toString())

    const query = params.toString() ? `?${params.toString()}` : ""
    return this.request(`/v6/deployments${query}`)
  }

  // 获取部署详情
  async getDeployment(deploymentId: string, teamId?: string): Promise<VercelDeployment> {
    const query = teamId ? `?teamId=${teamId}` : ""
    return this.request(`/v13/deployments/${deploymentId}${query}`)
  }

  // 取消部署
  async cancelDeployment(deploymentId: string, teamId?: string): Promise<void> {
    const query = teamId ? `?teamId=${teamId}` : ""
    return this.request(`/v12/deployments/${deploymentId}/cancel${query}`, {
      method: "PATCH",
    })
  }

  // 获取部署日志
  async getDeploymentLogs(deploymentId: string, teamId?: string): Promise<any> {
    const query = teamId ? `?teamId=${teamId}` : ""
    return this.request(`/v2/deployments/${deploymentId}/events${query}`)
  }

  // 设置环境变量
  async setEnvironmentVariables(
    projectId: string,
    variables: Array<{
      key: string
      value: string
      target: ("production" | "preview" | "development")[]
      type?: "system" | "secret" | "plain"
    }>,
    teamId?: string,
  ): Promise<void> {
    const query = teamId ? `?teamId=${teamId}` : ""

    for (const variable of variables) {
      await this.request(`/v9/projects/${projectId}/env${query}`, {
        method: "POST",
        body: JSON.stringify({
          key: variable.key,
          value: variable.value,
          target: variable.target,
          type: variable.type || "plain",
        }),
      })
    }
  }

  // 获取环境变量
  async getEnvironmentVariables(projectId: string, teamId?: string): Promise<any> {
    const query = teamId ? `?teamId=${teamId}` : ""
    return this.request(`/v9/projects/${projectId}/env${query}`)
  }

  // 设置自定义域名
  async addDomain(projectId: string, domain: string, teamId?: string): Promise<any> {
    const query = teamId ? `?teamId=${teamId}` : ""
    return this.request(`/v9/projects/${projectId}/domains${query}`, {
      method: "POST",
      body: JSON.stringify({ name: domain }),
    })
  }

  // 获取域名列表
  async getDomains(projectId: string, teamId?: string): Promise<any> {
    const query = teamId ? `?teamId=${teamId}` : ""
    return this.request(`/v9/projects/${projectId}/domains${query}`)
  }
}

export const vercelAPI = new VercelAPI()

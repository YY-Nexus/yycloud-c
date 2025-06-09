import type { WorkflowTemplate } from "@/types/workflow"

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "daily-backup-reminder",
    name: "每日备份提醒",
    description: "每天定时提醒进行数据备份",
    category: "系统维护",
    tags: ["备份", "提醒", "定时"],
    icon: "🔄",
    difficulty: "beginner",
    estimatedTime: "5分钟",
    triggers: [
      {
        type: "schedule",
        name: "每日提醒",
        config: {
          schedule: {
            type: "daily",
            value: "09:00",
            timezone: "Asia/Shanghai",
          },
        },
        enabled: true,
      },
    ],
    actions: [
      {
        type: "notification",
        name: "发送备份提醒",
        config: {
          notification: {
            title: "数据备份提醒",
            message: "是时候进行每日数据备份了！",
            type: "info",
            channels: ["browser"],
          },
        },
        enabled: true,
        order: 1,
      },
    ],
    variables: [],
    usageCount: 0,
    rating: 4.5,
    author: "系统",
    createdAt: new Date(),
  },
  {
    id: "website-monitor",
    name: "网站监控",
    description: "定期检查网站状态，异常时发送通知",
    category: "监控",
    tags: ["监控", "网站", "健康检查"],
    icon: "🌐",
    difficulty: "intermediate",
    estimatedTime: "10分钟",
    triggers: [
      {
        type: "schedule",
        name: "每5分钟检查",
        config: {
          schedule: {
            type: "interval",
            value: "300",
          },
        },
        enabled: true,
      },
    ],
    actions: [
      {
        type: "webhook",
        name: "检查网站状态",
        config: {
          webhook: {
            url: "https://example.com",
            method: "GET",
            timeout: 10000,
          },
        },
        enabled: true,
        order: 1,
      },
      {
        type: "condition",
        name: "检查响应状态",
        config: {
          condition: {
            expression: "response.status >= 400",
            trueActions: ["send-alert"],
            falseActions: [],
          },
        },
        enabled: true,
        order: 2,
      },
      {
        type: "notification",
        name: "发送警报",
        config: {
          notification: {
            title: "网站异常警报",
            message: "网站响应异常，请检查！",
            type: "error",
            channels: ["browser"],
          },
        },
        enabled: true,
        order: 3,
      },
    ],
    variables: [
      {
        name: "website_url",
        type: "string",
        value: "https://example.com",
        description: "要监控的网站URL",
      },
    ],
    usageCount: 0,
    rating: 4.8,
    author: "系统",
    createdAt: new Date(),
  },
  {
    id: "file-organizer",
    name: "文件整理器",
    description: "自动整理下载文件夹中的文件",
    category: "文件管理",
    tags: ["文件", "整理", "自动化"],
    icon: "📁",
    difficulty: "advanced",
    estimatedTime: "15分钟",
    triggers: [
      {
        type: "schedule",
        name: "每小时整理",
        config: {
          schedule: {
            type: "interval",
            value: "3600",
          },
        },
        enabled: true,
      },
    ],
    actions: [
      {
        type: "script",
        name: "扫描文件",
        config: {
          script: {
            language: "javascript",
            code: `
              // 模拟文件扫描逻辑
              const files = ['document.pdf', 'image.jpg', 'video.mp4'];
              log('扫描到 ' + files.length + ' 个文件');
              variables.files = files;
            `,
          },
        },
        enabled: true,
        order: 1,
      },
      {
        type: "script",
        name: "分类文件",
        config: {
          script: {
            language: "javascript",
            code: `
              const files = variables.files || [];
              const categories = {
                documents: [],
                images: [],
                videos: []
              };
              
              files.forEach(file => {
                if (file.endsWith('.pdf') || file.endsWith('.doc')) {
                  categories.documents.push(file);
                } else if (file.endsWith('.jpg') || file.endsWith('.png')) {
                  categories.images.push(file);
                } else if (file.endsWith('.mp4') || file.endsWith('.avi')) {
                  categories.videos.push(file);
                }
              });
              
              log('文件分类完成');
              variables.categories = categories;
            `,
          },
        },
        enabled: true,
        order: 2,
      },
      {
        type: "notification",
        name: "整理完成通知",
        config: {
          notification: {
            title: "文件整理完成",
            message: "下载文件夹整理完成！",
            type: "success",
            channels: ["browser"],
          },
        },
        enabled: true,
        order: 3,
      },
    ],
    variables: [
      {
        name: "download_path",
        type: "string",
        value: "/Downloads",
        description: "下载文件夹路径",
      },
    ],
    usageCount: 0,
    rating: 4.3,
    author: "系统",
    createdAt: new Date(),
  },
  {
    id: "task-reminder",
    name: "任务提醒器",
    description: "基于优先级的智能任务提醒",
    category: "生产力",
    tags: ["任务", "提醒", "生产力"],
    icon: "✅",
    difficulty: "beginner",
    estimatedTime: "5分钟",
    triggers: [
      {
        type: "schedule",
        name: "工作日提醒",
        config: {
          schedule: {
            type: "daily",
            value: "10:00",
          },
        },
        enabled: true,
      },
    ],
    actions: [
      {
        type: "script",
        name: "检查待办事项",
        config: {
          script: {
            language: "javascript",
            code: `
              // 模拟待办事项检查
              const tasks = [
                { name: '完成项目报告', priority: 'high', due: '今天' },
                { name: '回复邮件', priority: 'medium', due: '明天' }
              ];
              
              const highPriorityTasks = tasks.filter(t => t.priority === 'high');
              variables.highPriorityTasks = highPriorityTasks;
              
              log('检查到 ' + highPriorityTasks.length + ' 个高优先级任务');
            `,
          },
        },
        enabled: true,
        order: 1,
      },
      {
        type: "condition",
        name: "检查是否有高优先级任务",
        config: {
          condition: {
            expression: "highPriorityTasks.length > 0",
            trueActions: ["send-task-reminder"],
            falseActions: [],
          },
        },
        enabled: true,
        order: 2,
      },
      {
        type: "notification",
        name: "发送任务提醒",
        config: {
          notification: {
            title: "高优先级任务提醒",
            message: "您有重要任务需要处理！",
            type: "warning",
            channels: ["browser"],
          },
        },
        enabled: true,
        order: 3,
      },
    ],
    variables: [],
    usageCount: 0,
    rating: 4.6,
    author: "系统",
    createdAt: new Date(),
  },
]

export function getWorkflowTemplates(): WorkflowTemplate[] {
  return workflowTemplates
}

export function getWorkflowTemplate(id: string): WorkflowTemplate | null {
  return workflowTemplates.find((template) => template.id === id) || null
}

export function getTemplatesByCategory(category: string): WorkflowTemplate[] {
  return workflowTemplates.filter((template) => template.category === category)
}

export function searchTemplates(query: string): WorkflowTemplate[] {
  const lowercaseQuery = query.toLowerCase()
  return workflowTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

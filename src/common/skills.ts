export type SkillLevel = 'familiar' | 'proficient' | 'master'

export interface Skill {
  name: string
  level: SkillLevel
  percentage: number
  description: string
  // from: https://shields.io/
  icon: {
    name: string
    color: string
    logo: string
  }
}

export interface SkillCategory {
  title: string
  skills: Skill[]
}

export const mainSkills: string[] = [
  'TypeScript',
  'React.js',
  'Vue.js',
  'Node.js',
  'PHP'
]

export const skills: SkillCategory[] = [
  {
    title: "前端开发",
    skills: [
      {
        name: "JavaScript/TypeScript",
        level: "master",
        percentage: 95,
        description: "熟练使用现代JavaScript特性和TypeScript进行类型安全的开发",
        icon: {
          name: "TypeScript",
          color: "3178C6",
          logo: "typescript"
        }
      },
      {
        name: "React & React生态",
        level: "master",
        percentage: 90,
        description: "熟练使用React hooks, Context API, Zustand, 和SWR等状态管理方案",
        icon: {
          name: "React",
          color: "61DAFB",
          logo: "react"
        }
      },
      {
        name: 'Vue.js & Vue生态',
        level: 'master',
        percentage: 90,
        description: '熟练使用Vue 3, Pinna, Vue Router, Vuex 等状态管理方案',
        icon: {
          name: "Vue.js",
          color: "4FC08D",
          logo: "vue.js"
        }
      },
      {
        name: "Next.js",
        level: "proficient",
        percentage: 85,
        description: "能够构建高性能的服务端渲染和静态生成的React应用",
        icon: {
          name: "Next.js",
          color: "000000",
          logo: "next.js"
        }
      },
      {
        name: 'Electron / React Native',
        level: 'proficient',
        percentage: 80,
        description: '熟练使用Electron和React Native构建跨平台桌面和移动应用',
        icon: {
          name: "Electron",
          color: "47848F",
          logo: "electron"
        }
      },
      {
        name: "UI / UX / Tailwind CSS",
        level: "proficient",
        percentage: 85,
        description: "熟练使用Figma、Photoshop进行界面设计和原型制作，使用现代CSS技术和Tailwind CSS构建响应式UI",
        icon: {
          name: "Tailwind_CSS",
          color: "38B2AC",
          logo: "tailwind-css"
        }
      }
    ]
  },
  {
    title: "后端开发",
    skills: [
      {
        name: "Node.js",
        level: "master",
        percentage: 80,
        description: "熟练使用Express和Nest.js构建RESTful API和微服务",
        icon: {
          name: "Node.js",
          color: "339933",
          logo: "node.js"
        }
      },
      {
        name: 'PHP',
        level: 'master',
        percentage: 85,
        description: '熟练使用 PHP 和 Laravel 框架进行后端业务开发',
        icon: {
          name: "PHP",
          color: "777BB4",
          logo: "php"
        }
      },
      {
        name: "数据库",
        level: "familiar",
        percentage: 75,
        description: "熟练使用SQL和NoSQL数据库，包括MySQL、PostgreSQL, MongoDB等",
        icon: {
          name: "Database",
          color: "4479A1",
          logo: "mysql"
        }
      },
      {
        name: "API设计 / Linux / Nginx / 云服务",
        level: "familiar",
        percentage: 70,
        description: "设计可扩展的RESTful API，熟悉使用AWS, AliYun平台部署和管理应用",
        icon: {
          name: "Linux",
          color: "FCC624",
          logo: "linux"
        }
      }
    ]
  },
  {
    title: "开发工具与实践",
    skills: [
      {
        name: "Git与版本控制",
        level: "master",
        percentage: 90,
        description: "熟练使用Git工作流，包括分支管理、代码审查和CI/CD",
        icon: {
          name: "Git",
          color: "F05032",
          logo: "git"
        }
      },
      {
        name: "AI / ChatGPT",
        level: "proficient",
        percentage: 80,
        description: "具备AI项目经验，熟悉使用ChatGPT等模型进行应用开发和功能集成",
        icon: {
          name: "ChatGPT",
          color: "74aa9c",
          logo: "openai"
        }
      },
      {
        name: "Shell / 测试",
        level: "proficient",
        percentage: 80,
        description: "编写单元测试、集成测试和E2E测试，使用Jest, React Testing Library等",
        icon: {
          name: "Jest",
          color: "C21325",
          logo: "jest"
        }
      },
      {
        name: "容器化",
        level: "familiar",
        percentage: 70,
        description: "使用Docker构建和部署应用，基本的Kubernetes知识",
        icon: {
          name: "Docker",
          color: "2496ED",
          logo: "docker"
        }
      },
      {
        name: "敏捷开发",
        level: "proficient",
        percentage: 85,
        description: "在Jira和Coding环境中工作，注重迭代开发和持续改进",
        icon: {
          name: "Jira",
          color: "0052CC",
          logo: "jira"
        }
      },
      {
        name: '团队管理',
        level: 'familiar',
        percentage: 70,
        description: '具备团队管理和项目协调的经验，能够有效沟通和协作',
        icon: {
          name: "Management",
          color: "0078D7",
          logo: "codestream"
        }
      }
    ]
  }
]

export const getSkillImage = (skill: Skill): string => {
  return `https://img.shields.io/badge/${skill.name}-${skill.icon.color}?logo=${skill.icon.logo}&logoColor=white&style=for-the-badge`
}

// 辅助函数：将技能级别转换为中文显示
export const getSkillLevelText = (level: SkillLevel): string => {
  const levelMap: Record<SkillLevel, string> = {
    familiar: '熟悉',
    proficient: '熟练',
    master: '精通'
  }
  return levelMap[level]
}

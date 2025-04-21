import { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'
import { WebsiteProfile } from '@/common/config'
import { MailIcon } from 'lucide-react'
import GithubIcon from '@/components/icons/Github'
import { skills, getSkillLevelText, getSkillImage, Skill } from '@/common/skills'
import clsx from 'clsx'

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about me, my skills, and my experience as a full-stack developer.',
}

// 技能等级组件
const SkillLevel = ({ level }: { level: number }) => {
  return <Progress value={level} className="max-w-[200px] h-2" />
}

export default async function AboutPage() {
  // Try to fetch the GitHub README, but don't block rendering if it fails
  // const readmeRepo = await getFileContent('./README.md')

  return (
    <div className="container mx-auto space-y-8">
      {/* 个人简介部分 */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="rounded-xl overflow-hidden w-32 h-32 md:w-40 md:h-40 bg-muted flex-shrink-0">
            <Image className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground" src="/assets/avatar.png" width={128} height={128} alt="avatar" />
          </div>
          <div className="space-y-4">
            <div>
              <div className='flex items-center space-x-5'>
                <h2 className="text-2xl font-bold">{WebsiteProfile.Author}</h2>

                {WebsiteProfile.Email && (
                  <a href={`mailto:${WebsiteProfile.Email}`} aria-label="Email" className="text-muted-foreground hover:text-foreground transition-colors">
                    <MailIcon className="inline-block h-5 w-5" />
                  </a>
                )}
              </div>
              <p className="text-muted-foreground">
                {WebsiteProfile.JobName}
              </p>
            </div>
            <p className="text-base">
              {WebsiteProfile.AboutMe}
            </p>
            <div className="flex gap-2 flex-wrap">
              <img src="https://img.shields.io/badge/React-282C34?logo=react&logoColor=61DAFB" alt="React" title="React" height="25" />
              <img src="https://img.shields.io/badge/Vue.js-282C34?logo=vue.js&logoColor=4FC08D" alt="Vue.js" title="Vue.js" height="25" />
              <img src="https://img.shields.io/badge/React%20Native-282C34?logo=react&logoColor=61DAFB" alt="React Native" title="React Native" height="25" />
              <img src="https://img.shields.io/badge/Electron-282C34?logo=electron&logoColor=47848F" alt="Electron" title="Electron" height="25" />
              <img src="https://img.shields.io/badge/Node.js-282C34?logo=node.js&logoColor=339933" alt="Node.js" title="Node.js" height="25" />
              <img src="https://img.shields.io/badge/PHP-282C34?logo=php&logoColor=777BB4" alt="PHP" title="PHP" height="25" />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* 技术技能部分 */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">技术技能</h2>

        {/* 遍历技能分类 */}
        {skills.map((cg) => (
          <div key={cg.title} className="space-y-4">
            <h3 className="text-xl font-semibold">{cg.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cg.skills.map(skill => (
                <SkillItem key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

function SkillItem({ skill }: { skill: Skill }) {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md group">
      {/* Background progress bar that animates on hover */}
      <div 
        className={clsx(
          'absolute inset-0 bg-gradient-to-r opacity-60 transition-transform duration-700 ease-in-out origin-left scale-x-0 group-hover:scale-x-100',
          skill.level === 'master' && 'from-blue-500/10 to-blue-500',
          skill.level === 'proficient' && 'from-green-500/10 to-green-500',
          skill.level === 'familiar' && 'from-yellow-500/10 to-yellow-500',
        )}
        style={{ width: `${skill.percentage}%` }}
      />
      
      <div className="relative z-10 px-4 space-y-3">
        {/* Top section with skill image and level */}
        <div className="flex justify-between items-center">
          <div className="w-auto h-8">
            <img 
              src={getSkillImage(skill)} 
              alt={skill.name}
              className="rounded h-8 transform transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
          <Badge 
            variant="outline" 
            className={clsx(
              `text-xs font-medium transition-colors duration-300`,
              skill.level === 'master' && 'bg-blue-500/10 text-blue-500',
              skill.level === 'proficient' && 'bg-green-500/10 text-green-500',
              skill.level === 'familiar' && 'bg-yellow-500/10 text-yellow-500',
            )}>
            {getSkillLevelText(skill.level)}
          </Badge>
        </div>
        {/* Skill description */}
        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {skill.description}
        </p>
      </div>
    </Card>
  )
}

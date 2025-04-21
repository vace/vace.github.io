"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 定义项目类型
interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  link: string;
  demoLink?: string;
}

// 示例项目数据
const projects: Project[] = [];

// 获取所有标签
const getAllTags = () => {
  const tagsSet = new Set<string>();
  
  projects.forEach(project => {
    project.tags.forEach(tag => tagsSet.add(tag));
  });
  
  return ["全部", ...Array.from(tagsSet)];
};

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = React.useState("全部");
  const allTags = getAllTags();
  
  // 根据选定标签筛选项目
  const filteredProjects = activeTab === "全部" 
    ? projects 
    : projects.filter(project => project.tags.includes(activeTab));

  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <h1 className="text-4xl font-bold mb-8">我的项目</h1>
      
      {/* 标签筛选 */}
      <div className="mb-8">
        <Tabs 
          defaultValue="全部" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4 flex flex-wrap overflow-x-auto">
            {allTags.map(tag => (
              <TabsTrigger key={tag} value={tag}>{tag}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 项目列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <Link key={project.id} href={project.link} target="_blank" className="group">
            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
              {/* 项目封面图 */}
              <div className="relative w-full h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  {project.coverImage && (
                    <Image
                      src={'https://placehold.co/600x400?text=Cover'}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/600x400?text=项目封面";
                      }}
                    />
                  )}
                </div>
              </div>

              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                <CardDescription className="group-hover:opacity-100 opacity-70 transition-opacity">
                  {project.description}
                </CardDescription>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={project.link} target="_blank">
                    源代码
                    <ExternalLinkIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {project.demoLink && (
                  <Button size="sm" asChild>
                    <Link href={project.demoLink} target="_blank">
                      在线演示
                      <ExternalLinkIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
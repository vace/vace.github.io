# Copilot Instructions for Vace's Personal Blog

## Architecture Overview

This is a **Next.js 15 personal blog** with App Router, featuring sophisticated MDX compilation and a custom blog post caching system. The architecture centers around these key patterns:

- **Static blog generation**: Markdown/MDX posts in `_posts/` → JSON cache → static pages
- **Modular MDX processing**: Custom rehype/remark plugins for enhanced content rendering
- **Component-driven UI**: Radix UI + Tailwind CSS with custom design system
- **Performance-first**: Build-time caching, static generation, and optimized images

## Critical Development Workflows

### Blog Post Management
- Posts live in `_posts/{category}/filename.md` with frontmatter (title, date, summary, tags)
- **Cache regeneration**: Run `pnpm dev` or `pnpm build` triggers `bin/generator-post-cache.ts`
- Cache output: `src/modules/blog/.posts.cache.json` (auto-generated, don't edit manually)
- New posts require restart in dev mode to rebuild cache

### Development Commands
```bash
pnpm dev          # Development with Turbopack
pnpm build        # Production build with cache generation
pnpm dev-inspect  # Debug mode with Node inspector
```

### MDX Compilation Pipeline
- Source: `src/modules/mdx/mdx-compile.ts` - handles both .md and .mdx files
- Plugins: `src/modules/mdx/plugins/` - custom remarkImage, rehypeCode, remarkInstall, etc.
- Output: Serialized function-body format for runtime execution

## Project-Specific Conventions

### File Organization Patterns
- **Modules**: `src/modules/{blog,mdx,shiki}/` - domain-specific logic
- **Components**: Flat structure in `src/components/{ui,layout,pages,providers}/`
- **App Routes**: Follow Next.js 15 App Router conventions in `src/app/`
- **Utilities**: Shared helpers in `src/lib/` and `src/common/`

### Blog Post Structure
```typescript
// Required frontmatter in _posts/**/*.md
title: string
date: string (ISO format)
summary: string
tags: string[]
image?: string (optional)
```

### Custom MDX Features
- **Code blocks**: Enhanced with Shiki syntax highlighting and language tabs
- **Install commands**: `remarkInstall` plugin converts package managers (npm/yarn/pnpm)
- **Table of Contents**: Auto-generated from headings with `rehypeToc`
- **Image optimization**: Custom loader in `src/lib/next-image-loader.ts`

### Blog Formatting Standards
When creating or editing blog posts, follow these formatting conventions:

#### Front Matter Requirements
```yaml
---
title: "Article title (auto-generated if missing)"
date: YYYY-MM-DD (current date if new)
summary: "150-character summary of core content and technical points"
tags: [English, Technical, Terms] # 1-5 tags, technical terms in English
---
```

#### Extended MDX Components
- **Cards**: Use for feature highlights or related links
  ```mdx
  <Cards>
    <Card title="Feature Name">Description text</Card>
  </Cards>
  ```
- **Callouts**: For tips, warnings, and important notes
  ```mdx
  <Callout type="error" title="Warning">Important message</Callout>
  ```
- **Code Tabs**: Multiple language examples
  ```mdx
  ```js tab="JavaScript"
  console.log('Hello');
  ```
  
  ```ts tab="TypeScript" 
  console.log('Hello');
  ```
  ```
- **Code Titles**: Named code blocks
  ```mdx
  ```js title="example.js"
  console.log('Hello World');
  ```
  ```

#### Content Structure
- Use `## Secondary` and `### Tertiary` headings for structure
- Technical terms in `inline code blocks`
- Key conclusions in `> blockquotes`
- Complex processes as numbered lists
- Professional terminology in English, avoid Chinese translations
- Add PlantUML diagrams for complex system flows, architecture diagrams, or process visualizations

## Integration Points

### Theme System
- Uses `next-themes` with Radix UI dark mode support
- Theme provider in `src/components/providers/theme-provider.tsx`
- CSS variables defined in `src/app/global.css`

### Performance Monitoring
- Vercel Analytics and Speed Insights integrated in root layout
- Custom reading time calculation in `src/lib/reading-time.ts`

### Static Generation
- **Blog posts**: `generateStaticParams()` in `src/app/blog/[slug]/page.tsx`
- **Metadata**: Dynamic OG image generation via `src/app/og/route.tsx`
- **Sitemap/RSS**: Generated in `src/app/{sitemap.ts,rss/route.ts}`

## Key Files for Understanding

- `next.config.ts` - Build-time cache generation and MDX configuration
- `src/modules/blog/model.ts` - Core blog data layer and caching logic
- `src/modules/mdx/mdx-compile.ts` - MDX processing pipeline
- `bin/generator-post-cache.ts` - Build-time blog post indexing
- `src/common/config.ts` - Site configuration and metadata

## Component Patterns

### UI Components
- Built with Radix UI primitives + custom styling
- Consistent use of `clsx` and `tailwind-merge` for conditional classes
- Motion animations with Framer Motion (`motion` package)

### Layout Structure
```tsx
// Standard page wrapper pattern
<Body> {/* Custom container with responsive padding */}
  <article className="max-w-screen-2xl mx-auto py-4 px-4 md:px-0">
    {/* Page content */}
  </article>
</Body>
```

When working on this codebase, always consider the blog caching system and ensure MDX plugins are properly configured for new content features.

## Blog Content Guidelines

When formatting or creating blog posts:
1. **Preserve technical accuracy** - never alter original implementation logic
2. **Use English for technical terms** - avoid Chinese translations of programming concepts  
3. **Structure with clear headings** - use ## and ### for logical content hierarchy
4. **Enhance with MDX components** - utilize Cards, Callouts, and code tabs where appropriate
5. **Add visual documentation** - use PlantUML for architecture diagrams, sequence flows, and complex system interactions
6. **Technical explanations** - add brief explanations for professional terms when necessary
7. **Implementation details** - include "Implementation Principles" sections for technical deep-dives
8. **Cache considerations** - new posts require `pnpm dev` restart to rebuild cache
9. **Maintain frontmatter consistency** - ensure all required metadata fields are present

### Document Formatting Optimization

#### Enhanced Content Guidelines
- **Code examples**: Always include usage scenarios before code blocks
- **Technical difficulties**: Add inline comments for complex implementations
- **Visualization suggestions**: Use tables, flowcharts, or PlantUML diagrams for result presentation
- **Process documentation**: Break down complex workflows into numbered lists
- **Professional terminology**: Prefer English technical terms over Chinese translations

#### PlantUML Usage Scenarios
- **System Architecture**: Component relationships and data flows
- **Sequence Diagrams**: API interactions and process flows  
- **Class Diagrams**: Object-oriented design patterns
- **Deployment Diagrams**: Infrastructure and service topology
- **State Diagrams**: Application state transitions

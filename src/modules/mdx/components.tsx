import type {
  AnchorHTMLAttributes,
  FC,
  HTMLAttributes,
  ImgHTMLAttributes,
  TableHTMLAttributes,
} from 'react';

import NextImage, { ImageProps } from 'next/image'

import { cn } from '@/lib/utils'

import { Accordion, Accordions } from './components/accordion'
import { Banner } from './components/banner'
import { Callout } from './components/callout'
import { Card, Cards } from './components/card'
import { CodeBlock, Pre } from './components/codeblock'
import { Heading } from './components/heading'
import { ImageZoom } from './components/image-zoom'
import Link from './components/link'
import { Step, Steps } from './components/steps'
import { Tab, Tabs } from './components/tabs'
import { TypeTable } from './components/type-table'

// function Image(
//   props: ImageProps
// ) {
//   return (
//     <NextImage
//       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
//       {...props}
//       src={props.src as unknown as string}
//       className={cn('rounded-lg', props.className)}
//     />
//   );
// }

function Table(props: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative overflow-auto prose-no-margin my-6">
      <table {...props} />
    </div>
  );
}

export const defaultMdxComponents = {
  pre: (props: HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock {...props}>
      <Pre>{props.children}</Pre>
    </CodeBlock>
  ),
  Card,
  Cards,
  a: Link as FC<AnchorHTMLAttributes<HTMLAnchorElement>>,
  img: ImageZoom,
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h1" {...props} />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h2" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h3" {...props} />
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h4" {...props} />
  ),
  h5: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h5" {...props} />
  ),
  h6: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h6" {...props} />
  ),
  table: Table,
  
  Callout,
  Tab,
  Tabs,

  /**
   * extends
   */
  // Popup,
  // PopupContent,
  // PopupTrigger,
  TypeTable,
  CodeBlock,
  blockquote: Callout,
  Accordions,
  Accordion,
  Banner,
  Steps,
  Step,
}

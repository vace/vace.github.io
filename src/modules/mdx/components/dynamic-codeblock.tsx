'use client';
import { cn } from '@/lib/utils';
import { CodeBlock, Pre } from './codeblock';
import { useShiki } from '@/modules/shiki/client';
import { HighlightOptionsCommon, HighlightOptionsThemes } from '@/modules/shiki';

const components = {
  pre(props) {
    return (
      <CodeBlock {...props} className={cn('my-0', props.className)}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    );
  },
} satisfies HighlightOptionsCommon['components'];

export function DynamicCodeBlock({
  lang,
  code,
  options,
}: {
  lang: string;
  code: string;
  options?: Omit<HighlightOptionsCommon, 'lang'> & HighlightOptionsThemes;
}) {
  return useShiki(code, {
    lang,
    ...options,
    components: {
      ...components,
      ...options?.components,
    },
    withPrerenderScript: true,
  });
}

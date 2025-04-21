'use client';
import { useEffect, useRef, useState } from 'react';
import * as Primitive from './primitive'
import { TOCItemType } from './types';
import { TocThumb } from './toc-thumb';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, SquareArrowUp, TextIcon } from 'lucide-react';
import { Toc, TOCScrollArea } from './toc';
import { MaxTocDepth } from '@/common/config';

export default function ClerkTOCItems({ items }: { items: TOCItemType[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [svg, setSvg] = useState<{
    path: string;
    width: number;
    height: number;
  }>();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    function onResize(): void {
      if (container.clientHeight === 0) return;
      let w = 0,
        h = 0;
      const d: string[] = [];
      for (let i = 0; i < items.length; i++) {
        const element: HTMLElement | null = container.querySelector(
          `a[href="#${items[i].url.slice(1)}"]`,
        );
        if (!element) continue;

        const styles = getComputedStyle(element);
        const offset = getLineOffset(items[i].depth) + 1,
          top = element.offsetTop + parseFloat(styles.paddingTop),
          bottom =
            element.offsetTop +
            element.clientHeight -
            parseFloat(styles.paddingBottom);

        w = Math.max(offset, w);
        h = Math.max(h, bottom);

        d.push(`${i === 0 ? 'M' : 'L'}${offset} ${top}`);
        d.push(`L${offset} ${bottom}`);
      }

      setSvg({
        path: d.join(' '),
        width: w + 1,
        height: h,
      });
    }

    const observer = new ResizeObserver(onResize);
    onResize();

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [items]);

  if (!items.length) {
    return null
  }

  return (
    <Toc>
      <h3 className="inline-flex items-center gap-1.5 text-sm">
        <TextIcon className="size-4" />
        On this page
      </h3>
      <TOCScrollArea>

        {svg ? (
          <div
            className="absolute start-0 top-0 rtl:-scale-x-100"
            style={{
              width: svg.width,
              height: svg.height,
              maskImage: `url("data:image/svg+xml,${
                // Inline SVG
                encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1" fill="none" /></svg>`,
                )
                }")`,
            }}
          >
            <TocThumb
              containerRef={containerRef}
              className="mt-(--fd-top) h-(--fd-height) bg-primary transition-all"
            />
          </div>
        ) : null}

        <div className="flex flex-col" ref={containerRef}>
          {items.map((item, i) => (
            <TOCItem
              key={item.url}
              item={item}
              upper={items[i - 1]?.depth}
              lower={items[i + 1]?.depth}
            />
          ))}
        </div>
      </TOCScrollArea>

      <h3
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer hover:text-foreground mt-2"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUpIcon className="size-4" />
        Scroll to top
      </h3>
    </Toc>
  );
}

function getItemOffset(depth: number): number {
  if (depth <= 2) return 14;
  if (depth === 3) return 26;
  return 36;
}

function getLineOffset(depth: number): number {
  return depth >= 3 ? 10 : 0;
}

function TOCItem({
  item,
  upper = item.depth,
  lower = item.depth,
}: {
  item: TOCItemType;
  upper?: number;
  lower?: number;
}) {

  if (item.depth > MaxTocDepth) {
    return null
  }
  const offset = getLineOffset(item.depth),
    upperOffset = getLineOffset(upper),
    lowerOffset = getLineOffset(lower);

  return (
    <Primitive.TOCItem
      href={item.url}
      style={{
        paddingInlineStart: getItemOffset(item.depth),
      }}
      className="prose relative py-1.5 text-sm text-muted-foreground transition-colors [overflow-wrap:anywhere] first:pt-0 last:pb-0 data-[active=true]:text-primary"
    >
      {offset !== upperOffset ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className="absolute -top-1.5 start-0 size-4 rtl:-scale-x-100"
        >
          <line
            x1={upperOffset}
            y1="0"
            x2={offset}
            y2="12"
            className="stroke-foreground/10"
            strokeWidth="1"
          />
        </svg>
      ) : null}
      <div
        className={cn(
          'absolute inset-y-0 w-px bg-foreground/10',
          offset !== upperOffset && 'top-1.5',
          offset !== lowerOffset && 'bottom-1.5',
        )}
        style={{
          insetInlineStart: offset,
        }}
      />
      {item.title}
    </Primitive.TOCItem>
  );
}

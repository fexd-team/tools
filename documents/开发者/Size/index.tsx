/**
 * inline: true
 */
import React, { useState, useEffect, useMemo } from 'react'
import { groupBy } from '@fexd/tools'

import './index.less'

const TIER_COLORS = [
  { max: 0.05, cls: 'low-1' },
  { max: 0.15, cls: 'low-2' },
  { max: 0.25, cls: 'med-1' },
  { max: 0.4, cls: 'med-2' },
  { max: 0.5, cls: 'med-3' },
  { max: 0.7, cls: 'high-1' },
  { max: 1.01, cls: 'high-2' },
]

function getBGClass(ratio: number) {
  return (TIER_COLORS.find((t) => ratio < t.max) || TIER_COLORS[6]).cls
}

function formatSize(value: number) {
  if (value < 1024) return { size: value, unit: 'B' }
  if (value < 1048576) return { size: value / 1024, unit: 'kB' }
  return { size: value / 1048576, unit: 'MB' }
}

function SizeLabel({ value }: { value: number }) {
  const { size, unit } = formatSize(value)
  return (
    <span className="eas__pill-size">
      {size < 10 ? size.toFixed(1) : Math.round(size)}
      <span className="eas__pill-size-unit">{unit}</span>
    </span>
  )
}

export default () => {
  const [data, setData] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [format, setFormat] = useState<'esm' | 'cjs'>('esm')

  useEffect(() => {
    const base = window.location.href.includes('/tools/') ? '/tools/' : '/'
    fetch(`${base}size.json`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  const { items, maxGzip, totalGzip, groups } = useMemo(() => {
    if (!data)
      return {
        items: [] as any[],
        maxGzip: 1,
        totalGzip: 0,
        groups: {} as Record<string, any[]>,
      }

    const q = search.toLowerCase()
    const all = (data[format] || [])
      .filter((i: any) => !i.name.endsWith('/index'))
      .map((i: any) => {
        const name = i.name.replace(/@fexd\/tools\/(es|lib)\//, '')
        return { ...i, shortName: name }
      })
      .filter((i: any) => !q || i.shortName.toLowerCase().includes(q))
      .sort((a: any, b: any) => b.rawGzip - a.rawGzip)

    const maxGzip = Math.max(...all.map((i: any) => i.rawGzip), 1)
    const totalGzip = all.reduce((s: number, i: any) => s + i.rawGzip, 0)

    const grouped = groupBy(
      (item: any) => item.shortName[0]?.toUpperCase?.(),
      all
    )

    return { items: all, maxGzip, totalGzip, groups: grouped }
  }, [data, search, format])

  if (!data) {
    return <div className="eas__loading">加载体积数据中...</div>
  }

  const totalFmt = formatSize(totalGzip)
  const shouldShowLabels = items.length > 20

  return (
    <div className="eas">
      <h1 className="eas__title">
        @fexd/tools
        <span className="eas__title-badge">{format.toUpperCase()}</span>
      </h1>

      <div className="eas__topbar">
        <div className="eas__total">
          总包体积：
          <span className="eas__total-value">
            {totalFmt.size.toFixed(1)}
            <span className="eas__pill-size-unit">{totalFmt.unit}</span>
          </span>
          <span className="eas__total-count">{items.length} 个导出</span>
        </div>

        <div className="eas__controls">
          <div className="eas__filter-wrap">
            <input
              placeholder="Filter exports..."
              className="eas__filter-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              className="eas__filter-icon"
              width="90"
              height="90"
              viewBox="0 0 90 90"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M89.32 86.5L64.25 61.4C77.2 47 76.75 24.72 62.87 10.87 55.93 3.92 46.7.1 36.87.1s-19.06 3.82-26 10.77C3.92 17.8.1 27.05.1 36.87s3.82 19.06 10.77 26c6.94 6.95 16.18 10.77 26 10.77 9.15 0 17.8-3.32 24.55-9.4l25.08 25.1c.38.4.9.57 1.4.57.52 0 1.03-.2 1.42-.56.78-.78.78-2.05 0-2.83zM36.87 69.63c-8.75 0-16.98-3.4-23.17-9.6-6.2-6.2-9.6-14.42-9.6-23.17 0-8.75 3.4-16.98 9.6-23.17 6.2-6.2 14.42-9.6 23.17-9.6 8.75 0 16.98 3.4 23.18 9.6 12.77 12.75 12.77 33.55 0 46.33-6.2 6.2-14.43 9.6-23.18 9.6z" />
            </svg>
          </div>
          <div className="eas__format-toggle">
            {(['esm', 'cjs'] as const).map((f) => (
              <button
                key={f}
                className={`eas__format-btn ${
                  format === f ? 'eas__format-btn--active' : ''
                }`}
                onClick={() => setFormat(f)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="eas__list">
        {Object.entries(groups)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([letter, list]) => (
            <div key={letter} className="eas__letter-group">
              {shouldShowLabels && (
                <h3 className="eas__letter-heading">{letter}</h3>
              )}
              {(list as any[]).map((item) => {
                const ratio = item.rawGzip / maxGzip
                return (
                  <li key={item.shortName} className="eas__pill">
                    <div
                      className={`eas__pill-fill eas__pill-fill--${getBGClass(
                        ratio
                      )}`}
                      style={{ transform: `scaleX(${Math.min(ratio, 1)})` }}
                    />
                    <div className="eas__pill-name">{item.shortName}</div>
                    <SizeLabel value={item.rawGzip} />
                  </li>
                )
              })}
            </div>
          ))}
      </ul>

      {items.length === 0 && <div className="eas__empty">无匹配结果</div>}

      <div className="eas__footer">
        数据来源：<code>npm run size</code> · webpack 独立打包 + gzip ·
        不含共享依赖去重
      </div>
    </div>
  )
}

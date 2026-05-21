import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const SkeletonBase = styled.span`
  display: inline-block;
  width: ${({ $width }) => (typeof $width === 'number' ? `${$width}px` : $width || '100%')};
  height: ${({ $height }) => (typeof $height === 'number' ? `${$height}px` : $height || '20px')};
  border-radius: ${({ $circle, $borderRadius, theme }) =>
    $circle ? '50%' : $borderRadius || theme.borderRadii.sm};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceHover} 25%,
    ${({ theme }) => theme.colors.surface} 37%,
    ${({ theme }) => theme.colors.surfaceHover} 63%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  line-height: 1;
`

export default function Skeleton({ width, height, circle, borderRadius, count, style }) {
  const countVal = count || 1

  if (countVal > 1) {
    return (
      <>
        {Array.from({ length: countVal }).map((_, i) => (
          <SkeletonBase
            key={i}
            $width={width}
            $height={height}
            $circle={circle}
            $borderRadius={borderRadius}
            style={{ ...style, display: 'block', marginBottom: 4 }}
          />
        ))}
      </>
    )
  }

  return (
    <SkeletonBase
      $width={width}
      $height={height}
      $circle={circle}
      $borderRadius={borderRadius}
      style={style}
    />
  )
}

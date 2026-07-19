import {useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function useScrollAnimation() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100])

  return { ref, opacity, y }
}

export function useParallax() {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, (value) => value * 0.5)

  return { ref, y }
}

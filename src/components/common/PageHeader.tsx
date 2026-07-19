import { Container } from './Container'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
}

/** Consistent page title block used across routed pages. */
export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <Container className="py-12 md:py-16">
      {eyebrow && (
        <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-[0.2em]">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
          {description}
        </p>
      )}
    </Container>
  )
}

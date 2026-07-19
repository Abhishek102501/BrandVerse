import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { footerNav } from '@/config/site'
import { paths } from '@/app/router/paths'
import { Github, Twitter, Linkedin } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export function Footer() {
  const socials = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <Container className="py-12 md:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-12"
        >
          {/* Top section */}
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Brand column */}
            <motion.div variants={itemVariants}>
              <Link to={paths.home} className="group mb-4 flex items-center gap-2">
                <motion.div
                  className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-lg font-display text-lg font-bold"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  B
                </motion.div>
                <span className="font-display text-lg font-bold">BrandVerse</span>
              </Link>

              <p className="text-muted-foreground max-w-sm">
                Discover, compare, and follow fashion brands you love. Ranked by
                ratings, reviews, and sustainability.
              </p>

              <div className="mt-6 flex gap-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="bg-accent hover:bg-primary hover:text-primary-foreground grid size-10 place-items-center rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="size-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-8"
            >
              {footerNav.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-wider">
                    {section.title}
                  </h3>

                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.to}>
                        <motion.div
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            to={item.to}
                            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="h-px bg-gradient-to-r from-transparent via-muted to-transparent"
          />

          {/* Bottom section */}
          <motion.div
            variants={itemVariants}
            className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm sm:flex-row"
          >
            <div>© {currentYear} BrandVerse. All rights reserved.</div>

            <div className="flex gap-6">
              {[
                { label: 'Privacy', href: '#' },
                { label: 'Terms', href: '#' },
                { label: 'Cookies', href: '#' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="hover:text-foreground transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </footer>
  )
}
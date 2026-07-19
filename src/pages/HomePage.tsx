import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturedBrandsSection } from '@/components/sections/FeaturedBrandsSection'
import { TrendingBrandsSection } from '@/components/sections/TrendingBrandsSection'
import { EditorPicksSection } from '@/components/sections/EditorPicksSection'
import { CategoriesSection } from '@/components/sections/CategoriesSection'
import { Newsletter } from '@/components/brand/Newsletter'
import { PageTransition } from '@/components/common/PageTransition'
import { paths } from '@/app/router/paths'

export function HomePage() {
  const navigate = useNavigate()

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`${paths.brands}?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <PageTransition>
      <motion.div className="min-h-screen">
        <HeroSection onSearch={handleSearch} />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FeaturedBrandsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <TrendingBrandsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <EditorPicksSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <CategoriesSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Newsletter />
        </motion.div>
      </motion.div>
    </PageTransition>
  )
}

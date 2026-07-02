'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

const HeroSection = () => {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/chatbot')
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-b border-purple-100">
      {/* Soft colored glow accents */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <Badge
            variant="outline"
            className="mb-5 bg-white/80 backdrop-blur text-purple-700 border-purple-200 px-4 py-2 text-sm shadow-sm"
          >
            <Sparkles className="w-4 h-4 mr-2 text-pink-500" />
            AI-Powered OCT Analysis
          </Badge>

          {/* Main Title */}
          <h1 className="font-display text-5xl md:text-7xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            OCTina
          </h1>

          <h2 className="font-display text-xl md:text-2xl font-medium text-gray-800 mb-5 leading-relaxed">
            Advanced OCT Scan Analysis with{' '}
            <span className="text-purple-600 font-semibold">AI Precision</span>
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the future of ophthalmology diagnostics. OCTina combines cutting-edge AI
            with medical expertise to deliver comprehensive OCT scan analysis in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg shadow-purple-500/25"
            >
              Launch OCTina
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-purple-300 bg-white/70 backdrop-blur text-purple-700 hover:bg-white px-8 py-4 text-lg rounded-full"
            >
              Learn More
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="border border-purple-100 bg-white/80 backdrop-blur shadow-md shadow-purple-500/5 h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600 text-sm">Get comprehensive OCT analysis in under 3 seconds</p>
              </CardContent>
            </Card>

            <Card className="border border-blue-100 bg-white/80 backdrop-blur shadow-md shadow-blue-500/5 h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">Medical Grade</h3>
                <p className="text-gray-600 text-sm">Professional-level accuracy you can trust</p>
              </CardContent>
            </Card>

            <Card className="border border-emerald-100 bg-white/80 backdrop-blur shadow-md shadow-emerald-500/5 h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">Secure Processing</h3>
                <p className="text-gray-600 text-sm">Your data is processed with enterprise-grade security</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

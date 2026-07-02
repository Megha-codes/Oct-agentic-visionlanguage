'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Brain,
  FileImage,
  BarChart3,
  Users,
  Lock,
  Globe,
  Clock,
  Target,
  Award,
  Crosshair,
  ArrowRight,
} from 'lucide-react'

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms trained on thousands of OCT scans for accurate diagnosis",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FileImage,
      title: "Multi-Format Support",
      description: "Supports JPG, PNG, DICOM and other medical imaging formats",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Detailed Reports",
      description: "Comprehensive analysis with measurements, comparisons, and treatment recommendations",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Users,
      title: "Collaborative Care",
      description: "Share results with colleagues and integrate with existing medical workflows",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Secure data processing with end-to-end encryption and protected storage",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Globe,
      title: "Cloud-Based",
      description: "Access from anywhere, anytime with no installation required",
      color: "from-pink-500 to-rose-500"
    }
  ]

  const stats = [
    { icon: Clock, value: "3s", label: "Average Analysis Time", color: "text-purple-600" },
    { icon: Target, value: "99.2%", label: "Accuracy Rate", color: "text-blue-600" },
    { icon: Users, value: "10K+", label: "Medical Professionals", color: "text-green-600" },
    { icon: Award, value: "Secure", label: "Data Protection", color: "text-orange-600" }
  ]

  return (
    <section className="section-bg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-3 bg-purple-100 text-purple-800 border-purple-300">
            Advanced Features
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Why Choose OCTina?
          </h2>
          <p className="text-base text-gray-700 max-w-2xl mx-auto">
            Experience the perfect blend of cutting-edge AI technology and medical expertise designed for modern healthcare professionals.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-t-4 border-t-purple-500 border border-gray-100 shadow-sm">
              <CardContent className="p-6 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="font-display text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white border border-gray-200 shadow-sm"
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="font-display text-xl font-bold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Annotation Tool CTA */}
        <div className="mt-10">
          <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-10">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                    <Crosshair className="w-10 h-10 text-cyan-400" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Badge className="mb-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20">
                    New Tool
                  </Badge>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    Macular Hole Annotation Tool
                  </h3>
                  <p className="text-slate-400 leading-relaxed max-w-xl">
                    Precisely measure and annotate macular holes on OCT B-scans. Calculate MHI, DHI, THI, HFF and Close Index indices with pixel-level accuracy. Get an instant surgical prognosis based on established clinical thresholds.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    {['MHI', 'DHI', 'THI', 'HFF', 'Close Index', 'Surgical Prognosis'].map(tag => (
                      <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link href="/annotation-tool">
                    <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-cyan-500/25 flex items-center gap-2">
                      Open Tool
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Badge */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg">
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
              <Lock className="w-4 h-4 mr-2" />
              Enterprise Grade
            </Badge>
            <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
              <Users className="w-4 h-4 mr-2" />
              Medical Professional Approved
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
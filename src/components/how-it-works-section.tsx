'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Brain, 
  FileText, 
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react'

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload OCT Scan",
      description: "Simply drag and drop your OCT scan image or click to browse. We support multiple formats including DICOM.",
      color: "from-purple-500 to-pink-500",
      time: "10 seconds"
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our advanced AI processes your scan using sophisticated algorithms trained on thousands of medical images.",
      color: "from-blue-500 to-cyan-500",
      time: "2-3 seconds"
    },
    {
      icon: FileText,
      title: "Get Report",
      description: "Receive a comprehensive analysis with detailed findings, measurements, and professional recommendations.",
      color: "from-green-500 to-teal-500",
      time: "Instant"
    }
  ]

  return (
    <section className="section-bg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-3 bg-purple-100 text-purple-700 border-purple-200">
            Simple Process
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            How OCTina Works
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Get professional OCT scan analysis in three simple steps. No complex software, no waiting.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                {index + 1}
              </div>

              <Card className="h-full bg-white border-t-4 border-t-purple-500 border border-gray-100 shadow-sm">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-6`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-display text-xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      <Clock className="w-3 h-3 mr-1" />
                      {step.time}
                    </Badge>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <ArrowRight className="w-8 h-8 text-purple-500" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Trusted by Medical Professionals
            </h3>
            <p className="text-gray-800 dark:text-gray-300">
              Join thousands of healthcare providers who rely on OCTina for accurate OCT analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                No Installation Required
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-300">
                Access directly from your web browser
              </p>
            </div>
            
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Secure & Private
              </h4>
              <p className="text-sm text-gray-800 dark:text-gray-300">
                Your data is encrypted and protected
              </p>
            </div>
            
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Always Up-to-Date
              </h4>
              <p className="text-sm text-gray-800 dark:text-gray-300">
                Latest AI models and medical insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
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
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
            Simple Process
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            How OCTina Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get professional OCT scan analysis in three simple steps. No complex software, no waiting.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                {index + 1}
              </div>

              <Card className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                      <Clock className="w-3 h-3 mr-1" />
                      {step.time}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <ArrowRight className="w-8 h-8 text-purple-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
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
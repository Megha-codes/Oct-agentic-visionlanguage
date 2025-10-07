'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Shield, Info, CheckCircle } from 'lucide-react'

const DisclaimerBox = () => {
  return (
    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Important Medical Disclaimer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm mb-1">
                AI-Assisted Analysis
              </h4>
              <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                OCTina provides AI-assisted analysis and should not replace professional medical diagnosis. 
                All results should be reviewed by qualified healthcare professionals.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm mb-1">
                Professional Review Required
              </h4>
              <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                This tool is designed to assist healthcare professionals, not replace their clinical judgment. 
                Always verify AI-generated insights with medical expertise.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm mb-1">
                Emergency Situations
              </h4>
              <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                In case of medical emergencies or urgent conditions, seek immediate professional medical care. 
                This platform is not intended for emergency diagnosis.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-amber-200 dark:border-amber-700">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600 text-xs">
              HIPAA Compliant
            </Badge>
            <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600 text-xs">
              For Professional Use
            </Badge>
            <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600 text-xs">
              Quality Assured
            </Badge>
          </div>
        </div>

        <div className="text-xs text-amber-600 dark:text-amber-400 italic">
          By using OCTina, you acknowledge that you are a healthcare professional or acting under the guidance of one. 
          Use responsibly and in accordance with applicable medical standards and regulations.
        </div>
      </CardContent>
    </Card>
  )
}

export default DisclaimerBox
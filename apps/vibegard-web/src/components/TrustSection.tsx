import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Shield, Eye, CheckCircle2 } from 'lucide-react';

export default function TrustSection() {
  return (
    <div className="container mx-auto max-w-6xl space-y-16">
      {/* Header */}
      <div className="text-center space-y-5">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Why Teams Trust SecretGuard
        </h2>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
          Built for modern workflows where AI assistants are essential,
          <br />
          but <span className="font-medium text-foreground">data privacy is non-negotiable</span>
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="group transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border-teal-200/30 dark:border-teal-800/30">
          <CardHeader className="space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 backdrop-blur-sm border border-teal-500/20 dark:border-teal-400/20 shadow-lg shadow-teal-500/10 group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-7 w-7 text-teal-600 dark:text-teal-400" strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-xl font-bold">Real-Time Detection</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Advanced pattern matching instantly identifies 15+ types of sensitive data—API keys, credentials, PII, and financial information—as you type.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="group transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border-teal-200/30 dark:border-teal-800/30">
          <CardHeader className="space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 backdrop-blur-sm border border-teal-500/20 dark:border-teal-400/20 shadow-lg shadow-teal-500/10 group-hover:scale-110 transition-transform duration-300">
              <Eye className="h-7 w-7 text-teal-600 dark:text-teal-400" strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-xl font-bold">Visual Comparison</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                See exactly what gets masked with side-by-side highlighting. Review and verify before sharing with ChatGPT, Claude, or your team's LLM tools.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="group transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border-teal-200/30 dark:border-teal-800/30">
          <CardHeader className="space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 backdrop-blur-sm border border-teal-500/20 dark:border-teal-400/20 shadow-lg shadow-teal-500/10 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 className="h-7 w-7 text-teal-600 dark:text-teal-400" strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-xl font-bold">Zero Trust Security</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Everything processes in your browser. No servers, no APIs, no data collection. Your sensitive information never leaves your device.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Built for Teams Who Value Privacy
          </h3>
          <p className="text-sm text-muted-foreground font-light max-w-2xl mx-auto">
            Whether you're shipping code, analyzing data, or helping customers—protect what matters most
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
              { 
                role: 'Software Developers', 
                desc: 'Share code snippets and error logs with AI assistants safely. Keep your AWS credentials, database connection strings, and API keys completely private.',
                icon: '💻'
              },
              { 
                role: 'Data Analysts', 
                desc: 'Collaborate with AI on datasets without risking exposure of personal information, social security numbers, or sensitive financial data.',
                icon: '📊'
              },
              { 
                role: 'Support Teams', 
                desc: 'Get instant AI-powered help on customer issues while automatically redacting contact information, addresses, and account details.',
                icon: '🎧'
              },
              { 
                role: 'Compliance Teams', 
                desc: 'Stay compliant with GDPR, HIPAA, and SOC2 regulations while still benefiting from AI productivity tools and automation.',
                icon: '🛡️'
              },
            ].map((useCase, idx) => (
              <Card key={idx} className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-teal-200/30 dark:border-teal-800/30">
                <CardContent className="p-6">
                  <div className="flex gap-4 items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 dark:bg-teal-400/10 backdrop-blur-sm border border-teal-500/20 dark:border-teal-400/20 shadow-lg shadow-teal-500/10 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">{useCase.icon}</span>
                    </div>
                    <div className="space-y-2 flex-1">
                      <h5 className="font-semibold text-base text-foreground leading-tight">
                        {useCase.role}
                      </h5>
                      <p className="text-sm leading-relaxed text-muted-foreground font-light">
                        {useCase.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

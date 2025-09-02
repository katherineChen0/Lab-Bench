import Link from 'next/link';
import { ArrowRight, Database, FlaskConical, Code, Zap, BarChart3, Lock } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

export default function Home() {
  const features = [
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: 'Manage Datasets',
      description: 'Easily upload, version, and manage your datasets in one place.',
      href: '/datasets'
    },
    {
      icon: <FlaskConical className="h-6 w-6 text-primary" />,
      title: 'Run Experiments',
      description: 'Track and compare different ML models and hyperparameters.',
      href: '/experiments'
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: 'Visualize Results',
      description: 'Interactive visualizations to understand model performance.',
      href: '#'
    },
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: 'API Access',
      description: 'Integrate with your existing ML workflow using our REST API.',
      href: '#'
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: 'Local-First',
      description: 'Your data stays on your machine. No cloud required.',
      href: '#'
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: 'Fast & Lightweight',
      description: 'Built with performance in mind. No heavy dependencies.',
      href: '#'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Machine Learning,
                <br />
                Simplified.
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-6">
                A local-first platform for running machine learning experiments with zero boilerplate.
                Focus on your models, not infrastructure.
              </p>
            </div>
            <div className="space-x-4 mt-8">
              <Button asChild size="lg">
                <Link href="/datasets" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/experiments">
                  View Experiments
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                A complete toolkit for your machine learning workflow, all in one place.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {feature.title}
                    </CardTitle>
                    <div className="rounded-md bg-primary/10 p-2">
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Ready to get started?
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-8">
              Join thousands of data scientists and ML engineers who use ML Playground to accelerate their research.
            </p>
            <Button size="lg" className="mt-4" asChild>
              <Link href="/datasets/upload" className="group">
                Upload Your First Dataset
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
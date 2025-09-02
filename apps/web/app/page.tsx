import Link from 'next/link';
import { ArrowRight, Database, FlaskConical, Code, Zap, BarChart3, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  const features = [
    {
      icon: <Database className="h-5 w-5 text-primary" />,
      title: 'Manage Datasets',
      description: 'Easily upload, version, and manage your datasets in one place with our intuitive interface.',
      href: '/datasets'
    },
    {
      icon: <FlaskConical className="h-5 w-5 text-primary" />,
      title: 'Run Experiments',
      description: 'Track, compare, and reproduce ML experiments with comprehensive versioning and metrics.',
      href: '/experiments'
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      title: 'Visualize Results',
      description: 'Interactive visualizations and dashboards to analyze model performance and metrics.',
      href: '#'
    },
    {
      icon: <Code className="h-5 w-5 text-primary" />,
      title: 'API Access',
      description: 'Seamless integration with your existing ML workflow through our comprehensive REST API.',
      href: '#'
    },
    {
      icon: <Lock className="h-5 w-5 text-primary" />,
      title: 'Local-First',
      description: 'Your data stays on your machine. Full control with no cloud dependency.',
      href: '#',
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      title: 'Fast & Lightweight',
      description: 'Optimized for performance with minimal overhead. Built for modern ML workflows.',
      href: '#',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden py-20 md:py-28 lg:py-36">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        </div>
        
        <div className="container relative px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Machine Learning,
              <br />
              Simplified.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Focus on your models, not infrastructure. A local-first platform for machine learning experimentation.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/datasets"
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 px-8 font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Link>
              
              <Link
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 font-medium text-foreground shadow-sm transition-all duration-200 hover:bg-accent/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-muted/20">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Everything You Need for ML
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              A complete toolkit for your machine learning workflow, all in one place.
            </p>
          </motion.div>

          <motion.div 
            className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link href={feature.href} className="block h-full">
                  <Card className="h-full overflow-hidden border-border/40 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
                          {feature.icon}
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
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
import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowRight } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { homepageConfig } from "../../config/homepageConfig";

const Home = () => {
  const {
    branding,
    hero,
    features,
    templates,
    testimonials,
    cta,
    demoSection,
    featuresSection,
    templatesSection,
    testimonialsSection,
  } = homepageConfig;
  const LogoIcon = branding.logoIcon;

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  {hero.headline.split(hero.highlight).map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <>
                        {part}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                          {hero.highlight}
                        </span>
                      </>
                    ) : (
                      part
                    )
                  )}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  {hero.description}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {hero.cta.map((action, idx) =>
                  action.primary ? (
                    <Link to={action.to} key={idx}>
                      <Button size="lg" className="h-12 btn-primary">
                        {action.label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      key={idx}
                      size="lg"
                      variant="outline"
                      className="h-12 hover:bg-muted hover:border-blue-200 hover:text-primary transition-colors">
                      {action.label}
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="flex items-center justify-center">
              {/* Demo UI or illustration can go here */}
              <div className="relative w-full h-[350px] rounded-lg border bg-background p-4 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {demoSection.title}
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">U</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm">{demoSection.userPrompt}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                      <LogoIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm">{demoSection.aiIntro}</p>
                      <div className="flex gap-2 flex-wrap">
                        {demoSection.quickActions.map((action, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-1 gradient-accent text-primary rounded-full text-xs">
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg gradient-primary px-3 py-1 text-sm text-white">
                {featuresSection.label}
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {featuresSection.heading}
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {featuresSection.subheading}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="grid gap-4 p-6 rounded-lg bg-background border hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg gradient-accent">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Templates Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {templatesSection.heading}
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {templatesSection.subheading}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
            {templates.map((template, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg border bg-background p-2 hover:shadow-lg transition-shadow">
                <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                  <img
                    src={template.image}
                    alt={template.alt}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-background/80 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="btn-primary">
                      {templatesSection.useTemplateLabel}
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{template.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-muted hover:border-blue-200 hover:text-primary transition-colors">
              {templatesSection.viewAllLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {testimonialsSection.heading}
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {testimonialsSection.subheading}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-4 p-6 bg-background rounded-lg border hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full gradient-accent flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {cta.headline}
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {cta.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {cta.actions.map((action, idx) =>
                action.primary ? (
                  <Link to={action.to} key={idx}>
                    <Button size="lg" className="h-12 btn-primary">
                      {action.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={idx}
                    size="lg"
                    variant="outline"
                    className="h-12 hover:bg-muted hover:border-blue-200 hover:text-primary transition-colors">
                    {action.label}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;

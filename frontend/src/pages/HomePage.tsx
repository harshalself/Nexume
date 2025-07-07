"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  ArrowRight,
  Bot,
  MessageSquare,
  Zap,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { homepageConfig } from "../config/homepageConfig";

const HomePage = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const firstElement = tabRefs.current[0];
      if (firstElement) {
        const { offsetLeft, offsetWidth } = firstElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const { navTabs, branding, hero, features, templates, testimonials, cta } =
    homepageConfig;
  const LogoIcon = branding.logoIcon;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-8 flex">
            <Link to="/" className="mr-8 flex items-center space-x-2">
              <div className="p-1 rounded-lg gradient-accent">
                <LogoIcon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {branding.appName}
              </span>
            </Link>
            <nav className="flex items-center">
              <div className="relative">
                {/* Hover Highlight */}
                <div
                  className="absolute h-[30px] transition-all duration-300 ease-out gradient-accent rounded-[6px] flex items-center"
                  style={{
                    ...hoverStyle,
                    opacity: hoveredIndex !== null ? 1 : 0,
                  }}
                />

                {/* Active Indicator */}
                <div
                  className="absolute bottom-[-6px] h-[2px] bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-300 ease-out rounded-full"
                  style={activeStyle}
                />

                {/* Tabs */}
                <div className="relative flex space-x-[6px] items-center">
                  {navTabs.map((tab, index) => (
                    <Link
                      key={index}
                      to={index === 0 ? "/" : `/${tab.toLowerCase()}`}
                      ref={(el) => {
                        tabRefs.current[index] = el;
                      }}
                      className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] rounded-md ${
                        index === activeIndex
                          ? "text-primary dark:text-primary/80 font-medium"
                          : "text-[#0e0f1199] dark:text-[#ffffff99] hover:text-primary"
                      }`}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => setActiveIndex(index)}>
                      <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full">
                        {tab}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hover:bg-muted dark:hover:bg-blue-900/20 transition-colors">
              {isDarkMode ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
            <Link
              to="/signin"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted dark:hover:bg-blue-900/20">
              Sign In
            </Link>
            <Link to="/signup">
              <Button className="btn-primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
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
                <div className="relative w-full h-[350px] rounded-lg border bg-background p-4 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      AI Chatbot Builder
                    </div>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">U</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm">How can I help you today?</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm">
                          I'm your AI assistant! I can help you with questions,
                          provide information, and assist with various tasks.
                          What would you like to know?
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <div className="px-3 py-1 gradient-accent text-primary rounded-full text-xs">
                            Ask about products
                          </div>
                          <div className="px-3 py-1 gradient-accent text-primary rounded-full text-xs">
                            Get support
                          </div>
                          <div className="px-3 py-1 gradient-accent text-primary rounded-full text-xs">
                            Book a demo
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg gradient-primary px-3 py-1 text-sm text-white">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything you need to build chatbots
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From simple FAQ bots to complex AI assistants, our platform
                  provides all the tools you need.
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
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Chatbot templates for every use case
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get started quickly with our pre-built chatbot templates.
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
                        Use Template
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
                View All Templates
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
                  Trusted by thousands of businesses
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our customers are saying about their chatbot
                  experiences.
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
                  Ready to build your chatbot?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of businesses automating customer interactions
                  with AI.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/signup">
                  <Button size="lg" className="h-12 btn-primary">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 hover:bg-muted hover:border-blue-200 hover:text-primary transition-colors">
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer Section */}
      <footer className="border-t bg-background">
        <div className="container px-4 py-12 md:px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2 group">
                <LogoIcon className="h-6 w-6 text-primary group-hover:text-primary transition-colors duration-200" />
                <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {homepageConfig.footer.branding.appName}
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                {homepageConfig.footer.branding.description}
              </p>
              <div className="flex space-x-4">
                {homepageConfig.footer.social.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      aria-label={social.label}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform"
                      target="_blank"
                      rel="noopener noreferrer">
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
            {homepageConfig.footer.columns.map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-sm font-semibold text-primary">
                  {col.heading}
                </h4>
                <ul className="space-y-2 text-sm">
                  {col.links.map((link, lidx) => (
                    <li key={lidx}>
                      <Link
                        to={link.to}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p
              dangerouslySetInnerHTML={{
                __html: homepageConfig.footer.copyright,
              }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

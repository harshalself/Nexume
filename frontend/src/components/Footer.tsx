import { Link } from "react-router-dom";
import { homepageConfig } from "../config/homepageConfig";

const Footer = () => {
  const { branding, social, columns, copyright } = homepageConfig.footer;
  const LogoIcon = branding.logoIcon;
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <LogoIcon className="h-6 w-6 text-primary group-hover:text-primary transition-colors duration-200" />
              <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {branding.appName}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {branding.description}
            </p>
            <div className="flex space-x-4">
              {social.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.url}
                    aria-label={item.label}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform"
                    target="_blank"
                    rel="noopener noreferrer">
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
          {columns.map((col, idx) => (
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
          <p dangerouslySetInnerHTML={{ __html: copyright }} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

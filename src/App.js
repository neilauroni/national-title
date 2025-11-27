import React, { useState, useEffect, useRef } from "react";

/*
 * NATIONAL TITLE USA — Redesign & Expansion
 * Content: Adapted from nationaltitleusa.com structure
 */

const tokens = `
  :root {
    --ink: #0f0f0f;
    --charcoal: #2d2d2d;
    --muted: #5a5a5a;
    --subtle: #8a8a8a;
    --surface: #f8f7f5;
    --surface-warm: #f5f3f0;
    --white: #ffffff;
    --gold: #a08b5b;
    --gold-muted: rgba(160, 139, 91, 0.15);
    --hairline: rgba(15, 15, 15, 0.08);
    --hairline-strong: rgba(15, 15, 15, 0.12);
    --font-serif: "Playfair Display", Georgia, serif;
    --font-sans: "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif;
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --nav-height: 5.5rem;
  }
`;

/* --- UTILITIES --- */

function Reveal({ children, className = "", delay = 0, threshold = 0.15 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.8s var(--ease-out-expo) ${delay}ms, transform 0.8s var(--ease-out-expo) ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

function Container({ children, className = "" }) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: "1200px",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "clamp(1.5rem, 4vw, 2.5rem)",
        paddingRight: "clamp(1.5rem, 4vw, 2.5rem)",
      }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ padding: "3rem 0" }} aria-hidden="true">
      <Container>
        <div style={{ display: "flex", justifyContent: "space-between", height: "1px", position: "relative" }}>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              style={{
                width: "1px",
                height: i === 2 ? "60px" : "40px",
                background: i === 2
                  ? "linear-gradient(to bottom, transparent, var(--gold-muted) 50%, transparent)"
                  : "linear-gradient(to bottom, transparent, var(--hairline-strong) 50%, transparent)",
                transform: "translateY(-50%)",
              }}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

/* --- NAVIGATION --- */

function MinimalNav({ currentPage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About Us", id: "about" },
    { label: "Services", id: "services" },
    { label: "Resources", id: "resources" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: "var(--nav-height)",
        background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${scrolled ? "var(--hairline-strong)" : "var(--hairline)"}`,
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <Container>
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); setPage("home"); window.scrollTo(0,0); }}
            className="nav-brand"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.25rem",
              letterSpacing: "-0.01em",
              textDecoration: "none",
              color: "var(--ink)",
              position: "relative",
              zIndex: 102,
            }}
          >
            <span style={{ fontWeight: 400 }}>National Title</span>{" "}
            <span style={{ fontWeight: 600 }}>USA</span>
          </a>

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { setPage(link.id); window.scrollTo(0,0); }}
                className={`nav-link ${currentPage === link.id ? "active" : ""}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {link.label}
              </button>
            ))}
            <button onClick={() => { setPage("contact"); window.scrollTo(0,0); }} className="btn btn--primary btn--sm">
              Order Title
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ zIndex: 102, background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
          >
            <div style={{ width: '24px', height: '2px', background: 'var(--ink)', marginBottom: '6px', transition: '0.3s', transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }}></div>
            <div style={{ width: '24px', height: '2px', background: 'var(--ink)', transition: '0.3s', opacity: mobileMenuOpen ? 0 : 1 }}></div>
            <div style={{ width: '24px', height: '2px', background: 'var(--ink)', marginTop: '6px', transition: '0.3s', transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></div>
          </button>
        </div>
      </Container>

      {/* Mobile Nav Overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--white)',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s var(--ease-out-expo)',
        }}
      >
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => { setPage(link.id); setMobileMenuOpen(false); window.scrollTo(0,0); }}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.5rem', 
              fontFamily: 'var(--font-serif)', 
              color: 'var(--ink)',
              cursor: 'pointer'
            }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
}

/* --- PAGES --- */

function Home({ setPage }) {
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const handleScroll = () => {
      const offset = window.scrollY * 0.025;
      setParallaxOffset(Math.min(offset, 15));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section id="top" style={{ padding: "clamp(4rem, 8vw, 8rem) 0 clamp(6rem, 10vw, 10rem)", background: "var(--white)" }}>
        <Container>
          <div style={{ display: "grid", gap: "clamp(2rem, 5vw, 5rem)", alignItems: "center", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))" }}>
            <div style={{ maxWidth: "560px" }}>
              <Reveal>
                <h1
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2.5rem, 6vw, 4.25rem)",
                    lineHeight: 1.0,
                    letterSpacing: "-0.03em",
                    color: "var(--ink)",
                    marginBottom: "2rem",
                  }}
                >
                  Trusted Expertise,{" "}
                  <span className="hero-title-accent">Unmatched</span>{" "}
                  Service
                </h1>
              </Reveal>

              <Reveal delay={100}>
                <p style={{ fontSize: "1.0625rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "1.5rem" }}>
                  With over 20 years of experience, we are proud to be one of New York's largest and most trusted title companies. We combine a tradition of excellence with a commitment to innovation, delivering prompt, efficient, and competitively priced services.
                </p>
              </Reveal>

              <Reveal delay={160}>
                <p style={{ fontSize: "1.0625rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "1.5rem" }}>
                  When you choose us for your title needs, our expert team handles every search and report with speed, precision, and care. From expert readers to closers, every member of our staff is dedicated to ensuring timely recordings and swift disbursement.
                </p>
              </Reveal>

              <Reveal delay={280}>
                <button onClick={() => setPage("services")} className="btn btn--primary">
                  Explore Services
                </button>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <figure className="hero-frame" style={{ position: "relative", overflow: "hidden", background: "var(--surface)", margin: 0 }}>
                <span className="hero-corner hero-corner--tl" />
                <span className="hero-corner hero-corner--br" />

                <div style={{ transform: `translateY(${parallaxOffset}px)`, willChange: "transform", transition: "transform 0.1s ease-out" }}>
                  <img
                    src="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80&auto=format"
                    alt="New York City skyline"
                    style={{ width: "100%", height: "clamp(320px, 45vw, 520px)", objectFit: "cover", transform: "scale(1.05)", transition: "transform 6s cubic-bezier(0.25, 1, 0.5, 1)" }}
                    className="hero-image"
                  />
                </div>
              </figure>
            </Reveal>
          </div>
        </Container>
      </section>

      <Divider />
      <OrderSection />
    </>
  );
}

function About() {
  return (
    <div style={{ padding: "clamp(4rem, 6vw, 6rem) 0" }}>
      <Container>
        <Reveal>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", marginBottom: "3rem" }}>
            About National Title USA
          </h1>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem" }}>
          <div>
            <Reveal delay={100}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", marginBottom: "1rem", color: "var(--ink)" }}>Our History</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                Established over two decades ago, National Title USA has grown from a boutique agency into one of the premier title insurance providers in the region. Our journey is built on a foundation of integrity, accuracy, and unwavering client support.
              </p>
              <p style={{ color: "var(--muted)", lineHeight: 1.75 }}>
                We proudly underwrite through Old Republic, First American Title Insurance Company, and Security Title, providing you with strength, security, and peace of mind for every transaction.
              </p>
            </Reveal>
          </div>
          
          <div>
            <Reveal delay={200}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", marginBottom: "1rem", color: "var(--ink)" }}>Our Team</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                Our strength lies in our people. Our team consists of seasoned professionals including expert readers, clearance officers, closers, and post-closing specialists. 
              </p>
              <p style={{ color: "var(--muted)", lineHeight: 1.75 }}>
                We understand that in the real estate world, time is money. That's why our staff is dedicated to ensuring timely recordings and swift disbursement of escrows and fees, handling every detail so you don't have to.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Services() {
  const services = [
    {
      title: "Title Insurance",
      desc: "Comprehensive title insurance policies protecting owners and lenders against losses due to defects in title.",
    },
    {
      title: "Settlement Services",
      desc: "Full-service settlement handling, ensuring a smooth closing process for residential and commercial transactions.",
    },
    {
      title: "Lien Searches",
      desc: "Detailed searches for municipal liens, judgments, and other encumbrances that could affect property ownership.",
    },
    {
      title: "1031 Exchanges",
      desc: "Expert facilitation of 1031 tax-deferred exchanges to help investors maximize their real estate portfolio growth.",
    },
    {
      title: "Co-op Services",
      desc: "Specialized searches and insurance products tailored specifically for cooperative apartment transactions.",
    },
    {
      title: "Foreclosure Searches",
      desc: "Accurate and timely foreclosure certificates and searches assisting legal professionals and lenders.",
    }
  ];

  return (
    <div style={{ padding: "clamp(4rem, 6vw, 6rem) 0", background: "var(--surface)" }}>
      <Container>
        <Reveal>
          <div style={{ maxWidth: "700px", marginBottom: "4rem" }}>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", marginBottom: "1.5rem" }}>
              Our Services
            </h1>
            <p style={{ fontSize: "1.125rem", color: "var(--muted)", lineHeight: 1.75 }}>
              We offer a full suite of title and settlement services designed to meet the needs of attorneys, lenders, realtors, and homeowners.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
          {services.map((s, i) => (
            <Reveal key={i} delay={i * 50}>
              <div 
                style={{ 
                  background: "var(--white)", 
                  padding: "2.5rem", 
                  border: "1px solid var(--hairline)",
                  height: "100%",
                  transition: "transform 0.3s ease",
                }}
                className="service-card"
              >
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", marginBottom: "1rem", color: "var(--ink)" }}>
                  {s.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}

function Resources() {
  const links = [
    "Title Insurance Rate Calculator",
    "Mortgage Tax Calculator",
    "Transfer Tax Calculator",
    "Judicial Title Application",
    "Affidavit of Title",
    "Power of Attorney Form"
  ];

  return (
    <div style={{ padding: "clamp(4rem, 6vw, 6rem) 0" }}>
      <Container>
        <Reveal>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", marginBottom: "3rem" }}>
            Resources
          </h1>
        </Reveal>

        <div style={{ display: "grid", gap: "2rem", maxWidth: "800px" }}>
          <Reveal delay={100}>
            <div style={{ background: "var(--surface-warm)", padding: "3rem" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", marginBottom: "1.5rem" }}>Forms & Applications</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "1rem" }}>
                {links.map((link, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ width: "6px", height: "6px", background: "var(--gold)", borderRadius: "50%" }}></span>
                    <a href="#" style={{ color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid var(--hairline-strong)", paddingBottom: "0.25rem", width: "100%", transition: "border-color 0.2s" }} className="resource-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}

function Contact() {
  return (
    <div style={{ padding: "clamp(4rem, 6vw, 6rem) 0" }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem" }}>
          <Reveal>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", marginBottom: "2rem" }}>
              Contact Us
            </h1>
            <p style={{ fontSize: "1.125rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: "3rem" }}>
              Our team is ready to assist you with your title needs. Reach out to us via phone, email, or visit our office.
            </p>

            <div style={{ display: "grid", gap: "2rem" }}>
              <div>
                <h4 style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--subtle)", marginBottom: "0.5rem" }}>Address</h4>
                <p style={{ fontSize: "1.125rem", color: "var(--ink)" }}>
                  National Title USA<br />
                  123 Business Park Drive<br />
                  Suite 100<br />
                  New York, NY 10001
                </p>
              </div>
              
              <div>
                <h4 style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--subtle)", marginBottom: "0.5rem" }}>Contact Info</h4>
                <p style={{ fontSize: "1.125rem", color: "var(--ink)" }}>
                  Phone: (212) 555-0123<br />
                  Fax: (212) 555-0124<br />
                  Email: orders@nationaltitleusa.com
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <form style={{ background: "var(--surface)", padding: "2.5rem", border: "1px solid var(--hairline)" }} onSubmit={(e) => e.preventDefault()}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", marginBottom: "1.5rem" }}>Send a Message</h3>
              
              <div style={{ display: "grid", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "var(--muted)" }}>Name</label>
                  <input type="text" style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--hairline-strong)", background: "var(--white)", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "var(--muted)" }}>Email</label>
                  <input type="email" style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--hairline-strong)", background: "var(--white)", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "var(--muted)" }}>Message</label>
                  <textarea rows="4" style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--hairline-strong)", background: "var(--white)", fontFamily: "inherit" }}></textarea>
                </div>
                <button className="btn btn--primary" style={{ width: "100%" }}>Send Message</button>
              </div>
            </form>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}

function OrderSection() {
  return (
    <section id="order" style={{ padding: "clamp(4rem, 8vw, 8rem) 0", background: "var(--surface-warm)" }}>
      <Container>
        <Reveal>
          <div
            style={{
              position: "relative",
              background: "var(--white)",
              border: "1px solid var(--hairline)",
              padding: "clamp(2.5rem, 5vw, 4rem)",
              textAlign: "center",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            <span className="corner corner--tl" />
            <span className="corner corner--br" />

            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 400, color: "var(--ink)", marginBottom: "1.5rem", lineHeight: 1.1 }}>
              Order your title today!
            </h2>
            
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.75, color: "var(--muted)", marginBottom: "2rem" }}>
              To get started quickly, simply click the button below and provide a few initial details. We're excited to assist you and look forward to working together!
            </p>

            <button className="btn btn--primary">
              Get Started
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ borderTop: "1px solid var(--hairline)", position: "relative", background: "var(--white)" }}>
      <Container>
        <div
          style={{
            padding: "3rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "2rem"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem" }}>
              <span style={{ fontWeight: 400 }}>National Title</span>{" "}
              <span style={{ fontWeight: 600 }}>USA</span>
            </div>

            <div style={{ display: "flex", gap: "1.5rem" }}>
              {["Home", "About", "Contact"].map(item => (
                <button 
                  key={item} 
                  onClick={() => { setPage(item.toLowerCase() === "home" ? "home" : item.toLowerCase() === "about" ? "about" : "contact"); window.scrollTo(0,0); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--muted)' }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--subtle)", letterSpacing: "0.05em", textAlign: "center" }}>
            © {new Date().getFullYear()} National Title USA Agency, Inc. All rights reserved.
          </div>
        </div>
      </Container>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "200px",
          height: "2px",
          background: "linear-gradient(90deg, transparent, var(--gold) 50%, transparent)",
        }}
      />
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="ntusa-root">
      <style>{tokens}</style>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; }
        
        html { 
          font-size: 16px; 
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          scroll-behavior: smooth;
        }
        
        body { 
          margin: 0; 
          font-family: var(--font-sans); 
          color: var(--ink); 
          background: var(--white);
          line-height: 1.6;
        }
        
        img { max-width: 100%; height: auto; display: block; }
        
        .ntusa-root::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        
        .nav-brand::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--gold);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s var(--ease-out-expo);
        }
        
        .nav-brand:hover::after { transform: scaleX(1); }
        
        .nav-link {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          position: relative;
          padding: 0.5rem 0;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        
        .nav-link.active { color: var(--ink); opacity: 1; font-weight: 600; }
        
        .nav-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--gold);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.4s var(--ease-out-expo);
        }
        
        .nav-link:hover { color: var(--ink); opacity: 1; }
        .nav-link:hover::after { transform: scaleX(1); transform-origin: left; }
        .nav-link.active::after { transform: scaleX(1); }
        
        .hero-title-accent { position: relative; display: inline; }
        .hero-title-accent::after {
          content: "";
          position: absolute;
          bottom: 0.06em;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--gold);
          transform-origin: left;
          animation: heroUnderline 1.2s var(--ease-out-expo) 0.8s both;
        }
        
        @keyframes heroUnderline {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        .hero-corner {
          position: absolute;
          width: clamp(40px, 5vw, 70px);
          height: clamp(40px, 5vw, 70px);
          z-index: 10;
          pointer-events: none;
        }
        
        .hero-corner--tl { top: -1px; left: -1px; border-top: 2px solid var(--gold); border-left: 2px solid var(--gold); }
        .hero-corner--br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--gold); border-right: 2px solid var(--gold); }
        
        .hero-frame:hover .hero-image { transform: scale(1) !important; }
        
        .corner {
          position: absolute;
          width: clamp(40px, 5vw, 60px);
          height: clamp(40px, 5vw, 60px);
          pointer-events: none;
        }
        
        .corner--tl { top: -1px; left: -1px; border-top: 2px solid var(--gold); border-left: 2px solid var(--gold); }
        .corner--br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--gold); border-right: 2px solid var(--gold); }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          border: 1px solid transparent;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s var(--ease-out-expo);
          font-family: var(--font-sans);
        }
        
        .btn--primary {
          background: var(--ink);
          color: var(--white);
          border-color: var(--ink);
        }
        
        .btn--primary:hover {
          background: var(--charcoal);
          border-color: var(--charcoal);
        }
        
        .btn--sm {
          padding: 0.6rem 1.2rem;
          font-size: 0.8125rem;
        }
        
        .btn--primary svg { transition: transform 0.3s ease; }
        .btn--primary:hover svg { transform: translateX(4px); }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
        }
        
        .resource-link:hover {
          border-color: var(--gold);
        }

        .mobile-toggle { display: none; }
        
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block; }
        }
      `}</style>

      <MinimalNav currentPage={page} setPage={setPage} />

      <main>
        {page === "home" && <Home setPage={setPage} />}
        {page === "about" && <About />}
        {page === "services" && <Services />}
        {page === "resources" && <Resources />}
        {page === "contact" && <Contact />}
      </main>

      <Footer setPage={setPage} />
    </div>
  );
}
import { Validator } from "./validator";

const jsonLd = { "@context": "https://schema.org", "@graph": [
  { "@type": "WebApplication", name: "GhanaValidate", url: "https://validate.digitalghana.dev", applicationCategory: "DeveloperApplication", operatingSystem: "Web", description: "Deterministic Ghana-specific syntax validation and normalization primitives." },
  { "@type": "Organization", name: "Digital Ghana", url: "https://digitalghana.dev" },
  { "@type": "SoftwareSourceCode", name: "GhanaValidate", codeRepository: "https://github.com/stanleyHayes/ghanavalidate", programmingLanguage: "TypeScript", license: "https://opensource.org/license/mit" }
] };

export default function Home() { return <main>
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  <nav className="nav"><a className="brand" href="#top"><span>GV</span> GhanaValidate</a><div className="nav-links"><a href="#principles">Principles</a><a href="https://github.com/stanleyHayes/ghanavalidate">GitHub ↗</a></div></nav>
  <section className="hero" id="top"><div className="eyebrow"><span className="pulse" /> Public beta candidate · rule set 1.0.0</div><h1>Clean the input.<br /><em>Keep the claim honest.</em></h1><p className="lede">Small, deterministic Ghana-specific primitives for developers who need consistent data—not invented certainty.</p><div className="hero-meta"><span>TypeScript first</span><span>Zero runtime dependencies</span><span>Versioned reason codes</span></div></section>
  <Validator />
  <section className="principles" id="principles"><div><p className="section-label">The contract</p><h2>Validation is not verification.</h2></div><div className="principle-grid"><article><span>01</span><h3>Deterministic</h3><p>The same input, options and pinned reference dataset produce the same result.</p></article><article><span>02</span><h3>Versioned</h3><p>Every response names its rule version and carries a stable machine-readable reason code.</p></article><article><span>03</span><h3>Bounded</h3><p>A valid shape never proves identity, ownership, reachability, authenticity or real-world existence.</p></article></div></section>
  <footer><span>Independent, open source and non-governmental.</span><a href="https://digitalghana.dev">A Digital Ghana project ↗</a></footer>
</main>; }

"use client";

import { useMemo, useState } from "react";

type Category =
  | "Currying"
  | "No Exceptions"
  | "No Mutations"
  | "No Other Paradigms"
  | "No Statements"
  | "Stylistic";

type Rule = {
  name: string;
  category: Category;
  description: string;
  recommended?: boolean;
  lite?: boolean;
  strict?: boolean;
  typeAware?: boolean;
  fixable?: boolean;
  suggestion?: boolean;
  deprecated?: boolean;
  bad: string;
  good: string;
};

const ruleFamilies: Category[] = [
  "No Mutations",
  "No Statements",
  "No Other Paradigms",
  "No Exceptions",
  "Currying",
  "Stylistic",
];

const categories: Array<"All" | Category> = ["All", ...ruleFamilies];

const rules: Rule[] = [
  {
    name: "functional-parameters",
    category: "Currying",
    description: "Enforce functional parameters.",
    recommended: true,
    lite: true,
    strict: true,
    typeAware: true,
    bad: `const add = (a: number, b: number) => a + b;`,
    good: `const add = (a: number) => (b: number) => a + b;`,
  },
  {
    name: "immutable-data",
    category: "No Mutations",
    description: "Enforce treating data as immutable.",
    recommended: true,
    lite: true,
    strict: true,
    typeAware: true,
    bad: `const user = { name: "Ada" };
user.name = "Grace";`,
    good: `const user = { name: "Ada" };
const nextUser = { ...user, name: "Grace" };`,
  },
  {
    name: "no-class-inheritance",
    category: "No Other Paradigms",
    description: "Disallow inheritance in classes.",
    recommended: true,
    lite: true,
    strict: true,
    bad: `class Admin extends User {
  role = "admin";
}`,
    good: `type Admin = User & { role: "admin" };`,
  },
  {
    name: "no-classes",
    category: "No Other Paradigms",
    description: "Disallow classes.",
    recommended: true,
    strict: true,
    bad: `class Counter {
  increment(value: number) {
    return value + 1;
  }
}`,
    good: `const increment = (value: number) => value + 1;`,
  },
  {
    name: "no-conditional-statements",
    category: "No Statements",
    description: "Disallow conditional statements.",
    recommended: true,
    strict: true,
    typeAware: true,
    bad: `if (ok) {
  return "ready";
}

return "waiting";`,
    good: `return ok ? "ready" : "waiting";`,
  },
  {
    name: "no-expression-statements",
    category: "No Statements",
    description: "Disallow expression statements.",
    recommended: true,
    strict: true,
    typeAware: true,
    bad: `console.log("saved");
trackEvent("save");`,
    good: `const message = ["saved", trackEvent("save")].join(" ");`,
  },
  {
    name: "no-let",
    category: "No Mutations",
    description: "Disallow mutable variables.",
    recommended: true,
    lite: true,
    strict: true,
    bad: `let total = 0;
total += amount;`,
    good: `const total = amounts.reduce(
  (sum, amount) => sum + amount,
  0,
);`,
  },
  {
    name: "no-loop-statements",
    category: "No Statements",
    description: "Disallow imperative loops.",
    recommended: true,
    lite: true,
    strict: true,
    bad: `const ids: string[] = [];

for (const item of items) {
  ids.push(item.id);
}`,
    good: `const ids = items.map((item) => item.id);`,
  },
  {
    name: "no-mixed-types",
    category: "No Other Paradigms",
    description: "Restrict types so that only members of the same kind are allowed in them.",
    recommended: true,
    lite: true,
    strict: true,
    typeAware: true,
    bad: `type Mixed = {
  id: string;
  (): void;
};`,
    good: `type Model = {
  id: string;
  label: string;
};`,
  },
  {
    name: "no-promise-reject",
    category: "No Exceptions",
    description: "Disallow rejecting promises.",
    bad: `return Promise.reject(new Error("failed"));`,
    good: `return Promise.resolve({
  ok: false as const,
  error: "failed",
});`,
  },
  {
    name: "no-return-void",
    category: "No Statements",
    description: "Disallow functions that do not return anything.",
    recommended: true,
    lite: true,
    strict: true,
    typeAware: true,
    bad: `const log = (value: string): void => {
  console.log(value);
};`,
    good: `const format = (value: string): string =>
  value.trim();`,
  },
  {
    name: "no-this-expressions",
    category: "No Other Paradigms",
    description: "Disallow this access.",
    strict: true,
    bad: `class Cart {
  total() {
    return this.items.length;
  }
}`,
    good: `const total = (items: readonly Item[]) =>
  items.length;`,
  },
  {
    name: "no-throw-statements",
    category: "No Exceptions",
    description: "Disallow throwing exceptions.",
    recommended: true,
    lite: true,
    strict: true,
    typeAware: true,
    bad: `if (!token) {
  throw new Error("missing token");
}`,
    good: `if (!token) {
  return {
    ok: false as const,
    error: "missing token",
  };
}`,
  },
  {
    name: "no-try-statements",
    category: "No Exceptions",
    description: "Disallow try/catch statements.",
    strict: true,
    bad: `try {
  await save();
} catch (error) {
  report(error);
}`,
    good: `const result = await save()
  .then(ok)
  .catch(toFailure);`,
  },
  {
    name: "prefer-immutable-types",
    category: "No Mutations",
    description: "Prefer immutable type annotations.",
    recommended: true,
    lite: true,
    strict: true,
    typeAware: true,
    fixable: true,
    suggestion: true,
    bad: `const sum = (values: number[]) =>
  values.reduce(
    (total, value) => total + value,
    0,
  );`,
    good: `const sum = (values: readonly number[]) =>
  values.reduce(
    (total, value) => total + value,
    0,
  );`,
  },
  {
    name: "prefer-property-signatures",
    category: "Stylistic",
    description: "Prefer property signatures over method signatures.",
    typeAware: true,
    bad: `interface User {
  getName(): string;
}`,
    good: `interface User {
  getName: () => string;
}`,
  },
  {
    name: "prefer-readonly-type",
    category: "No Mutations",
    description: "Prefer readonly types over mutable types.",
    typeAware: true,
    fixable: true,
    deprecated: true,
    bad: `type Names = Array<string>;`,
    good: `type Names = ReadonlyArray<string>;`,
  },
  {
    name: "prefer-tacit",
    category: "Stylistic",
    description: "Replaces x => f(x) with just f.",
    typeAware: true,
    suggestion: true,
    bad: `const ids = items.map((item) =>
  getId(item),
);`,
    good: `const ids = items.map(getId);`,
  },
  {
    name: "readonly-type",
    category: "Stylistic",
    description: "Require consistently using either readonly keywords or Readonly<T>.",
    typeAware: true,
    fixable: true,
    bad: `type Point = {
  readonly x: number;
  readonly y: number;
};`,
    good: `type Point = Readonly<{
  x: number;
  y: number;
}>;`,
  },
  {
    name: "type-declaration-immutability",
    category: "No Mutations",
    description: "Enforce the immutability of types based on patterns.",
    recommended: true,
    lite: true,
    strict: true,
    typeAware: true,
    fixable: true,
    suggestion: true,
    bad: `type User = {
  name: string;
};`,
    good: `type User = {
  readonly name: string;
};`,
  },
];

const presets = [
  {
    name: "strict",
    label: "Strict",
    description: "A firm functional baseline for teams ready to remove the escape hatches.",
    tone: "red",
    use: `functional.configs.strict`,
  },
  {
    name: "recommended",
    label: "Recommended",
    description: "The balanced default: functional constraints with room for real-world libraries.",
    tone: "green",
    use: `functional.configs.recommended`,
  },
  {
    name: "lite",
    label: "Lite",
    description: "A lower-friction entry point for migrations and mixed-style codebases.",
    tone: "yellow",
    use: `functional.configs.lite`,
  },
  {
    name: "categories",
    label: "Categories",
    description: "Compose a focused stance with currying, noMutations, noStatements, or stylistic.",
    tone: "blue",
    use: `functional.configs.noMutations`,
  },
];

const tsConfig = `import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import functional from "eslint-plugin-functional";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  functional.configs.externalTypeScriptRecommended,
  functional.configs.recommended,
  functional.configs.stylistic,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
);`;

const jsConfig = `import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import functional from "eslint-plugin-functional";

export default defineConfig(
  eslint.configs.recommended,
  functional.configs.externalVanillaRecommended,
  functional.configs.recommended,
  functional.configs.stylistic,
  functional.configs.disableTypeChecked,
);`;

function normalizeCode(code: string): string {
  return code.replaceAll("\r\n", "\n").replaceAll("\r", "\n").replaceAll("\t", "  ").trim();
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const normalizedCode = normalizeCode(code);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(normalizedCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span className="code-language">{language}</span>

        <button type="button" className="copy-button" onClick={copy}>
          <span className="copy-glyph" aria-hidden="true">
            {copied ? "✓" : "□"}
          </span>
          {copied ? "copied" : "copy"}
        </button>
      </div>

      <pre>
        <code>{normalizedCode}</code>
      </pre>
    </div>
  );
}

function CategoryMark({ category }: { category: Category }) {
  const categoryClass = category.toLowerCase().replaceAll(" ", "-");

  return <span className={`category-mark category-${categoryClass}`} />;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | Category>("All");
  const [configMode, setConfigMode] = useState<"typescript" | "javascript">("typescript");

  const filteredRules = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rules.filter((rule) => {
      const matchesCategory = selectedCategory === "All" || rule.category === selectedCategory;

      const matchesQuery =
        normalizedQuery.length === 0 ||
        rule.name.includes(normalizedQuery) ||
        rule.description.toLowerCase().includes(normalizedQuery) ||
        rule.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory("All");
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a href="#overview" className="brand" aria-label="Functional ESLint home">
          <span className="brand-mark">λ</span>
          <span>functional</span>
          <span className="brand-muted">/ eslint</span>
        </a>

        <nav className="top-nav" aria-label="Primary navigation">
          <a href="#presets">Presets</a>
          <a href="#getting-started">Getting started</a>
          <a href="#rules">Rules</a>
          <a
            href="https://github.com/eslint-functional/eslint-plugin-functional"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <div className="topbar-meta">
          <span className="version-dot" />
          <span>v9.0.5</span>
        </div>
      </header>

      <div className="docs-layout">
        <aside className="side-nav">
          <div className="side-heading">Documentation</div>

          <nav aria-label="Documentation sections">
            <a className="side-link active" href="#overview">
              <span className="side-number">00</span>
              Overview
            </a>

            <a className="side-link" href="#presets">
              <span className="side-number">01</span>
              Presets
            </a>

            <a className="side-link" href="#getting-started">
              <span className="side-number">02</span>
              Getting started
            </a>

            <a className="side-link" href="#rules">
              <span className="side-number">03</span>
              Rule index
            </a>
          </nav>

          <div className="side-divider" />

          <div className="side-heading">Rule families</div>

          <nav aria-label="Rule families">
            {ruleFamilies.map((category) => (
              <a
                key={category}
                className="family-link"
                href="#rules"
                onClick={() => setSelectedCategory(category)}
              >
                <CategoryMark category={category} />
                <span>{category}</span>

                <span className="family-count">
                  {rules.filter((rule) => rule.category === category).length}
                </span>
              </a>
            ))}
          </nav>

          <div className="side-note">
            <span className="side-note-label">Design principle</span>

            <p>Make the immutable path the path of least resistance.</p>
          </div>
        </aside>

        <main className="content-column">
          <section id="overview" className="hero-section">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              eslint-plugin-functional
            </div>

            <div className="hero-grid">
              <div className="hero-copy">
                <h1>
                  Functional constraints
                  <br />
                  <em>for everyday TypeScript.</em>
                </h1>

                <p className="hero-intro">
                  ESLint rules that disable mutation and make functional programming easier to keep
                  consistent across a codebase.
                </p>

                <div className="hero-actions">
                  <a className="button button-primary" href="#getting-started">
                    Start with a config
                    <span aria-hidden="true">↓</span>
                  </a>

                  <a className="button button-quiet" href="#rules">
                    Browse all rules
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              <div className="terminal-card" aria-label="Installation command">
                <div className="terminal-topbar">
                  <span className="terminal-lights">
                    <i />
                    <i />
                    <i />
                  </span>

                  <span>shell</span>

                  <span className="terminal-scope">project root</span>
                </div>

                <div className="terminal-body">
                  <div>
                    <span className="terminal-prompt">$</span>
                    npm i -D eslint-plugin-functional
                  </div>

                  <div className="terminal-comment">
                    {"// add a stance to your eslint.config.js"}
                  </div>

                  <div>
                    <span className="terminal-prompt">$</span>
                    npx eslint .
                  </div>

                  <div className="terminal-success">
                    <span>✓</span>
                    functional rules loaded
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-strip">
              <div>
                <strong>20</strong>
                <span>rules in the catalog</span>
              </div>

              <div>
                <strong>6</strong>
                <span>focused rule families</span>
              </div>

              <div>
                <strong>3</strong>
                <span>ready-made stances</span>
              </div>

              <div>
                <strong>MIT</strong>
                <span>open-source license</span>
              </div>
            </div>
          </section>

          <section id="presets" className="section-block">
            <div className="section-heading-row">
              <div>
                <div className="section-kicker">01 / presets</div>

                <h2>Choose your level of constraint.</h2>
              </div>

              <p className="section-aside">
                Start broad, then compose a sharper point of view as the team gets comfortable.
              </p>
            </div>

            <div className="preset-grid">
              {presets.map((preset, index) => (
                <article key={preset.name} className={`preset-card preset-${preset.tone}`}>
                  <div className="preset-index">0{index + 1}</div>

                  <div className="preset-title-row">
                    <h3>{preset.label}</h3>
                    <span className="preset-arrow">↗</span>
                  </div>

                  <p>{preset.description}</p>
                  <code>{preset.use}</code>
                </article>
              ))}
            </div>
          </section>

          <section id="getting-started" className="section-block getting-started">
            <div className="section-kicker">02 / getting started</div>

            <div className="section-heading-row compact-heading">
              <div>
                <h2>Put a stance in your config.</h2>

                <p className="section-lede">
                  Flat config works for both typed and vanilla projects. Type-aware rules are
                  enabled when the parser has project information.
                </p>
              </div>

              <div className="mode-switch" role="tablist" aria-label="Configuration language">
                <button
                  type="button"
                  className={configMode === "typescript" ? "selected" : ""}
                  onClick={() => setConfigMode("typescript")}
                  role="tab"
                  aria-selected={configMode === "typescript"}
                >
                  TypeScript
                </button>

                <button
                  type="button"
                  className={configMode === "javascript" ? "selected" : ""}
                  onClick={() => setConfigMode("javascript")}
                  role="tab"
                  aria-selected={configMode === "javascript"}
                >
                  JavaScript
                </button>
              </div>
            </div>

            <CodeBlock
              code={configMode === "typescript" ? tsConfig : jsConfig}
              language={configMode === "typescript" ? "eslint.config.ts" : "eslint.config.js"}
            />

            <div className="callout">
              <span className="callout-icon">i</span>

              <p>
                <strong>Typed linting?</strong> Keep <code>disableTypeChecked</code> after the other
                configs for JavaScript files that should not use type information.
              </p>
            </div>
          </section>

          <section id="rules" className="section-block rules-section">
            <div className="section-kicker">03 / rule index</div>

            <div className="section-heading-row rule-heading">
              <div>
                <h2>Every rule, in context.</h2>

                <p className="section-lede">
                  Search by name or intent. Each card pairs the pattern the rule rejects with a
                  functional alternative.
                </p>
              </div>

              <div className="result-count">
                <strong>{filteredRules.length}</strong>
                <span>/ {rules.length} shown</span>
              </div>
            </div>

            <div className="rule-controls">
              <label className="search-box">
                <span className="search-icon" aria-hidden="true">
                  ⌕
                </span>

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search rules, categories, intent…"
                  aria-label="Search rules"
                />

                {query ? (
                  <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                    ×
                  </button>
                ) : null}
              </label>

              <div className="category-filters" role="tablist" aria-label="Filter by rule family">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={selectedCategory === category ? "selected" : ""}
                    onClick={() => setSelectedCategory(category)}
                    role="tab"
                    aria-selected={selectedCategory === category}
                  >
                    {category === "All" ? (
                      <span className="all-mark">*</span>
                    ) : (
                      <CategoryMark category={category} />
                    )}

                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="rule-list">
              {filteredRules.map((rule, index) => (
                <article key={rule.name} className="rule-card">
                  <div className="rule-card-header">
                    <div className="rule-name-wrap">
                      <span className="rule-number">
                        {String(rules.indexOf(rule) + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <h3>
                          <span>functional/</span>
                          {rule.name}
                        </h3>

                        <p>{rule.description}</p>
                      </div>
                    </div>

                    <div className="rule-category">
                      <CategoryMark category={rule.category} />
                      {rule.category}
                    </div>
                  </div>

                  <div className="rule-badges">
                    {rule.recommended ? (
                      <span className="badge badge-green">recommended</span>
                    ) : null}

                    {rule.lite ? <span className="badge badge-yellow">lite</span> : null}

                    {rule.strict ? <span className="badge badge-red">strict</span> : null}

                    {rule.typeAware ? <span className="badge badge-muted">type-aware</span> : null}

                    {rule.fixable ? <span className="badge badge-blue">--fix</span> : null}

                    {rule.suggestion ? (
                      <span className="badge badge-purple">suggestion</span>
                    ) : null}

                    {rule.deprecated ? (
                      <span className="badge badge-orange">deprecated</span>
                    ) : null}
                  </div>

                  <div className="rule-examples">
                    <div>
                      <div className="example-label example-bad">
                        <span>×</span>
                        violates
                      </div>

                      <CodeBlock code={rule.bad} language="typescript" />
                    </div>

                    <div>
                      <div className="example-label example-good">
                        <span>✓</span>
                        use instead
                      </div>

                      <CodeBlock code={rule.good} language="typescript" />
                    </div>
                  </div>

                  {index === 0 && filteredRules.length === rules.length ? (
                    <div className="rule-card-note">
                      The catalog mirrors the plugin’s generated rule list. Enable rules
                      individually when a full preset is too opinionated.
                    </div>
                  ) : null}
                </article>
              ))}

              {filteredRules.length === 0 ? (
                <div className="empty-state">
                  <span>∅</span>
                  <h3>No rules match that search.</h3>

                  <p>
                    Try a rule name such as <code>immutable-data</code> or reset the family filter.
                  </p>

                  <button type="button" onClick={clearFilters}>
                    Reset filters
                  </button>
                </div>
              ) : null}
            </div>
          </section>

          <footer className="site-footer">
            <div>
              <span className="brand-mark footer-mark">λ</span>
              <span>functional / eslint</span>
            </div>

            <p>Rules for a codebase that stays easier to reason about.</p>

            <a
              href="https://github.com/eslint-functional/eslint-plugin-functional"
              target="_blank"
              rel="noreferrer"
            >
              Source on GitHub ↗
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}

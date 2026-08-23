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
    bad: `/* eslint functional/functional-parameters: "error" */

function add() {
  return arguments.reduce((sum, number) => sum + number, 0);
}`,
    good: `/* eslint functional/functional-parameters: "error" */

function add(numbers) {
  return numbers.reduce((sum, number) => sum + number, 0);
}`,
  },
  {
    name: "immutable-data",
    category: "No Mutations",
    description: "Enforce treating data as immutable.",
    recommended: true,
    lite: true,
    strict: true,
    typeAware: true,
    bad: `/* eslint functional/immutable-data: "error" */

const obj = { foo: 1 };

obj.foo += 2; // <- Modifying an existing object/array is not allowed.
obj.bar = 1; // <- Modifying an existing object/array is not allowed.
delete obj.foo; // <- Modifying an existing object/array is not allowed.
Object.assign(obj, { bar: 2 }); // <- Modifying properties of existing object not allowed.`,
    good: `/* eslint functional/immutable-data: "error" */

const obj = { foo: 1 };
const arr = [0, 1, 2];

const x = {
  ...obj,
  bar: [...arr, 3, 4],
};`,
  },
  {
    name: "no-class-inheritance",
    category: "No Other Paradigms",
    description: "Disallow inheritance in classes.",
    recommended: true,
    lite: true,
    strict: true,
    bad: `/* eslint functional/no-class-inheritance: "error" */

abstract class Animal {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class Dog extends Animal {
  constructor(name, age) {
    super(name, age);
  }

  get ageInDogYears() {
    return 7 * this.age;
  }
}

const dogA = new Dog("Jasper", 2);

console.log(\`\${dogA.name} is \${dogA.ageInDogYears} in dog years.\`);`,
    good: `/* eslint functional/no-class-inheritance: "error" */

class Animal {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class Dog {
  constructor(name, age) {
    this.animal = new Animal(name, age);
  }

  get ageInDogYears() {
    return 7 * this.animal.age;
  }
}

console.log(\`\${dogA.name} is \${getAgeInDogYears(dogA.age)} in dog years.\`);`,
  },
  {
    name: "no-classes",
    category: "No Other Paradigms",
    description: "Disallow classes.",
    recommended: true,
    strict: true,
    bad: `/* eslint functional/no-classes: "error" */

class Dog {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  get ageInDogYears() {
    return 7 * this.age;
  }
}

const dogA = new Dog("Jasper", 2);

console.log(\`\${dogA.name} is \${dogA.ageInDogYears} in dog years.\`);`,
    good: `/* eslint functional/no-classes: "error" */

function getAgeInDogYears(age) {
  return 7 * age;
}

const dogA = {
  name: "Jasper",
  age: 2,
};

console.log(\`\${dogA.name} is \${getAgeInDogYears(dogA.age)} in dog years.\`);`,
  },
  {
    name: "no-conditional-statements",
    category: "No Statements",
    description: "Disallow conditional statements.",
    recommended: true,
    strict: true,
    typeAware: true,
    bad: `/* eslint functional/no-conditional-statements: "error" */

let x;
if (i === 1) {
  x = 2;
} else {
  x = 3;
}`,
    good: `/* eslint functional/no-conditional-statements: "error" */

const x = i === 1 ? 2 : 3;`,
  },
  {
    name: "no-expression-statements",
    category: "No Statements",
    description: "Disallow expression statements.",
    recommended: true,
    strict: true,
    typeAware: true,
    bad: `/* eslint functional/no-expression-statements: "error" */

console.log("Hello world!");`,
    good: `/* eslint functional/no-expression-statements: "error" */

const baz = foo(bar);`,
  },
  {
    name: "no-let",
    category: "No Mutations",
    description: "Disallow mutable variables.",
    recommended: true,
    lite: true,
    strict: true,
    bad: `/* eslint functional/no-let: "error" */

let x = 5;`,
    good: `/* eslint functional/no-let: "error" */

const x = 5;`,
  },
  {
    name: "no-loop-statements",
    category: "No Statements",
    description: "Disallow imperative loops.",
    recommended: true,
    lite: true,
    strict: true,
    bad: `/* eslint functional/no-loop-statements: "error" */

const numbers = [1, 2, 3];
const double = [];
for (let i = 0; i < numbers.length; i++) {
  double[i] = numbers[i] * 2;
}`,
    good: `/* eslint functional/no-loop-statements: "error" */

const numbers = [1, 2, 3];
const double = numbers.map((n) => n * 2);`,
  },
  {
    name: "no-mixed-types",
    category: "No Other Paradigms",
    description: "Restrict types so that only members of the same kind are allowed in them.",
    recommended: true,
    lite: true,
    strict: true,
    typeAware: true,
    bad: `/* eslint functional/no-mixed-types: "error" */

type Foo = {
  prop1: string;
  prop2: () => string;
};`,
    good: `/* eslint functional/no-mixed-types: "error" */

type Foo = {
  prop1: string;
  prop2: number;
};`,
  },
  {
    name: "no-promise-reject",
    category: "No Exceptions",
    description: "Disallow rejecting promises.",
    bad: `/* eslint functional/no-promise-reject: "error" */

async function divide(x, y) {
  const [xv, yv] = await Promise.all([x, y]);

  return yv === 0
    ? Promise.reject(new Error("Cannot divide by zero."))
    : xv / yv;
}`,
    good: `/* eslint functional/no-promise-reject: "error" */

async function divide(x, y) {
  const [xv, yv] = await Promise.all([x, y]);

  return yv === 0
    ? { error: new Error("Cannot divide by zero.") }
    : { value: xv / yv };
}`,
  },
  {
    name: "no-return-void",
    category: "No Statements",
    description: "Disallow functions that do not return anything.",
    recommended: true,
    lite: true,
    strict: true,
    typeAware: true,
    bad: `/* eslint functional/no-return-void: "error" */

function updateText(): void {}`,
    good: `/* eslint functional/no-return-void: "error" */

function updateText(value: string): string {}`,
  },
  {
    name: "no-this-expressions",
    category: "No Other Paradigms",
    description: "Disallow this access.",
    strict: true,
    bad: `/* eslint functional/no-this-expressions: "error" */

const foo = this.value + 17;`,
    good: `/* eslint functional/no-this-expressions: "error" */

const foo = object.value + 17;`,
  },
  {
    name: "no-throw-statements",
    category: "No Exceptions",
    description: "Disallow throwing exceptions.",
    recommended: true,
    lite: true,
    strict: true,
    typeAware: true,
    bad: `/* eslint functional/no-throw-statements: "error" */

throw new Error("Something went wrong.");`,
    good: `/* eslint functional/no-throw-statements: "error" */

function divide(x, y) {
  return y === 0 ? new Error("Cannot divide by zero.") : x / y;
}`,
  },
  {
    name: "no-try-statements",
    category: "No Exceptions",
    description: "Disallow try/catch statements.",
    strict: true,
    bad: `/* eslint functional/no-try-statements: "error" */

try {
  doSomethingThatMightGoWrong(); // <-- Might throw an exception.
} catch (error) {
  // Handle error.
}`,
    good: `/* eslint functional/no-try-statements: "error" */

doSomethingThatMightGoWrong() // <-- Returns a Promise
  .catch((error) => {
    // Handle error.
  });`,
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
    bad: `/* eslint functional/prefer-immutable-types: "error" */

function array1(arg: string[]) {} // array is not readonly
function array2(arg: ReadonlyArray<string[]>) {} // array element is not readonly
function array3(arg: [string, number]) {} // tuple is not readonly
function array4(arg: readonly [string[], number]) {} // tuple element is not readonly
// the above examples work the same if you use ReadonlyArray<T> instead
function object1(arg: { prop: string }) {} // property is not readonly
function object2(arg: { readonly prop: string; prop2: string }) {} // not all properties are readonly
function object3(arg: { readonly prop: { prop2: string } }) {} // nested property is not readonly
// the above examples work the same if you use Readonly<T> instead

interface CustomArrayType extends ReadonlyArray<string> {
  prop: string; // note: this property is mutable
}
function custom1(arg: CustomArrayType) {}

interface CustomFunction {
  (): void;
  prop: string; // note: this property is mutable
}
function custom2(arg: CustomFunction) {}

function union(arg: string[] | ReadonlyArray<number[]>) {} // not all types are readonly

// rule also checks function types
interface Foo1 {
  (arg: string[]): void;
}
interface Foo2 {
  new (arg: string[]): void;
}
const x = { foo(arg: string[]): void {} };
function foo(arg: string[]);
type Foo3 = (arg: string[]) => void;
interface Foo4 {
  foo(arg: string[]): void;
}`,
    good: `/* eslint functional/prefer-immutable-types: "error" */

function array1(arg: ReadonlyArray<string>) {}
function array2(arg: ReadonlyArray<ReadonlyArray<string>>) {}
function array3(arg: readonly [string, number]) {}
function array4(arg: readonly [ReadonlyArray<string>, number]) {}
// the above examples work the same if you use ReadonlyArray<T> instead

function object1(arg: { readonly prop: string }) {}
function object2(arg: { readonly prop: string; readonly prop2: string }) {}
function object3(arg: { readonly prop: { readonly prop2: string } }) {}
// the above examples work the same if you use Readonly<T> instead

interface CustomArrayType extends ReadonlyArray<string> {
  readonly prop: string;
}
function custom1(arg: Readonly<CustomArrayType>) {}
// interfaces that extend the array types are not considered arrays, and thus must be made readonly.
interface CustomFunction {
  (): void;
  readonly prop: string;
}
function custom2(arg: CustomFunction) {}

function union(arg: ReadonlyArray<string> | ReadonlyArray<number[]>) {}

function primitive1(arg: string) {}
function primitive2(arg: number) {}
function primitive3(arg: boolean) {}
function primitive4(arg: unknown) {}
function primitive5(arg: null) {}
function primitive6(arg: undefined) {}
function primitive7(arg: any) {}
function primitive8(arg: never) {}
function primitive9(arg: string | number | undefined) {}

function fnSig(arg: () => void) {}

enum Foo {
  a,
  b,
}
function enum1(arg: Foo) {}

function symb1(arg: symbol) {}
const customSymbol = Symbol("a");
function symb2(arg: typeof customSymbol) {}

// function types
interface Foo1 {
  (arg: ReadonlyArray<string>): void;
}
interface Foo2 {
  new (arg: ReadonlyArray<string>): void;
}
const x = { foo(arg: ReadonlyArray<string>): void {} };
function foo(arg: ReadonlyArray<string>);
type Foo3 = (arg: ReadonlyArray<string>) => void;
interface Foo4 {
  foo(arg: ReadonlyArray<string>): void;
}`,
  },
  {
    name: "prefer-property-signatures",
    category: "Stylistic",
    description: "Prefer property signatures over method signatures.",
    typeAware: true,
    bad: `/* eslint functional/prefer-property-signatures: "error" */

type Foo = {
  bar(): string;
};`,
    good: `/* eslint functional/prefer-property-signatures: "error" */

type Foo = {
  bar: () => string;
};`,
  },
  {
    name: "prefer-readonly-type",
    category: "No Mutations",
    description: "Prefer readonly types over mutable types.",
    typeAware: true,
    fixable: true,
    deprecated: true,
    bad: `/* eslint functional/prefer-readonly-type: "error" */

interface Point {
  x: number;
  y: number;
}
const point: Point = { x: 23, y: 44 };
point.x = 99; // This is perfectly valid.`,
    good: `/* eslint functional/prefer-readonly-type: "error" */

interface Point {
  readonly x: number;
  readonly y: number;
}
const point: Point = { x: 23, y: 44 };
point.x = 99; // <- No object mutation allowed.`,
  },
  {
    name: "prefer-tacit",
    category: "Stylistic",
    description: "Replaces x => f(x) with just f.",
    typeAware: true,
    suggestion: true,
    bad: `/* eslint functional/prefer-tacit: "error" */

function f(x) {
  return x + 1;
}

const foo = [1, 2, 3].map((x) => f(x));`,
    good: `/* eslint functional/prefer-tacit: "error" */

function f(x) {
  return x + 1;
}

const foo = [1, 2, 3].map(f);`,
  },
  {
    name: "readonly-type",
    category: "Stylistic",
    description: "Require consistently using either readonly keywords or Readonly<T>.",
    typeAware: true,
    fixable: true,
    bad: `/* eslint functional/readonly-type: ["error", "generic"] */

type Foo = {
  readonly bar: string;
  readonly baz: number;
};`,
    good: `/* eslint functional/readonly-type: ["error", "generic"] */

type Foo = Readonly<{
  bar: string;
  baz: number;
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
    bad: `/* eslint functional/type-declaration-immutability: "error" */

type ReadonlyElement = {
  id: number;
  data: string[];
};`,
    good: `/* eslint functional/type-declaration-immutability: "error" */

type ReadonlyElement = Readonly<{
  id: number;
  data: string[];
}>;`,
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

type SyntaxTokenKind =
  | "plain"
  | "comment"
  | "string"
  | "number"
  | "keyword"
  | "type"
  | "function"
  | "property"
  | "operator"
  | "punctuation"
  | "constant";

type SyntaxToken = {
  kind: SyntaxTokenKind;
  value: string;
};

const syntaxKeywords = new Set([
  "abstract",
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "declare",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "finally",
  "for",
  "from",
  "function",
  "get",
  "if",
  "implements",
  "import",
  "in",
  "infer",
  "instanceof",
  "interface",
  "keyof",
  "let",
  "namespace",
  "new",
  "of",
  "private",
  "protected",
  "public",
  "readonly",
  "return",
  "set",
  "static",
  "satisfies",
  "switch",
  "throw",
  "try",
  "type",
  "typeof",
  "var",
  "while",
  "with",
  "yield",
]);

const syntaxTypes = new Set([
  "any",
  "bigint",
  "boolean",
  "never",
  "number",
  "object",
  "string",
  "symbol",
  "undefined",
  "unknown",
  "void",
]);

const syntaxConstants = new Set(["false", "null", "super", "this", "true"]);

const syntaxOperators = [
  "===",
  "!==",
  ">>>",
  "**=",
  "&&=",
  "||=",
  "??=",
  "=>",
  "==",
  "!=",
  "<=",
  ">=",
  "&&",
  "||",
  "??",
  "?.",
  "++",
  "--",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "**",
  "<<",
  ">>",
  "+",
  "-",
  "*",
  "/",
  "%",
  "=",
  "<",
  ">",
  "!",
  "?",
  "&",
  "|",
  "^",
  "~",
];

function appendSyntaxToken(tokens: SyntaxToken[], kind: SyntaxTokenKind, value: string) {
  const previous = tokens.at(-1);

  if (previous?.kind === kind) {
    previous.value += value;
    return;
  }

  tokens.push({ kind, value });
}

function previousNonWhitespaceCharacter(code: string, index: number): string {
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    if (!/\s/.test(code[cursor])) {
      return code[cursor];
    }
  }

  return "";
}

function nextNonWhitespaceCharacter(code: string, index: number): string {
  for (let cursor = index; cursor < code.length; cursor += 1) {
    if (!/\s/.test(code[cursor])) {
      return code[cursor];
    }
  }

  return "";
}

function classifyIdentifier(code: string, identifier: string, start: number, end: number) {
  if (syntaxKeywords.has(identifier)) {
    return "keyword" satisfies SyntaxTokenKind;
  }

  if (syntaxTypes.has(identifier)) {
    return "type" satisfies SyntaxTokenKind;
  }

  if (syntaxConstants.has(identifier)) {
    return "constant" satisfies SyntaxTokenKind;
  }

  const previousCharacter = previousNonWhitespaceCharacter(code, start);
  const nextCharacter = nextNonWhitespaceCharacter(code, end);

  if (nextCharacter === "(") {
    return "function" satisfies SyntaxTokenKind;
  }

  if (previousCharacter === ".") {
    return "property" satisfies SyntaxTokenKind;
  }

  if (/^[A-Z]/.test(identifier)) {
    return "type" satisfies SyntaxTokenKind;
  }

  return "plain" satisfies SyntaxTokenKind;
}

function tokenizeCode(code: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  let index = 0;

  while (index < code.length) {
    const character = code[index];
    const nextCharacter = code[index + 1];

    if (/\s/.test(character)) {
      let end = index + 1;

      while (end < code.length && /\s/.test(code[end])) {
        end += 1;
      }

      appendSyntaxToken(tokens, "plain", code.slice(index, end));
      index = end;
      continue;
    }

    if (character === "/" && nextCharacter === "/") {
      const end = code.indexOf("\n", index);
      const commentEnd = end === -1 ? code.length : end;

      appendSyntaxToken(tokens, "comment", code.slice(index, commentEnd));
      index = commentEnd;
      continue;
    }

    if (character === "/" && nextCharacter === "*") {
      const end = code.indexOf("*/", index + 2);
      const commentEnd = end === -1 ? code.length : end + 2;

      appendSyntaxToken(tokens, "comment", code.slice(index, commentEnd));
      index = commentEnd;
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      const quote = character;
      let end = index + 1;

      while (end < code.length) {
        if (code[end] === "\\") {
          end += 2;
          continue;
        }

        if (code[end] === quote) {
          end += 1;
          break;
        }

        end += 1;
      }

      appendSyntaxToken(tokens, "string", code.slice(index, end));
      index = end;
      continue;
    }

    if (/\d/.test(character) || (character === "." && /\d/.test(nextCharacter))) {
      const number = code
        .slice(index)
        .match(
          /^(?:0[xX][\dA-Fa-f_]+|0[bB][01_]+|0[oO][0-7_]+|(?:\d[\d_]*(?:\.[\d_]*)?|\.\d[\d_]*)(?:[eE][+-]?\d[\d_]*)?n?)/,
        )?.[0];

      if (number) {
        appendSyntaxToken(tokens, "number", number);
        index += number.length;
        continue;
      }
    }

    if (/[A-Za-z_$]/.test(character)) {
      const identifier = code.slice(index).match(/^[A-Za-z_$][\w$]*/)?.[0] ?? character;
      const end = index + identifier.length;

      appendSyntaxToken(tokens, classifyIdentifier(code, identifier, index, end), identifier);
      index = end;
      continue;
    }

    const operator = syntaxOperators.find((candidate) => code.startsWith(candidate, index));

    if (operator) {
      appendSyntaxToken(tokens, "operator", operator);
      index += operator.length;
      continue;
    }

    if ("{}[]();,:.".includes(character)) {
      appendSyntaxToken(tokens, "punctuation", character);
      index += 1;
      continue;
    }

    appendSyntaxToken(tokens, "plain", character);
    index += 1;
  }

  return tokens;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const normalizedCode = normalizeCode(code);
  const highlightedCode = useMemo(() => tokenizeCode(normalizedCode), [normalizedCode]);

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
        <code className="syntax-highlight">
          {highlightedCode.map((token, index) => (
            <span key={`${token.kind}-${index}`} className={`syntax-${token.kind}`}>
              {token.value}
            </span>
          ))}
        </code>
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

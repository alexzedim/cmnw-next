import { title } from "@/components/primitives";
import { SearchForm } from "@/components/search-form";
import { Button } from "@heroui/button";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section flex flex-col items-center justify-center gap-8">
        <div className="inline-block max-w-3xl text-center justify-center">
          <h1 className={title()}>CMNW</h1>
          <p className="text-muted mt-4 text-lg">
            Commonwealth — World of Warcraft community tools
          </p>
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-3">
          <Button color="primary" className="min-h-11 px-6">Get Started</Button>
          <Button variant="bordered" className="min-h-11 px-6">Docs</Button>
        </div>

        {/* Prompt accent */}
        <div className="card-surface max-w-3xl w-full p-4">
          <div className="font-mono text-sm text-muted">
            <span className="text-foreground/80">$</span> cmnw search "Thunderfury"
          </div>
        </div>

        <div className="w-full flex justify-center px-4">
          <SearchForm />
        </div>
      </section>

      {/* Key features */}
      <section className="section container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "No IDE switch", body: "Use CMNW directly in your workflow." },
            { title: "Fast search", body: "Find items, logs, and valuations instantly." },
            { title: "Safe by default", body: "Explicit control over changes and data." },
          ].map((f) => (
            <div key={f.title} className="card-surface p-6">
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="text-muted mt-2 text-sm">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="section container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Works everywhere", body: "Web and CLI, no lock‑in." },
            { title: "Scales with you", body: "Built for large data sets." },
            { title: "Transparent", body: "Review every change." },
          ].map((f) => (
            <div key={f.title} className="card-surface p-6">
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="text-muted mt-2 text-sm">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section container mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold">Ready to try CMNW?</h2>
        <p className="text-muted mt-2">Start exploring items and logs now.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button color="primary" className="min-h-11 px-6">Open App</Button>
          <Button variant="bordered" className="min-h-11 px-6">Read Docs</Button>
        </div>
      </section>
    </>
  );
}

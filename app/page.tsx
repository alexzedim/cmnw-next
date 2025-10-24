import { title } from "@/components/primitives";
import { SearchForm } from "@/components/search-form";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] gap-8 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>CMNW</h1>
        <p className="text-default-500 mt-4">
          Commonwealth - World of Warcraft community tools
        </p>
      </div>

      <div className="w-full flex justify-center px-4">
        <SearchForm />
      </div>
    </section>
  );
}

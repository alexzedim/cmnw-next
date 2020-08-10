import fs from "fs";
import matter from "gray-matter";

export default function Test ({ posts }) {
    return (
        <div>
            {posts.map(({ frontmatter: { title, description, date } }) => (
                <article key={title}>
                    <header>
                        <h3>{title}</h3>
                        <span>{date}</span>
                    </header>
                    <section>
                        <p>{description}</p>
                    </section>
                </article>
            ))}
        </div>
    );
}

export async function getStaticProps() {
    const files = fs.readdirSync(`${process.cwd()}/tests`);

    const posts = files.map((filename) => {
        const markdownWithMetadata = fs
            .readFileSync(`tests/${filename}`)
            .toString();

        console.log(markdownWithMetadata);

        const { data } = matter(markdownWithMetadata);

        // Convert post date to format: Month day, Year
        const formattedDate = data.updatedAt.toLocaleDateString("en-GB");

        const frontmatter = {
            ...data,
            updatedAt: formattedDate,
        };

        return {
            slug: filename.replace(".md", ""),
            frontmatter,
        };
    });

    return {
        props: {
            posts,
        },
    };
}
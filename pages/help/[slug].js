import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown/with-html";
import {Container, Typography} from "@material-ui/core";
import Head from "next/head";

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = React.useState({
    width: undefined,
    height: undefined,
  });

  React.useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default function Post({content, frontmatter}) {

  const { width} = useWindowSize();

  return (
    <main>
      <Head>
        <title>{frontmatter.title}</title>

        <meta name="description" content={frontmatter.description}/>

        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://conglomerat.group/"/>
        <meta property="og:title" content={frontmatter.title}/>
        <meta property="og:description" content={frontmatter.description}/>
        <meta property="og:image" content="https://conglomerat.group/logo.png"/>

        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="og:url" content="https://conglomerat.group/"/>
        <meta property="twitter:title" content={frontmatter.title}/>
        <meta property="twitter:description" content={frontmatter.description}/>
        <meta property="og:image" content="https://conglomerat.group/logo.png"/>
      </Head>
      <Container fixed>
        <Typography variant="body1" component="p">
          <ReactMarkdown
            escapeHtml={false}
            source={content}
            renderers={{
              //This custom renderer changes how images are rendered
              //we use it to constrain the max width of an image to its container
              image: ({ alt, src, title }) => (
                <img
                  alt={alt}
                  src={src}
                  title={title}
                  style={{
                    maxWidth: (width * 0.64) || 0,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    display: 'block',
                    borderRadius: '1%'
                  }}
                />
              ),
            }}
          />
        </Typography>
      </Container>
    </main>
  );
}

export async function getStaticPaths() {

  const files = fs.readdirSync("./wiki");


  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({params: {slug}}) {

  const markdownWithMetadata = fs.readFileSync(path.join("./wiki", slug + ".md")).toString();

  const {data, content} = matter(markdownWithMetadata);

  // Convert post date to format: Month day, Year
  const formattedDate = data.updatedAt.toLocaleDateString("en-GB");

  const frontmatter = {
    ...data,
    updatedAt: formattedDate,
  };

  return {
    props: {
      content: `# ${data.title}\n${content}`,
      frontmatter,
    },
  };
}

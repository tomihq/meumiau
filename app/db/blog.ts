import fs from 'fs';
import path from 'path';
import { cache } from 'react';

type Metadata = {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
  };

  
function getMDXFiles(dir: string) {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}
function parseFrontmatter(fileContent: string) {
    let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
    let match = frontmatterRegex.exec(fileContent);
    let frontMatterBlock = match![1];
    let content = fileContent.replace(frontmatterRegex, '').trim();
    let frontMatterLines = frontMatterBlock.trim().split('\n');
    let metadata: Partial<Metadata> = {};

    frontMatterLines.forEach((line) => {
        let [key, ...valueArr] = line.split(': ');
        let value = valueArr.join(': ').trim();
        value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
        {/* @ts-ignore */ }
        metadata[key.trim() as keyof Metadata] = value;
    });

    return { metadata: metadata as Metadata, content };
}


function readMDXFile(filePath: string) {
    let rawContent = fs.readFileSync(filePath, 'utf-8');
    return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir)

  return mdxFiles
    .map((file) => {
      const { metadata, content } = readMDXFile(path.join(dir, file))
      const slug = path.basename(file, path.extname(file))

      return {
        metadata,
        slug,
        content,
      }
    })
    .sort((a, b) => {
      const dateA = new Date(a.metadata.publishedAt).getTime()
      const dateB = new Date(b.metadata.publishedAt).getTime()

      return dateB - dateA // más nuevo primero
    })
}

export const getBlogPosts = cache(() => {
    return getMDXData(path.join(process.cwd(), 'posts'))
})
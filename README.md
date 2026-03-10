# About Antama

We are a self-organized collective which was created in order to highlight the freedom of expression and to approach
social issues of a local - and not only - nature, through multifaceted actions.
All our actions are co-decided through the assembly process.
At a time when solidarity is not taken for granted, we choose to act collectively and develop zones of freedom and
creative expression.
Our purpose is the inclusion of all social groups in our action and their awareness. We are against any form of social
separation.
So we believe that the time has come to join forces and co-shape our society.

# Contact

- Email: info@antamacollective.gr
- Website: https//www.antamacollective.gr
- Facebook: https://www.facebook.com/antamacollective
- Instagram: https://www.instagram.com/antama_collective

# Adding a New Article

## 1. Create the post file

Create a new Markdown file in `content/blog/` with the date as the filename in `YYYYMMDD.md` format (e.g., `20240315.md`).

## 2. Add meta

At the top of the file, include the following:

```yaml
---
title: "Your Article Title"
meta_title: ""
description: ""
date: 2024-03-15
image: "/images/blog/20240315-01.png"
categories: [ "Κοινωνικά" ]
author: "Antama"
tags: [ "" ]
draft: false
---
```

- `image`: Path to the featured image in `/images/blog/`

## 3. Add images

Place images in the `static/images/blog/` directory. Use the naming convention `YYYYMMDD-01.png`, `YYYYMMDD-02.png`, etc. Reference them in the front matter as `/images/blog/filename.png`.

## 4. Build and deploy

To view the site locally:

```bash
hugo server
```

Visit `http://localhost:1313` to preview. When ready to deploy, run:

```bash
hugo
```

This generates the static site in the `public/` directory. Push the changes to the remote repository to deploy.

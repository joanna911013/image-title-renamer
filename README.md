# ClearCapture Next.js Starter

A calm and trustworthy Next.js 14 starter (App Router) that showcases a landing page and contact form for the Screenshot → Smart Filename concept. Built with TypeScript and Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the landing page and try the inquiry form.

## Scripts

- `npm run dev` – Start the development server.
- `npm run build` – Build the production bundle.
- `npm run start` – Run the production server.
- `npm run lint` – Lint the codebase with Next.js defaults.

## Project Structure

- `app/` – App Router routes, layouts, and global styles.
  - `page.tsx` – Hero, feature highlights, workflow steps, FAQ, and CTA sections in a calm blue-gray tone.
  - `contact/page.tsx` – Inquiry form with helpful context and accessible defaults.
- `components/` – Shared UI components like the header, footer, and responsive container.
- `tailwind.config.ts` – Tailwind customization with a cool gray and blue palette for a composed brand tone.

## Customization Ideas

- Hook up `/contact` to a real email or ticketing integration by adding an API route in `app/api/`.
- Adjust the brand palette in `tailwind.config.ts` to match your organization’s colors.
- Extend the landing page sections to showcase product demos or customer stories.

The layout and components use cool gray and blue hues, soft gradients, and accessible contrast to convey a composed, trustworthy brand aesthetic.

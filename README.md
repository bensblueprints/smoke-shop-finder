# Smoke Shop Finder

A modern web application that helps users locate smoke shops in their area. Built with React, TypeScript, and Next.js, featuring a clean, responsive design and powerful search capabilities.

## Features

- 🔍 Advanced search functionality for smoke shops
- 📍 Interactive map integration
- 📱 Responsive design for all devices
- 🎨 Modern, clean UI with dark mode support
- 📊 Detailed shop information and reviews
- 🔒 Secure authentication system
- 🚀 Fast performance with Next.js

## Tech Stack

- **Frontend Framework**: Next.js with React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Maps**: Google Maps API
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bensblueprints/smoke-shop-finder.git
   cd smoke-shop-finder
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
smoke-shop-finder/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Next.js pages
│   ├── styles/        # Global styles and Tailwind config
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   ├── context/       # React Context providers
│   └── lib/           # Library configurations
├── public/            # Static assets
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Ben Blueprints - [@bensblueprints](https://github.com/bensblueprints)

Project Link: [https://github.com/bensblueprints/smoke-shop-finder](https://github.com/bensblueprints/smoke-shop-finder)

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Maps API](https://developers.google.com/maps) 
# Camp Explorer Europe 2026 🏕️

**Discover Quality European Summer Camps for Kids & Youth**

A comprehensive web application featuring 23+ verified summer camp organizations across 13 European countries. Built with React and modern web technologies, offering advanced search and filtering to help families find the perfect summer camp experience.

## 🌟 Features

### 🎯 **Verified Camp Directory**
- **23+ verified camp organizations** representing 100+ individual programs
- **13 European countries** including Switzerland, Norway, UK, Germany, and more
- **Comprehensive pricing range** from €330 to CHF 6,980
- **Detailed camp profiles** with activities, languages, age groups, and special features

### 🔍 **Advanced Search & Discovery**
- **Real-time search** across camp names, locations, and countries
- **Category filtering** with 7 distinct camp types
- **Country-specific filtering** for targeted geographic searches
- **Smart filtering logic** combining multiple search criteria

### 🎨 **Modern User Experience**
- **Mobile-optimized design** with responsive layouts
- **Professional camp cards** with comprehensive information display
- **Advanced filtering system** with dynamic result counts
- **Accessibility compliant** following WCAG 2.1 AA standards
- **Optimized performance** with compressed images and fast loading

### 📊 **Rich Camp Information**
Each camp listing includes:
- **Age ranges** and program duration
- **Activity lists** and language offerings
- **Pricing information** and establishment dates
- **Location details** and special highlights
- **Direct booking links** to official camp websites

## 🌍 Camp Categories

- **Premium Alpine** - Luxury Swiss and Austrian mountain experiences
- **Academic & STEM** - University preparation and intensive learning programs
- **Language Immersion** - Native language learning environments
- **Sports Specialty** - Professional sports training and academies
- **Family Programs** - Multi-age programs welcoming families
- **Budget Excellence** - Quality programs under €2,000
- **Outdoor Adventures** - Nature-based and unique outdoor experiences

## 🛠️ Technology Stack

- **Frontend:** React 18 with Vite build system
- **Styling:** Tailwind CSS with custom component library
- **Icons:** Lucide React icon library
- **State Management:** React Hooks (useState, useEffect)
- **Performance:** Optimized images with WebP/AVIF formats
- **Accessibility:** WCAG 2.1 AA compliant implementation

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm package manager
- Git for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/PixelSnack/camp-explorer-europe-2026.git
cd camp-explorer-europe-2026

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173/
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
camp-explorer-europe-2026/
├── public/                 # Static assets and configuration
├── src/
│   ├── assets/            # Optimized images and media files
│   ├── components/        # Reusable UI components
│   │   └── ui/           # Shadcn/ui component library
│   ├── App.jsx           # Main application component
│   ├── App.css           # Global styles and utilities
│   └── main.jsx          # Application entry point
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.js        # Vite build configuration
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint code quality checks
```

### Adding New Camps

1. Open `src/App.jsx`
2. Add new camp object to the `allCamps` array
3. Follow the established data structure:
   ```javascript
   {
     id: [next_number],
     name: "Camp Name",
     location: "City, Country",
     country: "Country",
     ages: "X-Y years",
     price: "€XXX or CHF XXX",
     category: "category_name",
     activities: ["activity1", "activity2"],
     // ... additional properties
   }
   ```
4. Test search and filtering functionality

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel automatically detects Vite configuration
3. Deploy with one click - builds are automatic on push

### Netlify
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### Other Platforms
Any static hosting service that supports single-page applications will work with the built `dist/` folder.

## 📈 Performance Features

- **Image Optimization:** WebP and AVIF formats with PNG fallbacks
- **Bundle Optimization:** Vite tree-shaking and code splitting
- **Responsive Images:** Picture elements for optimal loading
- **Fast Loading:** Optimized assets and efficient rendering
- **SEO Ready:** Proper meta tags and structured data
- **Mobile Optimized:** Touch-friendly interface and fast mobile performance

## 🔐 Privacy & Compliance

- **GDPR Compliant:** Cookie consent implementation for EU users
- **Privacy Focused:** Analytics only loaded with user consent
- **Secure Headers:** HSTS and CSP security implementations
- **User Control:** Clear privacy options and data handling

## 🤝 Contributing

We welcome contributions to improve the camp directory:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m 'Add your feature'`
5. Push to your branch: `git push origin feature/your-feature`
6. Submit a Pull Request with detailed description

### Contribution Guidelines
- Verify all camp data before adding new entries
- Follow existing code style and structure
- Test search and filtering functionality
- Ensure mobile responsiveness
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Camp Research:** Data sourced from official camp websites and verified through multiple sources
- **Design System:** Modern UX/UI principles with accessibility focus
- **Icons:** Lucide React for consistent iconography
- **Styling:** Tailwind CSS for responsive design system
- **Component Library:** Shadcn/ui for professional UI components

## 📞 Contact & Support

**Project Maintainer:** PixelSnack
- **GitHub:** [@PixelSnack](https://github.com/PixelSnack)
- **Email:** contact@europeansummercamps.com

For questions about specific camps, please contact the camps directly through their official websites.

---

**Helping families discover amazing European summer camp experiences** 🌍

*Built with modern web technologies and a focus on user experience, accessibility, and performance.*
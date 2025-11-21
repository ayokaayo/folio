# Content Editing Guide

This guide explains where and how to edit all content on your portfolio site.

## 📁 File Locations

### **Case Studies (Work Entries)**
**File:** `lib/caseStudies.ts`

This file contains all your case studies/work entries. Each case study includes:
- Basic info (title, subtitle, hashtag, company, year)
- Card image
- Full case study details (impact, problem, approach, design decisions, etc.)

### **Side Projects**
**File:** `lib/projects.ts`

This file contains all your side projects. Each project includes:
- Basic info (title, description, hashtag, year)
- Card image
- Optional link URL

### **Articles**
**File:** `lib/articles.ts`

This file contains all your popular articles. Each article includes:
- Publication, date, title
- Tags
- Read time and views

---

## 🎨 How to Edit Existing Entries

### Editing a Case Study

1. Open `lib/caseStudies.ts`
2. Find the case study object in the `caseStudies` array
3. Edit any field you want:

```typescript
{
  id: 'dropdown-builder',                    // Unique ID (used in URLs)
  title: 'Advanced Dropdown Builder',         // Main title
  subtitle: 'Transformed 200+ field chaos...', // Subtitle shown on card
  hashtag: '#0 to 1',                        // Tag shown on card
  company: 'Fast Track AI',                   // Company name
  year: '2023',                               // Year
  linkText: 'Read case study',               // Link text on card
  imageUrl: '/images/dropdown-builder.jpg',  // Image path (see Images section)
  imageAlt: 'Dropdown builder interface',    // Alt text for image
  // ... rest of the case study details
}
```

### Editing a Side Project

1. Open `lib/projects.ts`
2. Find the project object in the `projects` array
3. Edit any field:

```typescript
{
  id: 'design-system-evolution',            // Unique ID
  hashtag: '#B2B SaaS',                      // Tag shown on card
  year: '2024',                              // Year
  title: 'Design System Evolution',          // Title
  description: 'Built a comprehensive...',    // Description
  imageUrl: '/images/design-system.jpg',     // Image path
  imageAlt: 'Design system components',      // Alt text
  linkUrl: 'https://example.com',            // Optional external link
}
```

### Editing an Article

1. Open `lib/articles.ts`
2. Find the article object in the `popularArticles` array
3. Edit any field:

```typescript
{
  id: 'designing-for-scale',                 // Unique ID
  publication: 'UXCollective',              // Publication name
  date: 'Feb, 2024',                         // Date
  title: 'Designing for scale...',           // Title
  tags: ['#Growth', '#B2B SaaS'],            // Array of tags
  readTime: '8 mins read',                   // Read time
  views: '12k+ views',                       // Views count
}
```

---

## ➕ How to Add New Entries

### Adding a New Case Study

1. Open `lib/caseStudies.ts`
2. Add a new object to the `caseStudies` array (before the closing `]`)
3. Copy the structure from an existing case study and fill in your content:

```typescript
{
  id: 'your-new-case-study',                 // Use lowercase, hyphens
  title: 'Your Case Study Title',
  subtitle: 'A compelling subtitle',
  hashtag: '#Your Tag',
  company: 'Company Name',
  year: '2024',
  linkText: 'Read case study',
  imageUrl: '/images/your-image.jpg',       // Add image to /public/images/
  imageAlt: 'Description of your image',
  impact: {
    title: 'IMPACT',
    items: [
      'Impact point 1',
      'Impact point 2',
      // Add more items
    ],
  },
  problem: {
    title: 'THE PROBLEM',
    context: 'Context about the problem...',
    issues: [
      'Issue 1',
      'Issue 2',
      // Add more issues
    ],
    whyItMattered: [
      'Why it mattered point 1',
      // Add more points
    ],
  },
  // ... continue with other sections (approach, designDecisions, etc.)
  timeline: 'Q1 2024',
  team: '5 (Product Designer, 2 Engineers, QA, Product Manager)',
}
```

**Important:** Make sure the `id` is unique and URL-friendly (lowercase, use hyphens).

### Adding a New Side Project

1. Open `lib/projects.ts`
2. Add a new object to the `projects` array:

```typescript
{
  id: 'your-new-project',                   // Unique ID
  hashtag: '#Your Tag',
  year: '2024',
  title: 'Your Project Title',
  description: 'A brief description of your project',
  imageUrl: '/images/your-project.jpg',     // Optional: add image
  imageAlt: 'Description of image',         // Optional: alt text
  linkUrl: 'https://your-project.com',      // Optional: external link
}
```

**Note:** Projects are automatically shown on the homepage (first 3) and all projects page.

### Adding a New Article

1. Open `lib/articles.ts`
2. Add a new object to the `popularArticles` array:

```typescript
{
  id: 'your-new-article',                   // Unique ID
  publication: 'Publication Name',
  date: 'Jan, 2024',
  title: 'Your Article Title',
  tags: ['#Tag1', '#Tag2'],
  readTime: '5 mins read',
  views: '10k+ views',
}
```

---

## 🖼️ Adding Images

### Step 1: Add Image File

1. Place your image in the `/public/images/` folder
2. Recommended size: **1200 × 800px** (3:2 aspect ratio)
3. Use descriptive filenames: `dropdown-builder.jpg`, `design-system.png`, etc.

### Step 2: Reference in Data File

In your case study or project object, add:

```typescript
imageUrl: '/images/your-filename.jpg',      // Path starts with /images/
imageAlt: 'Descriptive alt text for accessibility',
```

**Example:**
- Image file: `/public/images/dropdown-builder.jpg`
- In code: `imageUrl: '/images/dropdown-builder.jpg'`

### Image Guidelines

- **Format:** JPG or PNG
- **Size:** 1200 × 800px recommended (works well on all screen sizes)
- **Optimization:** Compress images before adding (use tools like TinyPNG)
- **Alt Text:** Always provide descriptive alt text for accessibility

---

## 🏷️ Tags and Hashtags

### Case Studies
- Edit the `hashtag` field (e.g., `'#0 to 1'`, `'#Growth design'`)
- Shown as a white pill badge on the card

### Side Projects
- Edit the `hashtag` field (e.g., `'#B2B SaaS'`, `'#AI/ML'`)
- Shown as plain text on the card

### Articles
- Edit the `tags` array (e.g., `['#Growth', '#B2B SaaS']`)
- Multiple tags are supported

---

## 🔗 Links and URLs

### Case Studies
- **Card Link:** Automatically goes to `/work/[id]` (individual case study page)
- **linkUrl:** Optional override (leave empty to use default)

### Side Projects
- **Card Link:** Uses `linkUrl` if provided, otherwise `#project-id`
- Add `linkUrl: 'https://example.com'` for external links

---

## 📝 Quick Reference

| Content Type | File | Key Fields |
|-------------|------|------------|
| **Case Studies** | `lib/caseStudies.ts` | `id`, `title`, `subtitle`, `hashtag`, `imageUrl` |
| **Side Projects** | `lib/projects.ts` | `id`, `title`, `description`, `hashtag`, `imageUrl` |
| **Articles** | `lib/articles.ts` | `id`, `title`, `publication`, `date`, `tags` |

---

## 💡 Tips

1. **Unique IDs:** Always use unique, URL-friendly IDs (lowercase, hyphens)
2. **Image Paths:** Always start with `/images/` (the `/public` folder is the root)
3. **Order Matters:** The order in the array determines display order
4. **Homepage:** First 2 case studies and first 3 projects appear on homepage
5. **Save & Refresh:** After editing, save the file and refresh your browser

---

## 🚨 Common Issues

**Image not showing?**
- Check the path starts with `/images/`
- Verify the file exists in `/public/images/`
- Check filename spelling matches exactly

**New entry not appearing?**
- Make sure you saved the file
- Check for syntax errors (commas, brackets)
- Verify the object is inside the array brackets

**Link not working?**
- For case studies, the `id` is used in the URL automatically
- Make sure the `id` is unique and URL-friendly

---

Need help? Check the existing entries in each file for examples of the correct structure!


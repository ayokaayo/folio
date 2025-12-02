# Image Gallery Usage Guide

## Quick Start

Add images to your case studies by including an `images` array in your case study data.

## Folder Structure

Organize images in `/public/img/` by case study:

```
public/img/
  ├── dropdown-builder/
  │   ├── interface-screenshot.png
  │   ├── validation-flow.png
  │   └── before-after-comparison.png
  ├── sms-characters/
  │   ├── encoding-detection.png
  │   └── mobile-preview.png
  └── time-management/
      ├── dual-timezone.png
      └── localization-settings.png
```

## Adding Images to Case Studies

### Example

```typescript
export const dropdownBuilder: CaseStudy = {
  id: 'dropdown-builder',
  title: 'Advanced Dropdown Builder',
  // ... other fields ...
  
  // Add images array at the end
  images: [
    {
      url: '/img/dropdown-builder/interface-screenshot.png',
      caption: 'The new dropdown interface with progressive disclosure',
      alt: 'Dropdown interface showing category selection screen'
    },
    {
      url: '/img/dropdown-builder/validation-flow.png',
      caption: 'Real-time validation prevents selection errors',
      alt: 'Validation flow diagram showing error prevention'
    },
    {
      url: '/img/dropdown-builder/before-after-comparison.png',
      alt: 'Before and after comparison of dropdown interface'
      // Caption is optional - can be omitted
    }
  ],
}
```

## Image Requirements

- **Location**: Place images in `/public/img/[case-study-id]/`
- **Format**: PNG, JPG, or WebP (WebP recommended for best performance)
- **Size**: 1600-2400px width recommended for retina displays
- **Aspect Ratio**: Any - images will maintain their aspect ratio
- **Alt Text**: Required for accessibility
- **Caption**: Optional but recommended for context

## How It Works

1. Images are automatically rendered at the end of the case study (after "What I Learned" section)
2. Each image appears in a styled container with rounded corners
3. Captions appear below images in italic, centered text
4. Images are optimized by Next.js Image component
5. Smooth fade-in animations on scroll

## Best Practices

- Use descriptive alt text that explains what the image shows
- Add captions to provide context or explain what the image demonstrates
- Keep image file sizes reasonable (optimize before adding)
- Use consistent naming: `feature-name-description.png`
- Group related images together in the array











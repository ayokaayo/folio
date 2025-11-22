# Image Guide for Portfolio Cards

## Recommended Image Specifications

### Standard Size
- **Dimensions:** 1200 × 800 pixels
- **Aspect Ratio:** 3:2 (width:height)
- **Format:** JPG or WebP (WebP recommended for better compression)
- **File Size:** Aim for under 200KB per image for optimal performance

### Why This Size?
This size works perfectly across all breakpoints:
- **Mobile (< 768px):** Full width, maintains aspect ratio
- **Tablet (768px - 1024px):** Scales to 50% width, looks great
- **Desktop (1024px+):** Max 800-900px width, maintains quality

## How to Add Images

### Step 1: Prepare Your Images
1. Resize/crop your images to **1200 × 800px** (3:2 aspect ratio)
2. Optimize them (use tools like TinyPNG, Squoosh, or ImageOptim)
3. Save as JPG or WebP format

### Step 2: Add Images to Project
1. Create an `images` folder in the `public` directory:
   ```
   public/
     images/
       dropdown-builder.jpg
       sms-characters.jpg
       time-management.jpg
       design-system.jpg
       ...
   ```

### Step 3: Update Your Data Files

#### For Case Studies (`lib/caseStudies.ts`):
```typescript
{
  id: 'dropdown-builder',
  title: 'Advanced Dropdown Builder',
  // ... other fields
  imageUrl: '/images/dropdown-builder.jpg', // Add this
  imageAlt: 'Advanced Dropdown Builder interface screenshot', // Add this
}
```

#### For Projects (`lib/projects.ts`):
```typescript
{
  id: 'design-system-evolution',
  title: 'Design System Evolution',
  // ... other fields
  imageUrl: '/images/design-system.jpg', // Add this
  imageAlt: 'Design System Evolution dashboard screenshot', // Add this
  linkUrl: '/projects/design-system', // Optional: link to project details
}
```

## Image Naming Convention

Use descriptive, kebab-case names:
- ✅ `dropdown-builder.jpg`
- ✅ `sms-characters-preview.jpg`
- ✅ `time-management-tool.jpg`
- ❌ `image1.jpg`
- ❌ `screenshot.png`

## Tips

1. **Consistency:** Use the same aspect ratio (3:2) for all images
2. **Quality:** Balance file size with quality - WebP typically gives 30-50% smaller files
3. **Alt Text:** Always provide descriptive alt text for accessibility
4. **Testing:** Test images on different screen sizes to ensure they look good

## Current Placeholder Behavior

If you don't add an `imageUrl`, the card will show a placeholder with dimensions displayed. This helps you know what size to prepare your images.




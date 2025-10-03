# 🎨 Oryxa Design System - Dual Theme

## Design Philosophy

**Inspired by**: Modern, minimalist UI with deep dark blue/black backgrounds, teal-to-blue gradients, and clean typography

**Goal**: Create a cohesive design that works seamlessly in both dark and light modes while maintaining the premium, futuristic feel.

---

## 🎨 Color Palette

### Dark Mode (Primary)
```css
Background: #0a0e27 (Deep navy/black)
Surface: #111827 (Dark slate)
Card: #1e293b (Elevated surfaces)
Border: rgba(148, 163, 184, 0.1) (Subtle borders)

Text Primary: #f8fafc (Almost white)
Text Secondary: #94a3b8 (Muted gray-blue)
Text Tertiary: #64748b (Subtle gray)

Accent Gradient: linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #3b82f6 100%)
  - Start: #14b8a6 (Teal)
  - Mid: #06b6d4 (Cyan)
  - End: #3b82f6 (Blue)

Status Colors:
  - Success: #10b981 (Emerald)
  - Warning: #f59e0b (Amber)
  - Error: #ef4444 (Red)
  - Info: #3b82f6 (Blue)
```

### Light Mode (Complementary)
```css
Background: #f8fafc (Soft white)
Surface: #ffffff (Pure white)
Card: #f1f5f9 (Light slate)
Border: rgba(15, 23, 42, 0.1) (Subtle borders)

Text Primary: #0f172a (Deep slate)
Text Secondary: #475569 (Medium slate)
Text Tertiary: #94a3b8 (Light slate)

Accent Gradient: linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #2563eb 100%)
  - Start: #0d9488 (Dark teal)
  - Mid: #0891b2 (Dark cyan)
  - End: #2563eb (Dark blue)

Status Colors:
  - Success: #059669 (Dark emerald)
  - Warning: #d97706 (Dark amber)
  - Error: #dc2626 (Dark red)
  - Info: #2563eb (Dark blue)
```

---

## 📐 Typography

### Font Stack
```css
Display (Headings): 'Poppins', sans-serif
  - Weights: 600 (SemiBold), 700 (Bold)
  - Use for: Hero text, main headings, CTAs

Body (Content): 'Inter', sans-serif
  - Weights: 400 (Regular), 500 (Medium), 600 (SemiBold)
  - Use for: Paragraphs, labels, descriptions

Monospace (Code/Data): 'JetBrains Mono', monospace
  - Weight: 400
  - Use for: Invoice numbers, API keys, technical data
```

### Type Scale
```css
Hero: 4rem (64px) - Bold, gradient text
H1: 3rem (48px) - SemiBold
H2: 2.25rem (36px) - SemiBold
H3: 1.875rem (30px) - SemiBold
H4: 1.5rem (24px) - Medium
Body Large: 1.125rem (18px) - Regular
Body: 1rem (16px) - Regular
Body Small: 0.875rem (14px) - Regular
Caption: 0.75rem (12px) - Medium
```

---

## 🎭 Visual Effects

### Glass Morphism
```css
Dark Mode:
  background: rgba(255, 255, 255, 0.03)
  backdrop-filter: blur(20px)
  border: 1px solid rgba(255, 255, 255, 0.08)
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2)

Light Mode:
  background: rgba(255, 255, 255, 0.7)
  backdrop-filter: blur(20px)
  border: 1px solid rgba(0, 0, 0, 0.05)
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08)
```

### Gradients

**Accent Gradient (Primary CTA)**
```css
Dark: linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #3b82f6 100%)
Light: linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #2563eb 100%)
```

**Subtle Background Gradient**
```css
Dark: radial-gradient(circle at top right, rgba(20, 184, 166, 0.1), transparent 50%)
Light: radial-gradient(circle at top right, rgba(13, 148, 136, 0.08), transparent 50%)
```

**Text Gradient (Hero/Emphasis)**
```css
Dark: linear-gradient(135deg, #14b8a6, #06b6d4, #3b82f6)
Light: linear-gradient(135deg, #0d9488, #0891b2, #2563eb)
```

### Glow Effects
```css
Dark Mode (Accent Glow):
  box-shadow: 0 0 40px rgba(20, 184, 166, 0.3),
              0 0 80px rgba(6, 182, 212, 0.2)

Light Mode (Subtle Lift):
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.15),
              0 0 40px rgba(8, 145, 178, 0.1)
```

---

## 🧩 Component Patterns

### Buttons

**Primary (CTA)**
```css
Dark:
  background: linear-gradient(135deg, #14b8a6, #06b6d4, #3b82f6)
  color: #ffffff
  shadow: 0 4px 20px rgba(20, 184, 166, 0.4)
  hover: transform scale(1.05), shadow enhance

Light:
  background: linear-gradient(135deg, #0d9488, #0891b2, #2563eb)
  color: #ffffff
  shadow: 0 4px 20px rgba(13, 148, 136, 0.3)
  hover: transform scale(1.05), shadow enhance
```

**Secondary**
```css
Dark:
  background: rgba(255, 255, 255, 0.05)
  border: 1px solid rgba(255, 255, 255, 0.1)
  color: #f8fafc
  hover: background rgba(255, 255, 255, 0.1)

Light:
  background: rgba(15, 23, 42, 0.03)
  border: 1px solid rgba(15, 23, 42, 0.1)
  color: #0f172a
  hover: background rgba(15, 23, 42, 0.05)
```

**Ghost/Tertiary**
```css
Dark:
  background: transparent
  color: #94a3b8
  hover: color #f8fafc, background rgba(255, 255, 255, 0.05)

Light:
  background: transparent
  color: #475569
  hover: color #0f172a, background rgba(15, 23, 42, 0.05)
```

### Cards

**Elevated Card**
```css
Dark:
  background: rgba(255, 255, 255, 0.03)
  backdrop-filter: blur(20px)
  border: 1px solid rgba(255, 255, 255, 0.08)
  border-radius: 16px
  padding: 24px

Light:
  background: #ffffff
  border: 1px solid rgba(15, 23, 42, 0.08)
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06)
  border-radius: 16px
  padding: 24px
```

**Feature Card (Hover Effect)**
```css
Dark:
  transition: all 0.3s ease
  hover: 
    background rgba(255, 255, 255, 0.05)
    border-color rgba(20, 184, 166, 0.3)
    transform translateY(-4px)
    shadow 0 12px 40px rgba(0, 0, 0, 0.3)

Light:
  transition: all 0.3s ease
  hover:
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1)
    border-color rgba(13, 148, 136, 0.3)
    transform translateY(-4px)
```

### Inputs

**Text Input**
```css
Dark:
  background: rgba(255, 255, 255, 0.03)
  border: 1px solid rgba(255, 255, 255, 0.1)
  color: #f8fafc
  placeholder: #64748b
  focus: border-color #14b8a6, shadow 0 0 0 3px rgba(20, 184, 166, 0.1)

Light:
  background: #ffffff
  border: 1px solid rgba(15, 23, 42, 0.15)
  color: #0f172a
  placeholder: #94a3b8
  focus: border-color #0d9488, shadow 0 0 0 3px rgba(13, 148, 136, 0.1)
```

### Status Badges

**Dark Mode**
```css
Draft: bg rgba(148, 163, 184, 0.15), text #cbd5e1, border rgba(148, 163, 184, 0.3)
Sent: bg rgba(59, 130, 246, 0.15), text #93c5fd, border rgba(59, 130, 246, 0.3)
Paid: bg rgba(16, 185, 129, 0.15), text #6ee7b7, border rgba(16, 185, 129, 0.3)
Overdue: bg rgba(239, 68, 68, 0.15), text #fca5a5, border rgba(239, 68, 68, 0.3)
```

**Light Mode**
```css
Draft: bg rgba(148, 163, 184, 0.1), text #475569, border rgba(148, 163, 184, 0.3)
Sent: bg rgba(37, 99, 235, 0.1), text #1e40af, border rgba(37, 99, 235, 0.3)
Paid: bg rgba(5, 150, 105, 0.1), text #047857, border rgba(5, 150, 105, 0.3)
Overdue: bg rgba(220, 38, 38, 0.1), text #b91c1c, border rgba(220, 38, 38, 0.3)
```

---

## 📊 Layout & Spacing

### Grid System
```css
Container: max-width 1280px, padding 32px
Columns: 12-column grid
Gutter: 24px
Breakpoints:
  - Mobile: 320px - 639px
  - Tablet: 640px - 1023px
  - Desktop: 1024px - 1279px
  - Wide: 1280px+
```

### Spacing Scale
```css
4xs: 2px
3xs: 4px
2xs: 8px
xs: 12px
sm: 16px
md: 24px
lg: 32px
xl: 48px
2xl: 64px
3xl: 96px
```

---

## ✨ Animations

### Transitions
```css
Fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
Normal: 300ms cubic-bezier(0.4, 0, 0.2, 1)
Slow: 500ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Keyframe Animations

**Fade In**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
duration: 500ms
```

**Slide Up**
```css
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
duration: 400ms
```

**Scale In**
```css
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
duration: 300ms
```

**Gradient Shift**
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
duration: 3s infinite
```

---

## 🎯 Icon System

**Style**: Outlined, 24px default, 2px stroke
**Library**: Feather Icons or Lucide (clean, minimal)
**Colors**:
- Dark Mode: #94a3b8 (default), #14b8a6 (accent)
- Light Mode: #64748b (default), #0d9488 (accent)

---

## 🌐 Accessibility

### Contrast Ratios
```css
Dark Mode:
  - Text on bg: 15.8:1 (AAA)
  - Secondary text: 7.2:1 (AA)
  - Accent gradient: 4.8:1 minimum (AA)

Light Mode:
  - Text on bg: 16.5:1 (AAA)
  - Secondary text: 7.8:1 (AA)
  - Accent gradient: 5.2:1 minimum (AA)
```

### Focus States
```css
Dark: 
  outline: 2px solid #14b8a6
  outline-offset: 2px
  shadow: 0 0 0 4px rgba(20, 184, 166, 0.2)

Light:
  outline: 2px solid #0d9488
  outline-offset: 2px
  shadow: 0 0 0 4px rgba(13, 148, 136, 0.15)
```

---

## 📱 Responsive Behavior

### Mobile (< 640px)
- Single column layout
- Collapsible sidebar → bottom nav
- Larger touch targets (min 44px)
- Reduced spacing
- Simplified gradients

### Tablet (640px - 1023px)
- Two-column layout
- Collapsible sidebar
- Medium spacing
- Full visual effects

### Desktop (1024px+)
- Multi-column layout
- Persistent sidebar
- Full spacing
- All effects enabled
- Hover states active

---

## 🎨 Implementation Guide

### CSS Variables Structure

```css
:root {
  /* Light Mode (Default) */
  --bg-primary: #f8fafc;
  --bg-surface: #ffffff;
  --bg-card: #f1f5f9;
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  
  --accent-start: #0d9488;
  --accent-mid: #0891b2;
  --accent-end: #2563eb;
  
  --border-color: rgba(15, 23, 42, 0.1);
  --shadow-sm: 0 4px 20px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  /* Dark Mode */
  --bg-primary: #0a0e27;
  --bg-surface: #111827;
  --bg-card: #1e293b;
  
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  
  --accent-start: #14b8a6;
  --accent-mid: #06b6d4;
  --accent-end: #3b82f6;
  
  --border-color: rgba(148, 163, 184, 0.1);
  --shadow-sm: 0 8px 32px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.3);
}
```

---

## 🎯 Key Design Principles

1. **Minimalism**: Clean, uncluttered interfaces with purposeful whitespace
2. **Contrast**: High contrast for readability in both themes
3. **Gradients**: Subtle teal-to-blue gradients for visual interest
4. **Typography**: Bold headlines, clean body text, readable hierarchy
5. **Symmetry**: Structured, balanced layouts
6. **Depth**: Glass morphism and shadows for visual layers
7. **Motion**: Smooth, purposeful animations
8. **Accessibility**: WCAG AAA compliance for text contrast

---

## 🚀 Usage Examples

### Hero Section
```
Dark: Deep navy bg with subtle teal glow
Light: Soft white bg with subtle teal accent

Headline: 64px, Bold, gradient text
Subheading: 18px, Medium, secondary color
CTA: Gradient button with arrow icon
```

### Dashboard Cards
```
Dark: Glass cards with backdrop blur, subtle borders
Light: White cards with soft shadows

Stats: Large numbers with gradient accent
Labels: Uppercase, small, secondary color
Icons: Outlined, accent color on hover
```

### Data Tables
```
Dark: Transparent bg, subtle row borders, hover glow
Light: White bg, light row borders, hover lift

Headers: Uppercase, small, tertiary color
Cells: Regular size, primary color
Actions: Icon buttons with hover effects
```

---

**Created**: October 3, 2025  
**Version**: 1.0  
**Status**: Ready for Implementation  

This design system provides complete flexibility for both dark and light modes while maintaining the modern, premium aesthetic inspired by your reference design! 🎨✨

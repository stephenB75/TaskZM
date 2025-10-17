# Design Standards - Task Manager Application

> **Version 1.3.0** | Last Updated: September 30, 2025
>
> This document defines all design standards, component specifications, and layout rules for the task manager application. **All changes must adhere to these standards unless explicitly approved by the user.**

---

## 🎨 Color System

### Primary Brand Colors

| Color Name             | Hex Value | Usage                           | Variable |
| ---------------------- | --------- | ------------------------------- | -------- |
| **Primary Blue**       | `#3300ff` | Primary actions, links, accents | N/A      |
| **Primary Blue Hover** | `#2200cc` | Hover state for primary blue    | N/A      |
| **Purple**             | `#7c3aed` | AI features, gradients          | N/A      |
| **Purple 500**         | `#a855f7` | Gradient start                  | N/A      |
| **Blue 500**           | `#3b82f6` | Gradient end                    | N/A      |

### Neutral Colors

| Color Name           | Hex Value            | Usage                     | Variable             |
| -------------------- | -------------------- | ------------------------- | -------------------- |
| **Background**       | `#f8f9fa`            | Main background           | `--background`       |
| **White**            | `#ffffff`            | Cards, panels, modals     | N/A                  |
| **Text Primary**     | `#313131`            | Headings, primary text    | `--foreground`       |
| **Text Secondary**   | `#828282`            | Descriptions, metadata    | `--muted-foreground` |
| **Border Light**     | `rgba(0, 0, 0, 0.1)` | Subtle borders            | `--border`           |
| **Accent Gray**      | `#e9ebef`            | Backgrounds, hover states | `--accent`           |
| **Input Background** | `#f3f3f5`            | Form inputs               | `--input-background` |

### Status Colors

| Status          | Background | Text Color | Usage           |
| --------------- | ---------- | ---------- | --------------- |
| **To Do**       | `#dfe9ff`  | `#2c62b4`  | Default status  |
| **In Progress** | `#fef3e0`  | `#d87f00`  | Active tasks    |
| **Done**        | `#e0f7e0`  | `#2d8a2d`  | Completed tasks |

### Priority Colors

| Priority   | Color        | Usage                 |
| ---------- | ------------ | --------------------- |
| **High**   | Red-based    | High priority tasks   |
| **Medium** | Orange-based | Medium priority tasks |
| **Low**    | Blue-based   | Low priority tasks    |

### Tag Colors (Pre-defined)

```typescript
{
  text: 'Design',
  bgColor: '#f5e6ff',
  textColor: '#8b4bc4',
  fontWeight: 'bold'
}

{
  text: 'Development',
  bgColor: '#dfe9ff',
  textColor: '#2c62b4',
  fontWeight: 'bold'
}

{
  text: 'Research',
  bgColor: '#fff4e6',
  textColor: '#d87f00',
  fontWeight: 'bold'
}

{
  text: 'Bug',
  bgColor: '#ffe6e6',
  textColor: '#d32f2f',
  fontWeight: 'bold'
}

{
  text: 'Feature',
  bgColor: '#e6f7f0',
  textColor: '#2d8a2d',
  fontWeight: 'bold'
}
```

---

## 📐 Typography System

### Font Family

- **Primary**: `DM Sans` (system default through browser)
- **Fallback**: System font stack

### Font Sizes

**DO NOT use Tailwind text size classes** (e.g., `text-xl`, `text-2xl`) unless specifically requested.

| Element            | Size (px) | CSS                      | Usage                  |
| ------------------ | --------- | ------------------------ | ---------------------- |
| **Large Heading**  | 32px      | `text-[32px]`            | Main page titles       |
| **Medium Heading** | 20px      | `text-[20px]`            | Section headers        |
| **Base Text**      | 16px      | `text-[16px]` or default | Body text, labels      |
| **Small Text**     | 13px      | `text-[13px]`            | Descriptions, metadata |
| **Extra Small**    | 12px      | `text-[12px]`            | Timestamps, counts     |
| **Tiny Text**      | 10px      | `text-[10px]`            | Micro labels           |

### Font Weights

**DO NOT use Tailwind weight classes** (e.g., `font-bold`, `font-semibold`) unless specifically requested.

| Weight     | Value | Usage                               |
| ---------- | ----- | ----------------------------------- |
| **Bold**   | 700   | `font-bold` - Headings, emphasis    |
| **Medium** | 500   | `font-medium` - Subheadings, labels |
| **Normal** | 400   | Default - Body text                 |

### Line Height

- Default: `1.5` for all text elements
- Specified in base typography (see `globals.css`)

---

## 📏 Spacing System

### Standard Spacing Scale

Use consistent spacing throughout the application:

| Token | Value | Usage               |
| ----- | ----- | ------------------- |
| `2`   | 8px   | Tight spacing       |
| `3`   | 12px  | Standard gap        |
| `4`   | 16px  | Comfortable spacing |
| `6`   | 24px  | Large spacing       |
| `8`   | 32px  | Section spacing     |
| `12`  | 48px  | Major sections      |

### Component-Specific Spacing

#### Task Cards

- **Padding**: `p-3` (12px)
- **Gap between elements**: `gap-2` or `gap-3` (8-12px)
- **Width**: `236px` fixed
- **Min Height**: Auto (content-based)

#### Day Columns

- **Width**: `280px` fixed (updated from original 256px)
- **Border Right**: `1px solid #e3e3e3`
- **Padding**: `12px` for task container
- **Header Padding**: `px-5 py-2.5` (20px horizontal, 10px vertical)

#### Panels

- **Inbox Panel Width**: `315px` fixed
- **Calendar Panel Width**: `315px` fixed
- **Timeline Panel Width**: `315px` fixed
- **Padding**: `px-6 py-8` (24px horizontal, 32px vertical)

#### Navigation

- **Vertical Nav Bar Width**: `80px` fixed
- **Week Navigation Height**: `72px` approximate
- **Mobile Bottom Nav Height**: Auto with padding

---

## 🎯 Component Standards

### 1. Task Card

**Dimensions:**

- Width: `236px` fixed
- Padding: `p-3` (12px)
- Border Radius: `rounded-lg` (10px)
- Background: White
- Border: `1px solid rgba(0, 0, 0, 0.05)`
- Shadow: `shadow-sm`

**Internal Structure:**

```
- Title (text-[13px], text-[#313131], line-clamp-2)
- Description (text-[12px], text-[#828282], line-clamp-2, mt-1)
- Tags Row (flex flex-wrap gap-1, mt-2)
  - Tag (px-2 py-0.5, rounded, text-[10px])
- Priority Badge (px-2 py-0.5, rounded-full, text-[10px], mt-2)
- Metadata Section (text-[10px], text-[#828282], mt-2, gap-2)
  - Assignee (flex items-center gap-1)
  - Due Date (flex items-center gap-1)
- Links/Files (text-[10px], text-[#3300ff], mt-2)
- Notes (text-[10px], text-[#828282], mt-2, line-clamp-2)
- Status Bar (mt-3, h-1, rounded-full)
```

**Hover State:**

- Transform: `scale(1.02)`
- Shadow: Enhanced
- Cursor: `pointer`
- Transition: `all 0.2s`

**States:**

- **Todo**: Blue status bar
- **In Progress**: Orange status bar
- **Done**: Green status bar, reduced opacity

### 2. Day Column

**Dimensions:**

- Width: `280px` fixed
- Height: `100%` (fills container)
- Background: `#fdfdfd`
- Border Right: `1px solid #e3e3e3`
- Padding: `12px` (tasks container)
- Flex: `flex-shrink-0` (prevents compression)

**Header:**

- Day Name: `text-[13px]`, `text-[#828282]`
- Date: `text-[20px]`, `text-[#313131]`
- Today Indicator: Blue background

**Add Task Button:**

- Size: `w-8 h-8`
- Background: `#e9ebef`
- Icon Color: `#828282`
- Hover: Darker background

**Task List:**

- Gap: `gap-3` (12px between cards)
- Overflow: Scroll if needed

### 3. Timeline Panel

**Dimensions:**

- Width: `315px` fixed
- Height: `100vh`
- Background: White
- Border Right: `1px solid rgba(0, 0, 0, 0.05)`
- Padding: `px-6 py-8`

**Header:**

- Title: `text-[20px]`, bold
- Subtitle: `text-[13px]`, `text-[#828282]`

**Time Slots:**

- Slot Height: `h-16` (64px)
- Time Label: `text-[12px]`, `text-[#828282]`
- Border Bottom: `1px solid rgba(0, 0, 0, 0.05)`

### 4. Navigation Bar (Vertical)

**Dimensions:**

- Width: `80px` fixed
- Height: `100vh`
- Background: White
- Border Right: `1px solid rgba(0, 0, 0, 0.05)`

**Icon Buttons:**

- Size: `w-12 h-12`
- Padding: `p-3`
- Border Radius: `rounded-xl`
- Active State: `bg-[#3300ff]`, white icon
- Inactive State: `bg-transparent`, gray icon

### 5. Week Navigation

**Dimensions:**

- Width: Full width
- Height: Auto (approx 72px)
- Background: Transparent
- Padding: `px-8 py-4`

**Week Selector:**

- Background: White
- Padding: `px-4 py-2`
- Border Radius: `rounded-lg`
- Border: `1px solid rgba(0, 0, 0, 0.1)`

**AI Schedule Button:**

- Background: Gradient `from-purple-500 to-blue-500`
- Text: White
- Padding: `px-4 py-2`
- Border Radius: `rounded-lg`
- Icon: Sparkles

### 6. Add Task Modal

**Dimensions:**

- Width: `650px` max
- Max Height: `90vh`
- Background: White
- Border Radius: `rounded-xl`
- Padding: `p-6`

**Form Layout:**

- Fields: Stacked with `space-y-4`
- Labels: `text-[13px]`, medium weight
- Inputs: Full width, `h-10`, `rounded-lg`
- Grid Layout: `grid-cols-2` or `grid-cols-3` for dates

**AI Schedule Toggle:**

- Background: Gradient `from-purple-50 to-blue-50`
- Border: `1px solid rgba(147, 51, 234, 0.2)`
- Border Radius: `rounded-lg`
- Padding: `p-4`
- Icon Container: `w-10 h-10`, gradient background, rounded-full

### 7. Inbox Panel

**Dimensions:**

- Width: `315px` fixed
- Height: `100vh`
- Background: White
- Border Left: `1px solid rgba(0, 0, 0, 0.05)`
- Padding: `px-6 py-8`

**Quick Add Input:**

- Height: `h-10`
- Background: `#f3f3f5`
- Border Radius: `rounded-lg`
- Placeholder: `text-[13px]`

**Inbox Items:**

- Background: `#f8f9fa`
- Padding: `p-3`
- Border Radius: `rounded-lg`
- Gap: `gap-2` between items

### 8. Calendar Panel

**Dimensions:**

- Width: `315px` fixed (desktop) / Full width (mobile)
- Height: `100vh` (desktop) / Auto (mobile)
- Background: White
- Padding: `px-6 py-8`

**Calendar Grid:**

- 7 columns (Sunday-Saturday)
- Cell Size: Square, responsive
- Padding: `p-2` per cell
- Border: `1px solid rgba(0, 0, 0, 0.05)`

**Date Cells:**

- Active: `bg-[#3300ff]`, white text
- Today: Border highlight
- Has Tasks: Dot indicator

### 9. Mobile Today's Agenda

**Dimensions:**

- Width: Full screen
- Background: `#f8f9fa`
- Padding: `p-4`

**Header:**

- Height: Auto
- Background: White
- Padding: `p-6`
- Border Radius: `rounded-b-2xl`

**Filter Buttons:**

- Height: `h-9`
- Padding: `px-4`
- Border Radius: `rounded-full`
- Active: `bg-[#3300ff]`, white text
- Inactive: `bg-white`, gray text

**FAB (Add Task):**

- Size: `w-14 h-14`
- Background: `bg-[#3300ff]`
- Border Radius: `rounded-full`
- Shadow: Large
- Position: Fixed bottom-right

---

## 📱 Responsive Breakpoints

### Desktop First Approach

| Breakpoint  | Width   | Usage                         | Class Prefix        |
| ----------- | ------- | ----------------------------- | ------------------- |
| **Mobile**  | < 768px | Single column, today's agenda | Default (no prefix) |
| **Desktop** | ≥ 768px | Multi-column, weekly view     | `md:`               |

### Layout Rules

#### Mobile (< 768px)

- **Hide**: Weekly kanban, timeline panel, vertical nav
- **Show**: Today's agenda, mobile navigation, single column
- **Panels**: Full screen overlays
- **Task Cards**: Full width with horizontal padding

#### Desktop (≥ 768px)

- **Hide**: Mobile agenda, mobile navigation
- **Show**: Weekly kanban, timeline panel, vertical nav, sliding panels
- **Task Cards**: Fixed width (236px)
- **Columns**: Fixed width (256px)

---

## 🏗️ Layout Standards

### Desktop Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  [Vertical Nav: 80px]  [Timeline: 315px]  [Main Content: Flex-1]  [Panel?: 315px]  │
└─────────────────────────────────────────────────────────────────┘
```

**Fixed Widths:**

- Vertical Nav Bar: `80px`
- Timeline Panel: `315px`
- Inbox/Calendar Panel: `315px`
- Main Content: `flex-1` (remaining space)

**Main Content Structure:**

```
┌─────────────────────────────┐
│  Week Navigation            │ ← Flex-shrink-0
├─────────────────────────────┤
│  Header (Title + Subtitle)  │ ← Flex-shrink-0, p-8 pb-4
├─────────────────────────────┤
│  Weekly Kanban Board        │ ← Flex-1, overflow-auto, px-8 pb-8
│  [Mon] [Tue] [Wed] [Thu]    │
│  [Fri]                      │
└─────────────────────────────┘
```

### Mobile Layout Structure

```
┌─────────────────────┐
│  Header             │ ← Fixed, white background, rounded bottom
├─────────────────────┤
│  Status Filters     │ ← Horizontal scroll
├─────────────────────┤
│  Task List          │ ← Scrollable, full width
├─────────────────────┤
│  Inbox Section      │ ← Below tasks
└─────────────────────┘
│  [FAB: Add Task]    │ ← Fixed bottom-right
```

### Panel Behavior (Desktop)

**Sliding Panels (Right Side):**

- **Width**: `315px` fixed
- **Animation**: `slide-in-from-right duration-300`
- **Z-Index**: Above main content
- **Toggle**: Click nav icon to show/hide
- **Panels**: Inbox, Calendar (mutually exclusive)

**Fixed Panels (Left Side):**

- **Timeline**: Always visible, `315px` fixed
- **Vertical Nav**: Always visible, `80px` fixed

---

## 🎨 Interactive States

### Buttons

**Primary Button:**

- Background: `#3300ff`
- Text: White
- Hover: `#2200cc`
- Padding: `px-4 py-2`
- Border Radius: `rounded-lg`

**Secondary Button:**

- Background: `#e9ebef`
- Text: `#313131`
- Hover: Darker gray
- Padding: `px-4 py-2`
- Border Radius: `rounded-lg`

**Icon Button:**

- Size: `w-8 h-8` or `w-10 h-10`
- Background: `#e9ebef`
- Icon Color: `#828282`
- Hover: Darker background

**Gradient Button (AI Features):**

- Background: `bg-gradient-to-r from-purple-500 to-blue-500`
- Text: White
- Hover: Slightly darker gradient
- Icon: Sparkles

### Hover Effects

**Task Cards:**

```css
hover:scale-[1.02]
hover:shadow-md
transition-all duration-200
cursor-pointer
```

**Buttons:**

```css
hover: bg-opacity-90 transition-colors duration-200;
```

**Interactive Elements:**

```css
hover: bg-gray-50 transition-all duration-150;
```

### Focus States

**All Interactive Elements:**

- Outline: `outline-ring/50` (from globals.css)
- Ring: Visible focus indicator

### Disabled States

**Buttons:**

- Opacity: `opacity-50`
- Cursor: `cursor-not-allowed`
- No hover effects

**Inputs:**

- Background: Lighter gray
- Cursor: `cursor-not-allowed`
- Border: Subtle

---

## 🔲 Border & Shadow System

### Border Radius

| Size       | Value               | Usage                  |
| ---------- | ------------------- | ---------------------- |
| **Small**  | `rounded` (4px)     | Tags, badges           |
| **Medium** | `rounded-lg` (10px) | Cards, inputs, buttons |
| **Large**  | `rounded-xl` (12px) | Panels, containers     |
| **Full**   | `rounded-full`      | Avatars, FAB, pills    |

### Borders

**Standard Border:**

- Width: `1px`
- Color: `rgba(0, 0, 0, 0.05)` - Very subtle
- Usage: Panel edges, card outlines

**Visible Border:**

- Width: `1px`
- Color: `rgba(0, 0, 0, 0.1)` - More prominent
- Usage: Form inputs, dividers

### Shadows

| Level           | Class       | Usage                         |
| --------------- | ----------- | ----------------------------- |
| **Small**       | `shadow-sm` | Task cards (default)          |
| **Medium**      | `shadow-md` | Task cards (hover), dropdowns |
| **Large**       | `shadow-lg` | Modals, FAB                   |
| **Extra Large** | `shadow-xl` | Overlays, important modals    |

---

## 🎭 Animation Standards

### Transitions

**Default Transition:**

```css
transition-all duration-200 ease-in-out
```

**Fast Transition:**

```css
transition-all duration-150
```

**Slow Transition:**

```css
transition-all duration-300
```

### Animations

**Panel Slide In:**

```css
animate-in slide-in-from-right duration-300
```

**Card Hover:**

```css
hover: scale-[1.02] transition-transform duration-200;
```

**Loading States:**

- Use skeleton components
- Pulse animation for loading

---

## 📋 Form Standards

### Input Fields

**Text Input:**

- Height: `h-10` (40px)
- Padding: `px-3`
- Background: `#f3f3f5`
- Border: None (unless error)
- Border Radius: `rounded-lg`
- Font Size: `text-[13px]`

**Textarea:**

- Min Height: `h-20` (80px)
- Padding: `p-3`
- Background: `#f3f3f5`
- Border Radius: `rounded-lg`

**Select Dropdown:**

- Height: `h-10`
- Background: White
- Border: `1px solid rgba(0, 0, 0, 0.1)`
- Border Radius: `rounded-lg`

**Switch Toggle:**

- Size: Defined by shadcn component
- Active: `#3300ff`
- Inactive: `#cbced4`

### Labels

- Font Size: `text-[13px]`
- Font Weight: Medium
- Color: `#313131`
- Margin Bottom: `mb-2`

### Validation

**Error State:**

- Border: Red
- Text: Red, `text-[12px]`
- Icon: Alert circle

**Success State:**

- Border: Green
- Text: Green, `text-[12px]`
- Icon: Check circle

---

## 🚨 LAYOUT CHANGE APPROVAL REQUIRED

**The following changes MUST be approved by the user before implementation:**

### Critical Layout Dimensions

1. **Panel Widths:**
   - Timeline Panel: `315px`
   - Inbox Panel: `315px`
   - Calendar Panel: `315px`
   - Vertical Nav: `80px`
   - Task Card: `236px`
   - Day Column: `280px`

2. **Layout Structure:**
   - Desktop: Multi-column kanban view
   - Mobile: Single column agenda view
   - Panel positioning (left/right fixed vs sliding)
   - Main content flex layout

3. **Component Positioning:**
   - Fixed vs absolute positioning
   - Z-index layering
   - Panel slide direction
   - Modal size and centering

4. **Responsive Breakpoints:**
   - Current breakpoint: `768px` (md:)
   - Mobile/desktop view switches

5. **Spacing & Padding:**
   - Section padding (p-8, px-8, py-8)
   - Component margins
   - Grid gaps

### Questions to Ask Before Layout Changes

**Before modifying widths:**

> "I need to adjust the [component] width from [current] to [new]. This will affect [impact]. Should I proceed?"

**Before changing layout structure:**

> "The requested feature requires changing the [layout aspect] from [current] to [new]. This is a major layout change. Should I proceed?"

**Before altering responsive behavior:**

> "This change affects the mobile/desktop breakpoint behavior. Currently [current behavior], proposed [new behavior]. Should I proceed?"

**Before modifying spacing:**

> "I need to adjust the padding/margin of [component] which will affect spacing throughout [area]. Should I proceed?"

### Minor Changes (No Approval Needed)

- Text content changes
- Color adjustments within existing palette
- Adding/removing elements within existing containers
- Font size adjustments (when explicitly requested)
- Icon changes
- Adding functionality without layout changes
- Internal component logic
- State management

---

## 📚 Component File Reference

### Core Components

| Component             | File                                | Purpose                   |
| --------------------- | ----------------------------------- | ------------------------- |
| **TaskCard**          | `/components/TaskCard.tsx`          | Individual task display   |
| **DayColumn**         | `/components/DayColumn.tsx`         | Daily task column         |
| **WeekNavigation**    | `/components/WeekNavigation.tsx`    | Week selector + AI button |
| **TimelinePanel**     | `/components/TimelinePanel.tsx`     | Left sidebar timeline     |
| **VerticalNavBar**    | `/components/VerticalNavBar.tsx`    | Left navigation icons     |
| **InboxPanel**        | `/components/InboxPanel.tsx`        | Quick capture inbox       |
| **CalendarPanel**     | `/components/CalendarPanel.tsx`     | Month calendar view       |
| **AddTaskModal**      | `/components/AddTaskModal.tsx`      | Task creation/edit modal  |
| **MobileTodayAgenda** | `/components/MobileTodayAgenda.tsx` | Mobile task view          |

### UI Components

Located in `/components/ui/` - 36 shadcn components

See `VERSION.md` for complete list.

---

## 🎯 Design Principles

### 1. Visual Consistency

- Use exact colors from palette
- Maintain spacing scale
- Apply consistent border radius
- Follow shadow hierarchy

### 2. Typography Consistency

- Never use Tailwind text classes unless requested
- Use exact pixel values: `text-[13px]`, `text-[20px]`
- Maintain font weight system
- Preserve line heights

### 3. Component Integrity

- Task cards always `236px` wide
- Day columns always `256px` wide
- Panels always `315px` wide
- Maintain internal spacing

### 4. Responsive Design

- Mobile-first CSS approach
- Clear breakpoint at `768px`
- Separate experiences (not just scaled)
- Full-width on mobile, fixed-width on desktop

### 5. Interactive Feedback

- Hover states on all clickable elements
- Smooth transitions (200ms default)
- Loading states for async actions
- Success/error toast notifications

### 6. Accessibility

- Focus indicators on all interactive elements
- Proper semantic HTML
- Keyboard navigation support
- ARIA labels where needed

---

## 📖 Usage Guidelines

### When Building New Features

1. **Check this document first** - Find matching patterns
2. **Use existing components** - Don't reinvent
3. **Match spacing** - Use the spacing scale
4. **Follow color palette** - No custom colors
5. **Maintain consistency** - Same patterns everywhere
6. **Ask before major changes** - See approval section

### When Editing Existing Features

1. **Preserve layout dimensions** - Don't change widths/heights
2. **Maintain spacing** - Keep existing padding/margins
3. **Match styling** - Use same classes as similar components
4. **Test responsive** - Check mobile and desktop
5. **Verify typography** - No unintended size changes

### When Adding New Components

1. **Follow existing patterns** - Look at similar components
2. **Use design tokens** - Colors, spacing, typography
3. **Make it responsive** - Test at all breakpoints
4. **Add to this document** - Document new standards
5. **Maintain hierarchy** - Visual weight and importance

---

## ✅ Pre-Flight Checklist

Before implementing any change:

- [ ] Colors match the palette (no custom colors)
- [ ] Spacing uses the scale (2, 3, 4, 6, 8, 12)
- [ ] Typography follows standards (exact px values)
- [ ] Component width matches standards (if fixed width)
- [ ] Border radius matches usage (rounded-lg for cards)
- [ ] Shadow level appropriate for hierarchy
- [ ] Hover states included
- [ ] Responsive on mobile and desktop
- [ ] Transitions smooth (200ms default)
- [ ] No layout changes without approval
- [ ] Accessibility considered

---

## 📞 Change Request Protocol

### User Requests Layout Change

**Step 1: Analyze Impact**

- Identify affected components
- Check against critical dimensions
- Assess responsive impact
- Note dependencies

**Step 2: Ask for Approval**

```
"This change requires modifying [component] from [current] to [new].

Impact:
- [Dimension/layout changes]
- [Affected components]
- [Responsive behavior changes]

This is a major layout change. Should I proceed?"
```

**Step 3: Implement if Approved**

- Make changes as specified
- Update this document
- Test thoroughly
- Document in VERSION.md

### User Requests Styling Change

**If within standards:**

- Implement without asking
- Follow existing patterns
- Maintain consistency

**If outside standards:**

- Ask for clarification
- Suggest standard alternatives
- Get approval if creating new pattern

---

## 🔄 Versioning

This document is versioned alongside the application.

**Current Version: 1.3.0**

Update this document when:

- New components are added
- Layout standards change (with approval)
- New patterns emerge
- Design tokens are added

---

## 📝 Notes

- **Figma Import**: Original design uses DM Sans and #3300ff blue
- **Mobile vs Desktop**: Completely different layouts, not just responsive scaling
- **AI Features**: Use purple-to-blue gradients and Sparkles icon
- **Task Limit**: 6 tasks per day (configurable constant)
- **Week Display**: Monday-Friday only (5 days)

---

**End of Design Standards Document**

_For version history and feature documentation, see `/VERSION.md`_
_For component implementation details, see individual component files_
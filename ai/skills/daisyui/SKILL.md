---
name: daisyui
description: Rules and guidelines for building frontend UI components and pages using DaisyUI 5 with Tailwind CSS 4. Use this skill whenever the user asks to build, create, write, or modify any frontend interface, HTML page, web component, UI element, form, layout, or navigation — especially when DaisyUI, daisyui, daisy-ui, or Tailwind CSS is mentioned. Also trigger when the user asks for buttons, cards, modals, navbars, forms, tables, badges, alerts, or any UI component that could benefit from DaisyUI classes. Trigger even if the user doesn't explicitly mention DaisyUI — proactively apply these rules when building frontend code.
---

# DaisyUI 5 Frontend Rules

DaisyUI 5 is a component library built on top of **Tailwind CSS 4**. It provides semantic class names for common UI components.

- Full component reference: see `references/components.md` in this skill directory
- Official docs: https://daisyui.com
- Version: 5.5.x

## Setup

DaisyUI 5 requires **Tailwind CSS 4** (not v3). Do NOT use `tailwind.config.js` — it is deprecated in v4.

**Node install:**
```bash
npm i -D daisyui@latest
```

**CSS file:**
```css
@import "tailwindcss";
@plugin "daisyui";
```

**CDN (no build step):**
```html
<link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

## Tech Stack Requirements

All frontend code **must** use:
- **TypeScript** — always use `.vue` files with `<script setup lang="ts">`, type all props, emits, refs, and composables
- **Vue.js Composition API** — always use `<script setup>` syntax; never use Options API (`data()`, `methods`, `computed` object, etc.)

### Vue + TypeScript patterns

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

// Props with type definition
const props = defineProps<{
  title: string
  count?: number
}>()

// Emits with type definition
const emit = defineEmits<{
  close: []
  submit: [value: string]
}>()

// Typed refs
const isOpen = ref(false)
const items = ref<string[]>([])

// Computed
const total = computed(() => items.value.length)
</script>
```

- Use `defineProps<T>()` with TypeScript generics instead of runtime props definition
- Use `defineEmits<T>()` with TypeScript generics
- Use `withDefaults(defineProps<T>(), {...})` when props need default values
- Type `ref<T>()` explicitly when the initial value doesn't infer the correct type
- Extract reusable logic into composables (`use*.ts`)

## Core Usage Rules

1. Apply components by adding daisyUI class names to HTML elements: combine a **component** class, optional **part** classes, and optional **modifier** classes.
2. Customize further with Tailwind CSS utility classes (e.g., `btn px-10` for custom padding).
3. If Tailwind utilities are overridden by daisyUI's specificity, append `!` to force override (e.g., `bg-red-500!`). Use this sparingly as a last resort.
4. If a component doesn't exist in daisyUI, build it with Tailwind utilities directly.
5. Layouts using `flex` and `grid` should be responsive using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, etc.).
6. Only use valid daisyUI class names or Tailwind CSS utility classes. No custom CSS unless absolutely necessary.
7. For placeholder images, use `https://picsum.photos/{width}/{height}`.
8. Don't add custom fonts unless required.
9. Don't add `bg-base-100 text-base-content` to `<body>` unless specifically needed.
10. Follow Refactoring UI best practices for design decisions.

## Color System

DaisyUI adds semantic color names that automatically adapt to the active theme. **Always prefer daisyUI color names over Tailwind's static colors** — static colors like `text-gray-800` will break on dark themes.

| Color name | Purpose |
|---|---|
| `primary` | Main brand color |
| `primary-content` | Text/content on primary |
| `secondary` | Secondary brand color |
| `secondary-content` | Text/content on secondary |
| `accent` | Accent color |
| `accent-content` | Text/content on accent |
| `neutral` | For less-saturated UI parts |
| `neutral-content` | Text/content on neutral |
| `base-100` | Page background (lightest) |
| `base-200` | Slightly darker surface |
| `base-300` | Even darker surface |
| `base-content` | Text on base colors |
| `info` | Informational messages |
| `success` | Success/safe states |
| `warning` | Caution states |
| `error` | Error/danger states |
| `*-content` | Foreground on any semantic color |

**Usage:** `bg-primary`, `text-primary-content`, `border-error`, etc.

**No need for `dark:` variants** — daisyUI color names update automatically with theme.

For design, use `base-*` colors for most of the page; use `primary` for important/highlighted elements.

## Theming

Apply themes via the `data-theme` attribute on `<html>`:
```html
<html data-theme="dark">
```

Built-in themes: `light`, `dark`, `cupcake`, `bumblebee`, `emerald`, `corporate`, `synthwave`, `retro`, `cyberpunk`, `valentine`, `halloween`, `garden`, `forest`, `aqua`, `lofi`, `pastel`, `fantasy`, `wireframe`, `black`, `luxury`, `dracula`, `cmyk`, `autumn`, `business`, `acid`, `lemonade`, `night`, `coffee`, `winter`, `dim`, `nord`, `sunset`, `caramellatte`, `abyss`, `silk`.

Configure in CSS:
```css
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}
```

Theme switcher: use `<input type="checkbox" value="dark" class="theme-controller" />`.

## Component Quick Reference

All class name details and syntax are in `references/components.md`. Here is a brief index:

| Component | Key class(es) | Notes |
|---|---|---|
| **accordion** | `collapse`, `collapse-title`, `collapse-content` | Uses radio inputs for group behavior |
| **alert** | `alert`, `alert-info/success/warning/error` | Styles: `alert-outline`, `alert-dash`, `alert-soft` |
| **avatar** | `avatar`, `avatar-group` | Modifiers: `avatar-online`, `avatar-offline`, `avatar-placeholder` |
| **badge** | `badge` | Colors + sizes, styles: `badge-outline/dash/soft/ghost` |
| **breadcrumbs** | `breadcrumbs` | Wrap `<ul><li><a>` |
| **button** | `btn` | Colors, sizes, styles; works on `<button>`, `<a>`, `<input>` |
| **card** | `card`, `card-body`, `card-title`, `card-actions` | Sizes, styles: `card-border/dash`; `card-side` |
| **carousel** | `carousel`, `carousel-item` | Directions: `carousel-horizontal/vertical` |
| **chat** | `chat chat-start/chat-end`, `chat-bubble` | For conversation UI |
| **checkbox** | `checkbox` | Colors + sizes |
| **collapse** | `collapse`, `collapse-title`, `collapse-content` | Can use `<details>/<summary>` |
| **countdown** | `countdown` | Set `--value` CSS var via JS |
| **diff** | `diff`, `diff-item-1`, `diff-item-2`, `diff-resizer` | Side-by-side comparison |
| **divider** | `divider` | Colors, directions: `divider-vertical/horizontal` |
| **dock** | `dock`, `dock-label` | Bottom navigation bar |
| **drawer** | `drawer`, `drawer-content`, `drawer-side` | Sidebar layout; use `lg:drawer-open` |
| **dropdown** | `dropdown`, `dropdown-content` | Via `<details>`, popover API, or CSS focus |
| **fab** | `fab`, `fab-main-action`, `fab-close` | Floating Action Button; `fab-flower` variant |
| **fieldset** | `fieldset`, `fieldset-legend` | Groups form elements |
| **file-input** | `file-input` | Colors + sizes |
| **filter** | `filter`, `filter-reset` | Radio-based filter group |
| **footer** | `footer`, `footer-title` | Placements: `footer-center`; directions |
| **hero** | `hero`, `hero-content`, `hero-overlay` | Full-width section with image/text |
| **hover-3d** | `hover-3d` | Must have exactly 9 children (1 content + 8 empty divs) |
| **hover-gallery** | `hover-gallery` | Up to 10 images, reveal on hover |
| **indicator** | `indicator`, `indicator-item` | Overlay badge on corner of element |
| **input** | `input` | Colors + sizes + `input-ghost` |
| **join** | `join`, `join-item` | Groups buttons/inputs; also used for pagination |
| **kbd** | `kbd` | Keyboard shortcut styling |
| **label** | `label`, `floating-label` | `floating-label` for animated float effect |
| **link** | `link` | Colors + `link-hover` |
| **list** | `list`, `list-row` | Vertical info rows; `list-col-grow/wrap` |
| **loading** | `loading` | Styles: `loading-spinner/dots/ring/ball/bars/infinity` |
| **mask** | `mask mask-squircle/heart/hexagon/...` | Crops element to shape |
| **menu** | `menu`, `menu-title` | Directions: `menu-vertical/horizontal`; `menu-xs/sm/md/lg/xl` |
| **mockup-browser** | `mockup-browser`, `mockup-browser-toolbar` | Browser window UI |
| **mockup-code** | `mockup-code` | Code editor UI; `<pre data-prefix="$">` |
| **mockup-phone** | `mockup-phone`, `mockup-phone-display` | iPhone mockup |
| **mockup-window** | `mockup-window` | OS window mockup |
| **modal** | `modal`, `modal-box`, `modal-action` | Prefer HTML `<dialog>` + `showModal()` |
| **navbar** | `navbar`, `navbar-start/center/end` | Top navigation |
| **pagination** | `join` + `join-item btn` | Pagination is built with join component |
| **progress** | `progress` | Colors; requires `value` and `max` attributes |
| **radial-progress** | `radial-progress` | Set `--value` CSS var |
| **radio** | `radio` | Colors + sizes |
| **range** | `range` | Colors + sizes; requires `min` and `max` |
| **rating** | `rating`, `mask mask-star` | Use radio inputs; `rating-half` for half stars |
| **select** | `select` | Colors + sizes + `select-ghost` |
| **skeleton** | `skeleton`, `skeleton-text` | Loading placeholder; set `h-*` and `w-*` |
| **stack** | `stack` | Visually stacks elements on top of each other |
| **stat** | `stats`, `stat`, `stat-title/value/desc/figure` | Data/metrics display |
| **status** | `status` | Tiny status indicator dot; colors + sizes |
| **steps** | `steps`, `step` | Process/wizard steps; colors, directions |
| **swap** | `swap`, `swap-on`, `swap-off` | Toggle between two elements; `swap-rotate/flip` |
| **tab** | `tabs`, `tab`, `tab-content` | Styles: `tabs-box/border/lift`; use radio for content |
| **table** | `table` | `table-zebra`, `table-pin-rows/cols`, sizes; wrap in `overflow-x-auto` |
| **text-rotate** | `text-rotate` | Rotating text animation; 2–6 lines; loops every 10s |
| **textarea** | `textarea` | Colors + sizes + `textarea-ghost` |
| **theme-controller** | `theme-controller` | Checkbox/radio to switch theme |
| **timeline** | `timeline`, `timeline-start/middle/end` | Chronological event list |
| **toast** | `toast` | Stacked notifications; placement modifiers |
| **toggle** | `toggle` | Switch-style checkbox; colors + sizes |
| **tooltip** | `tooltip` | `data-tip="text"` attribute; placement + colors |
| **validator** | `validator`, `validator-hint` | Form validation styling |

## Pattern Examples

### Form with labels and validation (Vue + TypeScript)
```vue
<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ submit: [email: string] }>()
const email = ref('')

function handleSubmit() {
  emit('submit', email.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Account Details</legend>
      <label class="floating-label">
        <input v-model="email" type="email" class="input validator" required placeholder="Email" />
        <span>Email address</span>
      </label>
      <p class="validator-hint">Please enter a valid email</p>
      <button type="submit" class="btn btn-primary mt-4">Submit</button>
    </fieldset>
  </form>
</template>
```

### Modal (Vue + TypeScript)
```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const open = () => dialog.value?.showModal()
const close = () => dialog.value?.close()
</script>

<template>
  <button class="btn btn-primary" @click="open">Open Modal</button>
  <dialog ref="dialog" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Title</h3>
      <p class="py-4">Content here</p>
      <div class="modal-action">
        <button class="btn" @click="close">Close</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button>close</button></form>
  </dialog>
</template>
```

### Navbar with drawer (responsive sidebar)
```vue
<template>
  <div class="drawer lg:drawer-open">
    <input id="sidebar" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <div class="navbar bg-base-200">
        <label for="sidebar" class="btn btn-ghost lg:hidden">☰</label>
        <span class="text-xl font-bold">App Name</span>
      </div>
      <!-- page content -->
    </div>
    <div class="drawer-side">
      <label for="sidebar" class="drawer-overlay"></label>
      <ul class="menu bg-base-100 min-h-full w-64 p-4">
        <li><a>Dashboard</a></li>
        <li><a>Settings</a></li>
      </ul>
    </div>
  </div>
</template>
```

### Card grid
```vue
<script setup lang="ts">
interface CardItem {
  id: number
  title: string
  description: string
}

const props = defineProps<{ items: CardItem[] }>()
const emit = defineEmits<{ action: [id: number] }>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="item in items" :key="item.id" class="card card-border">
      <div class="card-body">
        <h2 class="card-title">{{ item.title }}</h2>
        <p>{{ item.description }}</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary" @click="emit('action', item.id)">Action</button>
        </div>
      </div>
    </div>
  </div>
</template>
```

### Alert variants
```html
<div role="alert" class="alert alert-info">Info message</div>
<div role="alert" class="alert alert-success">Success!</div>
<div role="alert" class="alert alert-warning">Warning</div>
<div role="alert" class="alert alert-error">Error occurred</div>
```

### Stats display
```html
<div class="stats stats-horizontal shadow">
  <div class="stat">
    <div class="stat-title">Total Users</div>
    <div class="stat-value">4,200</div>
    <div class="stat-desc">↗︎ 12% more than last month</div>
  </div>
</div>
```

## Full Component Reference

For complete syntax, all class names, and rules for every component, read `references/components.md` in this skill directory. Consult it when you need details on a specific component.

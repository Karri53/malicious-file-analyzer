# UI Design Documentation

> **NSA Senior Design Project | Prairie View A&M University | Spring 2026**

[![Tool](https://img.shields.io/badge/Design%20Tool-Figma-orange)](https://figma.com)

---

## Table of Contents

- [Overview](#overview)
- [Wireframes](#wireframes)
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Component Specifications](#component-specifications)
- [User Flow Diagrams](#user-flow-diagrams)
- [UI States](#ui-states)
- [Spacing and Layout](#spacing-and-layout)

---

## Overview

The Malicious File Analyzer UI uses a dark, warm-toned design built around the Opulence team brand palette. The design prioritizes clarity and trust — users submitting potentially dangerous files need immediate, readable feedback about what is happening and what was found.

**Design decisions:**
- Dark warm theme using the Opulence gold, sage, cream, brown, and forest palette
- Monospace font (Space Mono) for all technical labels, scores, and UI chrome
- Sans-serif font (DM Sans) for body text and descriptions
- Color-coded threat system: green (clean, score 0–30), gold/yellow (suspicious, score 31–69), red (malicious, score 70–100)
- Three distinct page states on every analysis page: default, processing, and error

**Pages designed (9 total):**
- Home
- Email Instructions
- URL Analyzer
- URL Analyzer — Processing
- URL Analyzer — Error
- File Upload
- File Upload — Processing
- File Upload — Error
- Results

---

## Wireframes

All wireframe exports are in `docs/wireframes/`. The user flow diagram PDF is at `docs/wireframes/user-flows/MFA-User-Flow-Diagrams.pdf`.

### Home

![Home](wireframes/Home.pdf)

Hero section, three feature cards (Email Analysis, URL Analysis, File Upload), and a Recent Scans table showing past scan history with File Name, Type, Threat Score, Engine, Status, and Date columns.

### Email Instructions

![Email Instructions](wireframes/Email_Instructions.pdf)

Four-step instruction card layout (2x2 grid) walking the user through forwarding a suspicious email. Card 1 includes a copyable scanner address. Card 2 shows the forwarding format. A help bar at the bottom lists common issues.

### URL Analyzer

![URL Analyzer](wireframes/URL_Analyzer.pdf)

URL input field with SCAN URL button on the left. Example scan history panel on the right showing previous results with Malicious, Clean, and Suspicious status badges.

### URL Analyzer — Processing

![URL Analyzer Processing](wireframes/URL_Analyzer_Processing.pdf)

Input field locked, SCANNING... button disabled, animated gold progress bar, four-step checklist showing real-time scan progress.

### URL Analyzer — Error

![URL Analyzer Error](wireframes/URL_Analyzer_Error.pdf)

Red border on the input field, red error message box, three suggested fixes below, TRY AGAIN button.

### File Upload

![File Upload](wireframes/File_Upload.pdf)

Drag-and-drop zone with BROWSE FILES button on the left. Scan limits panel and active engines list (VirusTotal, Sandbox Detonation, Static Analysis, YARA Rules, Behavioral Analysis) on the right. File retention notice at the bottom of the right panel.

### File Upload — Processing

![File Upload Processing](wireframes/File_Upload_Processing.pdf)

Uploaded filename and size shown at top, animated gold progress bar, five-step checklist (File received, Static analysis, Sandbox detonation, Multi-engine scan, Generating report).

### File Upload — Error

![File Upload Error](wireframes/File_Upload_Error.pdf)

Red X icon centered in the drop zone, red UPLOAD FAILED message, list of common reasons, full-width TRY AGAIN button at the bottom.

### Results

![Results](wireframes/Results.pdf)

Two-column layout. Left: filename, file metadata, SVG threat score ring colored by score range, MALICIOUS/WARNING/CLEAN badge, and metadata rows (type, size, MD5, SHA256, scan time). Right: suspicious indicators list with H/M/L severity labels, six-engine results grid with score bars, and recent scan history table.

---

## Color Palette

### Brand Colors — Opulence

| Name | Hex | Usage |
|------|-----|-------|
| `brand/gold` | `#D0BC77` | Primary accent, headlines, CTAs, active states, NSA badge |
| `brand/sage` | `#77997B` | File Upload accent, Clean status badges, system status pulse dot |
| `brand/cream` | `#EDEDCD` | Primary text, card titles, hero headlines |
| `brand/brown` | `#827742` | Logo shield fill, gradient endpoint |
| `brand/forest` | `#759678` | URL Analysis accent, secondary interactive elements |

### Background System

| Name | Hex | Usage |
|------|-----|-------|
| `bg/primary` | `#0A0906` | Page background |
| `bg/surface` | `#111009` | Cards, nav bar, panels |
| `bg/surface2` | `#181510` | Hover states, inner input boxes |
| `border/default` | `#252015` | All borders and dividers |
| `border/hover` | `#3A3220` | Hovered borders, active input borders |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| `text/primary` | `#EEE8D5` | Main readable text, headings |
| `text/muted` | `#7A7260` | Subtitles, descriptions, nav links |
| `text/faint` | `#4A4535` | Section labels, timestamps, placeholders |

### Status Colors

| Name | Hex | Score Range | Usage |
|------|-----|-------------|-------|
| `status/clean` | `#77997B` | 0–30 | Green score ring, CLEAN badge |
| `status/warn` | `#D0BC77` | 31–69 | Yellow/gold score ring, WARNING badge |
| `status/threat` | `#E05555` | 70–100 | Red score ring, MALICIOUS badge |

> Score thresholds are driven by the malicious scoring algorithm in `backend/scoring.py`. The UI reads the numeric score returned by the API and applies color coding client-side.

---

## Typography

### Typefaces

| Font | Usage | Weights |
|------|-------|---------|
| Space Mono | Headlines, UI labels, badges, scores, table content, all monospace contexts | 400 Regular, 700 Bold |
| DM Sans | Body text, descriptions, subtitles, nav links | 300 Light, 400 Regular, 500 Medium |

### Type Scale

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| H1 hero headline | Space Mono | 42px | Bold | `#EDEDCD` with `#D0BC77` accent word |
| Page title | Space Mono | 38px | Bold | `#EDEDCD` with `#D0BC77` second line |
| Card title | Space Mono | 14px | Bold | `#EDEDCD` |
| Nav title | DM Sans | 14px | Medium | `#EDEDCD` |
| Section label | Space Mono | 10px | Regular | `#4A4535` — uppercase, 14% letter-spacing |
| Eyebrow label | Space Mono | 10px | Regular | `#D0BC77` — above page titles |
| Body / description | DM Sans | 13–15px | Light | `#7A7260` |
| Button text | Space Mono | 11px | Regular | varies — 6% letter-spacing |
| Badge text | Space Mono | 9–10px | Bold | varies by status |
| Breadcrumb — parent | Space Mono | 11px | Regular | `#7A7260` |
| Breadcrumb — current | Space Mono | 11px | Regular | `#D0BC77` |
| Table header | Space Mono | 9px | Regular | `#4A4535` — uppercase, 12% letter-spacing |
| Table content | Space Mono | 11–12px | Regular | `#EEE8D5` |
| Footer | Space Mono | 10px | Regular | `#4A4535` |

---

## Component Specifications

### Buttons

| Variant | Background | Text color | Border | Usage |
|---------|-----------|------------|--------|-------|
| Primary | `#D0BC77` | `#0A0906` | none | SCAN URL, UPLOAD FILE, START SCAN |
| Secondary | transparent | `#D0BC77` | 1px `rgba(208,188,119,0.35)` | COPY, VIEW RESULTS |
| Danger | `rgba(224,85,85,0.12)` | `#E05555` | 1px `rgba(224,85,85,0.3)` | TRY AGAIN, destructive actions |
| Ghost | transparent | `#7A7260` | 1px `#252015` | CANCEL, low-priority actions |
| Disabled | same as variant | 40% opacity | — | SCANNING... during processing |

Shared specs: Space Mono · 11px · Bold · border-radius 8px · 6% letter-spacing

### Badges

| Badge | Background | Border | Text color |
|-------|-----------|--------|------------|
| MALICIOUS | `rgba(224,85,85,0.1)` | `rgba(224,85,85,0.28)` | `#E05555` |
| WARNING | `rgba(208,188,119,0.1)` | `rgba(208,188,119,0.28)` | `#D0BC77` |
| CLEAN | `rgba(119,153,123,0.12)` | `rgba(119,153,123,0.3)` | `#77997B` |
| ONLINE | `rgba(117,150,120,0.1)` | `rgba(117,150,120,0.25)` | `#759678` |
| BETA | `rgba(130,119,66,0.12)` | `rgba(130,119,66,0.25)` | `#827742` |

Shared specs: border-radius 100px · Space Mono · 9–11px · Bold · uppercase · 7% letter-spacing

### Form Components

**Text / URL input field states:**

| State | Border color | Notes |
|-------|-------------|-------|
| Default | `#252015` | Placeholder text `#4A4535` |
| Focus | `#D0BC77` | Text color `#EEE8D5` |
| Error | `rgba(224,85,85,0.5)` | Error message shown below field |
| Success | `rgba(119,153,123,0.5)` | Confirmation hint shown below field |
| Disabled | `#252015` at 50% opacity | Locked while scan runs |

Specs: background `#181510` · border-radius 8px · padding 12px 16px · Space Mono 12px

**File drop zone:**

- Background: `#111009`
- Border: 2px dashed `#3A3220`
- Border-radius: 12px
- Hover border: `#77997B` (sage)
- Hover background: `rgba(119,153,123,0.04)`
- Drag-active border: `#77997B` solid
- Supported formats: `.exe` `.dll` `.pdf` `.docx` `.xlsx` `.zip` `.rar` `.js` `.html` `.py` and 40+ more
- Max file size: 256 MB

### Cards

**Feature cards (homepage):**

- Layout: CSS Grid — 1.4fr 1fr 1fr (Email card is wider)
- Gap between cards: 14px
- Background: `#111009`
- Border default: 1px solid `#252015`
- Border on hover: 1px solid (accent color)
- Border-radius: 14px
- Padding: 26px
- Hover lift: translateY(-5px)
- Email card accent: `#D0BC77`
- URL card accent: `#759678`
- File card accent: `#77997B`

**Threat score ring (Results page):**

- SVG circle, 140×140px
- Track color: `#252015`
- Ring color: determined by score range (see Status Colors)
- Score 0–30: green `#77997B`
- Score 31–69: gold `#D0BC77`
- Score 70–100: red `#E05555`
- Score number: Space Mono 36px Bold, same color as ring
- Label below: "THREAT SCORE" in Space Mono 9px `#7A7260`

**Indicator severity levels (Results page):**

| Level | Label | Ring color | Background |
|-------|-------|-----------|------------|
| High | H | `#E05555` | `rgba(224,85,85,0.15)` |
| Medium | M | `#D0BC77` | `rgba(208,188,119,0.12)` |
| Low | L | `#77997B` | `rgba(119,153,123,0.12)` |

> Note: The scoring validation report (LeMikkos Starks, Week 2) found that benign indicators — legitimate emails, private IPs, release checksums — can be flagged. The UI displays the raw indicator list but severity classification should defer to the weighted scoring algorithm, not indicator presence alone.

**Recent scans table columns:**

| Column | Width | Font | Alignment |
|--------|-------|------|-----------|
| File Name | 2fr (widest) | Space Mono 12px | Left — filename + small subtitle |
| Type | 80px | Space Mono 11px | Left |
| Threat Score | 100px | Space Mono 13px Bold | Center — colored by range |
| Engine | 100px | Space Mono 10px | Center |
| Status | 90px | Badge | Center |
| Date | 90px | Space Mono 10px | Right |

### Navigation

- Height: 64px
- Background: `rgba(10,9,6,0.9)` with backdrop blur
- Border bottom: 1px solid `#252015`
- Position: fixed, top 0
- Left/right padding: 120px
- Logo mark: 34×34px, border-radius 8px, SVG shield in brand colors
- App title: DM Sans 14px Medium `#EDEDCD`
- "/ Opulence" suffix: DM Sans 14px Regular `#7A7260`
- NSA badge: Space Mono 10px `#D0BC77`, border-radius 100px, gold bg at 8% opacity
- Nav links: DM Sans 13px — `#7A7260` default, `#EDEDCD` hover, `#D0BC77` active page
- Breadcrumb: Space Mono 11px — parent `#7A7260`, separator `#4A4535`, current page `#D0BC77`

---

## User Flow Diagrams

Hand-drawn flow diagrams are located at `docs/wireframes/user-flows/`. A printable PDF version is at `docs/wireframes/user-flows/MFA-User-Flow-Diagrams.pdf`.

![User Flow Diagram](wireframes/user-flows/MFA-User-Flow-Diagrams.pdf)

### Flow 1 — Email Analysis

```
HOME --> EMAIL PAGE --> COPY SCANNER ADDRESS --> FORWARD EMAIL
     --> SYSTEM EXTRACTS ATTACHMENTS --> MULTI-ENGINE ANALYSIS --> RESULTS
```

### Flow 2 — URL Analysis

```
HOME --> URL PAGE --> PASTE URL --> VALIDATE URL?
                                        |
                              YES ------+
                                        |
                                   SANDBOX FETCH --> SCAN --> RESULTS
                              NO -------+
                                        |
                                   ERROR STATE --> TRY AGAIN --> URL PAGE
```

### Flow 3 — File Upload

```
HOME --> UPLOAD PAGE --> DROP / BROWSE FILE --> VALIDATE FILE?
                                                      |
                                          YES ---------+
                                                       |
                                               SANDBOX DETONATION
                                                       |
                                               STATIC + YARA SCAN
                                                       |
                                                   RESULTS
                                          NO ----------+
                                                       |
                                               UPLOAD ERROR
                                                       |
                                               TRY AGAIN --> UPLOAD PAGE
```

---

## UI States

Every analysis page has three frame variants: default, processing, and error. The Results page has three score variants.

| State | Trigger | Key visual changes |
|-------|---------|-------------------|
| Default | Page load | Input active, primary CTA button enabled |
| Processing | After valid submit | Gold progress bar animates, button shows SCANNING..., step checklist appears |
| Clean | API returns score 0–30 | Green score ring, CLEAN badge |
| Suspicious | API returns score 31–69 | Yellow/gold score ring, WARNING badge |
| Malicious | API returns score 70–100 | Red score ring, MALICIOUS badge |
| Error | Invalid input or network failure | Red border on input, error message box, TRY AGAIN button |

**Processing step checklist — File Upload:**

```
[x] File received and validated        0.3s
[x] Static analysis complete           1.1s
[~] Sandbox detonation running...      active
[ ] Multi-engine scan                  pending
[ ] Generating report                  pending
```

---

## Spacing and Layout

### Page layout

| Property | Value |
|----------|-------|
| Frame width | 1440px |
| Left / right margin | 120px each side |
| Content width | 1200px (1440 - 240) |
| Nav height | 64px fixed |
| Card grid gap | 14–16px |
| Section spacing | 48–64px |

### Border radius reference

| Element | Radius |
|---------|--------|
| Feature cards, result panels | 12–14px |
| Buttons, input fields | 8px |
| Icon boxes, logo mark | 8–9px |
| Pill badges, nav badge | 100px |
| Drop zone | 12px |

### Spacing scale

| Token | Value | Used for |
|-------|-------|---------|
| xs | 4px | Icon internal gaps |
| sm | 8px | Badge padding, tight gaps |
| md | 12px | Card internal gaps |
| lg | 16px | Grid gap, card padding increment |
| xl | 24px | Card padding |
| 2xl | 32px | Between card groups |
| 3xl | 48px | Between page sections |
| 4xl | 64px | Major section spacing |
| page-margin | 120px | Left/right page margins |

---




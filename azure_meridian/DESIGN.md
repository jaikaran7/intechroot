# Design System Specification: The Architectural Intelligence

## 1. Overview & Creative North Star: "The Digital Monolith"
The Creative North Star for this design system is **The Digital Monolith**. In the world of high-end enterprise consulting, we move away from the frantic, cluttered energy of startups and toward an aesthetic of "Substantial Lightness." This system treats the UI not as a flat screen, but as a series of architectural layers—vast, illuminated spaces where data and strategy breathe.

To break the "template" look, we employ **Intentional Asymmetry**. Large-scale `display-lg` typography should often be offset from the primary grid line, creating an editorial feel that suggests bespoke craftsmanship rather than a rigid bootstrap layout. We favor overlapping elements—glass cards that bleed over section boundaries—to create a sense of depth and interconnectedness.

---

## 2. Colors & Surface Philosophy
Our palette is anchored in professional authority (`primary: #000615`) but elevated by the luminosity of high-tech execution (`tertiary_fixed: #acedff`).

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. We define boundaries through **Tonal Shifts**. 
*   A section utilizing `surface_container_low` sits directly against a `surface` background. 
*   The transition is the boundary. This creates a seamless, fluid user journey that feels expensive and modern.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of frosted materials.
*   **Base Layer:** `surface` (#f7f9fc)
*   **Recessed Content:** `surface_container` (#eceef1)
*   **Primary Interaction Cards:** `surface_container_lowest` (#ffffff)
*   **Floating Global Elements:** Glass-morphic layers using a 60% opacity of `surface_container_lowest` with a 20px-32px backdrop blur.

### The "Glass & Gradient" Signature
To inject "soul" into the enterprise framework:
*   **The Signature Glow:** Use a linear gradient transitioning from `secondary` (#4059aa) to `tertiary_fixed_dim` (#4cd7f6) at 15% opacity behind key glass cards to simulate a "network pulse."
*   **CTA Soul:** Main buttons should not be flat. Use a subtle vertical gradient from `on_primary_container` (#7587a7) to `primary_container` (#0b1f3a) to give them a tactile, machined quality.

---

## 3. Typography: The Editorial Authority
We utilize a pairing of **Manrope** (for Display/Headlines) and **Inter** (for UI/Body) to balance high-end editorial style with functional clarity.

*   **Display (Manrope):** Set with tight letter-spacing (-0.02em) and "Bold" weights. These are our "Monolith" moments. Use `display-lg` (3.5rem) sparingly to anchor major sections.
*   **Body (Inter):** Optimized for readability. `body-md` (0.875rem) is our workhorse. Use a generous line-height (1.6) to ensure the "Generous White Space" requirement is met at a typographic level.
*   **Visual Hierarchy:** Contrast is achieved through scale, not just weight. A `display-sm` headline paired with a `label-md` uppercase sub-header creates an authoritative, "Consultancy Report" aesthetic.

---

## 4. Elevation & Depth
In this system, elevation is a property of light, not physics.

### The Layering Principle
Avoid traditional drop shadows. Instead, stack your tokens:
1.  **Background:** `surface`
2.  **Section:** `surface_container_low`
3.  **Card:** `surface_container_lowest`
This creates a natural "lift" through color value alone.

### Ambient Shadows & Ghost Borders
When an element must "float" (e.g., a modal or a primary navigation bar):
*   **Shadow:** Use a 40px blur, 0px spread, and 4% opacity of the `primary` color. It should feel like an ambient occlusion, not a dark smudge.
*   **The Ghost Border:** For accessibility on white-on-white elements, use the `outline_variant` (#c4c6ce) at **15% opacity**. This provides a "whisper" of a boundary that disappears into the background upon quick glance.

---

## 5. Components

### Glass Cards
*   **Background:** 70% opacity of `surface_container_lowest`.
*   **Blur:** `backdrop-filter: blur(16px)`.
*   **Border:** 1px "Ghost Border" (15% opacity `outline_variant`).
*   **Shadow:** Ambient Shadow (4%).
*   **Usage:** Used for featured consulting services or executive bios.

### Buttons (The "Machined" Variant)
*   **Primary:** `primary_container` background. 0.25rem (`DEFAULT`) corner radius. Text in `on_primary`.
*   **Secondary:** Ghost Border with `primary_container` text. No fill.
*   **Micro-interaction:** On hover, the button should shift +2px Y-axis and increase shadow opacity to 8%.

### Inputs & Fields
*   **Architecture:** Forgo the box. Use a "Bottom Line Only" approach or a very subtle `surface_container_high` fill with no border.
*   **Focus State:** Transition the bottom line to `tertiary_fixed_dim` (#4cd7f6) with a 4px "outer glow" of the same color at 20% opacity.

### Lists & Data Tables
*   **No Dividers:** Separate list items using `spacing-4` (1.4rem) of vertical white space.
*   **Alternating Tones:** Use a `surface_container_low` background for every second row instead of a line.

### Additional Component: The "Network Motif" Background
A bespoke background component consisting of a SVG particle web using `outline_variant` lines at 5% opacity, slowly animating (30s loop) behind hero sections to reinforce the "Global IT Staffing" connectivity.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetric Padding:** Allow text to breathe by using `spacing-20` (7rem) on one side of a container while keeping the other side tight.
*   **Embrace the "Dead Space":** White space is a luxury. If a section feels "empty," it is likely working.
*   **Layer Glass:** Overlap glass cards to show off the backdrop-blur effect—it reinforces the "Top-Tier" tech aesthetic.

### Don't:
*   **Use Solid Black:** Never use #000000. Use `primary` (#000615) for deep blacks to maintain tonal harmony.
*   **Add "Heavy" Shadows:** If a shadow is clearly visible at a glance, it is too heavy. It should be felt, not seen.
*   **Use Rounded Corners > 12px:** While we use `xl: 0.75rem` for large cards, avoid "pill" shapes for everything except buttons. We want architectural stability, not "bubbly" startup energy.
*   **Use Divider Lines:** If you feel the urge to draw a line between elements, use a `1.4rem` (spacing-4) gap or a background color shift instead.
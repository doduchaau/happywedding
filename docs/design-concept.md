# DESIGN CONCEPT BRIEF: WEDDING GIFT FOR THÚY HIỀN & TRUNG KIÊN
**Creative Direction & Architectural Blueprint**
*Author: Senior Creative Director & Creative Developer*

---

## 1. THREE DISTINCT CREATIVE DIRECTIONS

### Direction A: "THE VOGUE WEDDING ISSUE" (Haute Couture Editorial & Cinematic Awwwards)
- **Moodboard in Words**:
  A limited-edition Parisian bridal magazine crossed with an award-winning cinematic web experience. Asymmetric editorial typography, razor-sharp hairline borders, champagne debossed foil, delicate film grain, fluid light leaks, and dry, witty editorial reportage reporting the marriage as the season's most sensational story.
- **Palette**:
  - Main Light Ground: Virgin Ivory `#FBF4EE` & High-end Paper `#FFFDFB`
  - Core Brand Identity: Cashmere Blush `#F3D9D4` & Warm Petal Pink `#E8B4B8`
  - Metallic Accents & Hairlines: Champagne Silk `#D4AF7A` & Rose Gold `#C98B8B`
  - Dramatic Dark Contrasts: Deep Vintage Bordeaux `#3A1F26` & Midnight Sky `#1E1218`
  - Typography Ink: Artisanal Ink `#2B1A1E`
- **Typography Pairing**:
  - **Display (Headlines & Editorial Titles)**: *Cormorant Garamond* (Light & Italic weights, tight tracking, poetic ligatures).
  - **Body & Editorial UI**: *Be Vietnam Pro* (Light/Regular, generous leading, wide letter-spaced small caps).
  - **Script Flourishes**: *Pinyon Script* / *Great Vibes* (Used exclusively for signatures, heartfelt confessions, and delicate seals).
- **Motion Language**:
  Editorial line-by-line masked reveals, scroll-scrubbed text lighting, inertia-driven 3D transforms, fluid shader mesh, magnetic cursor tracking with contextual verbs (*"Mở"*, *"Kéo"*, *"Cào"*, *"Ký"*, *"Ngắm"*).
- **Two Signature Wow Moments**:
  1. *The 3D Monogrammed Wax-Sealed Couture Envelope & Particle Text Morph*: A photorealistic 3D ivory paper envelope sealed with deep-rose wax bearing monogram "H & K". Dragging tilts the envelope with specular light sheen. Tapping fractures the seal, unrolls the letter, and detonates a 7,000-particle gold dust simulation that morphs through the couple's names into a heart outline and dissolves into the site.
  2. *The Interactive Champagne Toast & Optical Light Caustics*: A tactile celebration interaction where guests click/drag to toast, producing acoustic glass chime harmonics and dispersing shimmering gold caustics across the parchment.
- **Section Flow**:
  1. Preloader (SVG Monogram Draw & Serif Counter)
  2. Chapter I: The Sealed Invitation (3D Envelope & Gold Dust Morph)
  3. Chapter II: The Headline Story & Live Countdown (Fluid Shader, Floating Arch Frames, Infinite Marquee, Dark Wine Odometer Countdown)
  4. Chapter III: The Friend's Editorial Letter (Scroll-scrubbed word illumination & sticky arch photo cross-dissolve)
  5. Chapter IV: The Runway Archive (Pinned horizontal gallery with mixed frame geometries and cinematic lightbox)
  6. Chapter V: The Irrevocable Treaty (Parchment Marriage Contract with dual fountain-pen canvas signature pads, molten wax stamp animation, and PNG export)
  7. Chapter VI: The Pearl & Glass Capsule Vault (Matter.js heavy physics, glossy pearls & gold-rimmed capsules with glass-clink acoustics)
  8. Chapter VII: The Grand Nocturne (Champagne gold foil scratch cards, heartfelt script letter, dusk-to-night scroll transition, glowing lanterns, and celestial fireworks show)

---

### Direction B: "A CINEMATIC ROMANCE ARCHIVE" (35mm Anamorphic Film Stills)
- **Moodboard in Words**:
  Wong Kar-wai romance meets modern French film sequence. 35mm contact sheets, soft anamorphic lens flares, smoky quartz glass, retro typewriter metadata next to expressive italic serifs, and amber sunset rays filtering through blinds.
- **Palette**: Velvet Rose `#C27A88`, Smoked Quartz `#2D1C24`, Amber Golden Hour `#E5A854`, Dusty Mauve `#D4A5A5`, Night Reel `#120A0E`.
- **Typography Pairing**: Playfair Display (Display) + Space Mono (Metadata) + Syne / Be Vietnam Pro (Body).
- **Motion Language**: Filmstrip horizontal scrubbing, shutter wipe transitions, grain jitter, rack focus blurs.
- **Two Signature Wow Moments**:
  1. *The Interactive 35mm Filmstrip Contact Sheet*: Dragging scrubs through photo frames with mechanical click SFX and light exposure shifts.
  2. *Anamorphic Lens Flare Shader*: Real-time optical lens flare reacting to mouse movement over black-and-white portraits.
- **Section Flow**: Film Slate Preloader -> Opening Sequence -> The Headline -> Filmstrip Gallery -> The Memo (Letter) -> The Agreement -> Memory Boxes -> Midnight Sky.

---

### Direction C: "ATELIER LUMIÈRE" (Modernist Architectural Romance & Crystal Refraction)
- **Moodboard in Words**:
  Brutalist architectural purity softened by translucent rose silk and floating glass blocks. Razor-sharp hairlines, frosted acrylic cards suspended in 3D space, prism rainbows, geometric numbers, spatial sound design.
- **Palette**: Frosted Rose Glass `#E8C5C8`, Titanium Pure `#FAF8F8`, Warm Bronze `#A37B58`, Charcoal Onyx `#1A1618`, Pale Peach `#F7DDD7`.
- **Typography Pairing**: Tenor Sans / Bodoni Moda + Plus Jakarta Sans.
- **Motion Language**: Strict grid snaps, spring physics on glass panels, spectral prism refraction.
- **Two Signature Wow Moments**:
  1. *Interactive 3D Glass Prism Sculpture*: A rotatable crystal dispersing spectral rainbow refractions across text.
  2. *Spatial Acoustic Glass Capsule Chamber*: Anti-gravity glass sphere chamber emitting micro-tuned chord intervals upon collision.
- **Section Flow**: Monolith Preloader -> Prism Intro -> Architectural Hero -> Countdown Column -> Letter Slab -> Grid Gallery -> Signed Contract -> Wishes Prism -> Star Chamber.

---

## 2. SELECTION & 5-LINE CREATIVE JUSTIFICATION

**We select Direction A: "THE VOGUE WEDDING ISSUE".**

> 1. It honors the core emotional anchor of warm cashmere pink and blush while elevating it into high-fashion luxury rather than childish pastel.
> 2. The editorial concept gives the sender's dry, teasing humor the perfect vehicle: witty, deadpan journalism covering the wedding as a historic event.
> 3. The 3D wax-sealed envelope, fluid WebGL background, dual fountain-pen contract, and pearl physics create distinct, tactile "wow" moments that feel bespoke.
> 4. The pacing flows seamlessly like a cinematic feature: intimate prologue → grand hero spectacle → quiet letter → expansive gallery → playful treaty → celestial fireworks.
> 5. It completely avoids clichés, clip-art hearts, and template layouts, delivering an award-winning site the couple will cherish for a lifetime.

---

## 3. ARCHITECTURE & SPECIFICATIONS

- **Configuration Authority**: `src/config.js` is the single source of truth for all text, dates, photos, wishes, colors, and toggles, with bilingual EN/VI comments.
- **Responsive Architecture**: Mobile-first design strictly optimized for 375px viewports through 1920px 4K displays.
- **Performance & Accessibility**: 60fps budget, tiered quality manager (high/medium/low), automatic FPS throttling downgrade, prefers-reduced-motion integration, WCAG AA 4.5:1 text contrast.

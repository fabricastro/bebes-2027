---
name: Bebés 2027
description: A satin ribbon with each wish hot-stamped in gold, tied into one growing chain.
colors:
  satin: "#a80f29"
  satin-deep: "#6e0919"
  satin-ink: "#2a050c"
  gold: "#ebca7e"
  gold-soft: "#f3dfa9"
  gold-deep: "#8a6420"
  cotton: "#fdfaf7"
  cotton-shade: "#ece4dc"
  thread: "#3b1018"
  thread-soft: "#6d4a50"
  error: "#a30d24"
typography:
  display:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "clamp(3.75rem, 19vw, 9.5rem)"
    fontWeight: 800
    lineHeight: 0.84
    letterSpacing: "-0.02em"
    fontVariation: "'opsz' 96"
  headline:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "clamp(2rem, 8.5vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.01em"
    fontVariation: "'opsz' 72"
  title:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.3rem, 5.5vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    fontVariation: "'opsz' 36"
  stamp:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.45rem, 6.5vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.04em"
    fontVariation: "'opsz' 48"
  button:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "1.15rem"
    fontWeight: 700
    letterSpacing: "0.08em"
    fontVariation: "'opsz' 28"
  body:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
rounded:
  field: "6px"
  pill: "999px"
  knot: "50%"
spacing:
  gutter: "clamp(1rem, 5vw, 2.5rem)"
  section: "clamp(3.5rem, 10vw, 6rem)"
  field-stack: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.satin}"
    textColor: "{colors.gold}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.75rem"
    height: "3.5rem"
  button-primary-hover:
    backgroundColor: "{colors.satin-deep}"
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.satin-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.75rem"
    height: "3.5rem"
  button-gold-hover:
    backgroundColor: "{colors.gold-soft}"
  input-field:
    backgroundColor: "#ffffff"
    textColor: "{colors.thread}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0.55rem 0.75rem"
    height: "3rem"
  ribbon-band:
    backgroundColor: "{colors.cotton}"
    textColor: "{colors.thread}"
  ribbon-stamp:
    textColor: "{colors.gold-deep}"
    typography: "{typography.stamp}"
  chain-piece:
    backgroundColor: "{colors.cotton}"
    width: "2.25rem"
    height: "1.75rem"
  photo-mount:
    backgroundColor: "{colors.cotton}"
    padding: "0.6rem 0.6rem 2.25rem"
    width: "min(80vw, 26rem)"
---

# Design System: Bebés 2027

## Overview

**Creative North Star: "The Wish Ribbon"**

Every surface is a length of souvenir ribbon. The ground is flat satin red, type is hot-stamped gold, and the working material (the form, the admin sheet, the photo mount) is white cotton laid across the red. Nothing imitates a material with gradients, gloss, or emboss. Satin is a flat field, gold is a flat ink, and the illusion comes from composition: a band that tilts and runs off both edges of the screen, a dashed stitch along its selvedge, a gold safety pin fastening things down.

The page is a single centered column, generous on red and dense on cotton. Display type is Literata, set heavy and large, often in caps, the way names are stamped on a christening ribbon. Body copy is Figtree, plain and warm. Motion is physical and brief: the band straightens when it is pinned, a stamped name settles as if pressed, and a new piece of ribbon unrolls into the chain.

The confirmed rejection is the pastel baby-shower card: no watercolor, no flowers, no illustration, no emoji.

**Key Characteristics:**
- Flat satin red ground with a deeper red closing band and footer.
- Gold leaf as flat color, never foil, sheen, or emboss.
- White cotton band, tilted -1.2deg, full bleed, with a dashed gold selvedge stitch.
- Literata display in caps for stamped moments; Figtree for reading and fields.
- A line-drawn gold safety pin as the single ornament glyph.
- A chain of anonymous cotton ribbon pieces with gold knots, one per wish.

## Colors

Two flat inks, red and gold, with white cotton as the working surface and a dark red thread for text on cotton.

### Primary
- **Satin Ribbon Red** (satin): the page ground behind the masthead, the chain, and the motive. It is also the primary button fill on cotton, the caret color in fields, the focus border, and the color of confirmation titles on cotton.
- **Deep Satin** (satin-deep): the closing band and the footer, and the hover fill for the red button. It reads as the shadowed back of the ribbon.

### Secondary
- **Stamped Gold** (gold): display type on red, the focus outline, links, text selection, the safety pin on red, and the fill of the gold button.
- **Pale Gold** (gold-soft): running body text and secondary lines on red (counter, chain note, footer), and the hover fill for the gold button.
- **Old Gold** (gold-deep): every gold mark that sits on cotton, including the selvedge stitch, the live stamp preview, the chain knots, and the pin in the confirmation state. Light gold vanishes on white, so on cotton the gold darkens.

### Neutral
- **Piqué Cotton** (cotton): the ribbon band, chain pieces, photo mount, admin sheet, and long body copy on red (lead, motive).
- **Cotton Shade** (cotton-shade): field borders, the hairline under the stamp preview, and table rules.
- **Thread** (thread): primary text on cotton.
- **Faded Thread** (thread-soft): hints, consent copy, date separators, and secondary table columns.
- **Satin Ink** (satin-ink): text on gold fills and on the selection highlight.
- **Error Red** (error): invalid field borders and error messages. It sits near the satin red, so errors always carry text as well as color.

### Named Rules
**The Flat Ink Rule.** Red and gold are flat fills. There are no gradients, metallic sheens, or highlight overlays anywhere in the build. Gold reads as gold through its value against red, not through faked reflection.

**The Two Golds Rule.** Gold on red uses Stamped Gold or Pale Gold. Gold on cotton uses Old Gold. Never put light gold on white.

## Typography

**Display Font:** Literata (with Georgia, serif), a variable font loaded with weights 200 to 900 (the CSS also sets `opsz` values)
**Body Font:** Figtree (with system-ui, -apple-system, Segoe UI, sans-serif), weights 400 to 700

**Character:** A high-contrast Didone, set heavy, does the stamping. A friendly geometric sans does the explaining. The serif carries ceremony and the sans carries instructions, and they do not swap jobs.

### Hierarchy
- **Display** (800, clamp(3.75rem, 19vw, 9.5rem), 0.84, caps, opsz 96): the masthead title only. Its companion year line is set at 500 italic, clamp(2.75rem, 14vw, 7.25rem), with 0.04em tracking.
- **Headline** (600 italic, clamp(2rem, 8.5vw, 3.25rem), 1.05, opsz 72): section heads on red, in sentence case. The closing line uses the same voice at 500, clamp(1.75rem, 7.5vw, 3rem), with an emphasized second clause at 700.
- **Stamp** (700, clamp(1.45rem, 6.5vw, 2.4rem), 1.05, 0.04em, caps, opsz 48): the live preview of a participant's name on the ribbon, in Old Gold. The date under it is Literata 500 with tabular lining numerals and 0.18em tracking.
- **Title** (700, clamp(1.3rem, 5.5vw, 1.75rem), 1.15): confirmation messages on cotton, in Satin Ribbon Red. Admin sheet titles use the same treatment at clamp(1.6rem, 5vw, 2.25rem).
- **Body** (400, 1.0625rem, 1.55): all reading copy. The lead is larger (clamp(1.05rem, 4.2vw, 1.4rem), max 32ch). Motive paragraphs cap at 62ch.
- **Label** (600, 0.95rem): field labels in Thread. Hints are 0.85rem in Faded Thread. Admin table headers are 0.8rem caps with 0.04em tracking.
- **Button** (Literata 700, 1.15rem, 0.08em, caps, opsz 28): the public call to action. The admin panel's buttons fall back to Figtree 600, since that surface is operational.

### Named Rules
**The Stamping Rule.** Literata in caps is reserved for things that are stamped: the title, a participant's name, and the call to action. Sentences stay in sentence case, even when they are set in Literata.

**The Optical Size Rule.** The principal Literata settings declare an `opsz` that matches their rendered size: 72 for the masthead (Literata opsz max), 72 for the section headline and closing line, 48 for the stamp, 36 for the confirmation title, and 28 for the button. New display settings follow this scale.

No italic face ships. Only upright Literata files are loaded, so every italic in the build (the year line, the section headline, the motive close, the footer signature, and the closing emphasis) is synthesized by the browser.

## Layout

The page is one centered column on a red ground, padded at the sides by the gutter and separated by the section gap. Readable blocks cap their width: the masthead at 46rem, the motive at 38rem, the form inside the band at 34rem, and the chain at 60rem. The masthead, chain, and closing text are centered. The motive section and the fields inside the band are left-aligned.

The ribbon band breaks the column on purpose. It is 6rem wider than the viewport, offset -3rem on each side, and rotated -1.2deg so that it always runs off both edges. Its contents counter-rotate 1.2deg, which keeps fields and typed text level. When the form completes, both rotations ease to zero, so the band reads as pinned straight.

The closing band is full bleed in Deep Satin. On phones it stacks the photo, the line, and the button, centered. From 56rem it becomes two columns (photo, then a 28rem text column) with a 4rem gap, and the text aligns left.

Inside the band, fields stack with a 1rem gap and the label, input, and hint sit 0.3rem apart. The date field is a five-column grid (day, separator, month, separator, year at 1.6fr), capped at 20rem. Public fields are at least 3rem tall, and the primary button is 3.5rem tall and full width inside the band.

## Elevation & Depth

Depth is mostly flat color layering: cotton sits on red, and deep red sits under red. Shadows appear only on objects that read as physical things laid on the ribbon, and they are always soft and tinted dark red. They are never hard offsets or neutral gray.

### Shadow Vocabulary
- **Button lift** (`box-shadow: 0 4px 10px rgb(60 5 15 / 0.3)`): the pill buttons, so the action sits slightly proud of the band.
- **Pinned photo** (`box-shadow: 0 14px 28px rgb(20 2 6 / 0.45)`): the photo mount in the closing band.
- **Sheet** (`box-shadow: 0 18px 40px rgb(40 4 10 / 0.4)`): the admin cotton sheet resting on red.
- **Focus halo** (`box-shadow: 0 0 0 3px rgb(168 15 41 / 0.18)`): focused fields, paired with a satin border.

### Named Rules
**The Laid-On Rule.** Only objects that are physically laid on the ribbon cast a shadow: a button, a pinned photo, a sheet. The band and the chain stay flat.

## Shapes

The form language is cut cloth. The band and chain pieces have square edges, and the chain's end pieces are cut with a swallowtail notch (0.6rem) on their outer ends, the way ribbon ends are trimmed. Knots are small circles (0.5rem, 50%). Buttons are full pills (999px), and fields have gently rounded corners (6px). The photo mount is a square-cornered white card with a deeper bottom margin.

Rotation is part of the vocabulary. The band sits at -1.2deg, the masthead pin at -8deg, the photo at 2.5deg, and the photo pin at -10deg. Rotations stay small and tactile, never playful spins.

The selvedge is a 1px dashed Old Gold outline inset 0.35rem inside a 0.6rem cotton border on the top and bottom edges of the band. It reads as a woven stitch line.

## Components

### Buttons
Buttons are satin pills with stamped lettering.
- **Shape:** full pill (999px), at least 3.5rem tall.
- **Primary:** Satin Ribbon Red fill with Stamped Gold Literata caps, padded 0.85rem 1.75rem, with the button lift shadow. It is full width inside the band.
- **Gold variant:** used on red ground, such as the closing band. It has a Stamped Gold fill with Satin Ink text.
- **Hover / Active:** red deepens to Deep Satin, and gold lightens to Pale Gold. On press, the button moves 1px down and scales to 0.99 (200ms, ease-out). A busy state appends an ellipsis and drops to 0.75 opacity.
- **Focus:** on red, the global 2px Stamped Gold outline at a 3px offset.
- **Text link button:** Satin red Figtree 600 with an underline at a 0.25em offset, used for secondary actions such as adding another name.
- **Admin:** the primary button is the same pill in Figtree 600 with a Pale Gold label. The secondary button is a transparent pill with a 1.5px satin outline.

### Inputs / Fields
- **Style:** white fill on cotton, with a 1.5px Cotton Shade border and 6px corners. The bottom border is tinted dark red (`rgb(110 9 25 / 0.45)`), so each field reads as a line to write on. The caret is satin red. Text is 1.125rem in Thread.
- **Hover:** the border darkens slightly, and the bottom tint rises to 0.65.
- **Focus:** a satin border plus the focus halo, with no outline.
- **Error:** an Error Red border, a faint pink fill, and a 600-weight error message under the field.

### Ribbon Band (signature)
The band is the form. It is a full-bleed cotton strip with a dashed Old Gold selvedge, tilted -1.2deg, that carries the live stamp preview, the fields, the button, and the consent line. A hairline in Cotton Shade separates the stamp from the fields. As the participant types, her name appears in Old Gold Literata caps, and empty preview text sits at 0.4 opacity. Each keystroke replays a 380ms press (from a 1.04 scale and a slight blur back to rest). When she submits, the band straightens over 700ms, a gold safety pin swings in (900ms), and the confirmation title appears in satin red.

### Wish Chain (signature)
The chain is one wrapping row of cotton ribbon pieces (2.25rem by 1.75rem), one per wish and anonymous, centered and capped at 60rem. Each joint carries an Old Gold knot, and both ends are swallowtail-cut. A new piece unrolls from the left over 700ms, starting in Stamped Gold. On submit, a cotton slip carrying the stamped name flies from the preview into the newest piece. Below the chain, a count in Literata 700 at 1.6em in Stamped Gold sits inside a Pale Gold sentence.

### Pinned Photo (signature)
A cotton mount (0.6rem padding on three sides, 2.25rem at the bottom) holds a real photograph. It is rotated 2.5deg, carries the pinned photo shadow, and is clasped across its top edge by a 7rem Stamped Gold safety pin rotated -10deg. Photography is user-supplied only, and each shipped raster carries a provenance sidecar.

### Safety Pin (signature ornament)
The safety pin is a single-stroke line drawing (160 by 40 viewBox, round caps, 1.5 to 3 stroke) that inherits `currentColor`. It is Stamped Gold on red and Old Gold on cotton. It appears in three places: above the masthead title (-8deg), in the confirmation state, and clasping the photo.

### Admin Sheet
The admin page puts one cotton sheet on red, capped at 60rem, with the sheet shadow (4px corners from 62rem). Its header bar shows the project name in stamped gold caps. Tables use 0.8rem caps headers and Cotton Shade rules, with tabular numerals for dates. Row deletion is a ghost pill that turns Error Red on hover and on confirm.

## Do's and Don'ts

### Do:
- **Do** keep red and gold flat. Express gold on red with Stamped Gold (#ebca7e) and gold on cotton with Old Gold (#8a6420).
- **Do** put working content (forms, lists, photos) on cotton laid over red, and keep red for the ground and the stamped type.
- **Do** set stamped moments (title, names, call to action) in Literata caps with an `opsz` that matches the rendered size, and set reading copy in Figtree.
- **Do** use the safety pin SVG, in `currentColor`, when something needs fastening or confirming.
- **Do** keep tilts small (between -10deg and 2.5deg) and straighten the band when the user completes the form.
- **Do** keep public fields at least 3rem tall and the primary action at 3.5rem.
- **Do** collapse all animation to 1ms under `prefers-reduced-motion`.

### Don't:
- **Don't** imitate foil, emboss, or satin sheen with gradients, highlights, or texture images.
- **Don't** add flowers, watercolor, illustrations, or emoji. The pastel baby-shower card is the confirmed anti-reference.
- **Don't** introduce a second decorative glyph alongside the safety pin.
- **Don't** put light gold (#ebca7e or #f3dfa9) on cotton, where it loses legibility.
- **Don't** put names, initials, or other text on chain pieces. Each piece is a plain cotton length with a knot.
- **Don't** use hard offset shadows or neutral gray shadows. Shadows are soft, tinted dark red, and reserved for laid-on objects.

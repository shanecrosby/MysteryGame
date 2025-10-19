# Level 1 – Frozen Outpost  
**File:** Level1.md  
**Game:** Frostbeat Mystery: The Missing Melody

---

## Scene Overview

**Location:** Frostbeat Outpost – Snowfield Entrance  
**Description:** A cold wind blows across the snow. Icicles hang from the roof of the outpost. A single trail of footprints leads away from the base into the wilderness. Something is missing. The world feels… quiet.

**Gameplay Goals:**
- Introduce click interactions
- Introduce clue collection
- Set story tone
- Unlock the path to Level 2

---

## Scene Layout (Interactive Elements)

| Element | Interaction Type | Result |
|---------|------------------|--------|
| Footprints in the snow | Inspect | Clue 1 |
| Purple fabric scrap on branch | Pick up | Clue 2 |
| Half-buried metal object | Inspect | Clue 3 |
| Charcoal campfire | Inspect optional lore | Ambient story |
| Locked outpost door | Blocked progression | Opens after clues found |
| Snowy signpost | Optional examine | Tutorial hint text |

---

## Clues Collected in Level 1

| Clue # | Name | Description | Story Purpose |
|--------|------|-------------|----------------|
| 1 | Strange Footprints | Small, sharp-edged tracks | Introduces mystery |
| 2 | Purple Fabric Scrap | Torn from a costume | Connects to Team Starflare |
| 3 | Broken Headphone Jack | Frostbeat tech piece | Suggests music-related sabotage |

---

## Inventory Items

| Item | Purpose |
|------|----------|
| Scrap of Fabric | Combine with later clothing clue |
| Headphone Jack | Hints at Frostbeat tech involvement |

---

## Level Flow

1. Player wakes outside outpost → narration intro.
2. Player explores snow area.
3. Player clicks footprints → clue added.
4. Player finds fabric and headphone jack.
5. Tutorials trigger progressively.
6. After 3 clues collected → outpost door unlocks.
7. End of level narration → transition to Frostpine Forest.

---

## Narration Script Template

Each narration block follows this structure for voice rendering:

[NARRATION]
Voice Tone: <tone/emotion keywords>
Duration: <approx seconds>
Text: "<spoken line>"

[INTERACTION]
Trigger: <what triggers the line>
Voice Tone: <tone/emotion>
Text: "<spoken line>"

[DIALOGUE]
Character: <name>
Voice Tone: <emotion/style>
Text: "<spoken line>"


---

## Narration for Level 1

### Opening Narration

[NARRATION]
Voice Tone: calm, mysterious, winter atmosphere
Duration: 7s
Text: "Snow fell softly over the Frostbeat Outpost. The world was quiet, almost too quiet… and the Melody Crystal was gone."

[NARRATION]
Voice Tone: curious, gentle
Duration: 6s
Text: "Someone had left in a hurry. The only sign of what happened… was a trail of footprints leading into the snow."


---

### Interaction Narration

#### Inspect Footprints (Clue 1)

[INTERACTION]
Trigger: Click footprints
Voice Tone: investigative, low intensity
Text: "These footprints are strange… too sharp to be human, but too small to be a monster. Who could they belong to?"


#### Collect Fabric Scrap (Clue 2)

[INTERACTION]
Trigger: Click purple fabric
Voice Tone: surprised discovery
Text: "A torn piece of fabric… purple. Isn’t this the colour of Team Starflare's stage outfits?"


#### Inspect Headphone Jack (Clue 3)

[INTERACTION]
Trigger: Click metal object
Voice Tone: thoughtful
Text: "A broken headphone jack? This is Frostbeat tech. Someone from the squad was definitely here."


#### Optional – Inspect Campfire

[INTERACTION]
Trigger: Click campfire
Voice Tone: warm, reflective
Text: "A campfire… still warm. Whoever was here left not long ago."


---

### Tutorial Prompts

[NARRATION]
Trigger: First interaction
Voice Tone: tutorial, friendly
Text: "Try clicking objects to investigate. Some may hold clues."

[NARRATION]
Trigger: First clue found
Voice Tone: supportive
Text: "Great! You found your first clue. Keep searching the area."

[NARRATION]
Trigger: After all clues collected
Voice Tone: story progression
Text: "That's enough clues for now… time to follow the footprints and uncover the truth."


---

### Level 1 Finale

[NARRATION]
Trigger: Exit zone unlocked
Voice Tone: dramatic, building energy
Text: "The trail leads into Frostpine Forest. The Melody Crystal is out there… and so is the truth."


---

## UI/On-Screen Text

| Event | Text |
|-------|------|
| Enter level | "MISSION UPDATE: Investigate the Frostbeat Outpost." |
| First clue | "CLUE FOUND: Strange Footprints" |
| All clues collected | "OBJECTIVE COMPLETE: Follow the footprints into the forest." |
| Exit unlocked | "PATH UNLOCKED → Continue to Level 2" |

---

## Sound Design Ideas (Optional)
- Soft winter wind ambience
- Crunching snow footsteps
- Subtle shimmering sound when collecting clues
- Light K-pop beat sting when level ends

---

## Level Exit Condition
Unlocks after collecting 3 required clues.

---

_End of Level1.md_
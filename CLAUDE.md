# Claude Code - Project Guidelines

This document contains important guidelines and rules for AI assistants working on this project.

## Critical Rules

### 1. Never Delete Source Files
**IMPORTANT:** Never delete any files from the `.\src` directory or its subdirectories.

- Source files in `.\src` are the authoritative versions and may be needed for regeneration
- Even if files appear unused, they should be preserved
- Only delete files from `.\public` if explicitly instructed or if you're certain they're no longer needed
- When in doubt, ask the user before deleting anything

### 2. Asset Management

#### Source vs Public Files
- **Source files** (`.\src\models`, `.\src\images`, etc.) - Original, high-quality assets
- **Public files** (`.\public\models`, `.\public\images`, etc.) - Web-optimized versions served to the browser
- Always copy/export from `.\src` to `.\public`, never the other way around

#### Texture Files
- Models may require external texture files to render correctly
- Texture files should exist in both:
  - `.\src\models\[ModelName]\` - Source textures
  - `.\public\models\[ModelName]\Textures\` - Web-accessible textures
- Always check if a model uses external textures before assuming they're embedded
- GLB files can have either embedded or external textures - file size alone isn't definitive

### 3. 3D Models (GLB/GLTF)

#### Texture Loading
When working with 3D models:
1. Check if the model has external texture dependencies
2. Load textures manually using `THREE.TextureLoader`
3. Apply textures based on material names or properties
4. Set proper encoding: `texture.encoding = THREE.sRGBEncoding`

#### Material Properties
For tree/foliage materials:
- **Bark/Trunk:** `roughness: 0.9`, `metalness: 0`
- **Leaves/Needles:** `transparent: true`, `alphaTest: 0.5`, `side: THREE.DoubleSide`

### 4. File Organization

```
MysteryGame/
├── src/                    # SOURCE FILES - DO NOT DELETE
│   ├── models/            # Original 3D models and textures
│   ├── images/            # Original images
│   └── components/        # React components
├── public/                # WEB-ACCESSIBLE FILES
│   ├── models/            # Optimized 3D models
│   │   └── [ModelName]/
│   │       ├── model.glb
│   │       └── Textures/  # External textures if needed
│   └── images/            # Optimized images
└── CLAUDE.md              # This file
```

### 5. Todo Management

- Always use the `TodoWrite` tool for multi-step tasks
- Mark tasks as `in_progress` before starting work
- Mark tasks as `completed` immediately after finishing (don't batch completions)
- Only mark tasks complete when fully accomplished (no errors, tests passing, etc.)
- User-provided Todo will be found in TODO.md. Review and action this when instructed to "action the todo list".

### 6. Game-Specific Notes

#### Display Target
- Optimized for 1080p displays
- Camera positions and FOV are carefully tuned

#### Scene Structure
- Menu Scene: Night sky, snow, forest backdrop, icicles with soft blue glow
- Level 1: Frozen Outpost with reduced tree density (5 trees for performance)
- Trees use PineTree.glb with external bark and leaf textures

#### Performance Considerations
- Keep poly counts reasonable (reduced tree density in Level 1)
- Use texture atlases where possible
- Enable shadows selectively (castShadow, receiveShadow)

## Common Tasks

### Adding a New 3D Model

1. Place source files in `.\src\models\[ModelName]\`
2. Export/copy optimized GLB to `.\public\models\[ModelName]\`
3. If using external textures, copy to `.\public\models\[ModelName]\Textures\`
4. Load in component:
   ```jsx
   const { scene } = useGLTF('/models/[ModelName]/model.glb');
   const textures = useMemo(() => {
     const loader = new THREE.TextureLoader();
     const tex = loader.load('/models/[ModelName]/Textures/texture.jpg');
     tex.encoding = THREE.sRGBEncoding;
     return tex;
   }, []);
   ```

### Updating Textures

1. Update source texture in `.\src\models\[ModelName]\`
2. Copy to `.\public\models\[ModelName]\Textures\`
3. Clear browser cache if needed for testing

### Testing Changes

1. Start dev server: `npm run dev`
2. Check browser console for errors
3. Verify textures load (no 404s in Network tab)
4. Test in actual browser, not just relying on server output

## Version Control

- This is a git repository
- Commit messages should follow the format: `type: description 🤖 Generated with Claude Code`
- Never commit secrets or environment files

## Project Background

**K-Pop Demon Hunter Mysteries** - A web-based point-and-click mystery game for children aged 5-7, built with:
- React 18
- Vite
- TailwindCSS
- Three.js / React Three Fiber
- LocalStorage for game saves

The game follows a storyline where players collect clues across multiple levels to solve mysteries.
More detail can be found int README.md
// Game scenes based on Level1.md specifications
export const SCENES = [
  {
    id: 'level1_intro',
    title: 'Level 1 - Frozen Outpost',
    narration: {
      intro: {
        text: 'You are Kai, a trainee in the Frostbeat K-Pop Demon Hunter Squad, a group that uses music-powered magic to protect the world from sound-based spirits called Noisemancers. Someone has stolen the Melody Crystal, a magical source of rhythm that powers your squad\'s music and keeps dark forces away. Without it, your snow base is freezing over and your team is losing their groove. Your mission: Follow the footprints, gather clues, uncover the truth, and restore the Melody Crystal.',
        audio: new URL('../sounds/Level1/Intro.mp3', import.meta.url).href,
        duration: 38
      },
      scene: {
        text: 'Snow fell softly over the Frostbeat Outpost. The world was quiet, almost too quiet… and the Melody Crystal was gone. Someone had left in a hurry. The only sign of what happened… was a trail of footprints leading into the snow.',
        audio: new URL('../sounds/Level1/Scene1Intro.mp3', import.meta.url).href,
        duration: 21
      }
    },
    story: 'A cold wind blows across the snow. Icicles hang from the roof of the outpost. A single trail of footprints leads away from the base into the wilderness. Something is missing. The world feels… quiet.',
    clues: [
      {
        id: 'footprints',
        name: 'Strange Footprints',
        icon: '👣',
        label: 'Footprints',
        description: 'Small, sharp-edged tracks',
        position: [2, -4.8, -2],
        narration: {
          text: 'These footprints are strange… too sharp to be human, but too small to be a monster. Who could they belong to?',
          audio: new URL('../sounds/Level1/StrangeFootprints.mp3', import.meta.url).href,
          duration: 10
        },
        collected: false
      },
      {
        id: 'fabric',
        name: 'Purple Fabric Scrap',
        icon: '🧵',
        label: 'Fabric',
        description: 'Torn from a costume',
        position: [-3, 0, -1],
        narration: {
          text: 'A torn piece of fabric… purple. Isn\'t this the colour of Team Starflare\'s stage outfits?',
          audio: new URL('../sounds/Level1/TornFabricClue.mp3', import.meta.url).href,
          duration: 8
        },
        collected: false
      },
      {
        id: 'headphone',
        name: 'Broken Headphone Jack',
        icon: '🎧',
        label: 'Headphone',
        description: 'Frostbeat tech piece',
        position: [1, -4.5, 1],
        narration: {
          text: 'A broken headphone jack? This is Frostbeat tech. Someone from the squad was definitely here.',
          audio: new URL('../sounds/Level1/BrokenHeadphoneClue.mp3', import.meta.url).href,
          duration: 7
        },
        collected: false
      }
    ],
    optionalClues: [
      {
        id: 'campfire',
        name: 'Campfire',
        icon: '🔥',
        label: 'Campfire',
        position: [-2, -4.8, 2],
        narration: {
          text: 'A campfire… still warm. Whoever was here left not long ago.',
          audio: new URL('../sounds/Level1/CampfireClue.mp3', import.meta.url).href,
          duration: 5
        }
      }
    ],
    tutorials: [
      {
        trigger: 'first_click',
        text: 'Try clicking objects to investigate. Some may hold clues.',
        audio: new URL('../sounds/Level1/HowTo.mp3', import.meta.url).href,
        duration: 4
      },
      {
        trigger: 'first_clue',
        text: 'Great Work! You found your first clue. Keep searching the area.',
        audio: new URL('../sounds/Level1/FoundFirstClue.mp3', import.meta.url).href,
        duration: 4
      },
      {
        trigger: 'all_clues',
        text: 'That\'s enough clues for now… time to follow the footprints and uncover the truth.',
        audio: new URL('../sounds/Level1/Level1AllClues.mp3', import.meta.url).href,
        duration: 6
      }
    ],
    exitNarration: {
      text: 'The trail leads into Frostpine Forest. The Melody Crystal is out there… and so is the truth.',
      audio: new URL('../sounds/Level1/FollowTrail.mp3', import.meta.url).href,
      duration: 7
    }
  }
];

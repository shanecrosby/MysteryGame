export const SCENES = [
  {
    id: 'scene1',
    story: 'Strange things are happening in the snowy mountains! You discover mysterious footprints in the snow outside your K-Pop studio. The prints are glowing with a faint purple light and lead toward a dark cave in the distance...',
    clues: [
      { icon: '👣', label: 'Glowing Footprints' },
      { icon: '❄️', label: 'Snow Trail' },
      { icon: '🌙', label: 'Night Sky' }
    ],
    actions: [
      { text: 'Follow the footprints', correct: true },
      { text: 'Go back inside', correct: false },
      { text: 'Call for help', correct: false }
    ]
  },
  {
    id: 'scene2',
    story: 'You bravely follow the glowing footprints through the deep snow. As you get closer to the cave entrance, you notice strange symbols carved into the rocks. The footprints lead right into the dark cave opening!',
    clues: [
      { icon: '⭐', label: 'Magic Symbols' },
      { icon: '🕳️', label: 'Dark Cave' },
      { icon: '✨', label: 'Sparkling Trail' }
    ],
    actions: [
      { text: 'Run away scared', correct: false },
      { text: 'Enter the cave', correct: true },
      { text: 'Wait outside', correct: false }
    ]
  },
  {
    id: 'scene3',
    story: 'Inside the cave, you find something amazing! The walls are covered in beautiful glowing crystals. The footprints lead to a friendly K-Pop Demon Hunter who was tracking a mischievous snow sprite. "Thank you for following my trail!" they say with a smile. Mystery solved!',
    clues: [
      { icon: '💎', label: 'Magic Crystals' },
      { icon: '🎤', label: 'K-Pop Hunter' },
      { icon: '🎉', label: 'Mystery Solved!' }
    ],
    actions: [
      { text: 'Celebrate!', correct: true },
      { text: 'High Five!', correct: true },
      { text: 'Dance!', correct: true }
    ]
  }
];

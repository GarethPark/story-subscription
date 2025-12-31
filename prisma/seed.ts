import { prisma } from '../lib/db'

async function main() {
  console.log('Starting seed...')

  // Create sample romance stories
  const stories = [
    {
      title: 'Moonlight in Manhattan',
      summary: 'When ambitious lawyer Emma Carter crashes into street artist Jake Rivers, their worlds collide in the most unexpected way. Can they bridge the gap between corporate and creative?',
      content: `Chapter 1: The Collision

Emma Carter had exactly twelve minutes to make it to the most important meeting of her career. Her heels clicked against the Manhattan sidewalk with military precision as she reviewed her presentation notes on her phone. She didn't see the paint-splattered man until she walked directly into his chest.

"Watch where you're—" Emma started, then looked up.

Jake Rivers stood there, covered in vibrant splashes of color, a canvas under one arm and the most infuriatingly calm smile on his face. "You should really look where you're going," he said, his voice warm with amusement.

"I was looking," Emma snapped, brushing paint off her designer suit. "At my phone. Where normal people look in the 21st century."

"Normal people," Jake mused, setting down his canvas. "Is that what you are?"

Emma opened her mouth to retort, but found herself staring into his hazel eyes. There was something about the way the morning light caught them...

"I have to go," she said abruptly, stepping around him.

"See you around, corporate," Jake called after her.

She wouldn't, Emma told herself. New York was a big city. She'd never see him again.

She was wrong.

(This is a preview. Full story continues with 15 more chapters of their romance unfolding across New York City's contrasting worlds.)`,
      author: 'Sarah Mitchell',
      genre: 'Contemporary',
      tags: 'office romance, opposites attract, new york, artist',
      readingTime: 180,
      ageRating: 'PG-13',
      published: true,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=600&fit=crop',
    },
    {
      title: 'The Duke\'s Secret Garden',
      summary: 'Lady Charlotte tends to her beloved garden, unaware that the mysterious gardener she\'s grown fond of is actually the Duke of Ashford in disguise. A historical romance of secrets and blooming love.',
      content: `Prologue: Spring 1815

The gardens of Ashford Manor had fallen into disrepair since the old duke's passing. But Lady Charlotte Winters, sent to catalog the estate's assets, found herself enchanted by the overgrown roses and wild lavender.

"You have a gift with plants," a voice said from behind a hedge.

Charlotte spun to find a tall man in simple gardener's clothes, soil under his nails and sunlight in his dark hair. "I'm just... helping," she stammered.

"I'm glad," he said with a bow. "I'm... Thomas. The gardener."

He wasn't, of course. He was Edmund Ashford, the new duke, hiding from society's expectations. But in that garden, covered in dirt and surrounded by flowers, he could be just a man falling for a remarkable woman.

(This is a preview. The full story spans a season of secrets, society balls, and the ultimate revelation that will test their love.)`,
      author: 'Victoria Pembroke',
      genre: 'Historical',
      tags: 'regency, duke, secret identity, gardens',
      readingTime: 240,
      ageRating: 'PG',
      published: true,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=400&h=600&fit=crop',
    },
    {
      title: 'Wolf Moon Rising',
      summary: 'Park ranger Mia Rodriguez doesn\'t believe in werewolves—until she meets Dante, the alpha of the Silver Creek pack, during a full moon. A paranormal romance where two worlds collide.',
      content: `Chapter 1: The Howl

Mia had heard plenty of sounds in the Montana wilderness, but this howl was different. It raised goosebumps on her arms and made her flashlight beam waver.

"Just a wolf," she muttered to herself, continuing her patrol. "A regular, non-supernatural wolf."

Then she saw him—a massive silver wolf standing in the moonlight, watching her with impossibly intelligent amber eyes.

"Hey there," Mia said softly, reaching for her radio. "Easy now."

The wolf shifted—there was no other word for it—and suddenly a man stood where the beast had been. A very naked, very attractive man with those same amber eyes.

"You should run," he said, his voice rough. "The full moon affects our control."

Mia should have run. She should have screamed. Instead, she threw him her jacket. "You look cold."

Dante caught it, stunned. In three hundred years, he'd never met a human who didn't run.

"I'm Mia," she said. "And you have about three seconds to explain what I just saw before I decide I've lost my mind."

(This is a preview. The full story explores their forbidden attraction, pack politics, and the threat that will force them to trust each other completely.)`,
      author: 'Luna Blackwood',
      genre: 'Paranormal',
      tags: 'werewolf, shifter, paranormal, montana',
      readingTime: 200,
      ageRating: 'R',
      published: true,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1509670811615-5f85d45ae2a6?w=400&h=600&fit=crop',
    },
    {
      title: 'Hearts in Code',
      summary: 'Rival programmers Zoe and Marcus are forced to collaborate on a startup project. Between debugging sessions and coffee runs, they discover their best code is the chemistry they\'re writing together.',
      content: `Chapter 1: Merge Conflict

"Your code is a mess," Zoe said, staring at Marcus's pull request.

"Your architecture is rigid," Marcus shot back, spinning his chair to face her.

Their investors had thought pairing the startup's two lead developers would be brilliant. Neither Zoe nor Marcus agreed.

"We need to refactor this entire module," Zoe said.

"We need to ship," Marcus countered. "Perfect is the enemy of done."

"Bugs are the enemy of everything," Zoe snapped.

Marcus stood, moving closer. "Maybe we're both right."

Zoe looked up, suddenly aware of how close he was, how his eyes weren't just brown but had flecks of gold. "That's... not possible."

"Maybe," Marcus said softly, "we need to try a different approach."

Neither was talking about code anymore.

(This is a preview. Watch as these two brilliant minds debug their differences and compile a love story, one line at a time.)`,
      author: 'Sarah Mitchell',
      genre: 'Contemporary',
      tags: 'workplace romance, tech, startup, rivals to lovers',
      readingTime: 150,
      ageRating: 'PG-13',
      published: true,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=600&fit=crop',
    },
    {
      title: 'The Captain\'s Promise',
      summary: 'Naval officer Captain James Fletcher returns home after years at sea to find his childhood friend Isabella has grown into a woman he can\'t ignore. A tale of duty, honor, and long-awaited love.',
      content: `Chapter 1: Homecoming - Portsmouth, 1808

The sea had changed James Fletcher. Six years in His Majesty's Navy had turned the boy who left into a hardened captain. But as he walked up the familiar lane to Hartfield House, his heart raced like a midshipman's before his first battle.

"James?" Isabella stood in the garden, a basket of roses in her hands. The afternoon sun caught her auburn hair, and James forgot how to breathe.

"Isabella." He removed his hat, bowing. "You've... grown."

She laughed, setting down the basket. "It's been six years, James. We tend to do that."

"I meant—" He stopped, flustered. The girl he'd left behind had become a woman of remarkable grace.

"I know what you meant," she said softly, moving closer. "You've changed too."

"The sea does that."

"Or perhaps," Isabella said, her blue eyes meeting his, "we were always meant to be these people. We just needed time."

James had faced storms and battles, but nothing prepared him for the way his heart surrendered to her smile.

(This is a preview. Follow their story through naval intrigues, society's expectations, and the promise that will bind them forever.)`,
      author: 'Victoria Pembroke',
      genre: 'Historical',
      tags: 'naval, regency, childhood friends, second chances',
      readingTime: 220,
      ageRating: 'PG',
      published: true,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
    },
    {
      title: 'Enchanted Hearts',
      summary: 'Bookshop owner Elara discovers she\'s inherited magical powers—and a centuries-old curse. The only one who can help is Kieran, a powerful warlock with secrets of his own.',
      content: `Chapter 1: The Inheritance

The book appeared on Elara's shop counter at exactly midnight. One moment the counter was empty; the next, an ancient leather-bound tome sat there, glowing faintly.

"That's not normal," Elara whispered, even though she was alone.

She touched the cover, and the world exploded in light and sensation. Images flooded her mind—witches, spells, a family tree that ended with her name in glowing letters.

"I wouldn't open that if I were you," a voice said from the shadows.

Elara spun to find a man stepping out of the darkness as if he'd been made of it. His silver eyes gleamed with power and warning.

"Who are you?" she demanded.

"Kieran Blackthorne. And you, Elara Winters, are a witch. A very powerful one, if my senses are correct."

"I'm a bookshop owner," Elara protested.

"You're both," Kieran said, moving closer. "And that book? It's the key to breaking a curse that's been hunting your family for three hundred years. A curse that's now coming for you."

"Why should I trust you?"

Kieran smiled, sad and knowing. "Because I'm cursed too. And we're each other's only chance."

(This is a preview. Magic, mystery, and a love that transcends time itself awaits in the full story.)`,
      author: 'Luna Blackwood',
      genre: 'Paranormal',
      tags: 'witch, warlock, magic, curse, bookshop',
      readingTime: 190,
      ageRating: 'PG-13',
      published: false, // This one is a draft
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=600&fit=crop',
    },
  ]

  for (const story of stories) {
    await prisma.story.create({
      data: story,
    })
    console.log(`Created story: ${story.title}`)
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

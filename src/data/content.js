// Everything the landing page lists. Photos are Pexels images (credits in README).
const files = import.meta.glob('../assets/photos/*.webp', { eager: true, query: '?url', import: 'default' })
export const photo = name => files[`../assets/photos/${name}.webp`]

export const CATEGORIES = [
  { key: 'home',      name: 'Home Services', ask: 'Paint a two-bedroom flat' },
  { key: 'repair',    name: 'Repair & Fix', ask: 'Fix a dripping tap' },
  { key: 'tutoring',  name: 'Tutoring', ask: 'Grade 3, Mon to Fri' },
  { key: 'delivery',  name: 'Delivery', ask: 'A sofa, third floor, no lift' },
  { key: 'cleaning',  name: 'Cleaning', ask: 'Deep clean before move-in' },
  { key: 'tech',      name: 'Tech Help', ask: "My screen, it's bad" },
  { key: 'beauty',    name: 'Beauty', ask: 'Mehndi for the whole family' },
  { key: 'transport', name: 'Transport', ask: 'Airport run at 4 am' },
  { key: 'creative',  name: 'Creative', ask: 'Film my baking page' },
  { key: 'events',    name: 'Events', ask: "Shoot my cat's birthday" },
  { key: 'writing',   name: 'Writing', ask: 'One ruthless shayari' },
  { key: 'weird',     name: 'Weird & Fun', ask: 'Be a wizard. Make an entrance' },
]

// The requests the hero types out. Each is one of the examples below, shortened,
// with a reply that stays inside that example's budget.
export const ASKS = [
  { text: "Dress as a wizard at my friend's birthday", photo: 'ask-party', who: 'BK', reply: 'PKR 4,000' },
  { text: 'Home school teacher for Grade 3',           photo: 'ask-tutor', who: 'SN', reply: 'PKR 32,000' },
  { text: "Photographer for my cat's birthday party",  photo: 'ask-cat',   who: 'HR', reply: 'PKR 5,500' },
  { text: 'Deep clean before move-in',                 photo: 'ask-clean', who: 'IA', reply: 'PKR 4,500' },
  { text: 'Teach my dad WhatsApp, patiently',          photo: 'ask-phone', who: 'UM', reply: 'PKR 1,200' },
]

// tone: the card's colour when it has no photo.
export const EXAMPLES = [
  { cat: 'Tutoring',      photo: 'note-tutor', title: 'Home school teacher for Grade 3',                    desc: 'Full-time Mon–Fri. English, Math, Urdu. Must come to our home in Wapda Town.',    budget: 'PKR 25,000 – 40,000' },
  { cat: 'Weird & Fun',   tone: 'rose',        title: 'I need someone to break up with my ex for me',       desc: "I'm too soft. Need a confident stranger to deliver the message. Script provided.", budget: 'PKR 500 – 1,500' },
  { cat: 'Weird & Fun',   photo: 'note-party', title: "Dress as a wizard at my friend's birthday",          desc: 'Full costume. Dramatic entrance. Make him completely lose his mind.',              budget: 'PKR 2,000 – 5,000' },
  { cat: 'Home Services', tone: 'sky',         title: 'Painter for 2 bedroom apartment',                    desc: 'White walls, clean finish. Paint provided. Johar Town, Lahore.',                  budget: 'PKR 8,000 – 18,000' },
  { cat: 'Delivery',      photo: 'note-food',  title: 'Pick up biryani from Burns Road',                    desc: 'Friday lunch. 10 portions. Must arrive hot. Gulberg office, 1:00 PM sharp.',      budget: 'PKR 400 – 800' },
  { cat: 'Weird & Fun',   tone: 'maroon',      title: 'Pretend to be my boss on a call with my mother',     desc: 'She thinks I got promoted. Professional-sounding voice needed. 5 minutes max.',   budget: 'PKR 500 – 1,000' },
  { cat: 'Cleaning',      photo: 'note-clean', title: 'Deep clean before move-in',                          desc: '3-marla house. Floors, bathrooms, kitchen, fans, windows. Need a reliable team.', budget: 'PKR 3,000 – 6,000' },
  { cat: 'Weird & Fun',   tone: 'sun',         title: 'Roast my friend at his farewell',                    desc: "He's moving to Canada. Wants to go out with a roast. Need someone funny.",        budget: 'PKR 3,000 – 7,000' },
  { cat: 'Events',        photo: 'note-cat',   title: "Photographer for my cat's birthday party",           desc: "Yes it's a real party. 8 cats, 12 humans, a cake. Don't judge. Shoot fast.",      budget: 'PKR 4,000 – 8,000' },
  { cat: 'Tech Help',     tone: 'lime',        title: "Fix my parents' WiFi — offline for 3 days",          desc: 'They keep calling me and I live in another city. Please just sort it out.',       budget: 'PKR 500 – 1,500' },
  { cat: 'Tutoring',      photo: 'note-phone', title: 'Teach my dad WhatsApp without calling me 10x a day', desc: 'Patient person needed. He asks the same question 6 times. Urdu preferred.',       budget: 'PKR 500 – 1,500' },
  { cat: 'Weird & Fun',   photo: 'note-chai',  title: 'Write a shayari roasting my friend who ghosted us',  desc: 'Classic Urdu shayari format but the content should be absolutely ruthless.',      budget: 'PKR 500 – 1,500' },
]

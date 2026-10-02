const firstNames = [
  'Benjamin', 'Kwasi', 'Kofi', 'Kobby', 'Kojo', 'Esi', 'Ama', 'Anita', 'Alex',
  'Patrick', 'James', 'Akosua', 'Abena', 'Yaw', 'Nana', 'Kweku', 'Adwoa', 'Efua',
];

const familyNames = [
  'Owusu', 'Gorman', 'Hammond', 'Iddirusu', 'Alhassan', 'Mensah', 'Osei', 'Asare',
  'Boateng', 'Appiah', 'Agyeman', 'Amponsah', 'Quaye', 'Frimpong', 'Tetteh', 'Opoku',
];

const pick = (items) => items[Math.floor(Math.random() * items.length)];

export const randomGhanaianName = () => `${pick(firstNames)} ${pick(familyNames)}`;
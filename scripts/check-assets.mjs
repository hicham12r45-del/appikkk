// يتحقق من وجود كل الملفات المطلوبة داخل public قبل الريندر
import fs from 'node:fs';
import path from 'node:path';

const required = [
  'audio/merged.mp3',
  'audio/music.mp3',
  'images/nicholas_ii.png',
  'images/russian_poverty.png',
  'images/world_war_one.png',
  'images/petrograd_crowds.png',
  'images/lenin_bolsheviks.png',
  'images/red_guards.png',
  'images/winter_palace.png',
  'images/revolution_legacy.png',
  'posters/poster_land_bread_peace.png',
  'posters/poster_workers_soldiers.png',
  'posters/poster_fall_of_tsarism.png',
  'posters/poster_petrograd_revolution.png',
  'posters/poster_new_dawn.png',
];

const missing = required.filter((f) => !fs.existsSync(path.join('public', f)));
if (missing.length) {
  console.error('\n❌ ملفات ناقصة داخل مجلد public:\n');
  for (const m of missing) console.error('   public/' + m);
  console.error('\nتأكد من الأسماء والامتداد (.png بحروف صغيرة) ثم أعد المحاولة.\n');
  process.exit(1);
}
console.log('✅ كل الملفات موجودة (' + required.length + ').');

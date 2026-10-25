# الثورة الروسية ١٩١٧: عشرة أيام هزّت العالم

مشروع Remotion لفيلم وثائقي (1920×1080، 30 إطار/ث، 18,544 إطاراً ≈ 10:18).

## أين تضع الملفات (داخل مجلد `public`)

التعليق الصوتي والموسيقى موجودان فعلاً في `public/audio/`.
ضع الصور والملصقات بهذه الأسماء بالضبط (PNG وبحروف صغيرة):

public/images/
  nicholas_ii.png
  russian_poverty.png
  world_war_one.png
  petrograd_crowds.png
  lenin_bolsheviks.png
  red_guards.png
  winter_palace.png
  revolution_legacy.png

public/posters/
  poster_land_bread_peace.png
  poster_workers_soldiers.png
  poster_fall_of_tsarism.png
  poster_petrograd_revolution.png
  poster_new_dawn.png

## الريندر على GitHub

1. أنشئ مستودعاً جديداً (Private) وارفع كل محتويات هذا المجلد (بما فيه `.github`).
2. تبويب Actions ← Render documentary ← Run workflow.
3. اترك `test_only = true` أولاً (أول 30 ثانية) وراجع النتيجة.
4. ثم شغّله مرة ثانية بـ `test_only = false` للفيديو الكامل.
5. بعد انتهائه: افتح التشغيل ← Artifacts ← documentary (رابط تحميل لمدة 7 أيام).

## تعديل التوقيت

كل المشاهد في `src/scenePlan.ts`. غيّر `startSec` لأي مشهد وتنتهي نهايته تلقائياً عند بداية التالي.
المدة والـ FPS والأبعاد في `src/config.ts` فقط.

## ما الجديد في هذه النسخة

- **المعلّق**: شخصية متحركة (`src/characters`) يتحرك فمها حسب شدة صوت التعليق الحقيقية، وتتغير إيماءات ذراعيه من جدول `poses.ts`. جدول ظهوره في `narratorSchedule.ts`.
- **رسوم متحركة**: خرائط (طريق لينين، بريست ليتوفسك، الحرب الأهلية)، طابور الخبز، الجنود، الجماهير والرايات، تاج القيصر، المصنع، السوفييتات، الجسور، قصر الشتاء ليلاً، الساعة والتاريخ، المرسوم، الشعارات، شعار الاتحاد السوفييتي، تبدل الخريطة. كلها في `src/infographics`.
- **متى تظهر**: ملف واحد للبيانات هو `src/cuePlan.ts` (غيّر `fromSec` و`toSec` أو احذف أي إشارة).
- **انتقالات متنوعة** (`src/transitions`)، أجواء (ثلج، جمر، ورق، غبار، خدوش فيلم)، شريط زمني، مؤشر فصول.
- **الموسيقى** تنخفض تلقائياً تحت الكلام اعتماداً على منحنى الصوت.
- لتعطيل أي طبقة اضبط `FEATURES` في `src/config.ts`.

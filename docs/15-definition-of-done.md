# 15. Definition of Done

Фича или страница считается готовой только если выполнены применимые пункты.

## Product
- [ ] соответствует product brief;
- [ ] не добавляет неподтверждённых коммерческих обещаний;
- [ ] concept/demo статус не скрыт там, где это важно;
- [ ] edge cases продуманы.

## UX
- [ ] happy path работает;
- [ ] empty/error/unavailable state существует;
- [ ] mobile flow не является уменьшенной копией desktop;
- [ ] действие имеет понятный результат.

## Design
- [ ] использует design tokens;
- [ ] типографика и spacing соответствуют системе;
- [ ] нет случайной SaaS-карточности/glassmorphism;
- [ ] фото имеют корректный crop/aspect;
- [ ] focus/hover/disabled задизайнены.

## Accessibility
- [ ] клавиатура;
- [ ] visible focus;
- [ ] semantic control;
- [ ] labels/errors;
- [ ] reduced motion;
- [ ] color not sole cue.

## Engineering
- [ ] typecheck;
- [ ] lint;
- [ ] relevant unit/component tests;
- [ ] no console errors;
- [ ] state/business logic не размазана по UI;
- [ ] persisted data validated.

## Responsive
- [ ] 390;
- [ ] 768;
- [ ] 1024;
- [ ] 1440;
- [ ] no horizontal page scroll.

## Performance
- [ ] images sized/optimized;
- [ ] LCP candidate intentional;
- [ ] no unnecessary client component boundary;
- [ ] no layout jump on state change.

## Content
- [ ] русский текст чистый и конкретный;
- [ ] нет остатков керамической тематики;
- [ ] alt text reviewed;
- [ ] prices/sizes consistent with data.

## QA
- [ ] critical E2E affected flow passes;
- [ ] screenshot reviewed if visual change;
- [ ] production build passes.

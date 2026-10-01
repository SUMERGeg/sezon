# Пастельный орнамент

Первая версия. По последующему уточнению пользователя угловой орнамент снят с сайта и заменён тремя свободными побегами: `docs/botanical-growth.md`.

2026-10-01: по запросу пользователя палитра смягчена до шалфейного зелёного и пудрового розового. Декор дозирован: углы завершающего блока главной, край сезонного блока, верхний правый угол внутренних страниц на desktop. Mobile уменьшает орнаменты и убирает их над формами. Это визуальная правка, бизнес-логика не меняется.

Режим: встроенный imagegen, новый оригинальный орнамент по двум пользовательским style references. Alpha сохранён при оптимизации в WebP.

Asset: `public/images/decor/rose-vine.webp`.

Проверка: build/typecheck/lint успешны; 4 целевых browser tests прошли на 390/1440 (страницы и courier checkout), без console errors/overflow. Screenshots главной просмотрены. Контраст ink/sage 7.43, muted/bg 4.88, muted/surface 4.52, pine/sage и wine/rose 5.01. WebP 700×700, alpha, 86.7 KB.

Original: `C:/Users/User/.codex/generated_images/01a0f864-8208-7f20-be84-7145c3b7fb10/exec-291a4d4c-f646-4902-ad79-78c5e0705c52.png`.

Prompt:

Use case: stylized-concept. Asset type: delicate decorative botanical corner ornament for a refined flower shop website. Input image 1 is a style reference for hand-painted sage green rose vines and powder pink blossoms/ribbon; input image 2 is only a reference for the slender sparse floral vine, ignore ALL phone interface, text and screenshot elements. Create a NEW original illustration, not a reproduction. A whisper-light watercolor and fine colored-pencil rose vine, airy muted sage leaves, five tiny pale blush rose blossoms at most, one very small loosely tied dusty pink ribbon. Composition: square canvas, a loose L-shaped sprig along the TOP and RIGHT edges only, tapering ends, entirely within canvas with generous margin. The central and lower-left 75% is EMPTY and fully transparent. Thin graceful stems, natural irregular linework, soft translucent watercolor washes, pale desaturated pastel sage green and powder pink, very restrained, gentle and elegant. No dense garland, no ornate frame, no symmetry, no heavy bow, no saturated colors, no shadows, no paper texture/background, no lettering, no logo. Transparent alpha background around and between leaves and flowers. This will be shown as a small corner accent near a section edge, so delicate but crisp natural botanical detail.

export const filterGroups = [
  { key: "category", title: "Тип букета", options: [["author", "Авторские букеты"], ["mono", "Монобукеты"], ["arrangement", "Композиции"], ["seasonal", "Сезонные охапки"]] },
  { key: "occasion", title: "Повод", options: [["birthday", "День рождения"], ["date", "Свидание"], ["thank-you", "Благодарность"], ["home", "Для дома"], ["just-because", "Без повода"]] },
  { key: "palette", title: "Гамма", options: [["light", "Светлая"], ["pink-wine", "Розово-винная"], ["green-white", "Зелёно-белая"], ["warm", "Тёплая"], ["bright", "Яркая"]] },
] as const;

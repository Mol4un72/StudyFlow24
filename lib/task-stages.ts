export const TASK_STAGE_DEFINITIONS = [
  {
    id: "clone",
    title: "Клонування репозиторію",
    message: "Завантажуємо репозиторій із GitHub.",
  },
  {
    id: "prepare",
    title: "Підготовка проєкту",
    message: "Створюємо папку завдання та робочу гілку.",
  },
  {
    id: "ai",
    title: "Робота ШІ-агента",
    message: "Аналізуємо вимоги, пишемо код і виконуємо перевірки.",
  },
  {
    id: "git_check",
    title: "Перевірка змін",
    message: "Перевіряємо змінені файли перед комітом.",
  },
  {
    id: "commit",
    title: "Створення коміту",
    message: "Зберігаємо зміни в Git.",
  },
  {
    id: "push",
    title: "Публікація на GitHub",
    message: "Відправляємо зміни до віддаленого репозиторію.",
  },
] as const;

export function createInitialTaskStages() {
  return TASK_STAGE_DEFINITIONS.map((stage) => ({
    ...stage,
    status: "pending",
  }));
}
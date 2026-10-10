import JSZip from "jszip";
import { Assignment } from "@/types/assignment";

/**
 * ============================================================================
 * MOCK ARTIFACT & REPORT SERVICE
 * ============================================================================
 * 
 * [БЕКЕНД ІНТЕГРАЦІЯ / DATA SOURCE POINT]:
 * Місце, де збирається інформація для генерації звіту (Laboratory / Assignment Report):
 * 1. assignment.title             -> Назва практичної роботи або завдання
 * 2. assignment.subject           -> Назва навчальної дисципліни (предмету)
 * 3. assignment.repositoryName    -> Репозиторій студента
 * 4. assignment.branchName        -> Назва цільової гілки (куди агент запушив код)
 * 5. assignment.commitSha         -> Хеш коміту зі змінами
 * 6. assignment.instructions      -> Текст завдання та вимоги викладача
 * 7. assignment.additionalContext -> Додаткові вимоги / варіант студента
 * 8. assignment.files             -> Список згенерованих файлів та код рішень
 * 9. assignment.validationChecks  -> Результати виконання тестів і лінтерів агентом
 * 10. Placeholder для скриншотів  -> Місце для вставки скриншотів студентом перед здачею
 * ============================================================================
 */

export const mockArtifactService = {
  /**
   * Створює та завантажує ZIP-архів з виконаними файлами завдання.
   */
  async generateAndDownloadZip(assignment: Assignment): Promise<boolean> {
    try {
      const zip = new JSZip();
      const folderName = assignment.branchName || `assignment-${assignment.id}`;
      const folder = zip.folder(folderName) || zip;

      // Додавання згенерованих файлів розв'язку
      if (assignment.files && assignment.files.length > 0) {
        for (const file of assignment.files) {
          const content =
            file.newContent ||
            file.originalContent ||
            `# ${file.path}\n\n// Файл рішення, згенерований StudyFlow AI Agent\n// Завдання: ${assignment.title}\n// Предмет: ${assignment.subject}\n\n`;
          folder.file(file.path, content);
        }
      } else {
        folder.file("solution.py", `# Рішення для ${assignment.title}\nprint("Завдання виконано")\n`);
      }

      // Додавання файлу README з описом
      const readmeContent = `# ${assignment.title}
**Предмет:** ${assignment.subject}
**Репозиторій:** ${assignment.repositoryName}
**Гілка:** ${assignment.branchName || "practice-solution"}
**Коміт:** ${assignment.commitSha || "f8c2e91"}
**Дата виконання:** ${new Date().toLocaleDateString()}

## Вимоги до завдання
${assignment.instructions}

${assignment.additionalContext ? `## Додаткові вимоги\n${assignment.additionalContext}\n` : ""}

## Список виконаних файлів
${assignment.files.map((f) => `- [${f.action.toUpperCase()}] \`${f.path}\``).join("\n")}

## Результати автоматичної перевірки
${assignment.validationChecks.map((c) => `- [${c.status.toUpperCase()}] ${c.title}: ${c.description}`).join("\n")}

---
*Архів підготовлено платформою StudyFlow.*
`;
      folder.file("README.md", readmeContent);

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error("Помилка генерації ZIP-архіву:", error);
      return false;
    }
  },

  /**
   * ==========================================================================
   * [ДЖЕРЕЛО ДАНИХ ДЛЯ ЗВІТУ / REPORT GENERATION HOOK]
   * Ця функція формує окремий документ звіту (DOCX/DOC) на основі даних завдання.
   * Коли буде підключено реальний бекенд, сюди передаються дані зібрані агентом.
   * ==========================================================================
   */
  async generateAndDownloadReport(assignment: Assignment): Promise<boolean> {
    try {
      // 1. Формування структури звіту (HTML-формат з розміткою для MS Word / Google Docs)
      const reportHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>Звіт з практичної роботи - ${assignment.title}</title>
<style>
  body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 800px; margin: 40px auto; padding: 20px; }
  h1 { color: #4338ca; border-bottom: 2px solid #e0e7ff; padding-bottom: 8px; margin-top: 0; }
  h2 { color: #374151; margin-top: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
  .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
  .meta-grid { display: grid; grid-template-columns: 160px 1fr; row-gap: 8px; }
  .label { font-weight: bold; color: #4b5563; }
  .instructions-box { background: #fdf4ff; border-left: 4px solid #a855f7; padding: 12px 16px; margin: 16px 0; }
  pre { background: #1e293b; color: #f8fafc; padding: 14px; border-radius: 6px; overflow-x: auto; font-family: Consolas, monospace; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
  th { background-color: #f1f5f9; }
  .status-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: #dcfce7; color: #15803d; }
  .screenshot-placeholder { border: 2px dashed #94a3b8; border-radius: 8px; padding: 32px; text-align: center; color: #64748b; margin: 16px 0; background: #f8fafc; }
</style>
</head>
<body>
  <h1>ЗВІТ З ВИКОНАННЯ ЛАБОРАТОРНОЇ / ПРАКТИЧНОЇ РОБОТИ</h1>
  
  <div class="meta-box">
    <div class="meta-grid">
      <div class="label">Тема завдання:</div><div>${assignment.title}</div>
      <div class="label">Дисципліна:</div><div>${assignment.subject}</div>
      <div class="label">Репозиторій GitHub:</div><div>${assignment.repositoryName}</div>
      <div class="label">Гілка з кодом:</div><div><code>${assignment.branchName || "practice-solution"}</code></div>
      <div class="label">Коміт:</div><div><code>${assignment.commitSha || "f8c2e91"}</code> &mdash; "${assignment.commitMessage || "Виконання завдання"}"</div>
      <div class="label">Дата виконання:</div><div>${new Date(assignment.publishedAt || assignment.updatedAt).toLocaleString()}</div>
    </div>
  </div>

  <h2>1. Умова та вимоги до завдання</h2>
  <div class="instructions-box">
    <p>${assignment.instructions.replace(/\n/g, "<br/>")}</p>
  </div>
  ${assignment.additionalContext ? `<p><strong>Додаткові вимоги / варіант:</strong> ${assignment.additionalContext}</p>` : ""}

  <h2>2. Структура створених файлів та опис розв'язку</h2>
  <table>
    <thead>
      <tr>
        <th>Шлях до файлу</th>
        <th>Дія</th>
        <th>Статус</th>
      </tr>
    </thead>
    <tbody>
      ${assignment.files
        .map(
          (f) => `<tr>
            <td><code>${f.path}</code></td>
            <td><strong>${f.action.toUpperCase()}</strong></td>
            <td><span class="status-badge">Створено та перевірено</span></td>
          </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <h2>3. Результати автоматичного тестування</h2>
  <ul>
    ${assignment.validationChecks
      .map(
        (c) => `<li><strong>${c.title}</strong>: ${c.description} &mdash; <em>(${c.status.toUpperCase()})</em></li>`
      )
      .join("")}
  </ul>

  <h2>4. Скриншоти роботи програми (заповнюється студентом)</h2>
  <p><em>(Вставте скриншоти виводу консолі або роботи інтерфейсу нижче перед здачею викладачу)</em></p>
  <div class="screenshot-placeholder">
    [ Вставте Скриншот 1: Результат виконання програми в консолі / терміналі ]
  </div>
  <div class="screenshot-placeholder">
    [ Вставте Скриншот 2: Успішне проходження тестів ]
  </div>

  <h2>5. Підтвердження виконання</h2>
  <p>Код рішення зафіксовано в окремому коміті у гілці <code>${assignment.branchName || "practice-branch"}</code> репозиторію <code>${assignment.repositoryName}</code>.</p>
  <br/><br/>
  <p><strong>Студент:</strong> ___________________________ &nbsp;&nbsp;&nbsp;&nbsp; <strong>Дата:</strong> ________________</p>
</body>
</html>`;

      const blob = new Blob([reportHtml], { type: "application/msword;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Звіт_${assignment.title.replace(/[^a-zA-Z0-9а-яА-ЯіІїЇєЄ]/g, "_")}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error("Помилка створення звіту:", error);
      return false;
    }
  },
};

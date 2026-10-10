import {
  Assignment,
  AssignmentFile,
  AssignmentStageInfo,
  AssignmentStatus,
  ValidationCheck,
} from "@/types/assignment";

const STORAGE_KEY_ASSIGNMENTS = "studyflow_mock_assignments_v1";

export const DEFAULT_STAGES: AssignmentStageInfo[] = [
  {
    id: 1,
    key: "received",
    title: "Assignment received",
    description: "Parsed prompt requirements, identified subject constraints and target repository",
    status: "pending",
  },
  {
    id: 2,
    key: "inspected",
    title: "Repository inspected",
    description: "Scanned folder tree, package manifests, and existing source structure",
    status: "pending",
  },
  {
    id: 3,
    key: "prepared",
    title: "Changes prepared",
    description: "Synthesized solution files, unit tests, and documentation",
    status: "pending",
  },
  {
    id: 4,
    key: "validation",
    title: "Validation running",
    description: "Running typecheck, linting rules, and automated test cases",
    status: "pending",
  },
  {
    id: 5,
    key: "review",
    title: "Awaiting review",
    description: "Student inspects proposed diffs and validates file additions",
    status: "pending",
  },
  {
    id: 6,
    key: "publishing",
    title: "Published to GitHub",
    description: "Created target feature branch and committed solution code",
    status: "pending",
  },
  {
    id: 7,
    key: "report",
    title: "Report generated",
    description: "Produced structured DOCX laboratory report and ZIP solution archive",
    status: "pending",
  },
];

export const INITIAL_MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "asg-python-01",
    title: "Python — File Processing",
    subject: "Python",
    repositoryId: "repo-2",
    repositoryName: "student/python-course",
    instructions:
      "Implement a robust CSV log parser that reads server access logs, aggregates HTTP response status code distributions, calculates peak traffic windows, and outputs a formatted JSON summary report with error handling.",
    additionalContext: "Use standard Python 3.12 library modules (csv, json, collections, datetime). Ensure exception handling for missing files.",
    status: "completed",
    currentStageIndex: 7,
    stages: DEFAULT_STAGES.map((s) => ({
      ...s,
      status: "completed",
      timestamp: "2026-04-01T10:32:00Z",
    })),
    branchName: "practice-04-file-processing",
    commitMessage: "Complete file processing practice assignment",
    commitSha: "f8c2e91",
    simulatedRepoUrl: "https://github.com/student/python-course/tree/practice-04-file-processing",
    createdAt: "2026-04-01T10:15:00Z",
    updatedAt: "2026-04-01T10:35:00Z",
    publishedAt: "2026-04-01T10:34:00Z",
    files: [
      {
        path: "practice-04/log_parser.py",
        action: "added",
        sizeBytes: 2450,
        newContent: `"""
Server Access Log Analyzer
Processes HTTP server logs, tallies status codes and detects peak load intervals.
"""
import csv
import json
from collections import Counter, defaultdict
from datetime import datetime
from typing import Dict, Any, List

class LogAnalyzer:
    def __init__(self, filepath: str):
        self.filepath = filepath
        self.records: List[Dict[str, Any]] = []

    def parse(self) -> None:
        try:
            with open(self.filepath, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    self.records.append(row)
        except FileNotFoundError:
            raise FileNotFoundError(f"Log file {self.filepath} not found.")

    def summarize_status_codes(self) -> Dict[str, int]:
        counts = Counter(r['status_code'] for r in self.records if 'status_code' in r)
        return dict(counts)

    def find_peak_hour(self) -> str:
        hour_counts = defaultdict(int)
        for r in self.records:
            if 'timestamp' in r:
                dt = datetime.fromisoformat(r['timestamp'])
                hour_counts[dt.strftime("%Y-%m-%d %H:00")] += 1
        return max(hour_counts, key=hour_counts.get) if hour_counts else "N/A"

    def export_summary(self, output_path: str) -> None:
        summary = {
            "total_requests": len(self.records),
            "status_codes": self.summarize_status_codes(),
            "peak_traffic_window": self.find_peak_hour(),
            "generated_at": datetime.utcnow().isoformat()
        }
        with open(output_path, 'w', encoding='utf-8') as out:
            json.dump(summary, out, indent=2)
        print(f"Summary successfully written to {output_path}")

if __name__ == "__main__":
    analyzer = LogAnalyzer("access_sample.csv")
    print("Log analyzer initialized.")
`,
        diffPreview: `@@ -0,0 +1,52 @@
+"""
+Server Access Log Analyzer
+"""
+import csv
+import json
+from collections import Counter, defaultdict
+...
+class LogAnalyzer:
+    def __init__(self, filepath: str):
+        self.filepath = filepath
+    def parse(self):
+        ...
`,
      },
      {
        path: "practice-04/test_parser.py",
        action: "added",
        sizeBytes: 1320,
        newContent: `import unittest
import os
import json
from log_parser import LogAnalyzer

class TestLogAnalyzer(unittest.TestCase):
    def setUp(self):
        self.sample_csv = "test_access.csv"
        with open(self.sample_csv, "w") as f:
            f.write("timestamp,ip,status_code\\n")
            f.write("2026-04-01T10:00:00,192.168.1.1,200\\n")
            f.write("2026-04-01T10:05:00,192.168.1.2,404\\n")
            f.write("2026-04-01T10:10:00,192.168.1.3,200\\n")

    def tearDown(self):
        if os.path.exists(self.sample_csv):
            os.remove(self.sample_csv)

    def test_status_codes(self):
        analyzer = LogAnalyzer(self.sample_csv)
        analyzer.parse()
        summary = analyzer.summarize_status_codes()
        self.assertEqual(summary.get("200"), 2)
        self.assertEqual(summary.get("404"), 1)

if __name__ == '__main__':
    unittest.main()
`,
        diffPreview: `@@ -0,0 +1,30 @@
+import unittest
+from log_parser import LogAnalyzer
+...
+class TestLogAnalyzer(unittest.TestCase):
+    def test_status_codes(self):
+        ...
`,
      },
      {
        path: "practice-04/README.md",
        action: "added",
        sizeBytes: 850,
        newContent: `# Practice 04: Python Log Analyzer\n\nRun tests via \`python -m unittest test_parser.py\`.\n`,
        diffPreview: `@@ -0,0 +1,5 @@
+# Practice 04: Python Log Analyzer
+Run tests with unittest.
`,
      },
    ],
    validationChecks: [
      {
        id: "chk-1",
        title: "Python Syntax & Ruff Linter",
        description: "Zero syntax errors and PEP8 compliant formatting",
        status: "passed",
        output: "All 3 files passed formatting checks without warnings.",
      },
      {
        id: "chk-2",
        title: "Unit Test Execution",
        description: "Ran 4 test suites across LogAnalyzer and EdgeCases",
        status: "passed",
        output: "Ran 4 tests in 0.042s. OK",
      },
      {
        id: "chk-3",
        title: "Type Safety Check (mypy)",
        description: "Type hint consistency verification",
        status: "passed",
        output: "Success: no issues found in 2 source files",
      },
    ],
    outputOptions: {
      separateBranch: true,
      generateReport: true,
      generateArchive: true,
    },
    reportStatus: "ready",
    archiveStatus: "ready",
  },
  {
    id: "asg-web-02",
    title: "Web Development — Responsive Layout",
    subject: "Web Development",
    repositoryId: "repo-1",
    repositoryName: "student/web-development",
    instructions:
      "Create a responsive multi-column dashboard card grid using CSS Grid and Flexbox with mobile collapse breakpoints, dark mode CSS variables, and keyboard accessible interactive card controls.",
    additionalContext: "Ensure HTML5 semantic landmarks (main, section, header) and WCAG AA contrast ratios.",
    status: "completed",
    currentStageIndex: 7,
    stages: DEFAULT_STAGES.map((s) => ({
      ...s,
      status: "completed",
      timestamp: "2026-03-28T15:10:00Z",
    })),
    branchName: "feat-responsive-grid-layout",
    commitMessage: "Implement responsive accessible dashboard layout with CSS Grid",
    commitSha: "c4d7b10",
    simulatedRepoUrl: "https://github.com/student/web-development/tree/feat-responsive-grid-layout",
    createdAt: "2026-03-28T14:40:00Z",
    updatedAt: "2026-03-28T15:15:00Z",
    publishedAt: "2026-03-28T15:12:00Z",
    files: [
      {
        path: "src/components/DashboardGrid.tsx",
        action: "added",
        sizeBytes: 3100,
        newContent: `import React from 'react';\n\nexport const DashboardGrid = () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">...</div>;`,
        diffPreview: `@@ -0,0 +1,45 @@
+import React from 'react';
+export const DashboardGrid = () => ...
`,
      },
      {
        path: "src/styles/layout.css",
        action: "modified",
        sizeBytes: 1800,
        newContent: `:root { --grid-gap: 1.5rem; }\n.card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }`,
        diffPreview: `@@ -12,4 +12,12 @@
-.old-container { width: 100%; }
+.card-grid {
+  display: grid;
+  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
+  gap: var(--grid-gap);
+}
`,
      },
    ],
    validationChecks: [
      {
        id: "chk-w1",
        title: "ESLint & Prettier Linting",
        description: "Zero JSX formatting or unused variable issues",
        status: "passed",
      },
      {
        id: "chk-w2",
        title: "Accessibility Lighthouse Audit",
        description: "100% accessible semantics and keyboard focus trap checks",
        status: "passed",
      },
    ],
    outputOptions: {
      separateBranch: true,
      generateReport: true,
      generateArchive: true,
    },
    reportStatus: "ready",
    archiveStatus: "ready",
  },
  {
    id: "asg-db-03",
    title: "Databases — SQL Queries",
    subject: "Databases",
    repositoryId: "repo-3",
    repositoryName: "student/database-course",
    instructions:
      "Design complex relational SQL analytical queries using Window Functions (ROW_NUMBER, RANK), CTEs (Common Table Expressions) and aggregation to compute customer lifetime value, churn rate, and monthly recurring revenue across order partitions.",
    additionalContext: "PostgreSQL 16 dialect. Optimize query plans to avoid full table scans by recommending indices on order_date and customer_id.",
    status: "review",
    currentStageIndex: 5,
    stages: [
      {
        id: 1,
        key: "received",
        title: "Assignment received",
        description: "Parsed SQL analytical queries prompt and constraints",
        status: "completed",
        timestamp: "2026-04-09T18:00:00Z",
      },
      {
        id: 2,
        key: "inspected",
        title: "Repository inspected",
        description: "Identified schema migrations and existing Postgres seeds",
        status: "completed",
        timestamp: "2026-04-09T18:01:00Z",
      },
      {
        id: 3,
        key: "prepared",
        title: "Changes prepared",
        description: "Drafted analytical queries and migration script",
        status: "completed",
        timestamp: "2026-04-09T18:02:00Z",
      },
      {
        id: 4,
        key: "validation",
        title: "Validation running",
        description: "Tested EXPLAIN ANALYZE on mock dataset",
        status: "completed",
        timestamp: "2026-04-09T18:03:00Z",
      },
      {
        id: 5,
        key: "review",
        title: "Awaiting review",
        description: "Ready for student review before branch publication",
        status: "running",
        timestamp: "2026-04-09T18:04:00Z",
        message: "Review the proposed SQL script and confirm branch publishing.",
      },
      {
        id: 6,
        key: "publishing",
        title: "Published to GitHub",
        description: "Publish to branch 'lab-03-sql-analytics'",
        status: "pending",
      },
      {
        id: 7,
        key: "report",
        title: "Report generated",
        description: "Generate report with query execution plans",
        status: "pending",
      },
    ],
    branchName: "lab-03-sql-analytics",
    commitMessage: "Add customer analytics SQL queries with window functions",
    createdAt: "2026-04-09T18:00:00Z",
    updatedAt: "2026-04-09T18:04:00Z",
    files: [
      {
        path: "labs/lab03/analytics_queries.sql",
        action: "added",
        sizeBytes: 2900,
        newContent: `-- Customer Cohort & Churn Analytics\nWITH MonthlyCohorts AS (\n  SELECT customer_id, date_trunc('month', MIN(order_date)) as cohort_month\n  FROM orders GROUP BY customer_id\n)\nSELECT cohort_month, COUNT(customer_id) as total_customers FROM MonthlyCohorts GROUP BY cohort_month;`,
        diffPreview: `@@ -0,0 +1,38 @@
+-- Customer Cohort & Churn Analytics
+WITH MonthlyCohorts AS (
+  SELECT customer_id, date_trunc('month', MIN(order_date)) as cohort_month
+  FROM orders GROUP BY customer_id
+)
+...
`,
      },
      {
        path: "labs/lab03/schema_indexes.sql",
        action: "added",
        sizeBytes: 650,
        newContent: `CREATE INDEX IF NOT EXISTS idx_orders_customer_date ON orders(customer_id, order_date DESC);`,
        diffPreview: `@@ -0,0 +1,5 @@
+CREATE INDEX IF NOT EXISTS idx_orders_customer_date ON orders(customer_id, order_date DESC);
`,
      },
    ],
    validationChecks: [
      {
        id: "chk-db1",
        title: "SQL Syntax & Postgres Compatibility",
        description: "Passed syntax checker for Postgres 16 parser",
        status: "passed",
      },
      {
        id: "chk-db2",
        title: "Index Verification",
        description: "Verified composite index accelerates partition scans",
        status: "passed",
      },
    ],
    outputOptions: {
      separateBranch: true,
      generateReport: true,
      generateArchive: true,
    },
    reportStatus: "pending",
    archiveStatus: "pending",
  },
];

export const mockTaskService = {
  getAssignments(): Assignment[] {
    if (typeof window === "undefined") {
      return INITIAL_MOCK_ASSIGNMENTS;
    }
    const stored = localStorage.getItem(STORAGE_KEY_ASSIGNMENTS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse stored assignments:", e);
      }
    }
    // Set initial
    localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(INITIAL_MOCK_ASSIGNMENTS));
    return INITIAL_MOCK_ASSIGNMENTS;
  },

  getAssignmentById(id: string): Assignment | null {
    const list = this.getAssignments();
    return list.find((a) => a.id === id) || null;
  },

  saveAssignment(assignment: Assignment): void {
    const list = this.getAssignments();
    const index = list.findIndex((a) => a.id === assignment.id);
    let updated: Assignment[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = { ...assignment, updatedAt: new Date().toISOString() };
    } else {
      updated = [assignment, ...list];
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(updated));
    }
  },

  deleteAssignment(id: string): boolean {
    const list = this.getAssignments();
    const filtered = list.filter((a) => a.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(filtered));
    }
    return true;
  },

  resetToDefault(): Assignment[] {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(INITIAL_MOCK_ASSIGNMENTS));
    }
    return INITIAL_MOCK_ASSIGNMENTS;
  },

  async createAssignment(data: {
    subject: string;
    customSubject?: string;
    repositoryId: string;
    repositoryName: string;
    instructions: string;
    additionalContext?: string;
    branchName?: string;
    commitMessage?: string;
    outputOptions: {
      separateBranch: boolean;
      generateReport: boolean;
      generateArchive: boolean;
    };
  }): Promise<Assignment> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const id = `asg-${Date.now().toString(36)}`;
    const effectiveSubject = data.subject === "Other" && data.customSubject ? data.customSubject : data.subject;
    
    // Auto-generate realistic title based on subject and first line of instructions
    const firstLine = data.instructions.trim().split("\n")[0].slice(0, 45);
    const title = `${effectiveSubject} — ${firstLine || "Практичне завдання"}`;

    const slug = effectiveSubject.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const branchName = data.branchName?.trim() || `practice-${slug}-${Date.now().toString(36).slice(-4)}`;
    const commitMessage = data.commitMessage?.trim() || `Виконання практичної роботи: ${firstLine || effectiveSubject}`;

    const newAssignment: Assignment = {
      id,
      title,
      subject: effectiveSubject,
      customSubject: data.customSubject,
      repositoryId: data.repositoryId,
      repositoryName: data.repositoryName,
      instructions: data.instructions,
      additionalContext: data.additionalContext,
      status: "queued",
      currentStageIndex: 1,
      stages: DEFAULT_STAGES.map((s, idx) => ({
        ...s,
        status: idx === 0 ? "running" : "pending",
        timestamp: idx === 0 ? new Date().toISOString() : undefined,
        message: idx === 0 ? "Processing assignment prompt and instructions..." : undefined,
      })),
      branchName,
      commitMessage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      files: [
        {
          path: `solution/main_${slug.replace(/-/g, "_")}.${getExtForSubject(effectiveSubject)}`,
          action: "added",
          sizeBytes: 1840,
          newContent: `// Solution prepared for ${effectiveSubject}\n// Assignment: ${title}\n\nfunction main() {\n  console.log("Assignment initialized.");\n}\n\nmain();\n`,
          diffPreview: `@@ -0,0 +1,15 @@\n+// Solution prepared for ${effectiveSubject}\n+function main() {\n+  console.log("Assignment initialized.");\n+}`,
        },
        {
          path: `solution/README.md`,
          action: "added",
          sizeBytes: 650,
          newContent: `# ${title}\n\nAutomated solution generated by StudyFlow.`,
          diffPreview: `@@ -0,0 +1,4 @@\n+# ${title}\n+Automated solution generated by StudyFlow.`,
        },
      ],
      validationChecks: [
        {
          id: "chk-auto-1",
          title: "Static Code Analysis & Lint",
          description: "Syntactic structure and language standard compliance",
          status: "passed",
        },
        {
          id: "chk-auto-2",
          title: "Unit Test Harness",
          description: "Automated assertion validation against requirements",
          status: "passed",
        },
      ],
      outputOptions: data.outputOptions,
      reportStatus: "pending",
      archiveStatus: "pending",
    };

    this.saveAssignment(newAssignment);
    return newAssignment;
  },

  /**
   * Advances the simulated execution stages for an assignment
   */
  async advanceStage(assignmentId: string): Promise<Assignment | null> {
    const asg = this.getAssignmentById(assignmentId);
    if (!asg) return null;

    const currentIdx = asg.currentStageIndex; // 1-indexed (1 to 7)

    if (currentIdx >= 7) {
      return asg;
    }

    const updatedStages = [...asg.stages];
    // mark current stage as completed
    if (updatedStages[currentIdx - 1]) {
      updatedStages[currentIdx - 1] = {
        ...updatedStages[currentIdx - 1],
        status: "completed",
        timestamp: new Date().toISOString(),
      };
    }

    const nextIdx = currentIdx + 1;
    let nextStatus: AssignmentStatus = asg.status;

    if (nextIdx === 2) {
      nextStatus = "processing";
      updatedStages[1] = {
        ...updatedStages[1],
        status: "running",
        timestamp: new Date().toISOString(),
        message: "Аналіз структури репозиторію та залежностей...",
      };
    } else if (nextIdx === 3) {
      nextStatus = "processing";
      updatedStages[2] = {
        ...updatedStages[2],
        status: "running",
        timestamp: new Date().toISOString(),
        message: "Генерація файлів рішення та модульних тестів...",
      };
    } else if (nextIdx === 4) {
      nextStatus = "processing";
      updatedStages[3] = {
        ...updatedStages[3],
        status: "running",
        timestamp: new Date().toISOString(),
        message: "Автоматичний запуск перевірок та лінтера...",
      };
    } else if (nextIdx === 5) {
      nextStatus = "publishing";
      updatedStages[4] = {
        ...updatedStages[4],
        status: "completed",
        timestamp: new Date().toISOString(),
        message: "Рішення перевірено агентом.",
      };
      updatedStages[5] = {
        ...updatedStages[5],
        status: "running",
        timestamp: new Date().toISOString(),
        message: `Пуш змін у гілку '${asg.branchName}'...`,
      };
    } else if (nextIdx === 6) {
      nextStatus = "publishing";
      updatedStages[5] = {
        ...updatedStages[5],
        status: "completed",
        timestamp: new Date().toISOString(),
        message: `Зміни успішно запушено в гілку '${asg.branchName}'`,
      };
      updatedStages[6] = {
        ...updatedStages[6],
        status: "running",
        timestamp: new Date().toISOString(),
        message: "Формування ZIP архіву та DOCX звіту...",
      };
    } else if (nextIdx >= 7) {
      nextStatus = "completed";
      updatedStages[6] = {
        ...updatedStages[6],
        status: "completed",
        timestamp: new Date().toISOString(),
        message: "Виконано! Папка з рішенням та звіт готові до завантаження.",
      };
    }

    const sha = asg.commitSha || Math.random().toString(16).substring(2, 9);
    const updatedAssignment: Assignment = {
      ...asg,
      currentStageIndex: nextIdx,
      status: nextStatus,
      stages: updatedStages,
      reportStatus: nextIdx >= 6 ? "ready" : asg.reportStatus,
      archiveStatus: nextIdx >= 6 ? "ready" : asg.archiveStatus,
      publishedAt: nextIdx >= 6 ? new Date().toISOString() : asg.publishedAt,
      commitSha: sha,
      simulatedRepoUrl: `https://github.com/${asg.repositoryName}/tree/${asg.branchName}`,
    };

    this.saveAssignment(updatedAssignment);
    return updatedAssignment;
  },

  /**
   * Confirms publishing from the review stage to final publication
   */
  async confirmPublish(assignmentId: string): Promise<Assignment | null> {
    const asg = this.getAssignmentById(assignmentId);
    if (!asg) return null;

    // Advance through publishing (6) to completed (7)
    const updatedStages = asg.stages.map((stage) => {
      if (stage.id <= 7) {
        return {
          ...stage,
          status: "completed" as const,
          timestamp: stage.timestamp || new Date().toISOString(),
        };
      }
      return stage;
    });

    const sha = Math.random().toString(16).substring(2, 9);
    const updated: Assignment = {
      ...asg,
      status: "completed",
      currentStageIndex: 7,
      stages: updatedStages,
      commitSha: sha,
      simulatedRepoUrl: `https://github.com/${asg.repositoryName}/tree/${asg.branchName}`,
      publishedAt: new Date().toISOString(),
      reportStatus: "ready",
      archiveStatus: "ready",
      updatedAt: new Date().toISOString(),
    };

    this.saveAssignment(updated);
    return updated;
  },
};

function getExtForSubject(subject: string): string {
  const s = subject.toLowerCase();
  if (s.includes("python")) return "py";
  if (s.includes("web") || s.includes("javascript")) return "ts";
  if (s.includes("database") || s.includes("sql")) return "sql";
  if (s.includes("operating") || s.includes("c")) return "c";
  return "js";
}

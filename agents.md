# Agent Instructions

You are an AI agent working on the **ECU电喷管理系统 (ECU Injection Management System)** project.

## Project Overview
This is a high-fidelity desktop application for tuning and monitoring Engine Control Units (ECUs). It provides real-time data visualization, map editing (3D/2D tables), and sensor calibration.

### Tech Stack
- **Runtime:** Electron (Main Process)
- **Frontend:** React 18 + Vite (Renderer Process)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

### Key Features
- **Real-time Monitoring:** Dashboard with analog gauges (RPM, TPS, AFR) and digital sensor bars (ECT, IAT, MAP, Battery, etc.).
- **Tuning Maps:** Interactive 2D/3D tables for Fuel (VE), Ignition (Spark), and Compensation maps (e.g., ECT vs RPM).
- **Simulation:** Built-in engine simulator for testing UI responsiveness without hardware.
- **Connectivity:** USB-CAN communication (simulated or actual implementation via Node.js serialport/usb).

## Design & UI Guidelines
**CRITICAL:** All new features, UI updates, and frontend implementations **MUST** reference the design drafts and assets located in the `UI` folder.

- **Location:** `d:\OurWork\ecu-x-client\UI`
- **Requirement:** Before writing code for any visual component, check the `UI` folder for relevant screenshots, mockups, or design assets. Ensure your implementation matches the visual style (Dark Mode, Industrial/Automotive aesthetic), layout, and color palette defined there.

## Project Structure
- **Root:**
    - `electron/`: Electron main process (`main.js`).
    - `UI/`: Design assets and reference images.
- **Source (`src/`):**
    - `components/`: Reusable UI components (Gauges, MapTables, VerticalBars).
    - `App.tsx`: Main application layout and state management.
    - `types.ts`: TypeScript interfaces for Engine State and Maps.

## Workflow
1.  **Check Designs:** Look in `UI/` for context.
2.  **Plan:** Identify necessary components and state changes.
3.  **Implement:** Write clean, typed React code (TypeScript).
4.  **Verify:** Ensure the result matches the design intent.

## Coding Guidelines
- **Comments:** All code comments must be written in **Simplified Chinese**.

## Internationalization (i18n)
The application supports 9 languages: Simplified Chinese, Traditional Chinese, English, Japanese, Thai, Korean, Russian, German, and French.

- **Translation Files:** Located in `src/i18n/locales/` (zh-CN.ts, zh-TW.ts, en.ts, ja.ts, th.ts, ko.ts, ru.ts, de.ts, fr.ts)
- **Context Provider:** `src/i18n/I18nContext.tsx` provides the `useI18n()` hook
- **Usage:** Import `useI18n()` in components, use `t.category.key` to access translations
- **Language Selector:** Available in the title bar (Globe icon with dropdown menu)
- **Storage:** Language preference is saved to localStorage as 'ecu-language'

When adding new UI text, **always add it to all 9 translation files** to maintain consistency.

## Todo Workflow
- The user may provide a `todo.md` file in the `todo/` directory with multiple tasks (images and text).
- You should process tasks from `todo/todo.md` one by one or in small batches.
- If a task is large, break it down into smaller, manageable sub-tasks.
- After completing a task (or sub-task), remove ONLY that specific part from `todo/todo.md`. Do NOT delete the entire file unless all tasks are completed.
- Update `todo/finished.md` with the completed tasks and a timestamp.
- You can automatically request to continue if appropriate.
- If the request limit is reached or you cannot continue, ask the user to re-initiate with "Please complete TODO".
- Always check `agents.md` for these rules.

### Image Handling Protocol
- **When encountering image tasks in todo.md**:
  1. First, attempt to view/analyze the image files directly
  2. If you cannot see or interpret the images properly, PAUSE the task
  3. List the image file paths required (max 4 images per request)
  4. Ask the user to send/paste the images in the chat
  5. Wait for user to provide the images before continuing
- **Example Output when images are not visible**: "我无法查看以下图片，请将它们发送给我：\n- `d:\OurWork\ecu-x-client\todo\image-4.png`\n- `d:\OurWork\ecu-x-client\todo\image-5.png`\n\n请将这些图片粘贴到对话中，我再继续执行任务。"

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

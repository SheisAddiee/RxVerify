# RxVerify

**Your Personal AI Pharmacist**

RxVerify is a mobile health application designed to help patients identify medications, verify their authenticity, and check for potential adverse interactions using AI and OCR technology.

## Features

*   **AI Visual Scanning:** Capture an image of a medicine package to extract text (OCR).
*   **Instant Verification:** Cross-reference scanned text against a trusted local dataset to verify legitimacy.
*   **Safety Checks:** View simplified usage instructions and warnings (e.g., drug interactions).
*   **Scan History:** Keep a log of all verified medications.
*   **Local Database:** Works offline using a local JSON dataset.

## Technologies

*   **Frontend:** React Native (Expo SDK)
*   **Navigation:** Expo Router
*   **Camera:** Expo Camera
*   **Storage:** AsyncStorage

## How to Run

Follow these steps to set up and run the application.

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and npm installed.

### 2. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

### 3. Run the App

You can run the application on various platforms:

**Web (Recommended for quick testing):**
```bash
npm run web
```
This will start the app in your default web browser.

**Android:**
```bash
npm run android
```
*Requires an Android Emulator or a connected Android device.*

**iOS (macOS only):**
```bash
npm run ios
```
*Requires the iOS Simulator.*

**Physical Device (Expo Go):**
1.  Run `npx expo start`.
2.  Install the **Expo Go** app on your phone (Android or iOS).
3.  Scan the QR code displayed in your terminal using the Expo Go app (Android) or Camera app (iOS).

## Usage Guide

1.  **Home:** You will see the dashboard. Click "Scan Medicine".
2.  **Scanner:** Grant camera permissions if asked. Point the camera at a medication package and tap the capture button.
    *   *Note: In this demo version, the OCR is simulated. Taking a picture will simulate processing and return a result from the mock database.*
3.  **Result:** View the verification status (Safe/Risk), usage instructions, and warnings.
4.  **History:** Go back to the Home screen and select the "History" tab to view your past scans.

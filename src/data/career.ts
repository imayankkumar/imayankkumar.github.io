/**
 * Career facts shared by the About, Projects and Resume pages.
 *
 * Only public-safe material goes here: no customer names, internal
 * product internals, ticket IDs or internal effort metrics.
 */

export const contact = {
  email: "bymayankkumar@gmail.com",
}

export const patent = {
  number: "US 12,592,977",
  title:
    "Systems and Methods for Providing Push-to-Talk Session Participants Control of a Push-to-Talk Session",
  role: "Co-inventor",
  filed: "Jun 26, 2024",
  granted: "Mar 31, 2026",
  href: "https://patents.google.com/patent/US12592977",
}

export const framePulse = {
  name: "FramePulse",
  href: "https://github.com/imayankkumar/FramePulse",
  status: "Early alpha · built in public",
  summary:
    "A Kotlin-first Android library for frame pacing and jank analysis, built on Choreographer. I'm writing every component from scratch and documenting the design decisions as I go, so it doubles as a reference on how Android rendering works.",
  points: [
    "Choreographer-based frame source with explicit main-thread and lifecycle rules",
    "Written design docs on frame timing and Looper / MessageQueue internals",
    "Public API designed before the logic: api/ vs internal/, immutable metrics, one-shot sessions",
  ],
  tags: ["Kotlin", "Choreographer", "Rendering", "Open source"],
}

export interface Role {
  title: string
  period: string
}

export interface Job {
  company: string
  location: string
  roles: Role[]
  points: string[]
}

export const experience: Job[] = [
  {
    company: "Zebra Technologies",
    location: "Bengaluru, India",
    roles: [
      { title: "Senior Software Engineer I", period: "2025 – Present" },
      { title: "Software Engineer II", period: "2023 – 2025" },
    ],
    points: [
      "Own messaging and notification features on the Android client of an enterprise push-to-talk and messaging app, and act as subject matter expert for its iOS client.",
      "Built urgent-message notifications that keep alerting through Doze, process death and offline periods, with WorkManager re-scheduling until the message is acknowledged.",
      "Added support for very large groups (250+ users) through a REST + Room data source that runs alongside the voice SDK's own group model.",
      "Put a server-controlled messaging policy behind a single runtime gate, so turning texting off applies consistently across UI, notifications, intents and background paths without affecting push-to-talk.",
      "Designed AI-assisted workflows for Android target SDK and third-party SDK upgrades: inventory, migration planning, code changes and build verification.",
      "Took ownership of the iOS client for a period, including its iOS 15 → 16 upgrade. Code reviews and mentoring junior engineers.",
    ],
  },
  {
    company: "Tata Elxsi",
    location: "Bengaluru, India",
    roles: [
      { title: "Senior Engineer", period: "2019 – 2023" },
      { title: "Engineer", period: "2017 – 2019" },
    ],
    points: [
      "Led the first-time installation app for an Android TV hybrid set-top box (OSN): remote pairing, satellite scanning, onboarding and silent login. Supported the MVP release onsite in Dubai.",
      "Built Zebra's Device Diagnostic Tool: hardware tests for scanner, buttons, touch screen, Bluetooth, Wi-Fi, WWAN, audio and SD card, plus managed configuration and SQLite persistence.",
      "Started in test automation on Zebra enterprise devices (Android and Windows): scanning, RFID, NFC and MDM, with Robot Framework.",
    ],
  },
]

export const awards = [
  { name: "Customer Appreciation Award", org: "Tata Elxsi", year: "2021" },
  { name: "Bravo Award", org: "Tata Elxsi", year: "2019" },
]

export const education = {
  school: "Lovely Professional University",
  degree: "B.Tech, Computer Science and Engineering",
  period: "2013 – 2017",
}

export const skills = [
  { group: "Languages", items: ["Kotlin", "Java"] },
  {
    group: "Android",
    items: [
      "Android SDK",
      "WorkManager",
      "Room",
      "Paging 3",
      "Jetpack Navigation",
      "Dagger 2",
      "Services & broadcast receivers",
      "Notifications",
    ],
  },
  {
    group: "Architecture",
    items: ["Clean Architecture", "MVVM", "Modular architecture"],
  },
  {
    group: "Concurrency & networking",
    items: ["Coroutines", "Flow", "Retrofit", "REST"],
  },
  {
    group: "Performance & quality",
    items: [
      "Rendering performance",
      "Choreographer",
      "Memory",
      "JUnit",
      "SonarQube",
      "MobSF",
    ],
  },
  {
    group: "Tools & AI",
    items: [
      "Claude Code",
      "Cursor",
      "GitHub Copilot",
      "Android Studio",
      "Gradle",
      "Git",
    ],
  },
]

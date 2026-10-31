/**
 * The Android roadmap hub (/roadmap/).
 *
 * Each stage lists its planned topics in learning order. A post joins the
 * roadmap by naming its topic in frontmatter:
 *
 *   roadmap:
 *     topic: null-safety
 *
 * The hub then ticks and links that topic, and the post shows its stage.
 */

export interface RoadmapTopic {
  id: string
  title: string
}

export interface RoadmapStage {
  number: number
  title: string
  /** The "You're done when..." check, from the roadmap post. */
  doneWhen: string
  /** Heading id of this stage in the roadmap post. */
  anchor: string
  topics: RoadmapTopic[]
}

export const roadmapPostSlug = "android-developer-roadmap-2027"

export const roadmapStages: RoadmapStage[] = [
  {
    number: 1,
    title: "Kotlin and DSA basics",
    doneWhen: "you can build and test a small Kotlin project and explain your choices.",
    anchor: "stage-1-kotlin-and-dsa-basics",
    topics: [
      { id: "null-safety", title: "Null safety" },
      { id: "any-unit-nothing", title: "Any, Unit and Nothing" },
      { id: "data-classes", title: "Data class vs regular class" },
      { id: "sealed-vs-enum", title: "Sealed class vs enum" },
      { id: "value-classes", title: "Value classes" },
      { id: "objects-and-nested-classes", title: "object, companion object and inner classes" },
      { id: "properties", title: "val, var and backing properties" },
      { id: "lazy-vs-lateinit", title: "lazy vs lateinit" },
      { id: "higher-order-functions", title: "Higher-order functions and lambdas" },
      { id: "inline-and-reified", title: "inline and reified" },
      { id: "extensions-and-scope-functions", title: "Extension and scope functions" },
      { id: "collections-vs-sequences", title: "Collections vs Sequences" },
      { id: "dsa-in-kotlin", title: "DSA in Kotlin: 12 patterns" },
    ],
  },
  {
    number: 2,
    title: "The Android platform",
    doneWhen: "you can say what happens when the OS kills your app, and prove state comes back.",
    anchor: "stage-2-the-android-platform",
    topics: [
      { id: "app-components", title: "App components" },
      { id: "lifecycle", title: "Lifecycle" },
      { id: "process-death", title: "Process death and saved state" },
      { id: "window-insets", title: "Edge-to-edge and insets" },
      { id: "permissions", title: "Runtime permissions" },
      { id: "background-limits", title: "Background limits and WorkManager" },
    ],
  },
  {
    number: 3,
    title: "Coroutines and Flow",
    doneWhen: "you can handle cancel, failure and two requests at once without bugs.",
    anchor: "stage-3-coroutines-and-flow",
    topics: [
      { id: "structured-concurrency", title: "Structured concurrency" },
      { id: "cancellation", title: "Cancellation" },
      { id: "dispatchers", title: "Dispatchers and threads" },
      { id: "coroutine-exceptions", title: "Exceptions in coroutines" },
      { id: "cold-vs-hot-flows", title: "Cold vs hot flows" },
      { id: "stateflow-vs-sharedflow", title: "StateFlow vs SharedFlow" },
    ],
  },
  {
    number: 4,
    title: "Compose UI",
    doneWhen: "you can build a multi-screen app with loading, error, empty and data states.",
    anchor: "stage-4-compose-ui",
    topics: [
      { id: "compose-state", title: "State and recomposition" },
      { id: "compose-side-effects", title: "Side effects" },
      { id: "navigation-3", title: "Navigation 3" },
      { id: "adaptive-layouts", title: "Adaptive layouts" },
    ],
  },
  {
    number: 5,
    title: "Architecture",
    doneWhen: "you can defend every layer in a feature you designed.",
    anchor: "stage-5-architecture",
    topics: [
      { id: "ui-and-data-layers", title: "UI and data layers" },
      { id: "one-way-data-flow", title: "One-way data flow" },
      { id: "viewmodel-internals", title: "ViewModel internals" },
      { id: "dependency-injection", title: "Dependency injection" },
      { id: "modularization", title: "Modules" },
    ],
  },
  {
    number: 6,
    title: "Data and offline",
    doneWhen: "you can keep a feature useful when the network is slow or gone.",
    anchor: "stage-6-data-networking-and-offline",
    topics: [
      { id: "networking", title: "HTTP and networking" },
      { id: "room", title: "Room" },
      { id: "datastore", title: "DataStore" },
      { id: "caching", title: "Caching" },
      { id: "offline-sync", title: "Offline-first sync" },
      { id: "database-migrations", title: "Database migrations" },
    ],
  },
  {
    number: 7,
    title: "Testing",
    doneWhen: "you can catch a real regression automatically.",
    anchor: "stage-7-testing-and-code-quality",
    topics: [
      { id: "fakes-vs-mocks", title: "Fakes vs mocks" },
      { id: "testing-viewmodels-and-flows", title: "Testing ViewModels and Flows" },
      { id: "compose-ui-tests", title: "Compose UI tests" },
      { id: "android-ci", title: "CI for Android" },
    ],
  },
  {
    number: 8,
    title: "Production",
    doneWhen: "you can reproduce a problem, fix it, and show before and after numbers.",
    anchor: "stage-8-production-engineering",
    topics: [
      { id: "profiling", title: "Profiling" },
      { id: "jank", title: "Jank" },
      { id: "anrs", title: "ANRs" },
      { id: "baseline-profiles", title: "Baseline Profiles" },
      { id: "r8", title: "R8" },
      { id: "app-security", title: "App security" },
      { id: "releases", title: "Releases" },
    ],
  },
  {
    number: 9,
    title: "System design",
    doneWhen: "you can design an app and defend it against two alternatives.",
    anchor: "stage-9-system-design-and-senior-skills",
    topics: [
      { id: "mobile-system-design", title: "Mobile system design" },
      { id: "sync-and-failure", title: "Sync and failure handling" },
      { id: "android-internals", title: "Android internals" },
    ],
  },
]

/** Finds a topic and its stage by id. */
export function findRoadmapTopic(id: string) {
  for (const stage of roadmapStages) {
    const index = stage.topics.findIndex((t) => t.id === id)
    if (index >= 0) return { stage, topic: stage.topics[index], index }
  }
  return undefined
}

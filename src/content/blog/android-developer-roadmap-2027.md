---
title: "Android Developer Roadmap 2027: What to Learn, What Interviews Ask, and Where AI Fits"
seoTitle: "Android Developer Roadmap 2027: Skills, Interviews and AI"
description: "A complete Android roadmap for 2027: nine stages in learning order, what to know in each, common interview questions, what changed in 2026, and where AI fits."
pubDate: 2026-10-30
tags: ["android", "kotlin", "roadmap", "interviews", "ai"]
ogImage: "/og/android-developer-roadmap-2027.jpg"
ogImageAlt: "Android Developer Roadmap 2027: nine stages in learning order, plus AI at every stage."
cover: "../../assets/blog/android-roadmap-2027.png"
coverAlt: "Android Developer Roadmap 2027 diagram: nine stages in three rows, with two AI tracks under them."
---

If you are an Android developer right now, you are probably asking three questions:

1. **What should I learn next?**
2. **Does any of it still matter, now that AI writes code?**
3. **What will interviews actually ask me?**

The last year did not make this easier. In May 2026, Google said [Android UI is now Compose-first](https://android-developers.googleblog.com/2026/05/android-ui-development-is-compose-first.html) and moved the View components that Compose replaces into maintenance mode: critical bug fixes only, no new features, but no plan to remove them. The same day, [Android CLI 1.0](https://android-developers.googleblog.com/2026/05/android-cli-stable-1-0-agent-development.html) went stable so AI agents can build and run Android apps. And Google was reported to be [piloting coding interviews where candidates use Gemini](https://careers.northeastern.edu/blog/2026/05/13/googles-ai-assisted-coding-interview-2026-guide/).

This post answers all three questions. It is a complete roadmap for 2027: what to learn, in what order, how deep to go, what interviewers ask at each stage, and where AI fits.

**Short answer:** Learn Kotlin and the Android platform first, then coroutines, Compose and architecture, then data, testing, production and system design. Use AI at every stage, but only as fast as you can check what it gives you. Interviews test the same things, plus coding problems and design.

I built this from the official [Android Developers](https://developer.android.com/) and [Kotlin](https://kotlinlang.org/docs/) documentation, recent interview write-ups that developers posted publicly, and what I have seen in production Android work. It is my own roadmap, not one published by Google or JetBrains.

**Contents**

- [What changed going into 2027](#what-changed-for-android-developers-going-into-2027)
- [How to approach 2027](#how-should-you-approach-2027)
- [The roadmap at a glance](#the-roadmap-at-a-glance)
- [The nine stages](#the-nine-stages) (each with must know, go deeper, where to start, interview questions and a self-check)
- [Where AI fits](#where-does-ai-fit-in-an-android-roadmap)
- [What Android interviews look like now](#what-do-android-interviews-look-like-now)
- [What to learn later](#what-can-you-learn-later), and [where to start](#where-should-you-start-based-on-your-experience)
- [One project](#should-you-build-many-small-apps-or-one-real-project) and [a sample 6-month plan](#how-long-does-this-take-a-sample-6-month-plan)
- [FAQ](#frequently-asked-questions)

## What changed for Android developers going into 2027?

A roadmap is only useful if it matches the platform you will ship on. These changes from the last year affect what you should learn, newest first.

| When | What changed | What it means for your learning |
| --- | --- | --- |
| Feb 1, 2027 | Play blocks app updates that [don't support 16 KB memory pages](https://developer.android.com/guide/practices/page-sizes) (apps targeting Android 15+) | Know how native libraries and your build affect this, even if you never write C++ |
| 2027 | [Developer verification](https://support.google.com/android-developer-console/answer/16561738) expands to all apps on certified Android devices | Even apps shipped outside Play will need a verified developer |
| Aug 31, 2026 | New apps and updates must [target Android 16 (API 36)](https://developer.android.com/google/play/requirements/target-sdk) | You must know API 36 behavior changes, not just the APIs |
| Jul 2026 | Google says [more than 68% of the top 1,000 apps](https://android-developers.googleblog.com/2026/07/five-years-of-jetpack-compose.html) use Compose in production | Compose is the default skill employers expect |
| May 19, 2026 | [Compose-first](https://android-developers.googleblog.com/2026/05/android-ui-development-is-compose-first.html): Views get critical bug fixes only, no new features | Learn Compose first; learn Views to maintain old code |
| May 19, 2026 | [Android CLI 1.0](https://android-developers.googleblog.com/2026/05/android-cli-stable-1-0-agent-development.html) and Android skills for AI agents | Agents can build and run Android apps; your job shifts toward checking their work |

None of this replaces the basics. Most of it rewards people who already understand lifecycle, state and the build.

## How should you approach 2027?

Before the topic lists, five rules. They matter more than any single library.

1. **Fundamentals before tools.** Libraries change every year. Lifecycle, state, threading and data flow have not changed much in a decade. Learn the things that will still be true in 2030.
2. **One project, not ten tutorials.** Build one app and improve it at every stage. You learn more from fixing your own design than from finishing someone else's.
3. **Use AI, but check it.** Let AI write, explain and suggest. Then prove it right with a test, a profiler or the docs. If you can't check it, you are not ready to ship it.
4. **Go deep in one area.** Be solid across all nine stages, then pick one to become known for: performance, architecture, testing, AI features or Kotlin Multiplatform (KMP). Depth is what makes a senior engineer.
5. **Show your work.** A GitHub repo, a short write-up or a talk proves more than a certificate. It also gives you real stories for interviews.

## The roadmap at a glance

Each stage depends on the one before it. Compose makes little sense until you understand state. State makes little sense until you understand lifecycle and process death. Skip a stage and you can still ship features, but you end up debugging by guessing. AI makes that worse, because it gives you more code to guess about.

<picture>
  <source media="(max-width: 640px)" type="image/webp" srcset="/blog/android-developer-roadmap-2027/android-roadmap-2027-mobile.webp" width="960" height="2509" />
  <source media="(max-width: 640px)" srcset="/blog/android-developer-roadmap-2027/android-roadmap-2027-mobile.png" width="960" height="2509" />
  <source type="image/webp" srcset="/blog/android-developer-roadmap-2027/android-roadmap-2027.webp" width="1600" height="780" />
  <img src="/blog/android-developer-roadmap-2027/android-roadmap-2027.png" width="1600" height="780" loading="lazy" decoding="async" alt="Android Developer Roadmap 2027 diagram: nine stages in learning order. Foundations: 1 Kotlin and DSA basics, 2 Android platform, 3 Coroutines and Flow. Building apps: 4 Compose UI, 5 Architecture, 6 Data and offline. Shipping at quality: 7 Testing, 8 Production, 9 System design. Each stage has a done-when check. Two AI tracks run under all stages: use AI to work faster, and build AI features. A side box lists what to learn when needed: Kotlin and Compose Multiplatform, Views, Fragments and RxJava, specialized APIs, and Wear OS, TV, Auto and XR." />
</picture>

<div class="stage-table">

| Stage | What it covers | You are done when you can... |
| --- | --- | --- |
| <span class="stage-table__num">1</span> **Kotlin and DSA basics** | Language, collections, generics, OOP, DSA, Git, Gradle | Build and test a small Kotlin project and explain your choices |
| <span class="stage-table__num">2</span> **Android platform** | Components, lifecycle, process death, insets, permissions, background limits | Say what happens when the OS kills your app, and prove state comes back |
| <span class="stage-table__num">3</span> **Coroutines and Flow** | Structured concurrency, cancellation, dispatchers, StateFlow | Handle cancel, failure and two requests at once without bugs |
| <span class="stage-table__num">4</span> **Compose UI** | State, recomposition, side effects, Navigation 3, adaptive layouts | Build a multi-screen app with loading, error, empty and data states |
| <span class="stage-table__num">5</span> **Architecture** | UI and data layers, one-way data flow, ViewModel, dependency injection, modules | Defend every layer in a feature you designed |
| <span class="stage-table__num">6</span> **Data and offline** | HTTP, Room, DataStore, caching, sync, database migrations | Keep a feature useful when the network is slow or gone |
| <span class="stage-table__num">7</span> **Testing** | Fakes, ViewModel and Flow tests, Compose UI tests, CI | Catch a real regression automatically |
| <span class="stage-table__num">8</span> **Production** | Profiling, jank, ANRs, Baseline Profiles, R8, security, releases | Reproduce a problem, fix it, and show before and after numbers |
| <span class="stage-table__num">9</span> **System design** | Mobile design, sync, failure handling, internals | Design an app and defend it against two alternatives |

</div>

If you already work as an Android developer, do not start at stage 1 by default. Use the last column as a test, and start at the first stage you cannot pass.

## The nine stages

Every stage has the same parts: why it matters, what you must know, what to learn when you want to go deeper, where to start, the interview questions it prepares you for, and one exercise to test yourself.

### Stage 1: Kotlin and DSA basics

Kotlin is the language of Android. Knowing the syntax is easy. Knowing what the language does for you, and what it does not, takes longer. This stage also covers DSA (data structures and algorithms), which most Android interviews still test in a coding round.

**Must know**

- Types: `val` and `var`, type inference, null safety (`?.`, `?:`, `!!`, `let`), smart casts
- Functions: default and named arguments, extension and infix functions, lambdas, higher-order functions, `inline` and `reified`
- Classes: data, sealed, enum, object, companion object, value classes, interfaces, visibility
- Generics: variance (`in`, `out`), star projections (`*`) and why they exist
- Collections: read-only vs mutable, sequences, `map`, `filter`, `fold`, `groupBy`
- Equality: `==` vs `===`, `equals` and `hashCode`
- Idioms: scope functions, `by lazy`, class delegation, `lateinit`, exceptions
- Design: OOP, SOLID, and patterns you will meet on Android (builder, factory, observer, strategy, adapter, singleton)
- DSA basics: Big-O, arrays, strings, hash maps, linked lists, trees, graphs, recursion, basic dynamic programming
- Tools: Git, Gradle basics with the Kotlin DSL and version catalogs

<details>
<summary>Go deeper</summary>

- Kotlin and Java interop (`@JvmStatic`, `@JvmOverloads`, platform types)
- Reading the bytecode Kotlin generates
- DSL builders, contracts, context parameters
- Annotation processing with KSP

</details>

**Where to start:** the [Kotlin docs](https://kotlinlang.org/docs/), then [what's new in Kotlin 2.4](https://kotlinlang.org/docs/whatsnew24.html) to see where the language is going.

**Interview questions**

- `lateinit` vs `by lazy`: when would you use each?
- What does an extension function compile to? Can it access private members?
- Why can a `List<String>` be passed where a `List<Any>` is expected, but a `MutableList<String>` cannot?
- (Senior) What does `inline` change at the call site, and why does `reified` need it?
- (Senior) How does `by lazy` handle threads by default, and when would you change that?

**Try this:** Write a sealed `UiState` with four states and a `when` that handles them. Add a fifth state. Notice what the compiler does, and explain why that is the point of sealed types.

### Stage 2: The Android platform

This is the stage people skip, and it is where many production bugs live. The platform also keeps changing under you. Apps that target Android 16 [can no longer opt out of edge-to-edge](https://developer.android.com/about/versions/16/behavior-changes-16), get predictive back by default, and have orientation and resize limits ignored on large screens. Apps that target Android 17 [lose the large-screen opt-out](https://developer.android.com/about/versions/17/behavior-changes-17) and need a new permission for local network access.

**Must know**

- App components: Activity, Service, BroadcastReceiver, ContentProvider
- Intents: explicit and implicit, intent filters, `PendingIntent`, deep links and App Links
- Lifecycles: Activity, Fragment (for existing code) and process lifecycle, process priority
- Configuration changes and process death: `SavedStateHandle`, `rememberSaveable`, what to save and what to reload
- Tasks, back stack and launch modes
- Context types and when each is safe to hold
- Resources, qualifiers and the manifest
- Permissions: runtime and special permissions, the photo picker, scoped storage
- Notifications and channels; foreground services and their types
- Background limits: Doze, App Standby, what can run when
- Windows: edge-to-edge, insets (space taken by system bars, the keyboard and cutouts), predictive back, large screens and foldables
- The main thread, Looper and Handler

<details>
<summary>Go deeper</summary>

- Binder and inter-process communication
- Zygote and how an app process starts
- App Startup library, multi-window, App Bundles and feature delivery
- Reading every Android version's "behavior changes" page as a habit

</details>

**Where to start:** the [Activity lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle) and [saving UI state](https://developer.android.com/topic/libraries/architecture/saving-states) guides.

**Interview questions**

- Walk me through the Activity lifecycle when the user rotates the screen, then presses Home.
- How does a ViewModel survive a configuration change? Does it survive process death?
- `singleTop` vs `singleTask`: when would you use each?
- Started vs bound service, and when must a service run in the foreground?
- (Senior) How would you find the process-death bugs your app has today?

**Try this:** Open your app, fill a form, press Home, then run `adb shell am kill <your.package>`. Open it again from Recents. Did the form come back?

### Stage 3: Coroutines and Flow

Many Android bugs that "happen sometimes" are concurrency bugs. This is also where AI-written code most often looks correct while being wrong.

**Must know**

- Suspend functions; `launch`, `async`, `runBlocking`
- Scopes: `CoroutineScope`, `viewModelScope`, `lifecycleScope`
- Structured concurrency: Job, parent and child, why a scope waits for its children
- Dispatchers and `withContext`; never blocking the main thread
- Cancellation: it is cooperative; `isActive`, `ensureActive`, rethrowing `CancellationException`
- Exceptions: propagation, `CoroutineExceptionHandler`, `SupervisorJob`, `supervisorScope`, timeouts
- Flow: cold streams, operators (`map`, `combine`, `flatMapLatest`, `debounce`), `catch`
- StateFlow and SharedFlow, `stateIn` and `shareIn`, `WhileSubscribed`
- Collecting safely: `repeatOnLifecycle`, `collectAsStateWithLifecycle`
- Bridging callbacks with `callbackFlow`; protecting shared state with `Mutex`
- WorkManager for work that must finish even if the app closes
- Testing with `runTest` and test dispatchers

<details>
<summary>Go deeper</summary>

- Continuations and the state machine the compiler generates
- Channels and `select`
- `flowOn`, `buffer`, `conflate` and backpressure (when a producer is faster than its collector)
- Threads, thread pools and Java memory model basics
- RxJava interop for older code

</details>

**Where to start:** the [Kotlin coroutines guide](https://kotlinlang.org/docs/coroutines-guide.html), then Android's [coroutines best practices](https://developer.android.com/kotlin/coroutines/coroutines-best-practices).

**Interview questions**

- `launch` vs `async`?
- StateFlow vs SharedFlow: when would you use each?
- What happens to the other children when one child coroutine fails? How does `supervisorScope` change that?
- Where should you make an API call in a ViewModel, and on which dispatcher?
- (Senior) Why is catching `CancellationException` dangerous? (See the snippet in the AI section.)
- (Senior) How does Flow handle a fast producer and a slow collector?

**Try this:** Start two requests with `async` inside `coroutineScope`, and make one fail. What happens to the other? Switch to `supervisorScope` and explain the difference.

### Stage 4: Compose UI

Google now says [all Android UI should be built with Compose](https://android-developers.googleblog.com/2026/05/android-ui-development-is-compose-first.html). Views still work and get critical fixes, but no new features. The goal of this stage is not to make screens. It is to predict when a screen recomposes and why.

**Must know**

- Composable functions, Row, Column, Box, and why modifier order matters
- Material 3 and theming
- State: `remember`, `mutableStateOf`, `rememberSaveable`
- State hoisting and one-way data flow (UDF): state flows down to the UI, events flow up
- Recomposition, skipping and stability
- Side effects: `LaunchedEffect`, `DisposableEffect`, `rememberCoroutineScope`, `derivedStateOf`, `snapshotFlow`
- Lazy lists and why keys matter
- [Navigation 3](https://android-developers.googleblog.com/2025/11/jetpack-navigation-3-is-stable.html)
- Forms, text input and image loading
- Previews and CompositionLocal
- Semantics and accessibility
- Window size classes and adaptive layouts for phones, foldables and tablets
- Basic animation

<details>
<summary>Go deeper</summary>

- The three phases: composition, layout and draw
- Custom layouts, `Modifier.Node` and Canvas drawing
- The snapshot system and the slot table (where Compose keeps state between recompositions)
- Compose compiler stability reports
- View interop for existing apps, Glance for widgets

</details>

**Where to start:** [Thinking in Compose](https://developer.android.com/develop/ui/compose/mental-model), then the [Compose performance guide](https://developer.android.com/develop/ui/compose/performance).

**Interview questions**

- What triggers recomposition?
- `remember` vs `rememberSaveable`?
- When would you use `LaunchedEffect`, and what happens when its key changes?
- What makes a class stable, and why does it matter?
- (Senior) A list janks while scrolling. How do you find out why?
- (Senior) How does Compose remember state between recompositions? (the slot table)

**Try this:** Turn on recomposition counts in Layout Inspector and scroll a list. Find one composable that recomposes more than it should, and fix it.

### Stage 5: Architecture

Google's [architecture recommendations](https://developer.android.com/topic/architecture/recommendations) are a good baseline. They strongly recommend a data layer with repositories, one-way data flow (UDF) and dependency injection. They recommend a domain layer only when business logic is reused across ViewModels or a ViewModel gets too complex. Architecture should solve a problem you have. A small app does not need every layer.

**Must know**

- Layers: UI, data, and an optional domain layer
- ViewModel: what it owns, what it must never hold (a Context or a View)
- UI state: one `uiState` as a `StateFlow`, modeled with data and sealed classes
- One-time events such as navigation or a snackbar
- Repositories, data sources and a single source of truth
- MVVM vs MVI-style state handling
- Dependency injection: constructor injection first, Hilt modules, scopes and `@HiltViewModel`
- Mapping models between layers; modeling errors
- SOLID applied to Android code

<details>
<summary>Go deeper</summary>

- [Modularization](https://developer.android.com/topic/modularization): feature and core modules, api and impl modules
- Gradle convention plugins
- Clean Architecture and its trade-offs
- Other DI options and when manual DI is enough
- Google's Now in Android sample app as a reference

</details>

**Where to start:** the [guide to app architecture](https://developer.android.com/topic/architecture) and the [recommendations page](https://developer.android.com/topic/architecture/recommendations).

**Interview questions**

- Why expose `StateFlow` and not `MutableStateFlow`?
- MVVM vs MVI: what problem does each solve?
- How does Hilt know how to build a ViewModel?
- When does a domain layer earn its place?
- (Senior) How would you split a large app into modules, and how do you stop modules from depending on each other badly?
- (Senior) Design the architecture for an SDK that other apps will embed.

**Try this:** Take a ViewModel that calls Retrofit directly. Move the call into a repository, write a fake repository, and test the ViewModel without the network.

### Stage 6: Data, networking and offline

Real apps are mostly about data that is late, missing or out of date. The interesting problems start when the network fails.

**Must know**

- HTTP, REST, status codes and API contracts
- JSON with kotlinx.serialization or Moshi
- Retrofit; OkHttp interceptors, timeouts and caching
- Room: entities, DAOs, Flow queries, relations, transactions, and database migrations (changing the schema without losing user data)
- DataStore (and SharedPreferences in older code)
- [Offline-first](https://developer.android.com/topic/architecture/data-layer/offline-first): the local database as the source of truth
- Paging 3
- WorkManager for sync
- Errors, retries, backoff and timeouts
- Auth tokens and safe token refresh
- Image loading and caching

<details>
<summary>Go deeper</summary>

- WebSockets and push with FCM
- GraphQL and the Ktor client
- SQL indexes and query performance
- Conflict resolution for data edited on two devices
- Encrypting data at rest

</details>

**Where to start:** the [data layer guide](https://developer.android.com/topic/architecture/data-layer) and the [offline-first guide](https://developer.android.com/topic/architecture/data-layer/offline-first).

**Interview questions**

- What does your app show when it is offline?
- How do you write a Room migration safely?
- Five requests fail at once because the token expired. How do you refresh it only once?
- How would you build instant search without sending a request on every key press?
- (Senior) Design sync for an app that is used offline for days.

**Try this:** Make a list screen read only from Room and refresh from the network in the background. Turn on airplane mode. Does the screen still make sense?

### Stage 7: Testing and code quality

A feature that worked once on your phone is not done. Google's guidance is to [prefer fakes to mocks](https://developer.android.com/topic/architecture/recommendations) and to test ViewModels, the data layer, navigation and performance. The skill is choosing what to test, not writing more tests.

**Must know**

- Local tests vs instrumented tests, and when each is worth it
- JUnit and clear assertions
- Fakes vs mocks
- ViewModel and repository tests
- Coroutine tests: `runTest`, test dispatchers, replacing `Dispatchers.Main`
- Flow tests
- Room tests with an in-memory database
- [Compose UI tests](https://developer.android.com/develop/ui/compose/testing) with semantics; Espresso for View code
- Lint and static analysis
- CI that runs tests on every pull request

<details>
<summary>Go deeper</summary>

- Screenshot tests
- Robolectric
- Coverage tools, and why coverage is not the goal
- Gradle Managed Devices and device farms
- Finding and fixing flaky tests

</details>

**Where to start:** [Android testing fundamentals](https://developer.android.com/training/testing).

**Interview questions**

- Fake or mock: which do you prefer, and why?
- How do you test a ViewModel that uses `viewModelScope`?
- What would you test first in a new feature?
- (Senior) Your UI tests are flaky in CI. What do you check first?

**Try this:** Break a feature on purpose, for example by swapping two lines in a mapper. Does any test fail? If not, write the one that would.

### Stage 8: Production engineering

Shipping is a separate skill from building. In 2027 it also includes rules that did not exist a few years ago: [16 KB page support](https://developer.android.com/guide/practices/page-sizes), [yearly target API deadlines](https://developer.android.com/google/play/requirements/target-sdk) and [developer verification](https://support.google.com/android-developer-console/answer/16561738).

**Must know**

- Debugging: Logcat, breakpoints, Layout Inspector, Database and Network Inspector
- Memory: profiler, heap dumps, leaks, LeakCanary
- [ANRs](https://developer.android.com/topic/performance/vitals/anr): causes and how to read the traces
- Rendering: jank, frame timing, JankStats
- Startup: cold, warm and hot start
- [Baseline Profiles](https://developer.android.com/topic/performance/baselineprofiles/overview) and Macrobenchmark
- R8, keep rules and app size
- Security: Keystore, network security config, Play Integrity, not shipping secrets in the APK
- Release: signing, App Bundles, Play testing tracks, staged rollouts, in-app updates
- Monitoring: crash reporting (for example Firebase Crashlytics), Remote Config and Android vitals
- Platform rules: target SDK upgrades, 16 KB pages, developer verification

<details>
<summary>Go deeper</summary>

- Perfetto and custom trace sections; logging and network inspection tools such as Timber and Chucker
- Native crashes
- Gradle build speed and the configuration cache
- Feature flags and safe rollouts
- Privacy reviews and the Play Data safety form

</details>

**Where to start:** the [performance overview](https://developer.android.com/topic/performance/overview).

This is the area I care most about, because "the app feels slow" is not a bug report you can fix. You need numbers first.

**Interview questions**

- What causes an ANR, and how do you debug one from production?
- How do you find a memory leak?
- How do Baseline Profiles make startup faster?
- (Senior) A release raises the crash rate. Walk me through the next hour.
- (Senior) How would you cut cold start time in half, and how would you prove it?

**Try this:** Measure cold start with Macrobenchmark. Add a Baseline Profile. Measure again and write down both numbers.

### Stage 9: System design and senior skills

This is where you stop asking "how do I build this screen" and start asking "what breaks, and who owns it". System design is not boxes and arrows. It is requirements, data models, failure cases and trade-offs you can defend.

**Must know**

- Clarifying requirements: users, scale, offline needs, what matters most
- API design between the app and the backend
- Data models and caching strategy
- Offline sync and conflicts
- Pagination and image loading pipelines
- Real-time updates: WebSocket, FCM, polling, and their trade-offs
- Background sync, retries and failure handling
- Auth and security
- Logging, metrics and monitoring
- Module boundaries and team ownership

**Common design prompts**

Chat app, news or social feed, photo gallery, offline notes or to-do, cart with filters, map or ride tracking, video player, file upload, LRU cache, an SDK for other apps.

<details>
<summary>Go deeper</summary>

- Android internals: ART and garbage collection, Looper and MessageQueue, the rendering pipeline (Choreographer, RenderThread, vsync)
- Leading migrations across a large codebase
- Writing design docs and mentoring

</details>

**Where to start:** the [guide to app architecture](https://developer.android.com/topic/architecture) and the [modularization guide](https://developer.android.com/topic/modularization).

**Interview questions**

- Design a chat app that works offline.
- Design an image-heavy feed like Instagram's.
- Design an LRU cache.
- (Senior) Design an SDK that other teams will embed. What does its API look like, and how do you version it?
- (Senior) How do you roll out a risky change to millions of users safely?

**Try this:** Design an offline-first chat app on paper. Then list three ways it fails, such as messages sent twice, out of order, or lost on process death, and how your design handles each.

## Where does AI fit in an Android roadmap?

AI is not stage 10. It runs alongside every stage, in two different ways: using AI to do your work, and building AI into the apps you ship.

### Track A: Using AI as an Android engineer

Google now ships tools for this. [Android CLI 1.0](https://android-developers.googleblog.com/2026/05/android-cli-stable-1-0-agent-development.html) lets agents such as Gemini in Android Studio, Claude Code or Codex create, build and deploy Android apps. Android skills give agents Google's best practices for tasks like adaptive UI or testing setup.

**Must know**

- Giving the tool the right context and clear limits
- Working in small steps: plan, small change, review, test
- Reviewing AI code for lifecycle, threading, state and security bugs
- Checking that AI-written tests can fail, not only that they pass
- What code and data you are allowed to share with which tool
- Knowing when to stop prompting and read the docs or the source
- The basics of how agents and MCP servers connect tools to models

Here is the kind of code AI tools often write. It compiles, the happy path works, and the review looks clean:

```kotlin
// Almost right
fun loadProfile() = viewModelScope.launch {
    runCatching { repository.fetchProfile() }
        .onSuccess { _uiState.value = UiState.Data(it) }
        .onFailure {
            crashReporter.log(it)          // also logs normal cancellations
            _uiState.value = UiState.Error
        }
}

// Right
fun loadProfile() = viewModelScope.launch {
    try {
        _uiState.value = UiState.Data(repository.fetchProfile())
    } catch (e: CancellationException) {
        throw e                            // let cancellation finish
    } catch (e: IOException) {
        crashReporter.log(e)
        _uiState.value = UiState.Error
    }
}
```

`runCatching` catches every `Throwable`, including `CancellationException`. When the user leaves the screen and the coroutine is cancelled, the first version treats that as a failure. It logs an error that never happened and runs code after the coroutine should have stopped. The [Kotlin docs](https://kotlinlang.org/docs/coroutines-cancellation.html) say it directly: if you catch `CancellationException`, rethrow it.

You only spot this if you learned stage 3. That is why AI makes the fundamentals more valuable, not less.

### Track B: Building AI features into apps

Google's [guide to choosing an AI solution](https://developer.android.com/ai/overview) starts with one rule: use the simplest model and tooling that does the job.

| Option | Good for | Watch out for |
| --- | --- | --- |
| On-device ([Gemini Nano](https://developer.android.com/ai/gemini-nano), ML Kit GenAI APIs, Prompt API) | Privacy, offline use, no cost per request | Only some devices support it; best for short text tasks |
| Cloud (Firebase AI Logic, your own backend) | Larger models, image and video input, complex tasks | Network, latency, cost, user data leaving the device |
| Hybrid | On-device when the device supports it, cloud as fallback | Two code paths to build and test |

**Must know**

- Choosing on-device, cloud or hybrid for a feature
- Calling a model and streaming the answer into Compose state
- Structured output and parsing it safely
- Timeouts, retries, rate limits and errors
- Cost and latency budgets
- Keeping API keys off the device and user data safe
- Checking model output and handling wrong answers in the UI
- AI-friendly UX: showing progress, letting users correct the result
- [AppFunctions](https://android-developers.googleblog.com/2026/07/build-intelligent-android-apps-appfunctions.html), so on-device agents can use your app's features
- Classic ML Kit for vision and text tasks that don't need a large model

**Go deeper:** embeddings and retrieval, evaluating model output with test sets, building agents.

Every item on that list is a stage 3, 6, 7 or 8 skill with a model in the middle. AI features do not replace the roadmap. They test it.

**AI interview questions**

- Review this AI-written ViewModel and find the bugs.
- How do you check AI-generated code before you merge it?
- On-device or cloud for this feature, and why?
- How do you stop a model call from leaking user data or your API key?
- What is an MCP server, and how does it connect a tool to a model?

## What do Android interviews look like now?

Based on recent Android interview experiences that developers shared publicly in 2026, from SDE-1 to SDE-2, a few patterns stand out. They are personal stories, not a survey, but they point the same way:

1. **Coding problems still show up.** Most loops had a DSA round (sliding window, two pointers, hash maps). Some asked for a small coroutine task instead. Android experience does not let you skip them.
2. **The Android round goes deep, not wide.** ViewModel internals and keeping state across configuration changes came up again and again. So did coroutines. Interviewers ask "how does it work" and "what happens if", not "what is".
3. **Design starts early.** Even SDE-1 loops can have a design round. Topics included an image loading library, an analytics SDK, an infinite image grid and a shopping app.
4. **Some companies add a machine coding round.** You build a small working app live in 45 to 60 minutes, or as a take-home.
5. **AI has entered the interview.** It comes up as a topic (which tools you use, what MCP is, how you use AI at work). In May 2026, Google was also reported to be [piloting a round](https://careers.northeastern.edu/blog/2026/05/13/googles-ai-assisted-coding-interview-2026-guide/) where junior and mid-level candidates read, debug and improve existing code with Gemini.

**How to prepare for each round**

| Round | What they test | How to prepare |
| --- | --- | --- |
| Coding (DSA) | Problem solving under time pressure | A few medium problems every week from month one. Explain your approach out loud before you code. |
| Android and Kotlin deep dive | Stages 1 to 5 | Use the interview questions in each stage. Answer out loud, then check yourself against the docs. |
| Machine coding | Clean, working code fast | Practice building a list, detail and search app in 60 minutes. Have a project template you know well. |
| Mobile system design | Stages 6 to 9 | Practice the common prompts: requirements first, then data, API, caching, offline, failure cases. |
| AI-assisted coding (where offered) | Reading code, checking AI output | Practice fixing bugs in code you didn't write, with AI, while explaining every change you accept. |
| Hiring manager and behavioral | Ownership and judgment | Prepare four true stories: a hard bug, a disagreement, a mistake, something you led. |

What is asked depends on the company and the level. Do not count how many questions you memorized. Count how many answers you can explain, build and defend against "what if".

## What can you learn later?

A roadmap that makes everything look equally important does not help anyone. These are worth learning when your product, team or next role needs them.

- **Kotlin Multiplatform and Compose Multiplatform.** JetBrains made [Compose Multiplatform for iOS stable](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released) in May 2025, and KMP is a main focus on the [Kotlin roadmap](https://kotlinlang.org/docs/roadmap.html). It is a strong skill, but it builds on stages 1 to 7. Learn it after them, or when your team shares code.
- **XML Views, Fragments and RxJava.** Many production apps still use them, and interviews still ask about Fragment lifecycles. Learn enough to maintain and migrate them. For new code, Compose, coroutines and Flow come first.
- **Specialized APIs.** Bluetooth, camera, media, location, health, Wear OS, TV, Auto and XR. Learn them deeply when a product needs them. Everyone should still know the privacy and permission basics.

The rule is simple: fundamentals first, then go deep where the product takes you.

## Where should you start based on your experience?

- **New to Android (0 to 1 year).** Start at stage 1 and go in order. Google's [Android Basics with Compose](https://developer.android.com/courses/android-basics-compose/course) course covers the first stages well. Start coding problems early. Do not jump to AI features or KMP yet.
- **Working Android developer (1 to 4 years).** Test yourself with the "done when" column. Stages 2, 3 and 7 are the easiest to skip while still shipping features: process death, cancellation and tests that catch real bugs. Check those first, then add system design.
- **Senior (5+ years).** Stages 8 and 9 are your job now. Add both AI tracks, and make sure you can still answer the stage 2 and 3 interview questions without notes, because you are the one reviewing everyone's AI-written code.

## Should you build many small apps or one real project?

One project, improved stage by stage, teaches more than ten tutorial apps. It also gives you something real to talk about in interviews.

A good roadmap project has:

- Three to five Compose screens
- A remote API plus Room, with offline behavior
- ViewModels, repositories and one `uiState` per screen
- Loading, error, empty and data states
- Unit tests, a few UI tests and CI
- One performance problem you measured and fixed
- A README with an architecture diagram and the decisions you made

Once it is stable, add one AI feature that solves a real user problem, such as search or summaries. That single feature will touch streaming, errors, cost, privacy and testing. Add it last, not first.

## How long does this take? A sample 6-month plan

A sample plan for about 12 to 15 focused hours a week, if you can already program. At 8 to 10 hours a week, expect closer to 9 months. Skip any stage whose check you already pass.

1. **Month 1:** Kotlin and DSA basics, Git and Gradle
2. **Month 2:** Android platform, lifecycle and process death
3. **Month 3:** Coroutines, Flow and Compose UI
4. **Month 4:** Architecture, data and offline
5. **Month 5:** Testing, performance and releases
6. **Month 6:** System design, project polish and mock interviews

Three things run through all six months: a few coding problems every week, both AI tracks, and your one project.

## How I am following this roadmap in public

I have built Android apps for more than six years. I still do not think a roadmap is something you finish. It is something you go back to.

At work I built an alert that keeps reminding a user every few minutes until they open an urgent message. The easy version, a timer inside the app, stops the moment Android kills the process, and Doze would delay it anyway. What worked was handing the repeat loop to WorkManager and saving the active message ID to disk instead of keeping it in memory. Process death, Doze and background limits are stage 2 topics, and that feature is where they stopped being interview theory for me.

So I am going through these stages again, at production depth: read the docs, build a small example, break it, and explain it from memory. AI helps at every step, but it does not replace the testing or the checking.

The posts will be here on the blog, and the videos on [YouTube](https://www.youtube.com/@byMayankKumar). I will keep this roadmap updated as Android changes.

## Frequently asked questions

**Will AI replace Android developers?** I don't think the evidence points that way. AI tools write more of the code, but more developers distrust their accuracy than trust it ([46% vs 33%](https://survey.stackoverflow.co/2025/ai#2-accuracy-of-ai-tools)). Someone still has to decide what to build, check that it works on real devices and own it in production. Some interviews are starting to move the same way: from writing code from scratch toward reading, checking and fixing it.

**Do I need Kotlin Multiplatform to get an Android job?** Not for most native Android roles. It helps when a team shares code with iOS or the web. Learn it after you are solid in Kotlin, coroutines, architecture and testing, since KMP builds on all of them.

**Do Android developers really need DSA?** Usually, yes. A coding round is still common in Android interviews, even at SDE-2. DSA also helps in daily work: picking the right collection, keeping list updates fast, sizing a cache. Practice a little every week instead of doing it all just before your interview.

## Build fundamentals, then go deep

There is no single stack that guarantees an Android career in 2027. But the order is clear: Kotlin, the platform, concurrency, Compose, architecture, data, testing, production, then system design. AI runs alongside all of it, as a tool and as a feature. Interviews test the same path, plus coding problems and design.

The goal is not to learn every tool.

It is to understand problems, build things that work, and keep up as Android changes.

Which stage are you working on right now, and which one do you keep putting off?

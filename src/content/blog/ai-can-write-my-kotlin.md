---
title: "AI Can Write My Kotlin. Who's Going to Debug It at 2 AM?"
description: "AI agents can now write and fix Android code. Why proving it works on real devices, not writing it, is becoming the Android engineer's core job."
pubDate: 2026-10-23
tags: ["android", "ai", "kotlin", "testing"]
linkedinUrl: "https://www.linkedin.com/posts/mayankkumar-mk_androiddev-kotlin-ai-share-7519340699205615616-pErm/"
xUrl: "https://x.com/bymayankkumar/status/2113642915671236925"
featuredIn:
  - name: "Android Weekly #750"
    url: "https://androidweekly.net/issues/issue-750"
ogImage: "/og/ai-can-write-my-kotlin.jpg"
ogImageAlt: "Diagram: tests pass in the repository, but Android bugs live on the device at runtime."
cover: "../../assets/blog/verification-gap.png"
coverAlt: "Diagram: tests pass in the repository, but Android bugs live on the device at runtime."
---

It's 2:07 AM, and Crashlytics has opinions. The crash is in a ViewModel that `git blame` says you wrote. You didn't. An agent did, and its pull request said "all tests pass." They do. The agent updated the expected values to match its new behaviour.

That's a composite, not a confession. But it points at a real shift in Android work. This post covers what AI tools can do on Android today, why "the tests pass" is not the same as "it works" on a phone, and what to get better at.

Short answer: AI can now write and fix Android code, but proving it works on a real device is still your job.

## What can AI tools do on Android today?

Quite a lot. Android Studio's [May 2026 release](https://android-developers.googleblog.com/2026/05/whats-new-android-developer-tools.html) includes an agent that plans multi-step work and fixes its own build errors, "Fix with AI" for crashes in App Quality Insights, and an option to hand LeakCanary traces to an agent. Google also runs [Android Bench](https://android-developers.googleblog.com/2026/03/elevating-ai-assisted-androi.html), which gives models real issues from public Android repos and checks each fix with tests. At its March 2026 launch, models solved between 16% and 72% of tasks.

So writing Android code is no longer the slow part. Checking it is.

## Why is "almost right" the expensive part?

Because it compiles, looks fine in review, and fails later. In Stack Overflow's [2025 survey](https://survey.stackoverflow.co/2025/ai), 66% of developers named "AI solutions that are almost right, but not quite" as their top frustration. Google's [DORA 2025 report](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) found that AI adoption goes with higher delivery throughput, but it's still linked to less stable delivery.

When changes get cheap to produce, teams produce more of them. The limit becomes how much change you can verify.

## Why is this harder on Android?

Because an agent works on the repository, but Android correctness depends on the device at runtime.

<picture>
  <source media="(max-width: 640px)" type="image/webp" srcset="/blog/ai-can-write-my-kotlin/verification-gap-mobile.webp" width="960" height="2114" />
  <source media="(max-width: 640px)" srcset="/blog/ai-can-write-my-kotlin/verification-gap-mobile.png" width="960" height="2114" />
  <source type="image/webp" srcset="/blog/ai-can-write-my-kotlin/verification-gap.webp" width="1600" height="780" />
  <img src="/blog/ai-can-write-my-kotlin/verification-gap.png" width="1600" height="780" loading="lazy" decoding="async" alt="Diagram: on the left, what the agent sees, the repository with a green build and passing tests. On the right, where Android bugs live: process death, OEM battery managers, R8 release builds, recomposition, and low-memory devices." />
</picture>

Process death, OEM battery managers, R8 in release builds, unexpected recomposition, and main-thread work on low-memory devices rarely show up in a diff. Most don't show up on a flagship emulator either.

Here's what "almost right" looks like. Both versions compile and pass a simple unit test:

```kotlin
// Loses the draft when Android kills the app in the background
class ComposeViewModel : ViewModel() {
    var draft by mutableStateOf("")
}

// Restores the draft after process death
class ComposeViewModel(private val state: SavedStateHandle) : ViewModel() {
    val draft = state.getStateFlow("draft", "")
    fun onDraftChange(text: String) { state["draft"] = text }
}
```

The first version keeps the draft only in memory. The second saves it in `SavedStateHandle`, which Android restores when the user comes back.

Android Bench counts a task as solved when the tests pass. That's fair for a benchmark and risky for a release. Tests only check what someone thought to check, and an agent working toward green will take the shortest path there. Sometimes that path goes through the test file.

## Doesn't AI debug too?

It does, and it's improving. At 2 AM, an agent can give you three possible explanations for a crash in seconds. The hard part is picking the true one: what the evidence supports, and whether the fix treats the cause or just hides it behind a `?.let`. That takes a mental model of the system.

Two things are less certain. Simple apps may end up mostly built by agents, so deep Android skill will matter most where failure is expensive. And if junior engineers stop writing the boring code, it's not clear how they'll build that mental model. I don't have an answer to that yet.

## What's coming next?

Your app may get a second kind of user. [AppFunctions](https://developer.android.com/ai/appfunctions), an experimental API on Android 16 and higher, lets an app expose functions that agents can call. The function's KDoc becomes the description the agent reads. That makes KDoc an interface contract, and it makes every argument LLM-generated input that you validate like any untrusted input.

## What should you do now?

Make checking cheaper than generating.

| Habit | What it catches | How to start |
| --- | --- | --- |
| Process-death test | State lost when the user returns | Background the app, run `adb shell am kill <package>`, reopen |
| Release-build smoke test | R8 removing code you still need | Run your critical flow on the minified build |
| One Macrobenchmark | Performance regressions | Measure startup or scrolling on your key screen |
| Small agent diffs | Changes nobody can review properly | Ask for a plan first; read any edited tests first |
| Read traces | Fixes for the wrong cause | Perfetto for jank, a heap dump for leaks |

And write some code by hand on purpose, in the parts you want to understand deeply. That's how mental models get built.

## Frequently asked questions

**Can an AI agent test process death?** Only if your workflow asks it to. Tests check what someone thought to check, and that's true for agents too.

**Should I stop using AI for Android code?** No. Let it write the code, and spend the time you save checking on real devices.

**Does Android Bench measure real-world quality?** It checks whether a model's fix passes tests from real repos. That's useful, but passing tests isn't the same as working on a phone.

## So, who debugs at 2 AM?

You and an agent, together. The agent will produce explanations faster. Your job is knowing which one is true and owning the release.

What's the most convincing "almost right" code an AI tool has given you on Android?

---
title: "Kotlin Null Safety Explained Simply: ?, ?., ?:, !! and Platform Types"
seoTitle: "Kotlin Null Safety Explained: ?., ?:, !! and Platform Types"
description: "How Kotlin stops NullPointerException before your app runs: nullable types, safe calls, the Elvis operator, why !! is risky, and where Java can still crash you."
pubDate: 2026-11-04
linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7523693169323163648/"
xUrl: "https://x.com/bymayankkumar/status/2117709559993380887"
tags: ["kotlin", "android", "null-safety", "basics"]
ogImage: "/og/kotlin-null-safety.jpg"
ogImageAlt: "Diagram: five ways to use a nullable value in Kotlin. Four are safe; only !! can still crash."
cover: "../../assets/blog/kotlin-null-safety.png"
coverAlt: "Diagram: five ways to use a nullable value in Kotlin. Four are safe; only !! can still crash."
roadmap:
  topic: null-safety
---

> **In short:** In Kotlin, a type says if a value can be null. `String` can never be null. `String?` can. You must handle the null case before you use a `String?`. So most null crashes become build errors instead.

Every Android developer has seen this line in a crash report: `java.lang.NullPointerException`. The app tried to use something that was not there, like an order with no delivery note.

This post covers how Kotlin's null safety works, the tools you use every day, and where a crash can still get through.

## What is null, and why does it crash apps?

`null` means "no value". Think of a contact in your phone with no phone number saved. Asking it for a number is fine. Calling that number is the problem.

In Java, any object can be null, and the compiler does not warn you. You find out at runtime, when the app crashes with a NullPointerException (NPE). Tony Hoare, who added null references to a language in 1965, later called it his ["billion-dollar mistake"](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/).

The usual Java fix is `if (x != null)` everywhere. That works only until someone forgets.

## How does Kotlin stop null crashes?

Kotlin puts the answer into the type itself. Every type comes in [two versions](https://kotlinlang.org/docs/null-safety.html#nullable-types-and-non-nullable-types):

- `String` is non-nullable. It always holds a real string.
- `String?` is nullable. It holds a string or `null`.

Non-nullable is the default. If you try `var restaurant: String = null`, the build fails with "Null cannot be a value of a non-null type 'String'."

The rule for `String?` is just as strict. If `deliveryNote` is a `String?`, then `deliveryNote.length` does not compile:

```text
Only safe (?.) or non-null asserted (!!.) calls are allowed
on a nullable receiver of type 'String?'.
```

So you decide what happens when the value is missing. You decide it while writing the code, not at 2 AM from a crash report.

You already see this on Android. In `onCreate(savedInstanceState: Bundle?)`, the `?` tells you the bundle is null on the first launch.

## How do you use a value that might be null?

There are four everyday tools.

**1. Check it with `if`** After `if (order != null)`, the compiler treats `order` as non-null inside that block. This is called a smart cast: the compiler changes the type for you because it saw the check.

**2. Safe call `?.`** `order?.total` means "give me the total if `order` is not null, otherwise give me null". You can chain it: `order?.rider?.phone`. If any part is null, the whole result is null and nothing crashes.

**3. Elvis operator `?:`** It gives a default when the left side is null: `order?.deliveryNote ?: "No note"`. It can also leave the function early: `val order = findOrder(orderId) ?: return`.

**4. `let` with `?.`** `order?.let { show(it) }` runs the block only when `order` is not null. Inside the block, `it` is non-null.

<picture>
  <source media="(max-width: 640px)" type="image/webp" srcset="/blog/kotlin-null-safety/kotlin-null-safety-mobile.webp" width="960" height="1877" />
  <source media="(max-width: 640px)" srcset="/blog/kotlin-null-safety/kotlin-null-safety-mobile.png" width="960" height="1877" />
  <source type="image/webp" srcset="/blog/kotlin-null-safety/kotlin-null-safety.webp" width="1600" height="780" />
  <img src="/blog/kotlin-null-safety/kotlin-null-safety.png" width="1600" height="780" loading="lazy" decoding="async" alt="Diagram: a value of type Order? comes from Kotlin code, or from Java as Order! which you should treat as Order?. It has four safe paths (if check, safe call, Elvis default, let) and one risky path, !!, which crashes when the value is null." />
</picture>

## Why is `!!` risky?

`!!` is the not-null assertion operator. It tells the compiler: "Trust me, this is not null." If you are wrong, you get the same NPE that Kotlin was trying to prevent.

When the compiler shows a red line, adding `!!` is the fastest way to make it go away. That is true whether you, a teammate or an AI tool writes the fix. Here is what that looks like:

```kotlin
// Almost right: compiles, but crashes when the order is not found
fun orderTitle(orderId: String): String {
    val order = findOrder(orderId)          // can be null
    return "Order total: " + order!!.total  // crashes if null
}

// Right: the "not found" case has an answer
fun orderTitle(orderId: String): String {
    val order = findOrder(orderId) ?: return "Order not found"
    // From here, order can't be null, so no ?. or !! is needed
    return "Order total: " + order.total
}
```

The first version hides a decision. Nobody said what should happen when the order is missing. The second version answers that question with `?:`, and after that line the compiler knows `order` is not null.

In code review, treat every `!!` as a question: "Why can't this be null here?" If there is a good reason, show it in code. For example: `requireNotNull(order) { "Order must be loaded first" }`.

## Where can a NullPointerException still happen in Kotlin?

The [Kotlin docs](https://kotlinlang.org/docs/null-safety.html) list a few causes. In everyday Android work, two matter most: `!!` and Java code.

Java does not say if a value can be null. So when Kotlin calls a Java method, the result has a [platform type](https://kotlinlang.org/docs/java-interop.html#null-safety-and-platform-types). The IDE shows it as `String!`, which means "`String` or `String?`, you decide".

Say an old Java class has `public String getCouponCode(String orderId)`, and it returns null when there is no coupon. In Kotlin:

- `val code: String = cart.getCouponCode(orderId)` compiles. At runtime it crashes on that line with "getCouponCode(...) must not be null".
- `val code: String? = cart.getCouponCode(orderId)` compiles, and now the compiler makes you handle null.

So treat values from Java as nullable unless you know better. "Knowing better" means the Java code has [nullability annotations](https://kotlinlang.org/docs/java-interop.html#nullability-annotations) like `@Nullable` and `@NonNull`. Kotlin reads them and gives you a real `String` or `String?` instead of `String!`. If you own the Java code, [Android's Kotlin interop guide](https://developer.android.com/kotlin/interop#nullability-annotations) says to annotate every public parameter, return value and field.

## Which null tool should you use?

| You write | What it means | Use it when |
| --- | --- | --- |
| `String?` | This value can be null | The value can really be missing |
| `if (x != null)` | Check, then use it as non-null | You need several steps with the value |
| `x?.total` | Total, or null if `x` is null | Null is fine for the result too |
| `x ?: default` | Use a default when null | You have a good fallback, or want to return early |
| `x?.let { }` | Run the block only when not null | One action that needs the value |
| `x as? Type` | Cast, or null if it fails | You are not sure of the type |
| `x!!` | Crash if null | Almost never; prefer a check or `requireNotNull` |

## Frequently asked questions

**Why does the smart cast not work on my `var` property?**
Because the property could change between the check and the use. The compiler tells you the smart cast is impossible. Copy it into a local `val` first, then check that.

**Is `!!` always wrong?**
No, but it should be rare. In tests it can be fine, because a crash there just fails the test. In app code, `requireNotNull` or `checkNotNull` with a message gives the same stop with a clearer reason.

**What is the difference between `as` and `as?`?**
`as` throws a `ClassCastException` if the value is not that type. `as?` returns null instead, so you handle it with `?.` or `?:` like any other nullable value.

## What should you remember?

Kotlin does not remove null. It makes you say, in the type, where null is allowed. Then the compiler checks every place you use it.

In everyday Kotlin code, watch two doors: `!!` and Java. Keep both small and easy to see.

If you want to test yourself, try the [null safety interview questions](/interview/kotlin-null-safety/). This post is the first topic in Stage 1 of my [Android roadmap](/roadmap/).

Where do most `!!` operators come from in your codebase: old Java code, framework callbacks, or habit?

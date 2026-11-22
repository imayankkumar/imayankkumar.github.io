---
title: "When Should You Use an Enum Class in Kotlin?"
description: "What an enum class is, how to add values and behavior to it, why entries replaced values(), and why saving ordinal or name can break your saved data."
pubDate: 2026-11-22
linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7530117876796731392/"
xUrl: "https://x.com/bymayankkumar/status/2124352175941861750"
tags: ["kotlin", "android", "enum-class", "basics"]
ogImage: "/og/kotlin-enum-class.jpg"
ogImageAlt: "Title card: When should you use an enum class in Kotlin? Tags: enum class, entries, when, ordinal."
cover: "../../assets/blog/covers/kotlin-enum-class.png"
coverAlt: "Title card: When should you use an enum class in Kotlin? Tags: enum class, entries, when, ordinal."
roadmap:
  topic: enum-classes
---

> **In short:** use an enum class when a value must be one of a small, fixed set that you know at compile time, and every option has the same shape. Each constant is a single object. It can carry values and its own behavior. When the options need different data, use a sealed class instead.

Adding a constant to an enum takes one line. Adding it in the wrong place can break data you saved last year.

Have you ever saved an enum to SharedPreferences, shipped the app, and later added a constant in the middle of the list? The code still compiles. But every user who saved the old value now reads a different status, and nothing crashes to tell you.

This post covers what an enum class is, how to add values and behavior to it, why `entries` replaced `values()`, and how to save an enum so it survives changes.

## What is an enum class in Kotlin?

An enum class is a class with a fixed list of instances. You write every instance inside the class, and nobody can create more.

```kotlin
enum class OrderStatus {
    PLACED, PREPARING, OUT_FOR_DELIVERY, DELIVERED
}

val status = OrderStatus.PREPARING
```

Each constant is created once. `OrderStatus.PREPARING` is always the same object.

Every constant also gets two values for free:

- **`name`:** the constant's name as a `String`, like `"PREPARING"`.
- **`ordinal`:** its position in the list, starting from 0. `PREPARING` is 1.

## How do you add values and functions to an enum?

An enum can have a constructor, properties and functions, like any class. Pass the values in brackets after each constant, and end the list with a `;` before the members:

```kotlin
enum class OrderStatus(val code: String) {
    PLACED("placed"),
    PREPARING("preparing"),
    OUT_FOR_DELIVERY("out_for_delivery"),
    DELIVERED("delivered");

    val isActive: Boolean
        get() = this != DELIVERED
}
```

Each constant can also have its own behavior. Declare an `abstract` function in the enum, and give each constant its own body:

```kotlin
enum class DeliverySpeed {
    STANDARD {
        override fun deliveryCharge(orderTotal: Int) = if (orderTotal >= 500) 0 else 30
    },
    EXPRESS {
        override fun deliveryCharge(orderTotal: Int) = 60
    };

    abstract fun deliveryCharge(orderTotal: Int): Int
}

DeliverySpeed.STANDARD.deliveryCharge(orderTotal = 650)   // 0
```

Standard delivery is free above 500, and express always costs 60. An enum can also implement an interface in the same way.

What an enum can't do is extend another class. Every enum already extends `Enum`, so Kotlin 2.4.21 stops you with "Enum classes cannot extend classes."

## Why doesn't when need an else branch?

The compiler knows every constant, so a `when` over an enum can cover all of them without `else`:

```kotlin
fun label(status: OrderStatus): String = when (status) {
    OrderStatus.PLACED -> "Order placed"
    OrderStatus.PREPARING -> "Being prepared"
    OrderStatus.OUT_FOR_DELIVERY -> "On the way"
    OrderStatus.DELIVERED -> "Delivered"
}
```

Add `CANCELLED` later, and this stops compiling:

```
'when' expression must be exhaustive. Add the 'CANCELLED' branch or an 'else' branch.
```

That error is your to-do list. If you had written `else -> "Order placed"`, a cancelled order would show "Order placed" and nothing would warn you. It's the same trap I covered in the [sealed class post](/blog/kotlin-sealed-class/#why-is-else-almost-right). Keep `else` out of `when` on enums and sealed types.

## Should you use entries or values()?

Use `entries`. It became [stable in Kotlin 1.9.0](https://kotlinlang.org/docs/whatsnew19.html#stable-replacement-of-the-enum-class-values-function), and the Kotlin team recommends it over `values()`.

`values()` returns a new array on every call, because an array can be changed by whoever gets it. On Kotlin 2.4.21, `values() === values()` is `false`. `entries` returns a read-only `List` that is created once.

For generic code, where you only know the enum as a type `T`, use [`enumEntries<T>()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.enums/enum-entries.html) (stable since Kotlin 2.0). The older `enumValues<T>()` has been around since Kotlin 1.1.

| API | What it gives you | When to use it |
| --- | --- | --- |
| `entries` | A read-only `List` of all constants, in order | Loops, dropdowns, lookups |
| `values()` | A new `Array` on every call | Only in old code; move to `entries` |
| `valueOf(name)` | The constant with that exact name, or an exception | Names you control, never server data |
| `enumEntries<T>()` | `entries` for a generic type `T` | Inline functions with `reified T` |
| `name` | The constant's name | Logs and debugging |
| `ordinal` | The constant's position, from 0 | Sorting in memory, never saving |

## Why is saving ordinal or name risky?

Because both can change when you edit the enum, but the saved value doesn't. Your app saves a status today and reads it back after an update. If the enum changed in between, the old value now means something else.

**Saving `ordinal` (the position).** `PREPARING` is second in the list, so its ordinal is `1`, and you save `1`. In the next release you add `CONFIRMED` after `PLACED`. Now position 1 is `CONFIRMED`. The app reads `1` and shows "Confirmed" for an order that is being prepared. No crash, just wrong data.

**Saving `name`.** You save `"PREPARING"`. Later you rename the constant to `COOKING`. Now `valueOf("PREPARING")` finds nothing and throws, and the app crashes for every user who had the old value saved.

**Reading server data with `valueOf()`.** The server starts sending a new status, `"READY_FOR_PICKUP"`. Older app versions don't have that constant, so `valueOf()` throws there too. You can't fix apps that users haven't updated.

The fix is to save a value you control and never change:

```kotlin
// Almost right: breaks when the enum changes
prefs.edit { putInt("last_status", status.ordinal) }
val saved = OrderStatus.entries[prefs.getInt("last_status", 0)]

// Right: save a fixed code, and handle codes you don't know
prefs.edit { putString("last_status", status.code) }
val saved = OrderStatus.fromCode(prefs.getString("last_status", null))
    ?: OrderStatus.PLACED

// inside OrderStatus
companion object {
    fun fromCode(code: String?): OrderStatus? =
        entries.firstOrNull { it.code == code }
}
```

`code` is the `"preparing"` string from the enum earlier. You can move or rename `PREPARING`, and `"preparing"` still finds it. For a code the app doesn't know, `fromCode()` returns `null` instead of crashing, and `?:` picks a safe default. That's the same idea as the [null safety post](/blog/kotlin-null-safety/): make the unknown case something the compiler makes you handle.

If you use kotlinx.serialization, `@SerialName("preparing")` on each constant does the same job for JSON.

<picture>
  <source media="(max-width: 640px)" type="image/webp" srcset="/blog/kotlin-enum-class/kotlin-enum-class-mobile.webp" width="960" height="2698" />
  <source media="(max-width: 640px)" srcset="/blog/kotlin-enum-class/kotlin-enum-class-mobile.png" width="960" height="2698" />
  <source type="image/webp" srcset="/blog/kotlin-enum-class/kotlin-enum-class.webp" width="1600" height="780" />
  <img src="/blog/kotlin-enum-class/kotlin-enum-class.png" width="1600" height="780" loading="lazy" decoding="async" alt="Diagram: what breaks when you change an enum. Saving ordinal gives wrong data when you add or move a constant and a crash when an old app reads a new value. Saving name crashes when you rename a constant or an old app reads a new value. Saving your own fixed code survives all three changes." />
</picture>

## Enum or sealed class?

Use an enum when every option has the same shape: the same properties, filled with fixed values. Order statuses, sort orders and delivery speeds fit well.

Use a sealed class when each option needs its own data. A `Failed` state needs a message, and a `Ready` state needs the items. An enum can't do that. Each constant is created once, so its values are fixed when you write the code, and an error message only exists at runtime.

The [sealed class post](/blog/kotlin-sealed-class/) covers that side in detail.

## Frequently asked questions

**Are enums still slow on Android?**
Early Android advice said to use `Int` constants instead. Today, R8 optimizes many enum uses in release builds. For example, it [replaces `ordinal` and `name` calls with constants](https://jakewharton.com/r8-optimization-enum-ordinals-and-names/). In normal app code, pick the enum for safety and clear code, and measure before you change it.

**Can an enum extend a class?**
No. It can implement any number of interfaces, but it can't extend a class, because it already extends `Enum`.

**Can you compare enum constants with `==`?**
Yes. Each constant is a single object, so `==` and `===` both work and give the same answer.

## What should you remember?

An enum is a fixed list of single objects that can hold values and behavior. `when` checks that you covered every constant. Use `entries`, not `values()`. And never save `ordinal` or `name`: save a code you control, and handle codes you don't know.

If you want to test yourself, try the [enum class interview questions](/interview/kotlin-enum-class/). This post is the sixth topic in Stage 1 of my [Android roadmap](/roadmap/). The previous one is [inner vs nested classes](/blog/kotlin-inner-vs-nested-class/).

Where does your app save an enum today, and what would happen if you added a constant in the middle?

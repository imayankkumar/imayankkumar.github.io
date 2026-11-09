---
title: "Kotlin Any, Unit and Nothing Explained Simply"
description: "What Any, Unit and Nothing mean in Kotlin, how they differ from Java's Object and void, and why Android code is full of () -> Unit and UiState<Nothing>."
pubDate: 2026-11-09
tags: ["kotlin", "android", "type-system", "basics"]
ogImage: "/og/kotlin-any-unit-nothing.jpg"
linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7525548676300136448/"
xUrl: "https://x.com/bymayankkumar/status/2119781795902419150"
ogImageAlt: "Diagram: Kotlin's type ladder. Any? at the top, Any below it, your own types in the middle, and Nothing at the bottom."
cover: "../../assets/blog/kotlin-any-unit-nothing.png"
coverAlt: "Diagram: Kotlin's type ladder. Any? at the top, Any below it, your own types in the middle, and Nothing at the bottom."
roadmap:
  topic: any-unit-nothing
---

> **In short:** `Any` is the parent of every non-null type, so it can hold any value. `Unit` means "the work is done, there is no result to give back". `Nothing` means "this code never finishes normally", for example because it always throws.

Open a typical Android screen written in Kotlin and you will often find all three. A button takes `onClick: () -> Unit`. A loading state is `UiState<Nothing>`. An analytics call takes values of type `Any?`. They look like small details, but each one tells the compiler something useful.

This post covers what each type means, how it differs from Java, and where you use it in real Android code.

## Where do Any, Unit and Nothing fit in Kotlin?

Think of Kotlin's types as a ladder.

- At the top is `Any?`. Every value fits here, even `null`.
- Just below is `Any`. Every value except `null` fits here.
- In the middle are the types you use every day: built-in ones like `String` and `Int`, your own classes like `Order` (from the food-order app in this series), and also `Unit`.
- At the bottom is `Nothing`. No value fits here at all.

A type high on the ladder accepts more values but tells you less about them. A type low on the ladder tells you more. `Nothing` is the extreme case: it tells the compiler "you will never get a value from here".

<picture>
  <source media="(max-width: 640px)" type="image/webp" srcset="/blog/kotlin-any-unit-nothing/kotlin-any-unit-nothing-mobile.webp" width="960" height="1381" />
  <source media="(max-width: 640px)" srcset="/blog/kotlin-any-unit-nothing/kotlin-any-unit-nothing-mobile.png" width="960" height="1381" />
  <source type="image/webp" srcset="/blog/kotlin-any-unit-nothing/kotlin-any-unit-nothing.webp" width="1600" height="780" />
  <img src="/blog/kotlin-any-unit-nothing/kotlin-any-unit-nothing.png" width="1600" height="780" loading="lazy" decoding="async" alt="Diagram: Kotlin's type ladder. Any? at the top accepts every value including null. Any accepts every non-null value. String, Int, Order and Unit sit in the middle. Nothing is at the bottom and has no values." />
</picture>

## What is Any in Kotlin?

[Every Kotlin class has `Any` as its parent](https://kotlinlang.org/docs/inheritance.html), even if you don't write it. That is why every object has three functions: `equals()`, `hashCode()` and `toString()`.

So a parameter of type `Any` accepts anything that is not null. A common Android place for this is analytics, where one event can carry a number, a text and an object:

```kotlin
// Sends one analytics event with any mix of values
fun logEvent(name: String, vararg params: Pair<String, Any?>) { /* ... */ }

logEvent("checkout", "items" to 3, "coupon" to "SAVE10", "note" to null)
```

Here each value is `Any?`, because the note can be missing. To use a value as its real type, you check it with `is`. After `if (value is String)`, the compiler lets you call `value.length`. This is the same smart cast you saw in the [null safety post](/blog/kotlin-null-safety/).

On the JVM, Kotlin [maps Java's `Object` to `Any`](https://kotlinlang.org/docs/java-interop.html#mapped-types). They are not exactly the same, though. `Any` only has those three functions, so `wait()` and `notify()` are not available on it.

`Any` is useful at the edges of your app: logging, analytics, a `Bundle`. Inside your own code, it throws away type information. If a function takes `Any` and then checks five types with `is`, a sealed type or a generic is usually a better fit.

## What is Unit, and how is it different from void?

A function that does some work but has no result returns `Unit`. You usually don't write it:

```kotlin
fun clearCart() { cartItems.clear() }   // return type is Unit
```

In Java, `void` means "no value at all". [In Kotlin, `Unit` is a real type with exactly one value](https://kotlinlang.org/docs/functions.html#unit-returning-functions), the object `Unit`. You can even store it: `val result = clearCart()` compiles, and printing it shows `kotlin.Unit`.

You might worry this costs extra. It doesn't. Compile `clearCart()` with Kotlin 2.4.0 and look at the bytecode: it is a normal `void` method.

So why have a real type? Because it works with generics, and `void` does not:

- `onClick: () -> Unit` is a function type that returns nothing useful.
- `suspend fun cancelOrder(id: String): Result<Unit>` says "it worked or it failed, there is no data".
- `MutableSharedFlow<Unit>` sends a one-time event from a ViewModel, like "the order was placed, close the cart screen". The event has no data. The fact that it happened is the message, so the type is `Unit`.

In Java you need the `Void` class and `return null` for this. In Kotlin, `Unit` just fits.

## What is Nothing, and why would a function return it?

[`Nothing` is the type of code that never finishes normally](https://kotlinlang.org/docs/exceptions.html#the-nothing-type). It has no values, so a function that returns `Nothing` can only throw or loop forever.

You already use it. `throw` is an expression of type `Nothing`. The standard library's [`error()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/error.html) and [`TODO()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-t-o-d-o.html) both return `Nothing`.

Because `Nothing` is at the bottom of the ladder, it fits wherever any type is expected. That is why this compiles:

```kotlin
data class Order(val id: String, val total: Int)
fun findOrder(id: String): Order? = orders[id]   // null when not found

val order: Order = findOrder(orderId) ?: error("Order $orderId not loaded")
```

`?:` has two paths. If `findOrder` finds the order, you get it. If it returns null, `error()` throws, so that path never gives a value: its type is `Nothing`. `Nothing` fits into any type, so the whole line is an `Order`, not `Order?`. That is why `order` needs no `?`.

The return type matters when you write your own helper:

```kotlin
// Almost right: the helper always throws, but the compiler doesn't know
fun stopOrder(id: String) {
    throw IllegalStateException("Order $id not loaded")
}

fun orderTotal(id: String): Int {
    val order = findOrder(id)
    if (order == null) stopOrder(id)
    return order.total   // error: order is still Order?
}

// Right: Nothing tells the compiler this call never comes back
fun stopOrder(id: String): Nothing {
    throw IllegalStateException("Order $id not loaded")
}
// Now order.total compiles, because order can't be null after that line
```

In the first version, `stopOrder` returns `Unit`. The compiler thinks the code can continue after it, with `order` still null. So you get "Only safe (?.) or non-null asserted (!!.) calls are allowed", and the quick fix is `order!!`. With `: Nothing`, the compiler knows the code after that line only runs when `order` is not null. So it changes the type of `order` from `Order?` to `Order` for you. No `!!` needed.

## Why can a loading state be `UiState<Nothing>`?

This is a common place to see `Nothing` in Android code. Many apps call this class `UiState`. Here it is `OrderState`:

```kotlin
sealed interface OrderState<out T> {
    data object Loading : OrderState<Nothing>
    data class Ready<T>(val data: T) : OrderState<T>
    data class Failed(val message: String) : OrderState<Nothing>
}

val state: OrderState<Order> = OrderState.Loading   // compiles
```

`Loading` has no data, so its type argument is `Nothing`. Because `Nothing` is a subtype of `Order`, and `T` is marked [`out`](https://kotlinlang.org/docs/generics.html#declaration-site-variance), `OrderState<Nothing>` is a subtype of `OrderState<Order>`. So one `Loading` object works for every `OrderState`, whatever its `T` is.

Remove the `out` and the last line fails with "initializer type mismatch". The `out` is what makes the trick work.

## Any vs Unit vs Nothing: quick comparison

| Type | What it means | How many values | Where you see it on Android |
| --- | --- | --- | --- |
| `Any?` | Anything, or null | All values | Analytics params, `Map<String, Any?>` |
| `Any` | Anything except null | All non-null values | `equals(other: Any?)`, logging helpers |
| `Unit` | Done, no result | One: `Unit` | `() -> Unit`, `Result<Unit>`, `Flow<Unit>` |
| `Nothing` | Never finishes normally | None | `throw`, `error()`, `TODO()`, `UiState<Nothing>` |

## Frequently asked questions

**Is `Any` the same as Java's `Object`?**
On the JVM they map to each other, so a Java method that takes `Object` takes `Any!` in Kotlin. But `Any` is a Kotlin type with only three functions, and it exists on every Kotlin platform, not only the JVM.

**What is the difference between `Unit` and `Nothing`?**
A `Unit` function finishes and comes back, just without a useful result. A `Nothing` function never comes back. In bytecode, `Unit` functions become `void`, while a `Nothing` function shows up as returning `java.lang.Void`.

**What is the type of `null`?**
`val x = null` gives `x` the type `Nothing?`. The only value of `Nothing?` is `null`, and since `Nothing?` sits under every nullable type, `null` fits into any `T?`.

## What should you remember?

`Any` is the top of the ladder: it accepts everything and tells you little. `Unit` is a real value that means "done". `Nothing` is the bottom: it tells the compiler a path never comes back, and the compiler uses that to make your other types more exact.

The practical habit: when you write a helper that always throws, give it `: Nothing`. Your smart casts will start working, and a few `!!` will go away.

If you want to test yourself, try the [Any, Unit and Nothing interview questions](/interview/kotlin-any-unit-nothing/). This post is the second topic in Stage 1 of my [Android roadmap](/roadmap/).

Have you seen `UiState<Nothing>` in your codebase, or does your team write a separate state class for every screen?

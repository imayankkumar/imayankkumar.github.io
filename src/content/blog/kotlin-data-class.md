---
title: "Kotlin Data Class vs Regular Class Explained Simply"
seoTitle: "Kotlin Data Class vs Class: equals, copy, componentN and Bytecode"
description: "What the data keyword really adds to a Kotlin class, the rules it comes with, why copy() is shallow, and what the compiler writes for you in bytecode."
pubDate: 2026-11-16
tags: ["kotlin", "android", "data-class", "basics"]
ogImage: "/og/kotlin-data-class.jpg"
ogImageAlt: "Title card: Data class vs class. Tags: data class, equals(), copy(), component1()."
cover: "../../assets/blog/covers/kotlin-data-class.png"
coverAlt: "Title card: Data class vs class. Tags: data class, equals(), copy(), component1()."
roadmap:
  topic: data-classes
---

> **In short:** a data class is a normal class where the compiler writes five things for you: `equals()`, `hashCode()`, `toString()`, `copy()` and `component1()`, `component2()` and so on. It uses only the properties in the primary constructor, and `copy()` copies values, not the objects inside them.

You add an item to the cart, the ViewModel updates its `StateFlow`, and the screen does not change. No crash, nothing in Logcat. The state is a data class and the update uses `copy()`. The bug is in how `copy()` and `equals()` work together.

This post covers what the `data` keyword adds, the rules it comes with, and the two details behind surprising data class bugs.

## What is a data class in Kotlin?

A data class is a class whose main job is to hold values. You write it in one line:

```kotlin
data class CartItem(val name: String, val price: Int, val quantity: Int)
```

The difference shows up when you compare it with the same class without `data`:

```kotlin
class PlainCartItem(val name: String, val price: Int, val quantity: Int)

val a = CartItem("Paneer Roll", 120, 2)
val b = CartItem("Paneer Roll", 120, 2)
a == b   // true

val c = PlainCartItem("Paneer Roll", 120, 2)
val d = PlainCartItem("Paneer Roll", 120, 2)
c == d   // false
```

A regular class gets `equals()` from [`Any`](/blog/kotlin-any-unit-nothing/), which only asks "is this the same object in memory?". A data class compares the values instead.

## What does the compiler generate for a data class?

[The Kotlin docs list five things](https://kotlinlang.org/docs/data-classes.html):

- **`equals()`**: two objects are equal when all constructor properties are equal.
- **`hashCode()`**: built from the same properties, so equal objects get the same hash. That is why a data class works as a `HashMap` key. Put the two `CartItem`s above in `setOf()` and you get one item; with `PlainCartItem` you get two.
- **`toString()`**: `CartItem(name=Paneer Roll, price=120, quantity=2)` instead of `PlainCartItem@7a81197d`. Very useful in logs.
- **`componentN()`**: `component1()` returns `name`, `component2()` returns `price`, in declaration order. This makes `val (name, price, quantity) = item` work.
- **`copy()`**: a new object with the same values, where you can change some: `item.copy(quantity = 3)`.

<picture>
  <source media="(max-width: 640px)" type="image/webp" srcset="/blog/kotlin-data-class/kotlin-data-class-mobile.webp" width="960" height="2005" />
  <source media="(max-width: 640px)" srcset="/blog/kotlin-data-class/kotlin-data-class-mobile.png" width="960" height="2005" />
  <source type="image/webp" srcset="/blog/kotlin-data-class/kotlin-data-class.webp" width="1600" height="780" />
  <img src="/blog/kotlin-data-class/kotlin-data-class.png" width="1600" height="780" loading="lazy" decoding="async" alt="Diagram: one line, data class CartItem with name, price and quantity, turns into five generated functions: equals, hashCode, toString, component1 to 3, and copy. Two warnings below: only constructor properties count, and copy() is shallow." />
</picture>

## What are the rules for a data class?

[The compiler checks four rules](https://kotlinlang.org/docs/data-classes.html):

1. The primary constructor needs at least one parameter.
2. Every parameter in it must be `val` or `var`.
3. A data class can't be `abstract`, `open`, `sealed` or `inner`.
4. You can't write your own `copy()` or `componentN()` with the same parameters the compiler would generate. You can write your own `equals()`, `hashCode()` or `toString()`, and then the compiler uses yours.

Rule 3 means nobody can extend a data class. It can still implement interfaces, which is why `data class Ready(...) : UiState` is so common in Android code. Break a rule and you get a compile error, like "Modifier 'open' is incompatible with 'data'".

## Which properties count in equals()?

Only the ones inside the primary constructor. A property declared in the class body is ignored by all five generated functions:

```kotlin
data class Order(val id: String, val items: List<CartItem>) {
    var isSeen: Boolean = false
}
```

Two `Order`s with the same `id` and `items` are equal, even if one has `isSeen = true`. `toString()` doesn't show it, and `copy()` doesn't carry it over: the copy starts with `false` again. If a value matters, put it in the constructor.

## Is copy() a deep copy?

No. [`copy()` is shallow](https://kotlinlang.org/docs/data-classes.html#copying): it copies each property's value, and for an object that value is a reference. So the copy and the original point to the same list.

This is the bug from the start of the post:

```kotlin
// Almost right: the state holds a MutableList
data class CartState(val items: MutableList<CartItem>)
val state = MutableStateFlow(CartState(mutableListOf()))  // in the ViewModel

val old = state.value
old.items.add(item)          // changes the list that old points to
state.value = old.copy()     // new object, same list, so new == old

// Right: a read-only List, and a new list for every change
data class CartState(val items: List<CartItem>)
val state = MutableStateFlow(CartState(emptyList()))

state.update { it.copy(items = it.items + item) }
```

`state` is the `StateFlow` the cart screen collects. In the first version, `add()` changes the list inside the old state. `copy()` then makes a new `CartState` pointing to that same list, so the new state equals the old one. [`StateFlow` skips a value equal to the current one](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/), so the screen never hears about it. You can test this yourself: collect `state` and print every value. The first version prints only the starting state. The second also prints the update.

In the second version, `it.items + item` creates a new list, so the new state is really different and `StateFlow` sends it.

## Why does copy() warn about a private constructor?

A private constructor is a common way to check values first:

```kotlin
data class Coupon private constructor(val percent: Int) {
    companion object {
        fun of(percent: Int): Coupon? =
            if (percent in 1..50) Coupon(percent) else null
    }
}

val coupon = Coupon.of(20)!!
val tooBig = coupon.copy(percent = 90)   // skips the 1..50 check
```

The generated `copy()` is public, so anyone can make a `Coupon(90)`. [Since Kotlin 2.0.20](https://kotlinlang.org/docs/whatsnew2020.html#data-class-copy-function-to-have-the-same-visibility-as-constructor) the compiler warns about this, and the plan is to give `copy()` the same visibility as the constructor. You can choose early:

- `@ConsistentCopyVisibility` makes `copy()` private now. The last line above then fails with a "Cannot access ... it is private" error.
- `@ExposedCopyVisibility` keeps the old public `copy()` and hides the warning on the class. Callers still get warned.

As of Kotlin 2.4.21 (November 2026), it is still a warning. [KT-11914](https://youtrack.jetbrains.com/issue/KT-11914) tracks when that changes. If your class has a private constructor, add `@ConsistentCopyVisibility` today.

## What does a data class look like in bytecode?

Compile `CartItem` with Kotlin 2.4.21 and run `javap` on it. Without method bodies, the one line becomes (shortened):

```java
public final class CartItem {
  public CartItem(String, int, int);
  public final String getName();            // + getPrice(), getQuantity()
  public final String component1();         // + component2(), component3()
  public final CartItem copy(String, int, int);
  public static CartItem copy$default(CartItem, String, int, int, int, Object);
  public String toString();
  public int hashCode();
  public boolean equals(Object);
}
```

The class is `final`: that is rule 3 in bytecode. `copy$default` handles default arguments: an `int` mask marks which ones you passed, and the rest come from the old object. And `hashCode()` is the classic `result * 31 + next` over the three fields, the same code you would write by hand in Java. To see it yourself in Android Studio: *Tools > Kotlin > Show Kotlin Bytecode*, then *Decompile*.

## Data class vs regular class: quick comparison

| | Regular class | Data class |
| --- | --- | --- |
| `==` compares | Same object in memory | Constructor property values |
| `toString()` | `PlainCartItem@7a81197d` | `CartItem(name=..., price=...)` |
| `copy()` and destructuring | No | Yes |
| Can be `open` or `abstract` | Yes | No |
| Constructor | Anything, or none | At least one `val`/`var` parameter |
| Good for | Behavior: ViewModels, repositories, managers | Values: UI state, API models, events with data |

## Frequently asked questions

**Can a data class have a property that is not in the constructor?**
Yes, but the generated functions ignore it. Use it only for values that should not affect equality.

**Should data class properties be `val` or `var`?**
Prefer `val`. With `var`, an object can change after you put it in a `HashSet`. Its hash changes too, so the set can no longer find it.

**What is a `data object`?**
[An `object` with a readable `toString()`](https://kotlinlang.org/docs/object-declarations.html#data-objects): it prints `Loading`, not `Loading@1b6d3586`. Use it for states with no data, like `data object Loading : UiState`.

## What should you remember?

The `data` keyword is a shortcut, not a different kind of class. It writes five functions from your constructor properties, and nothing more. Many data class bugs come from forgetting the "nothing more": body properties are ignored, and `copy()` shares the objects inside.

The practical habit: build state classes from `val`s and read-only types like `List`, and make changes with `copy()`.

If you want to test yourself, try the [data class interview questions](/interview/kotlin-data-class/). This post is the third topic in Stage 1 of my [Android roadmap](/roadmap/).

Have you ever had a `StateFlow` that didn't update even though the code called `copy()`?

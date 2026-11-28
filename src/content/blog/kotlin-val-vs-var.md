---
title: "What Is the Difference Between val and var in Kotlin, and Is val Immutable?"
description: "val vs var in Kotlin: why val is read-only and not immutable, how a val can still change, where const val fits, and the StateFlow bug this causes on Android."
pubDate: 2026-11-28
tags: ["kotlin", "android", "val", "basics"]
ogImage: "/og/kotlin-val-vs-var.jpg"
ogImageAlt: "Title card: What is the difference between val and var in Kotlin, and is val immutable? Tags: val, var, const val."
cover: "../../assets/blog/covers/kotlin-val-vs-var.png"
coverAlt: "Title card: What is the difference between val and var in Kotlin, and is val immutable? Tags: val, var, const val."
roadmap:
  topic: val-vs-var
---

> **In short:** `var` can be given a new value. `val` can't. But `val` only locks the name, not the object behind it. A `val` list can still grow, and a `val` property can return a new value each time you read it. That's why Kotlin calls `val` read-only, not immutable.

`val` stops you from changing the name. It doesn't stop you from changing the thing.

Say a search screen shows your recent searches. The state is a data class with `val recent: MutableList<String>`, kept in a `StateFlow`. When you search, the code calls `recent.add(query)`. It compiles, there's a `val` everywhere, and the list on screen doesn't update.

This post covers what `val` and `var` really promise, why `val` isn't immutable, where `const val` fits, and how to fix that search screen.

## What is the difference between val and var?

A `var` can point to a new value later. A `val` is assigned once:

```kotlin
var query = "kotlin"
query = "compose"   // fine

val email = "hello@imayankkumar.com"
email = "hi@imayankkumar.com"
// 'val' cannot be reassigned.
```

"Once" doesn't have to mean "on the same line". You can declare a `val` first and assign it later, as long as the compiler can see it gets exactly one value on every path:

```kotlin
val label: String
if (count > 1) label = "searches" else label = "search"
```

If one path skips the assignment, the compiler stops you with "Variable 'label' must be initialized."

In a class, the difference shows up in the bytecode. Here is a small class and its decompiled Java (Kotlin 2.4.21, trimmed):

```kotlin
class Contact(val email: String, var phone: String)
```

```java
public final class Contact {
    private final String email;
    private String phone;

    public final String getEmail() { return this.email; }

    public final String getPhone() { return this.phone; }
    public final void setPhone(String phone) { this.phone = phone; }
}
```

`email` is a `private final` field with only a getter. `phone` has a getter and a setter. So a `val` property is a property with no setter.

## Why is val read-only and not immutable?

A `val` holds a reference to an object. `val` locks that reference. It says nothing about the object:

```kotlin
val recent = mutableListOf("kotlin")
recent.add("compose")       // fine: the list itself changes
recent = mutableListOf()    // error: the name can't point to a new list
```

That's why the [Kotlin docs](https://kotlinlang.org/docs/properties.html) say properties are "mutable (`var`) or read-only (`val`)". Read-only means *you* can't assign it. It doesn't mean nobody can change what's inside.

The same is true for collection types. `List` is the [read-only interface](https://kotlinlang.org/docs/collections-overview.html): it has no `add()`. But a `List` can be a view of a `MutableList` that someone else still holds:

```kotlin
val view: List<String> = recent
recent.add("flow")
println(view)   // [kotlin, compose, flow]
```

`view` is a `val` of a read-only type, and it still changed. If you need a list that really can't change, copy it, or use [kotlinx.collections.immutable](https://github.com/Kotlin/kotlinx.collections.immutable).

<picture>
  <source media="(max-width: 640px)" type="image/webp" srcset="/blog/kotlin-val-vs-var/kotlin-val-vs-var-mobile.webp" width="960" height="1945" />
  <source media="(max-width: 640px)" srcset="/blog/kotlin-val-vs-var/kotlin-val-vs-var-mobile.png" width="960" height="1945" />
  <source type="image/webp" srcset="/blog/kotlin-val-vs-var/kotlin-val-vs-var.webp" width="1600" height="706" />
  <img src="/blog/kotlin-val-vs-var/kotlin-val-vs-var.png" width="1600" height="706" loading="lazy" decoding="async" alt="Diagram: what val locks. With var, the name can point to a new list and the list can change. With val, the name is fixed, but the list can still change. With a val of a read-only List, neither can change, and each change makes a new copy." />
</picture>

## Can a val return a different value each time?

Yes. A `val` property can have a custom getter, and the getter runs on every read:

```kotlin
class Session(private val expiresAtMillis: Long) {
    val isExpired: Boolean
        get() = System.currentTimeMillis() > expiresAtMillis
}
```

`isExpired` is a `val`. It can be `false` now and `true` a minute later. Nothing was assigned. The getter just returned a different answer.

There is one more case. A subclass can [override an open `val` with a `var`](https://kotlinlang.org/docs/inheritance.html#overriding-properties), but not the other way round. So when you read a `val` property, the only promise is "you can't set it from here". It doesn't promise "it will always be the same".

## Where does this break on Android?

Back to the search screen. Here is the almost-right version and the fix:

```kotlin
// Almost right: val everywhere, but the list inside can change
data class SearchState(val recent: MutableList<String>)

private val _state = MutableStateFlow(SearchState(mutableListOf()))

fun onSearch(query: String) {
    _state.value.recent.add(query)   // compiles, screen doesn't update
}

// Right: a read-only list, and a new state for each change
data class SearchState(val recent: List<String> = emptyList())

private val _state = MutableStateFlow(SearchState())

fun onSearch(query: String) {
    _state.update { it.copy(recent = it.recent + query) }
}
```

In the first version, `add()` changes the list inside the current state. Nobody sets a new value on the flow, so there is nothing to send. Even `_state.value = _state.value` doesn't help: a `StateFlow` [compares values with `equals`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/), and the object is equal to itself. I checked this with a collector: it got the first state and nothing after the `add()`.

In the second version, `it.recent + query` creates a new list and `copy()` creates a new state. The flow sees a different value and sends it. As a bonus, no other code can change `recent` behind your back, because `List` has no `add()`.

## Where does const val fit?

A `val` gets its value when the code runs. A [`const val`](https://kotlinlang.org/docs/properties.html#compile-time-constants) is known when the code compiles:

```kotlin
const val MAX_RECENT = 10                      // fine
val startedAt = System.currentTimeMillis()     // fine: set at runtime
const val builtAt = System.currentTimeMillis()
// Const 'val' initializer must be a constant value.
```

A `const val` must be at the top level, in an `object` or in a companion object. It only allows primitive types and `String`. The compiler copies its value into every place that reads it. When I read `MAX_RECENT + 1` from another function, the bytecode had the number `11` in it, with no field read at all.

| | `var` | `val` | `const val` |
| --- | --- | --- | --- |
| Can you assign it again? | Yes | No | No |
| When is the value set? | Any time | Once, when the code runs | When the code compiles |
| Where can you use it? | Anywhere | Anywhere | Top level, `object`, companion object |
| Which types? | Any | Any | Primitives and `String` |
| Property in bytecode | Field, getter and setter | Final field and getter | `public static final` field, value copied into callers |
| Can the object inside change? | Yes, if it's mutable | Yes, if it's mutable | No, the value is a primitive or `String` |

## Frequently asked questions

**Is val the same as final in Java?**
For a local variable, it's close. For a property, `val` means "a getter and no setter". A custom getter can compute a new value on every read, which a Java `final` field can't do.

**Should I always use val?**
Start with `val` and switch to `var` only when the value really has to change, like a counter in a loop. Fewer things that can change means fewer places to look when a bug shows up. For state you share with other classes, use a `val` of a read-only type and create a new copy for each change.

**Is listOf() immutable?**
No, it's read-only. The `List` type has no `add()`, so your code can't change it through that type. But the object underneath is a plain Java list, and a cast can still reach it:

```kotlin
val letters = listOf("a", "b")
val mutable = letters as MutableList<String>
mutable[0] = "z"     // works
println(letters)     // [z, b]
mutable.add("c")     // crashes: UnsupportedOperationException
```

So `List` means "you can't change it through this type". It doesn't promise that the list never changes.

## What should you remember?

`var` can point to a new value. `val` can't. But `val` locks the name, not the object, so a `val` can still hold a list that changes, or return a new value from its getter. If you want something that really can't change, use read-only types and make copies. Use `const val` for primitive and `String` values you know when the code compiles.

One more thing hides in the fixed code. On Android you'd pair the private `_state` with a public `val state: StateFlow<SearchState>`, so only this class can change it. That pattern is called a backing property, and it's the topic of the next post.

If you want to test yourself, try the [val vs var interview questions](/interview/kotlin-val-vs-var/). This post is the tenth topic in Stage 1 of my [Android roadmap](/roadmap/). The previous one is [companion objects](/blog/kotlin-companion-object/).

Do you allow `var` in your data classes, or is it `val` only in your team?

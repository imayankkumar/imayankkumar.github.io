---
title: "What Is the Difference Between Inner and Nested Classes in Kotlin?"
description: "A nested class has no link to its outer object. An inner class keeps one. What the compiler generates for each, and how that hidden link can leak an Activity."
pubDate: 2026-11-18
tags: ["kotlin", "android", "inner-class", "basics"]
ogImage: "/og/kotlin-inner-class.jpg"
ogImageAlt: "Title card: What is the difference between inner and nested classes in Kotlin? Tags: inner, this$0, this@Outer, static."
cover: "../../assets/blog/covers/kotlin-inner-class.png"
coverAlt: "Title card: What is the difference between inner and nested classes in Kotlin? Tags: inner, this$0, this@Outer, static."
roadmap:
  topic: inner-vs-nested-classes
---

> **In short:** a nested class is just a class written inside another class. It has no link to any outer object. Mark it `inner` and every instance keeps a hidden reference to the outer object. That lets it use the outer class's members, but it also keeps the outer object alive for as long as the inner one lives.

One keyword looks like a small change. In the bytecode, it adds a field to every object you create.

Have you ever added `inner` just to make a red error go away in Android Studio? It works, the code compiles, and you move on. But that keyword changes what your object holds in memory. In an Activity, that can be the difference between a clean screen and a leak.

This post covers what a nested class is, what `inner` adds, what the compiler generates for each, and when to use `inner`.

## What is a nested class in Kotlin?

A nested class is a class declared inside another class. By default, it has no connection to any object of the outer class. The outer class only works like a namespace.

```kotlin
class OrderTracker(val orderId: String) {

    class DeliveryStop(val name: String, val etaMinutes: Int)
}

val stop = OrderTracker.DeliveryStop("Restaurant", 12)   // no OrderTracker needed
```

A delivery stop makes sense on its own, so you create a `DeliveryStop` without any `OrderTracker`. Because there is no outer object, the nested class can't read `orderId`. If you try, Kotlin 2.4.21 stops you with:

```
Outer class 'class OrderTracker : Any' of non-inner class cannot be used as receiver.
```

This is the error that makes many of us reach for `inner`.

## What changes when you add inner?

An [inner class](https://kotlinlang.org/docs/nested-classes.html#inner-classes) belongs to one object of the outer class. It can read and call that object's members, including private ones.

```kotlin
class OrderTracker(val orderId: String) {

    inner class StatusLabel {
        fun text() = "Order $orderId"
        fun tracker() = this@OrderTracker
    }
}

val tracker = OrderTracker("A12")
val label = tracker.StatusLabel()   // needs an OrderTracker
```

Two things are different now:

- **You create it from an outer object:** `tracker.StatusLabel()`. Calling `OrderTracker.StatusLabel()` fails with "Constructor of the inner class ... can only be called with a receiver of the containing class."
- **Inside it, `this` means the inner object.** To get the outer object, you use a [qualified this](https://kotlinlang.org/docs/this-expressions.html#qualified-this): `this@OrderTracker`.

Java works the other way around. In Java, a class inside a class is inner by default, and you write `static` to cut the link. Kotlin makes the safe version the default, and you opt in with `inner`.

## What does the compiler generate?

You can see this in Android Studio. Open the Kotlin file, go to **Tools > Kotlin > Show Kotlin Bytecode**, and click **Decompile**. Here is the shape of the decompiled Java (Kotlin 2.4.21, JVM target 17):

```java
// Nested class: static, no link to OrderTracker
public static final class DeliveryStop {
    private final String name;
    private final int etaMinutes;

    public DeliveryStop(String name, int etaMinutes) { ... }
}

// Inner class: not static, one extra field
public final class StatusLabel {
    final OrderTracker this$0;            // the hidden reference

    public StatusLabel(OrderTracker this$0) {
        this.this$0 = this$0;
    }
}
```

What to notice:

- **The nested class is `static`.** Its constructor takes only its own parameters.
- **The inner class gets a field called `this$0`.** It points to the outer object. It is package-private and marked synthetic (made by the compiler), so you can't see it in Kotlin.
- **The constructor gets an extra first parameter.** `tracker.StatusLabel()` in Kotlin becomes `new StatusLabel(tracker)` in bytecode.
- **`this@OrderTracker` is just a read of `this$0`.**

One more detail. When an inner class uses a private member of the outer class, Kotlin still generates small helper methods in the outer class. For a private property `total`, it adds `access$getTotal$p`. On Kotlin 2.4.21 you get them with JVM target 17 and with 21, because Kotlin doesn't use Java's newer nest-based access. You can find them in the same Show Kotlin Bytecode window.

## How can an inner class leak an Activity?

The `this$0` field is a strong reference. As long as something holds the inner object, the outer object can't be garbage collected. That's fine when both die together. It's a problem when the inner object is given to something that lives longer.

```kotlin
fun interface StatusListener { fun onStatus(status: String) }

object OrderUpdates {            // lives as long as the app process
    private val listeners = mutableListOf<StatusListener>()
    fun add(listener: StatusListener) { listeners += listener }
    fun remove(listener: StatusListener) { listeners -= listener }
}

// Almost right: added in onCreate, never removed
class OrderTrackingActivity : AppCompatActivity() {
    private lateinit var statusText: TextView

    inner class StatusUpdater : StatusListener {
        override fun onStatus(status: String) { statusText.text = status }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        OrderUpdates.add(StatusUpdater())
    }
}

// Right: the listener lives only while the screen is visible
class OrderTrackingActivity : AppCompatActivity() {
    private lateinit var statusText: TextView
    private val updater = StatusUpdater()

    inner class StatusUpdater : StatusListener {
        override fun onStatus(status: String) { statusText.text = status }
    }

    override fun onStart() { super.onStart(); OrderUpdates.add(updater) }
    override fun onStop() { OrderUpdates.remove(updater); super.onStop() }
}
```

In the first version, rotate the phone once. The old Activity is destroyed, but `OrderUpdates` still holds the old `StatusUpdater`. Its `this$0` still points to the old Activity, and the Activity holds its whole view tree. Rotate again and another one stays in memory.

<picture>
  <source media="(max-width: 640px)" type="image/webp" srcset="/blog/kotlin-inner-class/kotlin-inner-class-mobile.webp" width="960" height="2077" />
  <source media="(max-width: 640px)" srcset="/blog/kotlin-inner-class/kotlin-inner-class-mobile.png" width="960" height="2077" />
  <source type="image/webp" srcset="/blog/kotlin-inner-class/kotlin-inner-class.webp" width="1600" height="780" />
  <img src="/blog/kotlin-inner-class/kotlin-inner-class.png" width="1600" height="780" loading="lazy" decoding="async" alt="Diagram: how an inner class keeps an Activity alive. OrderUpdates, a singleton, holds the StatusUpdater listener. The listener's hidden this$0 field points to the destroyed OrderTrackingActivity, which holds its views. A nested class has no this$0 arrow." />
</picture>

Notice the fix. The second version is still an `inner` class. What changed is its lifetime: it is removed in `onStop`, so nothing outlives the screen. Making the class nested and passing it `statusText` would not fix the first version. A View keeps a reference to [its Context](https://developer.android.com/reference/android/view/View#getContext()), which here is the Activity. So the real question isn't "inner or nested?" A better question is:

Does this object live longer than its outer object?

Android Lint warns about one common case. If you declare a `Handler` as an inner class, the [HandlerLeak check](https://googlesamples.github.io/android-custom-lint-rules/checks/HandlerLeak.md.html) says "This Handler class should be static or leaks might occur". A delayed message on the main thread holds the Handler until it runs, and an inner Handler holds the Activity. In new code, if `OrderUpdates` exposed a `Flow`, collecting it with [`repeatOnLifecycle`](https://developer.android.com/topic/libraries/architecture/coroutines#restart) would start and stop the collection for you.

## When should you use inner?

Use `inner` when the inner object is a small helper of one outer object and never lives longer than it. A `RecyclerView` adapter's ViewHolder that calls the adapter's click handler is a common example. Both are created and dropped together.

Use a plain nested class for everything else: builders, small helper types, or [sealed class](/blog/kotlin-sealed-class/) subtypes grouped under a parent. If the class only needs one value, pass that value in instead of the whole outer object.

## Nested vs inner class: quick comparison

| | Nested class | Inner class |
| --- | --- | --- |
| Keyword | none (default) | `inner` |
| Holds the outer object | No | Yes, in `this$0` |
| How you create it | `Outer.Nested()` | `outer.Inner()` |
| Uses outer members directly | No | Yes, including private |
| Java equivalent | `static` nested class | inner (non-static) class |
| Can keep the outer object alive | No | Yes, while it is reachable |

## Frequently asked questions

**Is a Kotlin nested class the same as a Java static nested class?**
Yes. It compiles to a `static` nested class. The [data class post](/blog/kotlin-data-class/) also looks at what Kotlin generates for you behind one keyword.

**Can a nested class read private members of the outer class?**
Yes, if it has an instance. If `OrderTracker` had a `private val secret`, a nested class could still read it with `fun peek(t: OrderTracker) = t.secret`. What it can't do is read them without an instance, because it has no `this$0`.

**Does every `object :` expression or lambda hold the outer class?**
No. On Kotlin 2.4.21, an `object :` expression or a lambda only stores the outer object if its body uses something from the outer class. One that uses nothing from the outer class gets no `this$0`. This is easy to break by accident: one `statusText` inside the lambda brings the whole Activity in.

## What should you remember?

A nested class is a class in a namespace. An inner class is a class with a hidden pointer to its outer object. The pointer is what gives you `this@Outer`, and it's also what keeps the outer object alive. Before you give an inner object to something long-lived, check who removes it.

This post is the fifth topic in Stage 1 of my [Android roadmap](/roadmap/). The previous one is [sealed classes](/blog/kotlin-sealed-class/).

Do you have a listener in your app that is added in `onCreate` and never removed?

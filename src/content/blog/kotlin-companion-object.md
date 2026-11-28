---
title: "What Is a Companion Object in Kotlin, and How Is It Different from static?"
description: "What a Kotlin companion object is, how it differs from Java static, what the compiler turns it into, and how @JvmStatic, const val and @JvmField change Java calls."
pubDate: 2026-11-28
tags: ["kotlin", "android", "companion object", "basics"]
ogImage: "/og/kotlin-companion-object.jpg"
ogImageAlt: "Title card: What is a companion object in Kotlin, and how is it different from static? Tags: companion object, @JvmStatic, const val."
cover: "../../assets/blog/covers/kotlin-companion-object.png"
coverAlt: "Title card: What is a companion object in Kotlin, and how is it different from static? Tags: companion object, @JvmStatic, const val."
roadmap:
  topic: companion-objects
---

> **In short:** a companion object is an object that lives inside a class. You call its members with the class name, like `Otp.parse("482913")`, the way you'd call `static` in Java. But it is a real object: it can implement an interface and you can pass it around. Kotlin creates it once, the first time the class is used.

Java has `static`. Kotlin doesn't.

Say your login screen uses a one-time password (OTP). Every code has 6 digits, and you want one place that checks a code before an `Otp` is created. In Java you'd write `static final int LENGTH = 6` and `static Otp parse(String text)`. In Kotlin, `static` isn't a keyword.

Kotlin's answer is the companion object. This post covers what it is, why it isn't the same as `static`, what the compiler turns it into, and how Java code calls it.

## What is a companion object?

A companion object is an [object](/blog/kotlin-object/) declared inside a class with the `companion` keyword. Its members belong to the class, not to any one instance:

```kotlin
class Otp private constructor(val code: String) {

    companion object {
        const val LENGTH = 6

        fun parse(text: String): Otp? {
            if (text.length != LENGTH || !text.all { it.isDigit() }) return null
            return Otp(text)
        }
    }
}

val otp = Otp.parse("482913")   // an Otp
val bad = Otp.parse("12")       // null
println(Otp.LENGTH)             // 6
```

Here, we call `parse()` and read `LENGTH` with the class name. We don't need an `Otp` first.

A few rules, checked on Kotlin 2.4.21:

- A class can have only one. A second one fails with "Only one companion object is allowed per class."
- Its default name is `Companion`. You can give it your own: `companion object Factory`.
- You can't reach its members through an instance. `otp.parse("482913")` doesn't compile, while Java lets you call a static method on an instance.

## Why use it to create objects?

The companion object sits inside the class, so it can call the private constructor. That gives you one controlled way to create instances:

```kotlin
// Almost right: the constructor is public
class Otp(val code: String) {
    companion object {
        fun parse(text: String): Otp? { /* check, then Otp(text) */ }
    }
}

val otp = Otp("12")   // compiles and skips the check

// Right: only parse() can create an Otp
class Otp private constructor(val code: String) {
    companion object {
        fun parse(text: String): Otp? { /* check, then Otp(text) */ }
    }
}

val otp = Otp("12")
// Cannot access 'constructor(code: String): Otp': it is private in 'Otp'.
```

The first version looks fine, but anyone can call `Otp("12")` and get a broken code. With a private constructor, every `Otp` goes through `parse()`, so every `Otp` in your app has 6 digits.

On Android you'll see the same idea in a Fragment's `newInstance()` function and in constants like `TAG` and bundle keys.

## How is it different from static?

The functions in a companion object are not static. They are [instance members of one real object](https://kotlinlang.org/docs/object-declarations.html#companion-objects), `Otp.Companion`.

Because it is a real object, it can do two things `static` can't. It can implement an interface, and you can pass it as a value:

```kotlin
interface Parser<T> {
    fun parse(text: String): T?
}

class Otp private constructor(val code: String) {
    companion object : Parser<Otp> {
        override fun parse(text: String): Otp? { /* same as before */ }
    }
}

fun <T> readField(text: String, parser: Parser<T>): T? = parser.parse(text)

readField("482913", Otp)   // Otp here means Otp.Companion
```

You already use this when you write `coroutineContext[Job]`. In kotlinx.coroutines, `Job` has a [companion object named `Key`](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/common/src/Job.kt) that implements `CoroutineContext.Key<Job>`, so the name `Job` works as the lookup key.

You can also add functions to a companion from outside, with an [extension](https://kotlinlang.org/docs/extensions.html#companion-object-extensions):

```kotlin
fun Otp.Companion.fromSms(sms: String): Otp? =
    Regex("\\d{6}").find(sms)?.value?.let { parse(it) }

Otp.fromSms("Your code is 105377. Do not share it.")
```

This only works if the class declares a companion object, even an empty one.

## What does the compiler turn it into?

Here is the decompiled Java for the first `Otp` (Kotlin 2.4.21, trimmed):

```java
public final class Otp {
    public static final Otp.Companion Companion = new Otp.Companion(null);
    public static final int LENGTH = 6;
    private final String code;

    private Otp(String code) {
        this.code = code;
    }

    public static final class Companion {
        private Companion() {
        }

        public final Otp parse(String text) {
            // check, then: return new Otp(text, null);
        }
    }
}
```

Here, we can see three things:

1. **`Companion` is a nested class with a private constructor.** Its only instance is kept in a static field of `Otp`. When you write `Otp.parse("482913")`, Kotlin calls `Otp.Companion.parse("482913")`.
2. **`parse()` is an instance method, not a static one.** That's why the companion can implement an interface.
3. **Properties are stored in `Otp`, not in `Companion`.** `const val LENGTH` becomes a public constant, and the compiler copies `6` into every place that reads it.

<picture>
  <source media="(max-width: 640px)" type="image/webp" srcset="/blog/kotlin-companion-object/kotlin-companion-object-mobile.webp" width="960" height="1741" />
  <source media="(max-width: 640px)" srcset="/blog/kotlin-companion-object/kotlin-companion-object-mobile.png" width="960" height="1741" />
  <source type="image/webp" srcset="/blog/kotlin-companion-object/kotlin-companion-object.webp" width="1600" height="780" />
  <img src="/blog/kotlin-companion-object/kotlin-companion-object.png" width="1600" height="780" loading="lazy" decoding="async" alt="Diagram: many Otp instances, one companion. Each Otp instance has its own code. All of them share one Otp.Companion, which holds LENGTH and parse(). You call it with the class name, and Kotlin creates it the first time Otp is used." />
</picture>

## When is it created?

The companion is created in the static block of `Otp`. The JVM runs that block once, the first time your code really uses `Otp`, for example when you call `Otp.parse()`. This [matches a Java static initializer](https://kotlinlang.org/docs/object-declarations.html#companion-objects), so creation is thread-safe.

Reading `Otp.LENGTH` doesn't count. A `const val` is copied into your code when it compiles, so reading it never touches `Otp`. I checked this with a `println` in the companion's `init` block: it printed on the first `parse()` call, not on the `LENGTH` read.

There is one companion for the whole class, shared by every instance. A `var attempts` inside it is shared by every OTP screen in the app and stays until the process dies. If you need state per screen, keep it in the screen's ViewModel instead.

## How do you call it from Java?

From Kotlin, all of these look the same. From Java, they don't:

| In the companion | Java call | What the compiler makes |
| --- | --- | --- |
| `fun parse()` | `Otp.Companion.parse()` | An instance method on `Companion` |
| `@JvmStatic fun parse()` | `Otp.parse()` | Also a static method on `Otp` that calls `Companion` |
| `val MAX_TRIES = 3` | `Otp.Companion.getMAX_TRIES()` | A private static field on `Otp`, a getter on `Companion` |
| `const val LENGTH = 6` | `Otp.LENGTH` | A public static constant, copied into callers |
| `@JvmField val HINT = "------"` | `Otp.HINT` | A public static field, no getter |

[`@JvmStatic`](https://kotlinlang.org/docs/java-to-kotlin-interop.html#static-methods) keeps the method on `Companion` too, so the interface still works. [`const val`](https://kotlinlang.org/docs/properties.html#compile-time-constants) only allows primitive types and `String`. For other types, use [`@JvmField`](https://kotlinlang.org/docs/java-to-kotlin-interop.html#static-fields).

## Frequently asked questions

**Should I use a companion object or a top-level function?**
A top-level function lives in the file, next to the class. In a file named `Otp.kt`, Java calls it as `OtpKt.parse()`. Use it for helpers that don't need the class's private parts. Use a companion object when the function needs the private constructor, or when `Otp.parse()` reads better.

**Does `@JvmStatic` make Kotlin calls faster?**
No. Kotlin code still calls `Otp.Companion.parse()`. The static method is only for Java callers.

**Can I have a companion object in an interface?**
Yes. `Job` in kotlinx.coroutines is an interface, and its companion `Key` is what makes `coroutineContext[Job]` work.

## What should you remember?

A companion object is one real object inside a class. You call it with the class name, it can use the class's private constructor, and Kotlin creates it the first time the class is used. It isn't `static`, but `@JvmStatic`, `const val` and `@JvmField` make it look static to Java.

If you want to test yourself, try the [companion object interview questions](/interview/kotlin-companion-object/). This post is the ninth topic in Stage 1 of my [Android roadmap](/roadmap/). The previous one is [objects](/blog/kotlin-object/).

Do you keep constants in a companion object or at the top level of the file?

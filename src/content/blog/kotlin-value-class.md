---
title: "What Is a Value Class in Kotlin, and When Does It Create an Object?"
description: "What a Kotlin value class is, what the compiler turns it into, and the exact cases where it creates a real object."
pubDate: 2026-11-26
tags: ["kotlin", "android", "value-class", "basics"]
ogImage: "/og/kotlin-value-class.jpg"
ogImageAlt: "Title card: What is a value class in Kotlin, and when does it create an object? Tags: value class, @JvmInline, Email, boxing."
cover: "../../assets/blog/covers/kotlin-value-class.png"
coverAlt: "Title card: What is a value class in Kotlin, and when does it create an object? Tags: value class, @JvmInline, Email, boxing."
roadmap:
  topic: value-classes
---

> **In short:** a value class wraps one value and gives it its own type, like `Email` instead of a plain `String`. The compiler checks the type, but at runtime Kotlin passes the plain `String`, so no extra object is created. It creates a real object only when the value is used as another type, like `Any`, a generic type or an item in a list.

To the compiler, an email and a phone number are both `String`. With value classes, they become two different types.

Look at this function:

```kotlin
fun sendOtp(email: String, phone: String)

sendOtp(user.phone, user.email)   // compiles, but the arguments are swapped
```

It compiles, so nothing warns you. The bug shows up later, when a user says the code never arrived.

This post covers what a value class is, what the compiler turns it into, and when it creates an object.

## What is a value class in Kotlin?

A value class wraps exactly one value and gives it a new type:

```kotlin
@JvmInline
value class Email(val value: String) {
    init {
        require("@" in value) { "Not an email: $value" }
    }
}

@JvmInline
value class PhoneNumber(val value: String)

fun sendOtp(email: Email, phone: PhoneNumber) { /* ... */ }
```

Here, `Email` and `PhoneNumber` both hold a `String`, but they are different types. Now the swap doesn't compile:

```kotlin
sendOtp(user.phone, user.email)
// Argument type mismatch: actual type is 'PhoneNumber', but 'Email' was expected.
```

The `init` block also checks the value, so an `Email` without an `@` fails as soon as you create it.

A few rules, checked on Kotlin 2.4.21:

- It holds exactly one `val`, declared in the constructor.
- On the JVM it needs the `@JvmInline` annotation.
- It can have functions and an `init` block, and it can implement interfaces. It can't extend a class.
- `===` doesn't compile for it. Use `==`.

You already use value classes: `UInt`, `Duration` and `Result` in the standard library, and [`Dp`](https://github.com/androidx/androidx/blob/androidx-main/compose/ui/ui-unit/src/commonMain/kotlin/androidx/compose/ui/unit/Dp.kt) and `Color` in Compose.

## Why not use a typealias or a normal class?

`typealias Email = String` is only a second name for `String`. A `String` still fits where an `Email` is expected, so the swap still compiles. The [Kotlin docs](https://kotlinlang.org/docs/inline-classes.html#inline-classes-vs-type-aliases) say this directly.

A normal class, or a [data class](/blog/kotlin-data-class/), does give you a new type. But every `Email` you create is one more object in memory.

A value class gives you the type check of a class, and in most places the cost of a plain `String`.

## What does the compiler turn it into?

Let's create an `Email` and a `PhoneNumber`, and pass them to `sendOtp`:

```kotlin
fun sendOtp(email: Email, phone: PhoneNumber) {
    println("Sending OTP to ${email.value} and ${phone.value}")
}

fun main() {
    val email = Email("asha@example.com")
    val phone = PhoneNumber("+91 98765 43210")
    sendOtp(email, phone)
}
```

Now, let's see the decompiled Java (Kotlin 2.4.21, cleaned up a little):

```java
// Inside the Email class: what Email("...") calls
public static String constructor-impl(String value) {
    if (!value.contains("@")) {
        throw new IllegalArgumentException("Not an email: " + value);
    }
    return value;
}

public static final void main() {
    String email = Email.constructor-impl("asha@example.com");
    String phone = PhoneNumber.constructor-impl("+91 98765 43210");
    sendOtp-JkvqDOU(email, phone);
}

public static final void sendOtp-JkvqDOU(String email, String phone) {
    System.out.println("Sending OTP to " + email + " and " + phone);
}
```

Here, we can see three things:

1. **`Email("...")` doesn't create an object.** There is no `new Email(...)`. Kotlin calls a static function, `constructor-impl`. It runs your `init` check and returns the same `String`. So the `email` variable is a plain `String`.
2. **The parameters are plain strings.** `sendOtp` takes two `String` values. The `Email` and `PhoneNumber` types only exist for the compiler.
3. **The function name changed** to `sendOtp-JkvqDOU`. Kotlin adds this hash so that `sendOtp(Email, PhoneNumber)` and a `sendOtp(String, String)` don't become the same method. Java can't call a name with a `-` in it, so Java code can't call this function.

## When does a value class create an object?

The [Kotlin docs](https://kotlinlang.org/docs/inline-classes.html#representation) give one rule: a value class becomes a real object whenever it is used as another type. This is called boxing.

I checked each case in the decompiled Java:

| How you use `Email` | Object created |
| --- | --- |
| Parameter, return value, local variable | No |
| Property of another class | No |
| `a == b` and `"$email"` | No |
| `Email?` | No |
| As `Any`, a generic `T`, or an interface | Yes |
| In a `List`, `Set` or `Map` | Yes |
| Passed to a lambda `(Email) -> Unit` that isn't inline | Yes |

The nullable case depends on what is inside. `Email?` stays a `String`, because a `String` can already be `null`. But if a value class wraps an `Int`, like `value class Age(val value: Int)`, then `Age?` becomes an object. An `int` can't be `null`, so Kotlin needs an object to hold the `null`. It's the same reason `Int?` becomes a Java `Integer` (see the [null safety post](/blog/kotlin-null-safety/)).

<picture>
  <source media="(max-width: 640px)" type="image/webp" srcset="/blog/kotlin-value-class/kotlin-value-class-mobile.webp" width="960" height="1920" />
  <source media="(max-width: 640px)" srcset="/blog/kotlin-value-class/kotlin-value-class-mobile.png" width="960" height="1920" />
  <source type="image/webp" srcset="/blog/kotlin-value-class/kotlin-value-class.webp" width="1600" height="738" />
  <img src="/blog/kotlin-value-class/kotlin-value-class.png" width="1600" height="738" loading="lazy" decoding="async" alt="Diagram: raw value or real object? A value class stays a raw value as a parameter, a property, in an equals check or string, and as a nullable type when it wraps a String. It becomes a real object as Any, a generic T or an interface, inside a List, Set or Map, in a lambda, and as a nullable type when it wraps an Int or Long." />
</picture>

For most code, this doesn't matter. It matters in code that runs thousands of times, like a long list or drawing on screen. There, prefer plain parameters over `List<Email>` or `Any`, and measure before you change anything.

## Inline class or value class?

They are the same feature. Kotlin 1.3 added it as `inline class`, in [Alpha](https://kotlinlang.org/docs/whatsnew13.html). The name confused people, because inline functions are always inlined, but these classes are not: as the table shows, they sometimes become objects.

So [Kotlin 1.5](https://kotlinlang.org/docs/whatsnew15.html#inline-classes) renamed it to `value class` with `@JvmInline`. Old `inline class` code still compiles on Kotlin 2.4.21, with the warning "'inline' modifier is deprecated. Use 'value' instead."

## Frequently asked questions

**Can Java code call a value class?**
Not easily, because of the changed names. Add `@JvmName("sendOtpJava")` to a function to keep a normal name. Kotlin 2.2 also added [`@JvmExposeBoxed`](https://kotlinlang.org/docs/whatsnew22.html), which adds Java-friendly versions of your functions. It is still experimental.

**Can a value class hold two values?**
No. It holds exactly one. For two values, use a normal class or a data class.

**Does `==` create an object?**
No. Kotlin compares the two `String` values directly. `===` doesn't compile for value classes.

## What should you remember?

A value class gives a plain value its own type, so the compiler catches mix-ups like a swapped email and phone number. At runtime it is usually just the plain value. It becomes an object when used as `Any`, a generic type, an interface, in a collection or a lambda, or as nullable when it wraps an `Int` or `Long`.

If you want to test yourself, try the [value class interview questions](/interview/kotlin-value-class/). This post is the seventh topic in Stage 1 of my [Android roadmap](/roadmap/). The previous one is [enum classes](/blog/kotlin-enum-class/).

Which two values in your app share the same type today, and what happens if someone swaps them?

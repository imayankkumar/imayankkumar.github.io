---
title: "What Is an Object in Kotlin, and How Is It Different from a Class?"
description: "What a Kotlin object is, how it differs from a class, what the compiler turns it into, and when to use an object expression or a data object."
pubDate: 2026-11-27
tags: ["kotlin", "android", "object", "basics"]
ogImage: "/og/kotlin-object.jpg"
ogImageAlt: "Title card: What is an object in Kotlin, and how is it different from a class? Tags: object, INSTANCE, object :, data object."
cover: "../../assets/blog/covers/kotlin-object.png"
coverAlt: "Title card: What is an object in Kotlin, and how is it different from a class? Tags: object, INSTANCE, object :, data object."
roadmap:
  topic: objects
---

> **In short:** a class is a blueprint. You call its constructor and get a new instance each time. An `object` is a class with exactly one instance. Kotlin creates it the first time you use it, and you reach it by its name.

A class can have many instances. An object always has one.

Say you keep the signed-in user in a class:

```kotlin
class Session {
    var email: String? = null
}

// Login screen
Session().email = "hello@imayankkumar.com"

// Profile screen
println(Session().email)   // null
```

Every `Session()` creates a new instance, so the profile screen reads an empty one. You want one session that every screen shares. That is what `object` is for.

This post covers what an object is, what the compiler turns it into, and two more uses of the `object` keyword: object expressions and data objects.

## What is an object in Kotlin?

An object declaration creates a class and its only instance in one step:

```kotlin
object Session {
    var email: String? = null

    init {
        println("Session created")
    }

    fun isLoggedIn(): Boolean = email != null
}

// Login screen
Session.email = "hello@imayankkumar.com"

// Profile screen
println(Session.email)   // hello@imayankkumar.com
```

Here, there is no `Session()`. You use the name `Session`, and every screen gets the same instance.

A few rules, checked on Kotlin 2.4.21:

- It can't have a constructor. The compiler says "Objects cannot have constructors."
- It can have properties, functions and an `init` block. It can extend a class and implement interfaces.
- It [can't be declared inside a function](https://kotlinlang.org/docs/object-declarations.html#object-declarations). Use an object expression there.

## How is an object different from a class?

| Feature | Class | Object |
| --- | --- | --- |
| Instances | As many as you create | Exactly one |
| How you get one | Call the constructor: `Session()` | Use the name: `Session` |
| Constructor | Yes, with parameters | No |
| When it's created | When you call the constructor | The first time you use it |
| Good for | Things with many copies: users, orders | One shared thing: a cache, a registry, settings |

## What does the compiler turn it into?

Here is the decompiled Java for `Session` (Kotlin 2.4.21, getter and setter removed):

```java
public final class Session {
    public static final Session INSTANCE = new Session();
    private static String email;

    private Session() {
    }

    public final boolean isLoggedIn() {
        return email != null;
    }

    static {
        System.out.println("Session created");
    }
}
```

Here, we can see three things:

1. **`INSTANCE` is the one instance**, kept in a static field. When you write `Session.isLoggedIn()`, Kotlin calls `Session.INSTANCE.isLoggedIn()`.
2. **The constructor is private**, so no other code can create a second `Session`.
3. **The `init` block moves into a `static` block.** Properties are set and `init` runs in the order you wrote them.

It's the classic Java singleton, written for you.

## When is it created, and is it thread-safe?

The JVM runs a class's `static` block once, the first time your code uses the class. If two threads arrive at the same moment, one waits. So [creating an object is thread-safe and done on first access](https://kotlinlang.org/docs/object-declarations.html#object-declarations).

But only the *creation* is thread-safe. If two threads change `Session.email` at once, the object doesn't protect you. Use a `StateFlow`, an atomic type or a lock, like for any shared variable.

On Android, an object lives as long as the app process. That has two effects:

- **It doesn't survive process death.** When [Android kills your app in the background](https://developer.android.com/guide/components/activities/process-lifecycle), the object is gone. When the user comes back, Kotlin creates a new `Session`, and `email` is `null` again.
- **It can leak memory.** If an object holds an `Activity` or a `View`, that screen can't be freed, because the object never goes away.

## What is an object expression?

An object expression creates an object with no name, right where you write it. You use it to implement an interface once:

```kotlin
interface LoginListener {
    fun onSuccess(email: String)
    fun onError(message: String)
}

loginButton.addLoginListener(object : LoginListener {
    override fun onSuccess(email: String) { Session.email = email }
    override fun onError(message: String) { showError(message) }
})
```

It is not a singleton. In Java it becomes `new LoginListener() { ... }`, so each time this code runs, you get a new instance. It can also [read and change local variables](https://kotlinlang.org/docs/object-declarations.html#access-variables-from-anonymous-objects) around it.

That "new instance every time" causes a common bug:

```kotlin
// Almost right: this removes nothing
loginButton.addLoginListener(object : LoginListener { /* ... */ })
loginButton.removeLoginListener(object : LoginListener { /* ... */ })

// Right: keep one reference and use it twice
private val listener = object : LoginListener { /* ... */ }

loginButton.addLoginListener(listener)
loginButton.removeLoginListener(listener)
```

The first version compiles. But the second `object :` is a new, different object, so nothing is removed, and the first listener keeps running after the screen is gone.

For a `fun interface` with one function, a lambda is shorter. Use `object :` when there are two or more functions.

## What is a data object?

A data object is an object with a readable `toString()`. You'll use it most in [sealed](/blog/kotlin-sealed-class/) state, next to [data classes](/blog/kotlin-data-class/):

```kotlin
sealed interface AuthState {
    data object LoggedOut : AuthState
    data class LoggedIn(val email: String) : AuthState
}

println(AuthState.LoggedOut)
// LoggedOut

println(AuthState.LoggedIn("hello@imayankkumar.com"))
// LoggedIn(email=hello@imayankkumar.com)
```

With a plain `object LoggedOut`, the first line prints something like `AuthState$LoggedOut@3fee733d`, which is hard to read in logs.

What `data` adds, from the decompiled Java:

- `toString()` returns only the name, `"LoggedOut"`, even if the object has properties.
- `equals()` checks the type, so every `LoggedOut` is equal. Compare with `==`, [never `===`](https://kotlinlang.org/docs/object-declarations.html#data-objects): reflection or serialization can create a second instance.
- `hashCode()` returns a fixed number.

There is no `copy()` or `component1()`, because there's only one instance and nothing to copy. Data objects were [stable in Kotlin 1.9.0](https://kotlinlang.org/docs/whatsnew19.html#stable-data-objects-for-symmetry-with-data-classes).

<picture>
  <source media="(max-width: 640px)" type="image/webp" srcset="/blog/kotlin-object/kotlin-object-mobile.webp" width="960" height="2103" />
  <source media="(max-width: 640px)" srcset="/blog/kotlin-object/kotlin-object-mobile.png" width="960" height="2103" />
  <source type="image/webp" srcset="/blog/kotlin-object/kotlin-object.webp" width="1600" height="1024" />
  <img src="/blog/kotlin-object/kotlin-object.png" width="1600" height="1024" loading="lazy" decoding="async" alt="Diagram: class or object? A class gives you many instances, one each time you call its constructor. An object gives you exactly one, created the first time you use it. An object expression creates a new instance each time the code runs. A data object is one instance that prints its name, like LoggedOut." />
</picture>

## Frequently asked questions

**Is an object the same as `static` in Java?**
Close, but no. Its functions run on one real instance, `Session.INSTANCE`, so it can implement interfaces and be passed around. For static-like members inside a class, Kotlin has the companion object, the topic of the next post.

**Can an object take parameters?**
No, because it has no constructor. If you need a value at creation time, use a class.

**Should I use an object or dependency injection?**
An object is easy to reach from anywhere, which also makes it hard to replace in tests. Use it for small things with no dependencies. For a repository, a singleton from your DI library is easier to test.

## What should you remember?

A class is a blueprint for many instances. An `object` is one instance, created on first use and kept for the life of the process. `object :` creates a new, unnamed instance each time the code runs. A `data object` is an object that prints its name.

If you want to test yourself, try the [object interview questions](/interview/kotlin-object/). This post is the eighth topic in Stage 1 of my [Android roadmap](/roadmap/). The previous one is [value classes](/blog/kotlin-value-class/).

Which objects in your app hold state that should still be there after process death?

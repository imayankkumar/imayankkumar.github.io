/**
 * Interview questions (/interview/).
 *
 * Two kinds of card:
 * - ladder: an opening question and the follow-ups an interviewer asks next,
 *   each with a junior answer and a senior answer.
 * - output: a short snippet and "What does this print?".
 *
 * `topic` is a roadmap topic id (src/data/roadmap.ts), so each card sits in
 * its roadmap stage and links to the post once it is published.
 */

export type Level = "Junior" | "Mid" | "Senior"

export interface LadderStep {
  question: string
  junior: string
  senior: string
  /** Full page only: a short Kotlin (or Java) snippet for this step. */
  code?: string
  codeLang?: "kotlin" | "java"
  /** Full page only: what the interviewer is really checking. */
  trap?: string
}

/** A ladder with this gets its own page at /interview/<slug>/. */
export interface LadderPage {
  slug: string
  /** Page <title> and heading, written for search. */
  title: string
  description: string
  intro: string
  /** The answer to say out loud in about 30 seconds. */
  sayIt: string
}

interface BaseCard {
  id: string
  topic: string
  level: Level
  /** A short real story from Mayank's own work. */
  story?: string
}

export interface LadderCard extends BaseCard {
  kind: "ladder"
  steps: LadderStep[]
  page?: LadderPage
}

export interface OutputCard extends BaseCard {
  kind: "output"
  question: string
  code: string
  output: string
  why: string
}

export type InterviewCard = LadderCard | OutputCard

export const interviewCards: InterviewCard[] = [
  {
    id: "null-safety-ladder",
    kind: "ladder",
    topic: "null-safety",
    level: "Junior",
    page: {
      slug: "kotlin-null-safety",
      title: "Kotlin null safety interview questions: ?. vs !!, platform types and follow-ups",
      description: "How Kotlin null safety interviews really go: ?. vs !!, when !! is acceptable, platform types from Java, and nullability annotations, with junior and senior answers and code.",
      intro: "This is almost always the first Kotlin question, and the follow-ups are where interviews are won. The opener checks that you know the operators. The follow-ups check whether you understand where null safety stops: at the boundary with Java.",
      sayIt: "Kotlin puts null into the type system: String can't be null, String? can. With a nullable value I use ?. to keep the null visible, ?: to give a default, and a null check so the compiler smart-casts. !! forces the value and crashes if I'm wrong, so I avoid it; when a null really is a bug I use requireNotNull with a message. The gap is Java: unannotated Java values are platform types, so I treat them as nullable at the boundary, or add @Nullable and @NonNull on the Java side so the compiler checks them.",
    },
    steps: [
      {
        question: "What is the difference between ?. and !! in Kotlin?",
        junior: "?. calls the member only if the value is not null, otherwise it gives null. !! throws if the value is null.",
        senior: "?. turns a nullable chain into a nullable result, so the null case stays visible in the type. !! says \"I know better than the compiler\" and moves the failure to runtime as a NullPointerException.",
        code: `val name: String? = user?.name       // null if user is null
val length = name?.length ?: 0       // Elvis gives a default
val forced = name!!.length           // NullPointerException if name is null`,
        trap: "They want to hear that !! moves the failure from compile time to runtime, and that you reach for ?: when there's a sensible default.",
      },
      {
        question: "When is !! acceptable?",
        junior: "When you are sure the value is not null.",
        senior: "Almost never in app code. If I'm sure, I'd rather make the type non-null or use requireNotNull with a message, so the crash explains itself. Tests are the one place I use it freely.",
        code: `// Crashes with no context
val id = intent.getStringExtra("id")!!

// Crashes with a message you can act on
val checkedId = requireNotNull(intent.getStringExtra("id")) {
    "DetailActivity needs an id extra"
}`,
        trap: "\"When I'm sure\" is the answer that gets a follow-up. They're checking whether you know requireNotNull, checkNotNull and error(), and whether you'd rather fix the type than force it.",
      },
      {
        question: "A Kotlin app crashes with a NullPointerException, but the code has no !!. How?",
        junior: "Maybe a Java library returned null.",
        senior: "Platform types. A value from Java without nullability annotations has type String!, so Kotlin lets you treat it as non-null. If Java returns null, it fails where you use it, or at the assignment if you declared the variable as non-null.",
        code: `// Java, no annotations:
// public String getNickname() { return null; }

val nick = javaUser.nickname        // type is String! (platform type)
println(nick.length)                // compiles, crashes at runtime

val safe: String? = javaUser.nickname   // declare it nullable yourself`,
        trap: "This separates people who memorised the operators from people who've debugged a real crash. Bonus points for knowing Kotlin adds a null check where a platform value is assigned to a non-null type.",
      },
      {
        question: "How would you make a Java API safe for Kotlin callers?",
        junior: "Check for null everywhere in Kotlin.",
        senior: "Add nullability annotations such as @Nullable and @NonNull to the Java side. Kotlin reads them and gives proper nullable or non-null types, so the compiler checks every caller.",
        codeLang: "java",
        code: `import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class UserRepository {
    @Nullable
    public String findNickname(@NonNull String id) { /* ... */ }
}
// Kotlin now sees: fun findNickname(id: String): String?`,
        trap: "They want a fix at the source, not null checks scattered through Kotlin. It's a senior signal: you fix the boundary once and every caller benefits.",
      },
    ],
  },
  {
    id: "lazy-vs-lateinit-ladder",
    kind: "ladder",
    topic: "lazy-vs-lateinit",
    level: "Mid",
    steps: [
      {
        question: "What is the difference between lazy and lateinit?",
        junior: "lazy is for val and runs the block on first use. lateinit is for var that you assign later.",
        senior: "lazy is a delegate: the value is computed once, on first read, and can't change. lateinit is a promise that a var will be assigned before it's read, which suits values set by a framework, like injected fields or test setup.",
      },
      {
        question: "What happens if you read a lateinit property before it is assigned?",
        junior: "The app crashes.",
        senior: "It throws UninitializedPropertyAccessException, which names the property. You can check first with this::name.isInitialized, but needing that check often means the design should use a nullable type or a constructor parameter.",
      },
      {
        question: "Why can't you use lateinit with Int?",
        junior: "Kotlin doesn't allow it for primitives.",
        senior: "lateinit uses null in the backing field to mean \"not assigned yet\". An Int property compiles to a primitive int, which can't hold null, so there is no way to mark it as unassigned.",
      },
      {
        question: "Is lazy thread-safe?",
        junior: "Yes.",
        senior: "By default, yes: LazyThreadSafetyMode.SYNCHRONIZED locks so the block runs once. PUBLICATION lets several threads run it and keeps the first result. NONE skips locking, which is fine when only the main thread touches it.",
      },
    ],
  },
  {
    id: "data-class-ladder",
    kind: "ladder",
    topic: "data-classes",
    level: "Junior",
    steps: [
      {
        question: "What does the data keyword give you?",
        junior: "equals, hashCode, toString and copy.",
        senior: "equals, hashCode, toString, copy and componentN functions for destructuring, all generated from the primary constructor properties.",
      },
      {
        question: "Which properties take part in equals?",
        junior: "All of them.",
        senior: "Only the ones in the primary constructor. A property declared in the class body is ignored by equals, hashCode, toString and copy.",
      },
      {
        question: "Why is a data class with var properties risky as a HashMap key?",
        junior: "Because the values can change.",
        senior: "hashCode depends on those properties. Change one after inserting the key and the map looks in the wrong bucket, so get returns null for a key that is still inside.",
      },
      {
        question: "copy() is shallow. What does that mean for a property that holds a MutableList?",
        junior: "The list is copied too.",
        senior: "The list is not copied. The original and the copy share the same list, so adding to one changes both. Use read-only List types, or copy the list yourself.",
      },
    ],
  },
  {
    id: "sealed-vs-enum-ladder",
    kind: "ladder",
    topic: "sealed-vs-enum",
    level: "Mid",
    steps: [
      {
        question: "When would you use a sealed class instead of an enum?",
        junior: "When you need more than constants.",
        senior: "An enum has a fixed set of single instances that all share the same shape. A sealed class has a fixed set of types, and each type can carry its own data, like Loading, Error(message) and Success(items).",
      },
      {
        question: "Why doesn't a when on a sealed type need an else branch?",
        junior: "Because Kotlin knows all the cases.",
        senior: "The compiler knows every direct subtype, so it can check the when is exhaustive. That is the real benefit: add a new subtype and every when that misses it stops compiling.",
      },
      {
        question: "Where can the subclasses of a sealed class live?",
        junior: "In the same file.",
        senior: "Since Kotlin 1.5, in the same package and the same module, not only the same file. That's what lets a sealed hierarchy be split across files while still being closed to outside code.",
      },
    ],
  },
  {
    id: "any-unit-nothing-ladder",
    kind: "ladder",
    topic: "any-unit-nothing",
    level: "Mid",
    steps: [
      {
        question: "What are Any, Unit and Nothing?",
        junior: "Any is like Object, Unit is like void, Nothing means no value.",
        senior: "Any is the root of every non-null type. Unit is a real type with one value, used when a function returns nothing useful. Nothing has no values at all: a function returning Nothing never returns normally.",
      },
      {
        question: "What is the type of a throw expression?",
        junior: "It doesn't have one.",
        senior: "Nothing. Because Nothing is a subtype of every type, you can write val name = input ?: throw IllegalArgumentException() and name is still a String.",
      },
      {
        question: "Why does TODO() compile inside a function that must return a String?",
        junior: "It's a special keyword.",
        senior: "It's a normal function that returns Nothing. Nothing fits wherever a String is expected, and the compiler knows the code after it can't run.",
      },
    ],
  },
  {
    id: "inline-reified-ladder",
    kind: "ladder",
    topic: "inline-and-reified",
    level: "Senior",
    steps: [
      {
        question: "What does inline do?",
        junior: "It makes the function faster.",
        senior: "The compiler copies the function body and its lambda arguments into each call site. That removes the lambda object and the call, which matters for small higher-order functions called often.",
      },
      {
        question: "Why can you return from the outer function inside forEach { }?",
        junior: "Because forEach allows it.",
        senior: "forEach is inline, so the lambda body is pasted into your function and return exits your function. That is a non-local return. With a non-inline function you'd need return@forEach.",
      },
      {
        question: "What does reified do, and why does it need inline?",
        junior: "It lets you use T as a real type.",
        senior: "Generic types are erased at runtime, so T is unknown inside a normal function. Because an inline function is copied into each call site, the compiler can put the real type there, which allows is T and T::class.",
      },
      {
        question: "When should you not mark a function inline?",
        junior: "When it is big.",
        senior: "When it takes no lambda, when the body is large, or when it's called from many places: every call site gets a copy and the bytecode grows. noinline and crossinline handle lambdas that are stored or called from another context.",
      },
    ],
  },
  {
    id: "sequences-ladder",
    kind: "ladder",
    topic: "collections-vs-sequences",
    level: "Mid",
    steps: [
      {
        question: "What is the difference between a List chain and a Sequence chain?",
        junior: "Sequences are lazy.",
        senior: "A List chain runs each step over the whole list and builds a new list each time. A Sequence passes each element through all the steps before the next element, and only when a terminal operation like toList or first runs.",
      },
      {
        question: "When is a Sequence slower?",
        junior: "It's always faster.",
        senior: "On small collections, or chains with one or two steps. The per-element overhead of the lazy machinery costs more than the temporary lists it saves. Sequences win with big inputs, many steps, or an early exit like first.",
      },
      {
        question: "You build a Sequence with map and filter but nothing prints. Why?",
        junior: "There's a bug in the lambda.",
        senior: "There's no terminal operation. Intermediate steps on a Sequence only describe the work. Nothing runs until something like toList, first or forEach asks for elements.",
      },
    ],
  },
  {
    id: "value-classes-ladder",
    kind: "ladder",
    topic: "value-classes",
    level: "Senior",
    steps: [
      {
        question: "What is a value class?",
        junior: "A class that wraps one value.",
        senior: "@JvmInline value class UserId(val value: String) gives a distinct type at compile time. At runtime it usually compiles down to the plain String, so you get type safety without an extra object.",
      },
      {
        question: "Why not just use a typealias?",
        junior: "They're the same.",
        senior: "A typealias is only another name: you can pass an OrderId where a UserId is expected. A value class is a separate type, so the compiler catches the mix-up.",
      },
      {
        question: "When does a value class get boxed?",
        junior: "Never.",
        senior: "When it's used as a generic type argument such as List<UserId>, through an interface it implements, or as a nullable type when it wraps a primitive like Int. Then the wrapper object is created, so the saving is lost.",
      },
    ],
  },
  {
    id: "sequence-order-output",
    kind: "output",
    topic: "collections-vs-sequences",
    level: "Mid",
    question: "What does this print?",
    code: `val result = listOf(1, 2, 3)
    .asSequence()
    .map { println("map $it"); it * 2 }
    .filter { println("filter $it"); it > 2 }
    .first()
println(result)`,
    output: `map 1
filter 2
map 2
filter 4
4`,
    why: "A Sequence sends one element through every step before the next. first() stops at the first match, so 3 is never mapped.",
  },
  {
    id: "data-class-body-output",
    kind: "output",
    topic: "data-classes",
    level: "Junior",
    question: "What does this print?",
    code: `data class User(val name: String) {
    var age = 0
}

val a = User("Asha").apply { age = 30 }
val b = User("Asha").apply { age = 40 }
println(a == b)
println(a)`,
    output: `true
User(name=Asha)`,
    why: "age is declared in the class body, not the primary constructor, so equals and toString ignore it.",
  },
]

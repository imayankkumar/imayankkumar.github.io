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
  /** Leave out when the step has one answer; the page then shows a single "Answer". */
  junior?: string
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
    page: {
      slug: "kotlin-data-class",
      title: "Kotlin data class interview questions",
      description: "Kotlin data class interview questions: what data generates, body properties and equals, shallow copy with StateFlow, private constructors and copy(), and var in hash keys.",
      intro: "One opener and four harder follow-ups. Each step builds on the last, the way a real interviewer digs.",
      sayIt: "A data class is a final class where the compiler writes equals, hashCode, toString, copy and componentN from the primary constructor properties. Body properties don't count, and copy is shallow, which matters with mutable lists and StateFlow. If the constructor is private, add @ConsistentCopyVisibility.",
    },
    steps: [
      {
        question: "What does the data keyword add to a class?",
        junior: "It generates equals(), hashCode(), toString(), copy() and component1()..componentN(), so two objects with the same values are equal.",
        senior: "Same five, but only from primary constructor properties. The class stays final, and it must have at least one val/var constructor parameter. You can override equals/hashCode/toString, but not copy or componentN.",
        trap: "That you know it is code generation, not a new kind of class.",
      },
      {
        question: "Are these two orders equal?",
        senior: "true. isSeen is in the body, so equals() ignores it. toString() hides it, and a.copy().isSeen is false.",
        code: `data class CartItem(val name: String, val price: Int)
data class Order(val id: String, val items: List<CartItem>) {
    var isSeen: Boolean = false
}

val items = listOf(CartItem("Lassi", 60))
val a = Order("A1", items).apply { isSeen = true }
val b = Order("A1", items)
println(a == b)   // ?`,
        trap: "The trap is saying false because \"the objects are different\".",
      },
      {
        question: "The cart screen doesn't update. Why?",
        junior: "The list was changed in place, so the new state looks equal to the old one and StateFlow skips it.",
        senior: "add() changes the list inside the current state. copy() is shallow, so the new state points to that same list and equals() returns true. StateFlow drops a value equal to the current one, so collectors never see it. Fix: read-only List and state.update { it.copy(items = it.items + item) }, which builds a new list.",
        code: `data class CartState(val items: MutableList<CartItem>)
val state = MutableStateFlow(CartState(mutableListOf()))  // in the ViewModel
val item = CartItem("Lassi", 60)

val old = state.value
old.items.add(item)
state.value = old.copy()`,
        trap: "In-place mutation + shallow copy + equality-based conflation, a real production bug.",
      },
      {
        question: "A data class has a private constructor. What's the problem?",
        senior: "The generated copy() is public, so it skips the 1..50 check in of(). Since Kotlin 2.0.20 the compiler warns about this; as of Kotlin 2.4.21 (November 2026) it is still a warning (KT-11914). @ConsistentCopyVisibility makes copy() private now; @ExposedCopyVisibility keeps it public and silences the warning on the class.",
        code: `data class Coupon private constructor(val percent: Int) {
    companion object {
        fun of(percent: Int): Coupon? =
            if (percent in 1..50) Coupon(percent) else null
    }
}

val coupon = Coupon.of(20)!!
val tooBig = coupon.copy(percent = 90)`,
      },
      {
        question: "Why prefer val in a data class you put in a set or use as a map key?",
        senior: "hashCode() uses the properties. When a var changes after the object is in a HashSet or HashMap, its hash changes, so the lookup goes to the wrong bucket and can't find an object that is still inside.",
        code: `data class Tag(var label: String)

val tag = Tag("veg")
val tags = hashSetOf(tag)
tag.label = "spicy"
println(tags.contains(tag))   // false, but tags.size is still 1`,
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
    page: {
      slug: "kotlin-any-unit-nothing",
      title: "Kotlin Any, Unit and Nothing interview questions, with follow-ups",
      description: "Interview questions on Kotlin's Any, Unit and Nothing: Unit vs void, why a throwing helper should return Nothing, and why UiState<Nothing> works, with junior and senior answers.",
      intro: "The opener sounds like a definitions question, and most people answer it with \"Any is Object, Unit is void\". The follow-ups check if you know why Unit is a real type, how Nothing helps the compiler, and why a loading state can be UiState<Nothing>.",
      sayIt: "Any is the parent of every non-null type, and Any? is the top of the whole type system. Unit is a real type with one value, Unit. A function that returns it finishes but has no useful result, and because it's a real type it works in generics like () -> Unit or Result<Unit>. On the JVM it still compiles to void. Nothing has no values. It's the type of throw, error() and TODO(), and it sits under every other type. That's why ?: throw compiles, why a helper that always throws should return Nothing so smart casts keep working, and why a Loading object can be UiState<Nothing> when T is declared out.",
    },
    steps: [
      {
        question: "What are Any, Unit and Nothing in Kotlin?",
        junior: "Any is like Object, Unit is like void, and Nothing means there is no value.",
        senior: "They are the top, a normal type, and the bottom of Kotlin's types. Any is the parent of every non-null type, and Any? is above everything, null included. Unit is a type with exactly one value, used when a function has no useful result. Nothing has no values at all, so code of type Nothing never finishes normally.",
        code: `val anything: Any? = null              // Any? accepts every value, even null
val done: Unit = clearCart()           // a real value: kotlin.Unit
val never: Nothing = error("stop")     // never gets a value: it throws`,
        trap: "\"Like Object, like void\" is a fine start but it's where the follow-ups begin. They want to hear that Unit is a real value and that Nothing is the bottom type, not just \"no value\".",
      },
      {
        question: "How is Unit different from Java's void?",
        junior: "Unit is Kotlin's name for void.",
        senior: "void means there is no value at all, so Java can't use it as a type argument. Unit is a real type with one value, so it works in generics: () -> Unit, Result<Unit>, MutableSharedFlow<Unit>. It costs nothing for normal functions, because a Unit-returning function compiles to a void method on the JVM.",
        code: `fun clearCart() { cartItems.clear() }   // JVM: public void clearCart()

val onClick: () -> Unit = { clearCart() }
suspend fun cancelOrder(id: String): Result<Unit> =
    runCatching { api.cancel(id) }
val orderPlaced = MutableSharedFlow<Unit>()  // an event with no data`,
        trap: "They're checking if you can name a place where void fails and Unit works. Java needs Callable<Void> and return null for the same thing.",
      },
      {
        question: "A helper always throws, but after calling it the compiler still says the value can be null. Why?",
        junior: "Add !! after the call.",
        senior: "The helper returns Unit, so the compiler thinks code can continue after it with the value still null. Declare the return type as Nothing. Then the compiler knows the call never comes back, and it smart casts the value to non-null on the next line. throw, error() and TODO() all have type Nothing for the same reason.",
        code: `fun stopOrder(id: String): Nothing =
    throw IllegalStateException("Order $id not loaded")

fun orderTotal(id: String): Int {
    val order = findOrder(id)              // Order?
    if (order == null) stopOrder(id)
    return order.total                     // smart cast to Order: compiles
}`,
        trap: "!! is the answer they're hoping you won't give. This step checks if you know that the return type of a function changes how the compiler reads the code after the call.",
      },
      {
        question: "Why can a Loading object be UiState<Nothing> and still be used as UiState<Order>?",
        junior: "Because Loading has no data.",
        senior: "Nothing is a subtype of every type, so it's a subtype of Order. With T declared out, UiState is covariant, which makes UiState<Nothing> a subtype of UiState<Order>. So one Loading object works for every T. Without out, the assignment fails with a type mismatch.",
        code: `sealed interface UiState<out T> {
    data object Loading : UiState<Nothing>
    data class Ready<T>(val data: T) : UiState<T>
    data class Failed(val message: String) : UiState<Nothing>
}

val state: UiState<Order> = UiState.Loading   // compiles only because of out`,
        trap: "This is the senior step. They want both halves: Nothing is the bottom type, and out (covariance) is what lets UiState<Nothing> fit into UiState<Order>.",
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

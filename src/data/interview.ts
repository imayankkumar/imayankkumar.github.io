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
    id: "sealed-class-ladder",
    kind: "ladder",
    topic: "sealed-vs-enum",
    level: "Mid",
    page: {
      slug: "kotlin-sealed-class",
      title: "Kotlin sealed class interview questions",
      description: "Kotlin sealed class interview questions: why sealed types fit UI state, exhaustive when and the else trap, where subclasses can live, indirect subclasses, and sealed class vs sealed interface.",
      intro: "One opener and four harder follow-ups. Each step builds on the last, the way a real interviewer digs.",
      sayIt: "A sealed class or interface has a closed list of subtypes, so a when over it can be checked for every case. Direct subtypes must be in the same module and package; indirect ones can live anywhere. Avoid else on a sealed when, because it hides new cases. Use a sealed interface by default, and a sealed class when subtypes share constructor data.",
    },
    steps: [
      {
        question: "What is a sealed class, and why use one for screen state?",
        junior: "It's a class with a fixed list of subclasses, so a when over it needs no else.",
        senior: "It's a type whose subtypes are all known at compile time. For screen state it replaces flags like isLoading + error + order, where wrong mixes are possible, with one value that is exactly Loading, Ready or Failed. The compiler then checks every when covers all of them.",
        trap: "That you see the real benefit: impossible states can't be written, and the compiler checks every when.",
      },
      {
        question: "You add a Cancelled state. Which function still compiles?",
        senior: "titleA still compiles, and a cancelled order now shows \"Loading\". titleB fails with \"'when' expression must be exhaustive. Add the 'is Cancelled' branch or an 'else' branch.\" That error is what you want: it lists every place that needs a decision.",
        code: `sealed interface OrderUiState {
    data object Loading : OrderUiState
    data class Ready(val total: Int) : OrderUiState
    data class Failed(val message: String) : OrderUiState
    data class Cancelled(val reason: String) : OrderUiState  // new
}

fun titleA(state: OrderUiState) = when (state) {
    is OrderUiState.Ready -> "Your order"
    is OrderUiState.Failed -> "Something went wrong"
    else -> "Loading"
}

fun titleB(state: OrderUiState) = when (state) {
    OrderUiState.Loading -> "Loading"
    is OrderUiState.Ready -> "Your order"
    is OrderUiState.Failed -> "Something went wrong"
}`,
        trap: "Seeing that else on a sealed type switches off the exhaustiveness check.",
      },
      {
        question: "Where can the direct subclasses of a sealed class live?",
        junior: "In the same file.",
        senior: "In the same module and the same package, in any file, top-level or nested. Another package fails with \"A class can only extend a sealed class or interface declared in the same package\"; another module fails even with the same package name. Local classes and anonymous objects can't extend it. \"Same file\" was the rule before Kotlin 1.5.",
        trap: "The junior answer is the pre-1.5 rule. Knowing the module part matters in a multi-module app.",
      },
      {
        question: "This class is in another module. Does it compile, and is the when still exhaustive?",
        senior: "Yes to both. The same-module and same-package rule only applies to direct subclasses. Pending is open, so UpiPending can extend it from anywhere. The is PaymentResult.Pending branch also covers UpiPending. Make Pending sealed if you want that level closed too.",
        code: `// :core:model
sealed class PaymentResult(val orderId: String) {
    class Paid(orderId: String, val receiptUrl: String) : PaymentResult(orderId)
    class Declined(orderId: String, val reason: String) : PaymentResult(orderId)
    open class Pending(orderId: String) : PaymentResult(orderId)
}

// :feature:checkout
class UpiPending(orderId: String) : PaymentResult.Pending(orderId)

fun label(r: PaymentResult) = when (r) {
    is PaymentResult.Paid -> "Paid"
    is PaymentResult.Declined -> r.reason
    is PaymentResult.Pending -> "Waiting for \${r.orderId}"
}`,
        trap: "Direct vs indirect subclasses: the closed list is only one level deep.",
      },
      {
        question: "Sealed class or sealed interface: which would you pick, and when?",
        junior: "Sealed interface for UI state, sealed class when you need a constructor.",
        senior: "A sealed class can hold constructor data and logic shared by every subtype, like orderId, but a type can extend only one class. A sealed interface has no stored state, but one type can implement several, so it can be in two closed lists, and an enum can implement it. Default to a sealed interface; use a sealed class when subtypes share constructor data.",
        code: `sealed interface CartEvent
sealed interface AnalyticsEvent

data class ItemAdded(val name: String) : CartEvent, AnalyticsEvent
enum class SortOrder : CartEvent { PRICE, RATING }`,
      },
    ],
  },
  {
    id: "inner-vs-nested-ladder",
    kind: "ladder",
    topic: "inner-vs-nested-classes",
    level: "Mid",
    page: {
      slug: "kotlin-inner-vs-nested-class",
      title: "Kotlin inner vs nested class interview questions",
      description: "Kotlin inner vs nested class interview questions: what inner adds, the hidden this$0 field, why a nested class can't read outer members, Activity leaks, and when lambdas capture the outer class.",
      intro: "One opener and four harder follow-ups. Each step builds on the last, the way a real interviewer digs.",
      sayIt: "A nested class has no link to an outer object; it compiles to a static nested class. An inner class keeps a hidden this$0 reference to its outer object, which lets it use outer members but also keeps the outer object alive. That's how an inner listener given to a long-lived object leaks an Activity. The fix is matching lifetimes, for example removing the listener in onStop.",
    },
    steps: [
      {
        question: "What is the difference between a nested class and an inner class in Kotlin?",
        junior: "An inner class can use the outer class's members. A nested class can't.",
        senior: "A nested class has no link to any outer object. It compiles to a static nested class, and you create it with Outer.Nested(). An inner class belongs to one outer object: the compiler adds a hidden this$0 field, you create it with outer.Inner(), and inside it this@Outer reads that field. Kotlin makes nested the default; Java does the opposite.",
        trap: "That you know where the access comes from: a hidden reference, not magic. That reference is also the cost.",
      },
      {
        question: "This doesn't compile. Why, and what are two ways to fix it?",
        senior: "DeliveryStop is nested, so it has no OrderTracker object to read orderId from. The error is \"Outer class ... of non-inner class cannot be used as receiver\". Fix 1: mark it inner, then create it with tracker.DeliveryStop(...). Fix 2, often better: keep it nested and pass orderId in as a constructor parameter, so it doesn't hold the whole tracker.",
        code: `class OrderTracker(val orderId: String) {
    class DeliveryStop(val name: String) {
        fun label() = "$name for order $orderId"   // error
    }
}`,
        trap: "Whether you reach for inner by reflex, or ask if the class really needs the whole outer object.",
      },
      {
        question: "What does the compiler generate for an inner class?",
        junior: "A reference to the outer class.",
        senior: "A non-static class with a field this$0 (package-private and synthetic) that points to the outer object. The constructor gets the outer object as an extra first parameter, so outer.Inner() becomes new Inner(outer). If the inner class uses a private outer member, Kotlin also adds synthetic access$ helper methods in the outer class. You can see all of it in Android Studio: Tools > Kotlin > Show Kotlin Bytecode > Decompile.",
        trap: "Reading the bytecode, not just the docs. Senior candidates can describe the constructor change.",
      },
      {
        question: "Does this leak the Activity? Would making StatusUpdater a nested class fix it?",
        senior: "Yes, it leaks. OrderUpdates lives as long as the app, it holds the listener, and the listener's this$0 holds the Activity and its views. Every rotation leaves one more Activity in memory. Making it nested and passing statusText doesn't fix it, because a View holds its Context, which is the Activity. The fix is the lifetime: add the listener in onStart and remove it in onStop, or expose a Flow and collect it with repeatOnLifecycle.",
        code: `object OrderUpdates {
    private val listeners = mutableListOf<StatusListener>()
    fun add(listener: StatusListener) { listeners += listener }
    fun remove(listener: StatusListener) { listeners -= listener }
}

class OrderTrackingActivity : AppCompatActivity() {
    private lateinit var statusText: TextView

    inner class StatusUpdater : StatusListener {
        override fun onStatus(status: String) { statusText.text = status }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        OrderUpdates.add(StatusUpdater())
    }
}`,
        trap: "\"Use a nested class\" is the textbook answer. The real question is whether the object outlives its outer object.",
      },
      {
        question: "Does every lambda or object : expression hold the outer class?",
        junior: "Yes, like an anonymous class in Java.",
        senior: "No. In Kotlin, a lambda or an object : expression only captures the outer object if its body uses something from it. Here the first Runnable gets no this$0 field; the second one does, because it reads title. One stray property inside a callback is enough to pull the whole Activity in.",
        code: `class Screen(val title: String) {
    fun quiet() = object : Runnable {
        override fun run() { println("hi") }       // no this$0
    }
    fun capturing() = object : Runnable {
        override fun run() { println(title) }      // holds Screen
    }
}`,
        trap: "Knowing Kotlin differs from old Java anonymous classes, and that capture depends on what the body uses.",
      },
    ],
  },
  {
    id: "enum-class-ladder",
    kind: "ladder",
    topic: "enum-classes",
    level: "Mid",
    page: {
      slug: "kotlin-enum-class",
      title: "Kotlin enum class interview questions",
      description: "Kotlin enum class interview questions: per-constant behavior, why an enum can't extend a class, entries vs values(), and why saving ordinal or name breaks after an update.",
      intro: "One opener and four harder follow-ups. Each step builds on the last, the way a real interviewer digs.",
      sayIt: "An enum is a fixed list of single objects known at compile time. Each constant can carry constructor values and its own behavior, and an enum can implement interfaces, but it can't extend a class because it already extends Enum. A when over an enum is checked for every constant. Use entries, not values(), which copies an array on every call. Never save ordinal or name: save your own fixed code and map unknown codes to null with a fromCode() function.",
    },
    steps: [
      {
        question: "When would you use an enum class instead of a sealed class?",
        junior: "When I have a fixed list of constants, like statuses.",
        senior: "When every option has the same shape and its values are known when you write the code, like order statuses or sort orders. Each constant is a single object. When options need their own runtime data, like an error message or a list of items, use a sealed class, because an enum constant can't hold data that only exists at runtime.",
        trap: "Whether you can say what an enum can't do, not just what it is.",
      },
      {
        question: "Can each enum constant have its own behavior? Can an enum extend a class?",
        junior: "No, all constants share the same code.",
        senior: "Yes to behavior: declare an abstract function and give each constant its own body, or implement an interface. No to extending a class: every enum already extends Enum, and a class can extend only one class. Kotlin says \"Enum classes cannot extend classes.\"",
        code: `enum class DeliverySpeed {
    STANDARD {
        override fun deliveryCharge(orderTotal: Int) = if (orderTotal >= 500) 0 else 30
    },
    EXPRESS {
        override fun deliveryCharge(orderTotal: Int) = 60
    };

    abstract fun deliveryCharge(orderTotal: Int): Int
}`,
        trap: "Many notes say constants can't have behavior. Knowing they can, and why extending a class is the real limit, shows you've used enums beyond constants.",
      },
      {
        question: "Why is entries preferred over values()?",
        junior: "entries is the newer API.",
        senior: "values() returns a new array on every call, because an array can be changed by whoever gets it, so values() === values() is false. entries, stable since Kotlin 1.9.0, returns a read-only List created once. For generic code with a reified T, use enumEntries<T>().",
        trap: "That you know the cost behind the API change, not only that the IDE suggests it.",
      },
      {
        question: "What goes wrong with this code after a few app updates?",
        senior: "Two things. The saved ordinal is a position: add CONFIRMED after PLACED, and a saved 1 now reads as CONFIRMED instead of PREPARING, with no crash. And valueOf() throws for any name it doesn't know, so a renamed constant or a new status from the server crashes older app versions. Save a fixed code you never change, and read it back with a fromCode() that returns null for unknown codes.",
        code: `prefs.edit { putInt("last_status", status.ordinal) }
val saved = OrderStatus.entries[prefs.getInt("last_status", 0)]

val fromServer = OrderStatus.valueOf(json.getString("status"))`,
        trap: "The real Android bug: saved data lives longer than the enum's current order and names.",
      },
      {
        question: "Why should a when over an enum have no else branch?",
        junior: "It's not needed because the compiler knows all constants.",
        senior: "Without else, adding a constant breaks every when that doesn't handle it, so the compiler gives you a list of places to update. With else, the new constant silently falls into the default branch and nothing warns you. Since Kotlin 1.7 this check also applies to when statements, not only expressions.",
        code: `fun label(status: OrderStatus): String = when (status) {
    OrderStatus.PLACED -> "Order placed"
    OrderStatus.PREPARING -> "Being prepared"
    OrderStatus.OUT_FOR_DELIVERY -> "On the way"
    OrderStatus.DELIVERED -> "Delivered"
}`,
        trap: "Seeing else as a hidden bug, not a convenience.",
      },
    ],
  },
  {
    kind: "ladder",
    id: "value-class-ladder",
    level: "Mid",
    topic: "value-classes",
    page: {
      slug: "kotlin-value-class",
      title: "Kotlin value class interview questions",
      description: "Kotlin value class interview questions: why not a typealias, when a value class is boxed, why function names change in bytecode, and inline class vs value class.",
      intro: "One opener and four harder follow-ups. Each step builds on the last, the way a real interviewer digs.",
      sayIt: "A value class wraps exactly one value and gives it its own type, like Email instead of String, so the compiler catches mix-ups. On the JVM it needs @JvmInline, and at runtime Kotlin passes the plain value, so usually no object is created. It is boxed when it is used as another type: Any, a generic T, an interface, an item in a collection, or a non-inline lambda. A nullable value class is boxed only when it wraps a primitive like Int. Functions that take one get a hash added to their name, so Java can't call them without @JvmName or @JvmExposeBoxed.",
    },
    steps: [
      {
        question: "What is a value class, and why use one instead of a plain String?",
        junior: "It's a lightweight wrapper class that is faster than a normal class.",
        senior: "It wraps exactly one val and gives it a new type, like Email or PhoneNumber, so you can't pass a phone number where an email is expected. On the JVM it needs @JvmInline. At runtime Kotlin passes the plain String, so in most places there is no extra object. An init block can also check the value once, when it's created.",
        code: `@JvmInline
value class Email(val value: String) {
    init { require("@" in value) { "Not an email: $value" } }
}

@JvmInline
value class PhoneNumber(val value: String)

fun sendOtp(email: Email, phone: PhoneNumber) { /* ... */ }`,
        trap: "Type safety is the main reason. Speed is only the reason it costs nothing.",
      },
      {
        question: "Why not just use typealias Email = String?",
        junior: "A typealias does the same thing.",
        senior: "A typealias is only a second name. Email and String are the same type to the compiler, so a String, or a phone number, still fits where an Email is expected and the swap still compiles. A value class is a different type, so the swap fails with \"Argument type mismatch\".",
        trap: "Knowing that typealias gives readability but no safety.",
      },
      {
        question: "When you call these functions, which ones create an Age object?",
        senior: "Only b and c. In a, the parameter is a plain int. In b, Age? wraps an Int, and an int can't be null, so Kotlin boxes it into an Age object. In c, a List can only hold objects, so every item is boxed. The rule: a value class is boxed when it is used as another type, like Any, a generic T, an interface, a collection item or a non-inline lambda. An Email? that wraps a String is not boxed, because a String can already be null.",
        code: `@JvmInline
value class Age(val value: Int)

fun a(age: Age) {}
fun b(age: Age?) {}
fun c(ages: List<Age>) {}`,
        trap: "Most people say nullable always boxes. It depends on what the value class wraps.",
      },
      {
        question: "Why does sendOtp show up as sendOtp-JkvqDOU in the bytecode? Can Java call it?",
        junior: "That's the compiler's internal name, Java can call it normally.",
        senior: "That is name mangling. The parameters compile to String, so without the hash, sendOtp(Email, PhoneNumber) would clash with any sendOtp(String, String). The dash also stops Java from calling it with a raw String. To call it from Java, add @JvmName to keep a normal name, or use @JvmExposeBoxed, added in Kotlin 2.2 and still experimental, which generates Java-friendly versions that take the boxed class.",
        code: `public static final void sendOtp-JkvqDOU(String email, String phone)`,
        codeLang: "java",
        trap: "Library authors who ship value classes in a public API need this answer.",
      },
      {
        question: "What is the difference between an inline class and a value class?",
        junior: "Value classes are a new kind of class that replaced inline classes.",
        senior: "They are the same feature. Kotlin 1.3 added it as inline class, in Alpha. The name confused people, because these classes are sometimes boxed, unlike inline functions, which are always inlined. Kotlin 1.5 made it stable as value class with @JvmInline. The annotation leaves room for a future JVM with built-in value types (Project Valhalla). The inline modifier still compiles, with a deprecation warning.",
        trap: "Knowing why it was renamed shows you understand boxing, not just the syntax.",
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

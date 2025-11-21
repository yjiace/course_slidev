---
title: Java 8 新特性
category: JAVA
tags: [JAVA, Java8, 新特性]
description: 了解Java 8 的新特性
author: 张老师
date: 2024-01-15
theme: default
highlighter: shiki
drawings: true
---


# Java 8 新特性

Java 8是Java语言的一个重要版本，引入了许多新特性，使得Java编程更加高效、简洁和强大。

Java 8引入了多项重要的新特性，包括：

- **Lambda表达式**：简化代码，增强函数式编程能力。
- **Stream API**：提供高效的数据处理方式。
- **Optional类**：减少空指针异常。
- **新的日期与时间API**：解决旧API的不足。
- **并行流优化**：提升多核处理器的利用率。

这些特性显著提升了Java的开发效率和代码可读性。

## Lambda 表达式

`Lambda`是一个`匿名函数`，我们可以把 `Lambda` 表达式理解为是**一段可以传递的代码**（将代码像数据一样进行传递）。可以写出更简洁、更灵活的代码。作为一种更紧凑的代码风格，使`Java`的语言表达能力得到了提升。

基础语法：Java8中引入了一个新的操作符 "`->`" 该操作符称为`箭头操作符`或 `Lambda 操作符`，箭头操作符将 Lambda 表达式拆分成两部分：

- **左侧**：参数列表
- **右侧**：Lambda体（功能实现）

**Lambda表达式的`参数类型`可以省略不写，因为JVM编译器可以通过上下文推断出数据类型，这称为 `类型推断`**

## 1.1 无参数，无返回值

```java
// 传统方式
Runnable r1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello World!");
    }
};
```

```java
// Lambda表达式
Runnable r2 = () -> System.out.println("Hello Lambda!");
```

## 1.2 有一个参数，无返回值

```java
// 传统方式
Consumer<String> con1 = new Consumer<String>() {
    @Override
    public void accept(String s) {
        System.out.println(s);
    }
};
```

```java
// Lambda表达式（参数的小括号可以省略）
Consumer<String> con2 = s -> System.out.println(s);
```

## 1.3 有两个以上参数，有返回值

```java
// 传统方式
Comparator<Integer> com1 = new Comparator<Integer>() {
    @Override
    public int compare(Integer o1, Integer o2) {
        return Integer.compare(o1, o2);
    }
};
```

如果Lambda体中只有一条语句，return和大括号都可以省略
```java
// Lambda表达式
Comparator<Integer> com2 = (o1, o2) -> Integer.compare(o1, o2);
```

如果Lambda体中有多条语句，需要使用大括号
```java
Comparator<Integer> com4 = (o1, o2) -> {
    System.out.println("比较两个数");
    return Integer.compare(o1, o2);
};
```

## 2、Lambda 表达式的“函数式接口”

接口中只有一个抽象方法、并用`@FunctionalInterface` 注解修饰的接口，称之为`函数式接口`


1. 自定义函数式接口

```java
@FunctionalInterface
public interface MyFun {
    // 只能有一个抽象方法
    Integer getValue(Integer num);
}
```

2. 使用自定义函数式接口

```java
public Integer operation(Integer num, MyFun mf) {
    return mf.getValue(num);
}
```

2. 调用
```java
Integer result = operation(100, x -> x * x);
System.out.println(result); // 输出10000
```

## 3、常用内置函数式接口

### 3.1 消费型接口 `Consumer<T>`

```java
@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);
}
```

```java
// 使用示例
Consumer<String> con = s -> System.out.println(s);
con.accept("Hello Consumer");
```

===

### 3.2 供给型接口 `Supplier<T>`

```java
@FunctionalInterface
public interface Supplier<T> {
    T get();
}
```

```java
// 使用示例
Supplier<String> sup = () -> "Hello Supplier";
String str = sup.get();
System.out.println(str);
```

===

### 3.3 函数型接口 `Function<T, R>`

```java
@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);
}
```

```java
// 使用示例
Function<String, Integer> fun = s -> s.length();
Integer length = fun.apply("Hello Function");
System.out.println(length);
```

===

### 3.4 断言型接口 `Predicate<T>`

```java
@FunctionalInterface
public interface Predicate<T> {
    boolean test(T t);
}
```

```java
// 使用示例
Predicate<String> pre = s -> s.isEmpty();
boolean result = pre.test("Hello");
System.out.println(result); // 输出false
```

## 4、方法引用

方法引用是Lambda表达式的另一种表现形式，当Lambda体中的内容已经有方法实现时，可以使用方法引用。

**1. 对象::实例方法名**

```java
// Lambda表达式
Consumer<String> con1 = s -> System.out.println(s);
// 方法引用
Consumer<String> con2 = System.out::println;
```

**2. 类名::静态方法名**

```java
// Lambda表达式
Comparator<Integer> com1 = (x, y) -> Integer.compare(x, y);
// 方法引用
Comparator<Integer> com2 = Integer::compare;
```

**3. 类名::实例方法名**

```java
// Lambda表达式
BiPredicate<String, String> bp1 = (x, y) -> x.equals(y);
// 方法引用
BiPredicate<String, String> bp2 = String::equals;
```

> 注意：
> 1. 方法引用必须与目标函数式接口的抽象方法在**参数列表**和**返回值类型**上完全匹配，这种匹配是编译时检查的，不匹配会导致编译错误；
> 2. Lambda表达式的**第一个参数**是某个实例方法的**调用者对象**，其余参数(如果有)是该实例方法的参数时，此时可以使用`ClassName::MethodName`的形式

## 5、构造器引用

构造器引用用于创建对象，格式为：类名::new

```java
// Lambda表达式
Supplier<Person> sup1 = () -> new Person();
// 构造器引用
Supplier<Person> sup2 = Person::new;
```

## 6、数组引用

数组引用的格式为：类型[]::new

```java
// Lambda表达式
Function<Integer, String[]> fun1 = len -> new String[len];
// 数组引用
Function<Integer, String[]> fun2 = String[]::new;
```

## 二、Streram API

`Stream API` 是 `Java8` 中处理集合的关键抽象概念，它可以指定你希望对集合进行的操作，可以执行非常复杂的`查找`、`过滤`和`映射数据`等操作。使用`Stream API` 对集合数据进行操作，就类似于使用 `SQL` 执行的数据库查询。也可以使用 Stream API 来并行执行操作。简而言之，Stream API 提供了一种高效且易于使用的处理数据的方式。

流 (`Stream`)  是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列。

**集合讲的是数据，流讲的是计算！**

### Stream的特点

- Stream不会存储元素
- Stream不会改变源对象，而是返回一个持有结果的新Stream
- Stream操作是延迟执行的，即它们会等到需要结果的时候才执行

### Stream的操作步骤

1. 创建Stream：一个数据源（如：集合、数组），获取一个流；
2. 中间操作：一个中间操作链，对数据源的数据进行处理；
3. 终止操作：一个终止操作，执行中间操作链，并产生结果;

## 1、创建Stream

1. 通过Collection系列集合提供的Stream() 顺序流或 ParallelStream()并行流创建
```java
List<String> list = new ArrayList<>();
Stream<String> stream1 = list.stream();
```

2. 通过 Arrays 中的 stream() 获取一个数组流
```java
Integer[] nums = new Integer[10];
Stream<Integer> stream2 = Arrays.stream(nums);
```

3. 通过 Stream 类中静态方法 of()
```java
Stream<String> stream3 = Stream.of("a", "b", "c");
```

4. 创建无限流
```java
// 迭代
Stream<Integer> stream4 = Stream.iterate(0, x -> x + 2);
stream4.limit(10).forEach(System.out::println);
```

```java
// 生成
Stream<Double> stream5 = Stream.generate(Math::random);
stream5.limit(5).forEach(System.out::println);
```

## 2、中间操作

多个中间操作可以连接起来形成一个流水线，除非流水线上触发终止操作，否则中间操作不会执行任何处理。这种方式称为"`惰性求值`"。

### 2.1 筛选与切片

```java
// filter：过滤元素，从流中排除某些元素
list.stream().filter(user -> user.getAge() > 35).forEach(System.out::println);
// limit：截断流，使其元素不超过给定数量及当数量满足条件时停止循环
list.stream().limit(3).forEach(System.out::println);
// skip：跳过元素，返回一个扔掉了前 n 个元素的流。若流中元素不足 n 个，则返回一个空流。与 limit(n) 互补
list.stream().skip(3).forEach(System.out::println);
// distinct：去重，通过流所生成元素的 hashCode() 和 equals() 去除重复元素，因此需要实体类中有这两个方法的实现
list.stream().distinct().forEach(System.out::println);
```
===
### 2.2 映射

map：接收一个函数作为参数，该函数会被应用到每个元素上，将元素转换成其他形式或提取信息映射成一个新的元素

```java
List<String> list = Arrays.asList("aaa", "bbb", "ccc");
list.stream().map(String::toUpperCase).forEach(System.out::println);
```

flatMap：将流中的每个值都转换为另一个流，然后把所有流汇总成成一个新的流

```java
public class Jave8 {
    public static void main(String[] args) {
        List<String> list = Arrays.asList("aaa", "bbb", "ccc");
        Stream<Stream<Character>> stream = list.stream().map(Jave8::filterCharacter);
        stream.forEach(s -> s.forEach(System.out::println));

        Stream<Character> stream2 = list.stream().flatMap(Jave8::filterCharacter);
        stream2.forEach(System.out::println);
    }
    public static Stream<Character> filterCharacter(String str) {
        List<Character> list = new ArrayList<>();
        for (char c : str.toCharArray()) {
            list.add(c);
        }
        return list.stream();
    }
}
```

=== 
### 2.3 排序

```java
// sorted()：自然排序
list.stream().sorted().forEach(System.out::println);

// sorted(Comparator com)：定制排序
list.stream().sorted((user1, user2) -> {
    if(user1.getAge() == user2.getAge()){
        return user1.getName().compareTo(user2.getName());
    }else{
        return user1.getAge() - user2.getAge();
    }
}).forEach(System.out::println);
```

## 3、终止操作

终止操作会从流的流水线生成结果。其结果可以是任何不是流的值，例如：List、Integer，甚至是void

### 3.1 查找与匹配

```java
// allMatch：检查是否匹配所有元素
boolean b1 = list.stream().allMatch(user -> user.getAge() > 35);
// anyMatch：检查是否至少匹配一个元素
boolean b2 = list.stream().anyMatch(user -> user.getAge() > 35);
// noneMatch：检查是否没有匹配的元素
boolean b3 = list.stream().noneMatch(user -> user.getAge() > 35);
// findFirst：返回第一个元素
Optional<User> op1 = list.stream().findFirst();
// findAny：返回当前流中的任意元素
Optional<User> op2 = list.stream().findAny();
// count：返回流中元素的总个数
long count = list.stream().count();
// max：返回流中最大值
Optional<User> op3 = list.stream().max((user1, user2) -> Integer.compare(user1.getAge(), user2.getAge()));
// min：返回流中最小值
Optional<User> op4 = list.stream().min((user1, user2) -> Integer.compare(user1.getAge(), user2.getAge()));
```
===
### 3.2 归约

reduce：可以将流中元素反复结合起来，得到一个值

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
Integer sum = list.stream().reduce(0, (x, y) -> x + y);
System.out.println("数字列表求和：" + sum); // 55

// 计算所有员工工资的总和
Optional<Double> op = employees.stream().map(Employee::getSalary).reduce(Double::sum);
System.out.println(op.get());
```

示例1中，归约会把0做为第一个x，list中的第一个元素（1）做为y，进行运算x+y，然后结果做为下一次的x，list中的第二个元素做为y，再次进行x+y运算，直至list循环完成

===
### 3.3 收集

```java
// collect：将流转换为其他形式
List<String> list = employees.stream().map(Employee::getName).collect(Collectors.toList());
// 收集到Set
Set<String> set = employees.stream().map(Employee::getName).collect(Collectors.toSet());
// 收集到指定的集合
HashSet<String> hs = employees.stream().map(Employee::getName).collect(Collectors.toCollection(HashSet::new));
// 统计
Long count = employees.stream().collect(Collectors.counting());
Double avg = employees.stream().collect(Collectors.averagingDouble(Employee::getSalary));
Double sum = employees.stream().collect(Collectors.summingDouble(Employee::getSalary));
Double max = employees.stream().map(Employee::getSalary).collect(Collectors.maxBy(Double::compare)).get();
// 分组
Map<Status, List<Employee>> map = employees.stream().collect(Collectors.groupingBy(Employee::getStatus));
// 多级分组
Map<Status, Map<String, List<Employee>>> map2 = employees.stream()
    .collect(Collectors.groupingBy(Employee::getStatus, Collectors.groupingBy(e -> {
        if(e.getAge() <= 35){
            return "青年";
        }else if(e.getAge() <= 50){
            return "中年";
        }else{
            return "老年";
        }
    })));

// 分区
Map<Boolean, List<Employee>> map3 = employees.stream()
    .collect(Collectors.partitioningBy(e -> e.getSalary() > 8000));
```

## 三、空指针终结者 Optional

`java.lang.NullPointerException`是最常见也是最令人讨厌的一种异常，如果一个对象可能为null，在调用其方法之前必须进行非空检查，否则就会引发`java.lang.NullPointerException`。但是，很多对象永远都不会为null，如果能把那些可能为null的对象明确的标识出来，只对null嫌疑者进行判断，岂不是既可避免`java.lang.NullPointerException`有可避免不必要的非空判断？

`Optional<T>` 类(java.util.Optional) 是一个容器类，它明确指示开发者哪些对象需要非空检查的。代表一个值存在或不存在，原来用 null 表示一个值不存在，现在 `Optional` 可以更好的表达这个概念。并且可以避免空指针异常。

## Optional类的常用方法

```java
// Optional.of(T t)：创建一个Optional实例，t不能为null
Optional<Employee> op1 = Optional.of(new Employee());
// Optional.empty()：创建一个空的Optional实例
Optional<Employee> op2 = Optional.empty();
// Optional.ofNullable(T t)：若t不为null，创建Optional实例，否则创建空实例
Optional<Employee> op3 = Optional.ofNullable(new Employee());
// isPresent()：判断是否包含值
if(op3.isPresent()){
    System.out.println("有值");
}
// orElse(T t)：如果调用对象包含值，返回该值，否则返回t
Employee emp1 = op3.orElse(new Employee("张三"));
// orElseGet(Supplier s)：如果调用对象包含值，返回该值，否则返回s获取的值
Employee emp2 = op3.orElseGet(() -> new Employee("李四"));
// map(Function f)：如果有值对其处理，并返回处理后的Optional，否则返回Optional.empty()
Optional<String> op4 = op3.map(Employee::getName);
// flatMap(Function mapper)：与map类似，要求返回值必须是Optional
Optional<String> op5 = op3.flatMap(e -> Optional.of(e.getName()));
```

## 四、日期与时间

Java 8引入了新的日期和时间API，这些API位于java.time包中，提供了更加清晰和易用的日期和时间处理方法

## 1、LocalDate、LocalTime、LocalDateTime

这些类的实例是`不可变的对象`，分别表示使用`ISO-8601`日历系统的日期、时间、日期和时间。它们提供了简单的日期或时间，并不包含当前的时间信息，也不包含与时区相关的信息。

> 注：ISO-8601日历系统是国际标准化组织制定的现代公民的日期和时间的表示法

now()：静态方法，根据当前时间创建对象
```java
// 获取当前日期
LocalDate date = LocalDate.now();
// 获取当前时间
LocalTime time = LocalTime.now();
// 获取当前日期时间
LocalDateTime dateTime = LocalDateTime.now();
```

of()：静态方法，根据指定日期/时间创建对象

```java
// 指定日期
LocalDate date2 = LocalDate.of(2025, 5, 1);
// 指定时间
LocalTime time2 = LocalTime.of(12, 0, 0);
// 指定日期时间
LocalDateTime dateTime2 = LocalDateTime.of(2025, 5, 1, 12, 0, 0);
```

| 方法 | 描述 | 
| --- | --- |
| plusDays，plusWeeks，plusMonths，plusYears | 向当前LocalDate对象添加几天、几周、几个月、几年 |
| minusDays，minusWeeks，minusMonths，minusYears | 从当前LocalDate对象减去几天、几周、几个月、几年 |
| plus，minus | 添加或减少一个Duration或Period |
| withDayOfMonth，withDayOfYear，withMonth，withYear | 将月份天数、年份天数、月份、年份修改为指定的值并返回新的LocalDate对象 |
| getDayOfMonth | 获得月份天数（1-31） |
| getDayOfYear | 获得年份天数（1-366） |
| getDayOfWeek | 获得星期几（返回一个DayOfWeek枚举值） |
| getMonth | 获得月份，返回一个Month枚举值 |
| getMonthValue | 获得月份（1-12） |
| getYear | 获得年份 |
| until | 获得两个日期之间的Period对象或者指定ChronoUnits的数字 |
| isBefore，isAfter | 比较两个LocalDate |
| isLeapYear | 判断是否是闰年 |

## 2、Instant 时间戳

用于"时间戳"的运算。它是以Unix元年（UTC时区1970年1月1日午夜时分）开始所经历的描述进行运算。

> Instant 时间戳默认获取UTC（世界协调时间）时区的时间戳

```java
// 获取当前时间戳
Instant instant = Instant.now();
```

我们可以通过Instant的`atOffset()`方法对时间戳进行偏移

```java
// 时间戳的偏移
OffsetDateTime offsetDateTime = instant.atOffset(ZoneOffset.ofHours(8));

```

如果想要获取时间戳，则需要使用`toEpochMilli()`方法。

```java
// 获取毫秒值
long milli = instant.toEpochMilli();
```

## 3、Duration和Period

Duration用于计算两个"时间"间隔

```java
Instant inst1 = Instant.now();
Thread.sleep(1000);
Instant inst2 = Instant.now();
Duration duration = Duration.between(inst1, inst2);
System.out.println(duration.toMillis()); // 1000
```

Period用于计算两个"日期"间隔
```java
LocalDate ld1 = LocalDate.of(2023, 5, 15);
LocalDate ld2 = LocalDate.of(2023, 8, 15);
Period period = Period.between(ld1, ld2);
System.out.println(period.getMonths()); // 3
```

## 4、日期的操作

TemporalAdjuster是时间校正器，有时我们可能需要获取例如：将日期调整到"下个周日"等操作。

```java
// 获取下个周日
LocalDate nextSunday = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.SUNDAY));
System.out.println(nextSunday);

// 自定义：获取下个工作日
LocalDate nextWorkDay = LocalDate.now().with(temporal -> {
    LocalDate date = (LocalDate) temporal;
    DayOfWeek dow = date.getDayOfWeek();
    int add = 1;
    if (dow == DayOfWeek.FRIDAY) add = 3;
    else if (dow == DayOfWeek.SATURDAY) add = 2;
    return date.plusDays(add);
});
System.out.println(nextWorkDay);
```

## 5、解析与格式化

DateTimeFormatter类提供了三种格式化方法：预定义的标准格式、语言环境相关的格式、自定义的格式。

```java
// 预定义的标准格式
DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
LocalDate date1 = LocalDate.parse("2023-05-15", formatter);
System.out.println(date1); // 2023-05-15

// 自定义的格式
DateTimeFormatter formatter2 = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH:mm:ss");
String str = formatter2.format(LocalDateTime.now());
System.out.println(str); // 2023年05月15日 14:45:20

// 解析
LocalDateTime dateTime = LocalDateTime.parse("2023年05月15日 14:45:20", formatter2);
System.out.println(dateTime); // 2023-05-15T14:45:20
```

## 6、时区的处理

Java 8中加入了对时区的支持，带时区的时间为ZonedDate、ZonedTime、ZonedDateTime。

```java
// 获取所有可用的时区ID
Set<String> zoneIds = ZoneId.getAvailableZoneIds();
zoneIds.forEach(System.out::println);

// 获取指定时区的当前日期时间
LocalDateTime ldt = LocalDateTime.now();
ZonedDateTime zdt = ldt.atZone(ZoneId.of("Asia/Shanghai"));
System.out.println(zdt); // 2023-05-15T14:45:20.123+08:00[Asia/Shanghai]

// 获取指定时区的指定日期时间
ZonedDateTime zdt2 = ZonedDateTime.of(LocalDateTime.now(), ZoneId.of("US/Pacific"));
System.out.println(zdt2);
```

## 五、总结

Java 8引入的新特性极大地提升了Java语言的表达能力和开发效率：

1. **Lambda表达式**：使代码更加简洁，提高了可读性和可维护性
2. **Stream API**：提供了强大的集合处理能力，特别是结合Lambda表达式使用
3. **Optional类**：优雅地处理空值，减少NullPointerException
4. **新的时间日期API**：提供了更加清晰和易用的日期时间处理方法
3. **并行流**：简化了并行处理，提高了性能

这些新特性不仅使Java代码更加简洁优雅，还提高了程序的性能和安全性，是每个Java开发者都应该掌握的重要知识。

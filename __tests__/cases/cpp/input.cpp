#include <functional>
#include <iostream>

auto lambda = [](int x) { return x + 1; };

int main() {
  fizzbuzz(100);

  std::function<int(int, int)> gcd = [&gcd](int a, int b) { return b ? gcd(b, a % b) : a; };
  std::cout << gcd(6, 8) << std::endl;
}

void fizzbuzz(int n) {
  for (int i = 1; i <= n; i++) {
    if (i % 3 == 0 && i % 5 == 0) {
      std::cout << "FizzBuzz" << std::endl;
    } else if (i % 3 == 0) {
      std::cout << "Fizz" << std::endl;
    } else if (i % 5 == 0) {
      std::cout << "Buzz" << std::endl;
    } else {
      std::cout << n << std::endl;
    }
  }
}

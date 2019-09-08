#include <iostream>

int main() { std::cout << "Hello, World!" << std::endl; }

void function(bool condition1, bool condition2) {
  if (condition1 || condition2) {
    std::cout << "Hello, World!" << std::endl;
  }
}

void fizzbuzz(int n) {
  for (int i = 1; i < n; i++) {
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

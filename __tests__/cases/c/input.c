#include <stdio.h>

int main(int argc, char *args[]) {
  printf("hello, world\n");
  return 0;
}

void function(int condition1, int condition2) {
  if (condition1 || condition2) {
    printf("hello, world\n");
  }
}

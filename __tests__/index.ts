import { analyze } from '../dist';

test('test', () => {
  analyze('test.cpp', 'int main(){}');
});

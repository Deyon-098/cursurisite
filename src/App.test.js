// Test simplu care verifică că aplicația se compilează
test('app compiles without errors', () => {
  // Testăm doar că aplicația se poate importa fără erori
  expect(() => {
    require('./App');
  }).not.toThrow();
});


test('Can mount app', () => {
  document.body.innerHTML =
    '<div id="app">' +
    '</div>';

  // Executes main file
  require('./main');

  const pElement = document.getElementById('app');
  expect(pElement).not.toBeUndefined();
});
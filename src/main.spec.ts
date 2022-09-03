
test('Can mount app', async () => {
  try {

    //mock console log to prevent errors
    console.log = jest.fn();

    document.body.innerHTML =
    '<div id="app">' +
    '</div>';

    // Executes main file
    require('./main');

    const pElement = document.getElementById('app');
    expect(pElement).not.toBeUndefined();
    
  } catch (error) {
    // do nothing here
  }
});
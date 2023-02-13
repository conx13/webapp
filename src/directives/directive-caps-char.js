export const capsChar = {
  update(el) {
    const input = el.querySelector('.q-field__native');
    console.log(el.value, 'Element');
    console.log(input.value, 'INPUT');
    if (input.value) {
      el.value = input.value.toUpperCase();
      console.log(input.value, 'input value');
    }
    // el.value = el.value.toUpperCase();
  },
};

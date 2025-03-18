const inputs = document.querySelectorAll("input");

function handleKeyup({ target }) {
  let value = target.value.replace(/[^1-5]/g, "");
  value = parseInt(value[value.length - 1], 0);
  if (isNaN(value)) {
    value = "";
  }
  target.value = value;
  // TODO
}

inputs.forEach((input) => {
  input.addEventListener("keyup", handleKeyup);
});

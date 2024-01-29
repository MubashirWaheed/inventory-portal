export const formateCategory = (category: String) => {
  return category
    .split("-")
    .map((elemnet: string) => {
      return capitalizeFirstLetter(elemnet.toLowerCase());
    })
    .join("-");
};

function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

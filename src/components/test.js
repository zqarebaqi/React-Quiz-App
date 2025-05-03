const arr1 = ["1", "2", "3"];
const result = [];

arr1.forEach((item,index) => {
  const delEl = arr1.shift();
  if (delEl != 2) {
      result.push(item);
          console.log(item, "item", index, "index");

  }
});
console.log(result);

/////////////////////////////////////////////////////////

const arr2 = ["1", "2", "3"];
const result2 = [];

arr2.forEach((item, index) => {
  const delEl = arr2.shift();
  if (delEl !== 2) {
    result2.push(item);
    console.log(item,"item",index,"index");
  }
});
console.log(result2);

const par1 = "[100, 200]";

// Parse the JSON string into an array
const parsedArray = JSON.parse(par1);

// Convert each number in the array to a string
const B = parsedArray.map(value => value.toString());

console.log(B);

// deal with list 

/* let myList = [3, 4];
let itemCount = myList.length;

if (itemCount > 2) {
    console.log('banyak');
  } else {
    console.log('sedikit');
  }

  myList.forEach(item => {
    console.log(item);
  });

  console.log(myList[0]) 

nomors = [3, 4];
if (nomors.length > 1) {
  cmd = 1;
} else {
  cmd = 0;
}
console.log(cmd);
*/
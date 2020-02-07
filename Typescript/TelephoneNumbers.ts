
const N: number = parseInt(readline());
let mySet = new Set();
for (let i = 0; i < N; i++) {
    const telephone: string = readline();
    for (let j = 1; j <= telephone.length; j++) {
        mySet.add(telephone.substring(0,j));
    }
}

// The number of elements (referencing a number) stored in the structure.
console.log(mySet.size);

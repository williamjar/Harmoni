console.log("hei");

let test1 = "tekst.txt";
let test2 = "test.tekst.txt";

let test1Tab = test1.split('.');

let mime = test1Tab[test1Tab.length - 1];

console.log(mime);

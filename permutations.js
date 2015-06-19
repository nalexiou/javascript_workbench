//Algorithm to return an array of all the permutations of a given string
//Using recursion as well as a closure
//

var perm = function() {
  
  var usedChar =[]; 
  var permArray =[];
  
  return function doperm(arg) {
   var strArr = arg.split('');
  
   for (var i=0; i<strArr.length; i++){
    
    var char = strArr.splice(i,1);
    usedChar.push(char);
    
    if (strArr.length === 0) {
      permArray.push(usedChar.join(''));
    }
    
    doperm(strArr.join(''));
    
    strArr.splice(i,0,char);
    usedChar.pop();
    
  }
  return permArray;
 };
};

//example usage: Given string "abc"
var myPerm = perm();
myPerm('abc');
console.log(permArray); // displays ["abc", "acb", "bac", "bca", "cab", "cba"]


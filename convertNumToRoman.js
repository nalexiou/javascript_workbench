function convert(num) {
  var result = [];
  var romanNumMap = {
    1: "I",
    5: "V",
    10: "X",
    50: "L",
    100: "C",
    500: "D",
    1000: "M",
    5000: "M\u0305"
  };
  var digitArr = num.toString().split("").reverse();
  for (var i=0; i<digitArr.length; i++){
    var romanChar = "";
    console.log(digitArr[i]<5);
    if ((Math.pow(10,i)*digitArr[i])< Math.pow(10,i)*5){
     for (var j=digitArr[i]*Math.pow(10,i); j%Math.pow(10,i)===0 && j>0; j-=Math.pow(10,i)){
        romanChar += romanNumMap[Math.pow(10,i)];
      }
      if (romanChar.length===4){
        romanChar = romanNumMap[Math.pow(10,i)]+romanNumMap[Math.pow(10,i)*5];
      }
    }
    else {
     for (var k=(digitArr[i]-5)*Math.pow(10,i); k%Math.pow(10,i)===0 && k>0; k-=Math.pow(10,i)){
      romanChar += romanNumMap[Math.pow(10,i)];
       console.log(romanChar);
      }
      if (romanChar.length===4){
        romanChar = romanNumMap[Math.pow(10,i)] + romanNumMap[Math.pow(10,i+1)];
      }
      else{
        romanChar = romanNumMap[Math.pow(10,i)*5] + romanChar;
      }
    }
     result.push(romanChar);
  }
  return result.reverse().join("");
}

  
convert(444);

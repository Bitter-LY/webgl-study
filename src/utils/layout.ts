export function layoutMatrix4(el: Float32Array | number[]) {
  console.log(`
    ${el[0]}, ${el[4]}, ${el[8]}, ${el[12]},  
    ${el[1]}, ${el[5]}, ${el[9]}, ${el[13]},  
    ${el[2]}, ${el[6]}, ${el[10]}, ${el[14]},  
    ${el[3]}, ${el[7]}, ${el[11]}, ${el[15]},  
    `)
}

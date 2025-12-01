let map = `#########
#b.A.@.a#
#########`
charmap = map.split("")
const width = map.split("\n")[0].length
const height = map.split("\n").length

for( var i = charmap.length-1; i--;){
    if ( charmap[i] === '\n') charmap.splice(i, 1);
}

console.log(getCharAt(5, 1`))

function getCharAt(index) {
    return charmap[index];
}

function getCharAt(x, y) {
    return charmap[width*y + x];
}
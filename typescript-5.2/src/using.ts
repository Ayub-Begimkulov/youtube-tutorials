// polyfill Symbol.dispose
// @ts-expect-error
Symbol.dispose ??= Symbol.for('Symbol.dispose');

class TempMap extends Map implements Disposable {
  [Symbol.dispose]() {
    console.log("==========\n\nmap is cleared\n\n==========");
    this.clear();
  }
}

function sumTwo(array: number[], sum: number) {
    using map = new TempMap();
    
    for (let i = 0, l = array.length; i < l; i++) {
        const item = array[i]!;
        const pair = sum - item;
        if (map.has(pair)) {
            console.log('pair found');
            return true;
        }
        
        map.set(item, true);
    }

    console.log('pair not found');
    return false;
}

sumTwo([1, 2, 3], 10);

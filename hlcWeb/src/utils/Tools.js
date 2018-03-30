/**
 * Created by one on 2017/4/11.
 */
Number.prototype.toFixedStr =  function(num) {
    let str = this+"";
    if( str == 'NaN') {
        return "";
    }
    let regexp = new RegExp(`[0-9]*\.?[0-9]{0,${num}}`);
    let rs = str.match(regexp);
    return Number(rs[0]).toFixed(num);
}
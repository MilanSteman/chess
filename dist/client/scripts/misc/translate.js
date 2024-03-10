const DEFAULT_TRANSLATE = 0;
/**
 * Takes a DOM element and translates it based on the percentage
 */
function translate(el, row, col) {
    if (el) {
        el.style.transform = `translate(${col}%, ${row}%)`;
    }
}
;
export { DEFAULT_TRANSLATE, translate };

export function numberFormat(num: number) {
    return num > 0 ? Intl.NumberFormat('en-US', { notation: 'compact' }).format(num) : num;
}
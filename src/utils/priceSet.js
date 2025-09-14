// 가격 콤마 추가
export const formatWithComma = (value) => {
   if (!value) return

   return Number(value.replace(/,/g, '')).toLocaleString('ko-KR')
}

// 가격 콤마 제거
export const stripComma = (value) => {
   if (typeof value !== 'string') value = value?.toString?.() ?? ''
   return value.replace(/,/g, '')
}

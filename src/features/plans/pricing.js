export const calculateTotalPrice = (basePrice, options = {}) => {
   let total = basePrice

   // 나이에 따른 할인
   if (options.age >= 65) {
      total *= 0.9 // 65세 이상 10% 할인
   } else if (options.age <= 24) {
      total *= 0.85 // 청년 15% 할인
   }

   // 약정 기간에 따른 할인
   if (options.contract === 24) {
      total *= 0.85 // 2년 약정 15% 할인
   } else if (options.contract === 12) {
      total *= 0.9 // 1년 약정 10% 할인
   }

   // 부가서비스 추가
   if (options.services) {
      total += options.services.reduce((acc, service) => acc + service.price, 0)
   }

   return Math.floor(total) // 원 단위 절삭
}

export const calculatePoints = (price, months = 12) => {
   return Math.floor(price * months * 0.05) // 연간 결제시 5% 포인트 적립
}

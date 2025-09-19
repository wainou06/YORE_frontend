// PortOne API 연동 서비스
const API_BASE_URL = 'https://api.portone.io/v2'

// TODO: 실제 값으로 교체 필요
const TEST_STORE_ID = 'store-uuid' // 상점 ID
const TEST_API_KEY = 'test_api_key' // API 키
const TEST_SECRET_KEY = 'test_secret_key' // 시크릿 키

// Access Token 발급
const getAccessToken = async () => {
   try {
      const response = await fetch(`${API_BASE_URL}/authentication/access-token`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            grantType: 'SecretKey',
            storeId: TEST_STORE_ID,
            secretKey: TEST_SECRET_KEY,
         }),
      })

      if (!response.ok) throw new Error('토큰 발급 실패')

      const data = await response.json()
      return data.accessToken
   } catch (error) {
      throw error
   }
}

// 결제 요청 생성
const createPaymentRequest = async (orderData) => {
   try {
      const accessToken = await getAccessToken()

      const response = await fetch(`${API_BASE_URL}/payments`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
         },
         body: JSON.stringify({
            storeId: TEST_STORE_ID,
            orderName: orderData.planName,
            totalAmount: orderData.amount,
            currency: 'KRW',
            paymentMethod: {
               card: {
                  useCardPoint: false,
                  useInstallment: false,
               },
            },
            orderChannel: 'PC',
            redirectUrl: `${window.location.origin}/checkout/complete`,
            display: {
               card: {
                  cardCompanies: ['*'],
               },
            },
            customer: {
               customerId: orderData.customerId,
               fullName: orderData.customerName,
               email: orderData.customerEmail,
               phoneNumber: orderData.customerPhone,
            },
            testMode: true, // 테스트 모드 활성화
         }),
      })

      if (!response.ok) throw new Error('결제 요청 생성 실패')

      const data = await response.json()
      return data
   } catch (error) {
      throw error
   }
}

// 결제 상태 조회
const getPaymentStatus = async (paymentId) => {
   try {
      const accessToken = await getAccessToken()

      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
      })

      if (!response.ok) throw new Error('결제 상태 조회 실패')

      const data = await response.json()
      return data
   } catch (error) {
      throw error
   }
}

// 결제 취소
const cancelPayment = async (paymentId, reason) => {
   try {
      const accessToken = await getAccessToken()

      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/cancel`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
         },
         body: JSON.stringify({
            reason,
         }),
      })

      if (!response.ok) throw new Error('결제 취소 실패')

      const data = await response.json()
      return data
   } catch (error) {
      throw error
   }
}

export const portoneService = {
   createPaymentRequest,
   getPaymentStatus,
   cancelPayment,
}

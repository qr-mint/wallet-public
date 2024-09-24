export interface ExchangeLimitRequest {
    address_coin_id_from: number
    address_coin_id_to: number
}

export interface ExchangeLimitResponse {
    min: string
    max: string
}

export interface ExchangeAddressRequest extends ExchangeLimitRequest {
    amount: number
}

export interface ExchangeAddressResponse {
    pay_in_address: string
    id: string
}

export interface ExchangeAmountRequest extends ExchangeLimitRequest {
    send_amount: number
}

export interface ExchangeAmountResponse {
    receive_amount: string
}
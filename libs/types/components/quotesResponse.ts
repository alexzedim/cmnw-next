export type quotesResponse = {
  quotes: Array<{
    price: number,
    quantity: number,
    open_interest: number,
    size: number,
  }>
}

export const getAnonymousId = (): string => {
  let anonId = localStorage.getItem('anonymous_id')
  if (!anonId) {
    anonId = crypto.randomUUID()
    localStorage.setItem('anonymous_id', anonId)
  }

  return anonId
}

export const clearAnonymousId = (): void => {
  localStorage.removeItem('anonymous_id')
}

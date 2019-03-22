export function getLabel (baseUri, uri) {
  return uri && uri.slice(baseUri.length - 1)
}

/**
 * Storefront API (GraphQL) operations for the live client. API version is
 * locked to 2026-07 (see index.ts / .env).
 *
 * NOTE on metafields: the custom fields (vintage_story, original_retail,
 * is_dropship, customs_note, source_lot, angerratt_notice) only return values if their metafield
 * definitions are exposed to the Storefront API (Settings → Custom data →
 * Products → each definition → "Storefront access"). The live client flattens
 * them onto the Product type so components never see the difference.
 */

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    createdAt
    tags
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 8) {
      nodes {
        url
        altText
        width
        height
      }
    }
    options {
      id
      name
      values
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    collections(first: 10) {
      nodes {
        handle
      }
    }
    variants(first: 50) {
      nodes {
        id
        title
        availableForSale
        quantityAvailable
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          url
          altText
          width
          height
        }
      }
    }
    vintageBlurb: metafield(namespace: "custom", key: "vintage_story") {
      value
    }
    originalRetail: metafield(namespace: "custom", key: "original_retail") {
      value
    }
    isDropship: metafield(namespace: "custom", key: "is_dropship") {
      value
    }
    customsNote: metafield(namespace: "custom", key: "customs_note") {
      value
    }
    sourceLot: metafield(namespace: "custom", key: "source_lot") {
      value
    }
    lotNumber: metafield(namespace: "custom", key: "lot_number") {
      value
    }
    angerratt: metafield(namespace: "custom", key: "angerratt_notice") {
      value
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Products(
    $first: Int!
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $after: String
  ) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse, after: $after) {
      nodes {
        ...ProductFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

export const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        description
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`;

export const COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query CollectionProducts(
    $handle: String!
    $first: Int!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $after: String
  ) {
    collection(handle: $handle) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse, after: $after) {
        nodes {
          ...ProductFields
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

/* --- cart mutations --- */

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    discountCodes {
      code
      applicable
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            quantityAvailable
            image {
              url
              altText
              width
              height
            }
            product {
              handle
              title
            }
          }
        }
      }
    }
  }
`;

export const CART_CREATE = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartCreate {
    cartCreate {
      cart {
        ...CartFields
      }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  ${CART_FRAGMENT}
  query Cart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
`;

export const CART_LINES_ADD = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
`;

export const CART_LINES_UPDATE = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
`;

export const CART_LINES_REMOVE = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
    }
  }
`;

export const CART_DISCOUNT_CODES_UPDATE = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartDiscountCodesUpdate($cartId: ID!, $codes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $codes) {
      cart {
        ...CartFields
      }
    }
  }
`;


import { CustomerRowDataProps } from '../CustomerRow'

export const filterCustomers = (customers: CustomerRowDataProps[], filter: string) => (
  customers.filter((c: CustomerRowDataProps) => {
    // Don't filter on empty filter
    if (filter.trim().length === 0) { return true }

    // Add attributes to be used in filter
    const attributeList = [
      c.id,
    ].map(e => e != null ? e.toLowerCase() : '')

    for (const attribute of attributeList) {
      if (attribute.includes(filter.toLowerCase())) {
        return true
      }
    }
    return false
  }))

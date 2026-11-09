# Product checkout repair

The production source for urbanclothesmarket.com is aaahoneydo-arch/urban-clothes-market. The production source for jasontvmarketplace.com is aaahoneydo-arch/jason-coleman-media-network. Before publishing, compare the remote URL, main branch, CNAME and latest successful GitHub Pages deployment for the intended domain.

The featured Phoenix hoodie used a myspreadshop.com design link that opened a 404. The Spreadshirt marketplace offered the matching Urban Clothes Market design, product and color. Its seller price was $56.99 while the old catalog displayed $30.99. Other marketplace candidates opened a different variant or returned a 404.

## Importing products

1. Read the seller export and keep its actual design ID, sellable ID, product type and appearance. Never manufacture missing sellable IDs.
2. Open the candidate and follow redirects. For Spreadshirt, compare the returned designer name, article ID, sellable ID, product type, selected appearance, stock and available sizes. Read the orderable USD offer and URL from the seller's product data. Keep the seller's product name and price with that URL.
3. On the other stores, match the seller, product or work ID, product type and purchase option. Keep a record of blocked checks and unavailable products. A store home, search page, successful HTTP response, design with a different garment, or image alone cannot establish a purchase link.
4. Apply the verified offers to the public catalogs, search shards, featured cards, embedded product data, existing product landing pages, recommendations and advertising feeds. Keep existing advertising URLs where their landing pages can still deliver the exact product. Retain the source of unavailable items for recovery.
5. Run a clean full build. Check that catalog pages and the files served from the GitHub Pages root agree. Test a homepage card, a search result, an existing advertising landing page and a checkout from each affected seller on both live domains.
6. Publish both repositories and check their individual Pages deployments. A commit to one repository cannot update the other site's separate copy of the catalog.

The first repair snapshot covers 5,625 distinct physical catalog IDs. See the commit history for subsequent releases. Checkout availability and seller prices reflect the time of each check.

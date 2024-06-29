# JB Barcodify
Just a simple little chrome extension I made for people who work at JB Hi-Fi in Australia. When installed in Chrome and on the JB Hi-Fi website, the useless invisible PLU will be converted into a barcode that is scannable on PDA's, saving time by not having to type in the SKU into Onstage.
## Limitations
- ~~Currently the product carousel on the website does not update the Barcode when another product is selected. A page reload fixes this but is annoying~~ Now Supports Flickity!!
- Uses a third party barcode service to generate the image and send back to the computer, slower than local generation. A local library will be added in the future after gauging interest
- Could be prettier and properly integrated with CSS, but works for now

## Special Thanks
A massive thanks goes to metafloor for the [barcode generation service](https://github.com/metafloor/bwip-js/wiki/Online-Barcode-API) used

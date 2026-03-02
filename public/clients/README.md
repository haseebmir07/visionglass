## Client Logos

Place your client logo image files in this folder.

Supported formats: PNG, JPG, JPEG, SVG, WEBP

### File names expected:
- airtel.png
- cred.png
- bookmyshow.png
- ola.png
- zomato.png
- blinkit.png
- zepto.png
- swiggy.png
- lenskart.png
- urbancompany.png
- phonepe.png
- nykaa.png

### How to add/change a logo:
1. Drop your logo file into this folder with the matching name
2. The dev server will hot-reload and show it immediately

### How to add a new client:
Open `components/ClientsStrip.jsx` and add a new entry to the `clients` array:
```js
{ name: "Company Name", logo: "/clients/yourfile.png" }
```
